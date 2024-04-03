import { ref } from 'vue'
import axios from 'axios'
import moment from 'moment-timezone'

import html2canvas from 'html2canvas'

const map = ref(null)

// Initial default zoom. It is recalculated based on the route points.
let initialZoom = 14

// Determines the initial center of the map. It is calculated based on the route points.
let initialCoords = {}

const intermediates = ref([])

export const getRouteAndInitMap = async (transfers, routeData, mapImg = null) => {
    if (!transfers.value.rawData.length) {
        routeData.value = []
    }

    getIntermediates(transfers)

    const data = {
        origin: {
            location: {
                latLng: {
                    latitude: parseFloat(transfers.value.rawData[0].origin_facility.latitude_location),
                    longitude: parseFloat(transfers.value.rawData[0].origin_facility.longitude_location)
                }
            },
            sideOfRoad: true
        },
        destination: {
            location: {
                latLng: {
                    latitude: parseFloat(transfers.value.rawData[0].origin_facility.latitude_location),
                    longitude: parseFloat(transfers.value.rawData[0].origin_facility.longitude_location)
                }
            }
        },
        intermediates: intermediates.value,
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        departureTime: moment(new Date()).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSS[Z]'),
        computeAlternativeRoutes: false,
        optimizeWaypointOrder: 'true',
        routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false
        },
        languageCode: 'en-US',
        units: 'IMPERIAL'
    }

    const response = await axios({
        url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs,routes.optimizedIntermediateWaypointIndex',
            'X-Goog-Api-Key': 'AIzaSyDpr6B79utf03ufcQwJd18pFMmRh-WRNxc'
        },
        data
    })

    if (response.status === 200) {
        if (response.data.routes[0].legs.length > 1) {
            response.data.routes[0].legs.pop()
        }

        routeData.value = response.data

        setTimeout(() => {
            if (mapImg) {
                initMap(routeData).then(() => {
                    captureAndConvertMapToImage(mapImg)
                })

                return
            }

            initMap(routeData)
        }, 200)
    }
}

const getIntermediates = (transfers) => {
    intermediates.value = []

    transfers.value.rawData.forEach((transfer) => {
        if (transfer.destination_facility) {
            const latitude = parseFloat(transfer.destination_facility.latitude_location)
            const longitude = parseFloat(transfer.destination_facility.longitude_location)

            const objeto = {
                location: {
                    latLng: {
                        latitude,
                        longitude
                    }
                }
            }

            intermediates.value.push(objeto)
        }
    })
}

const initMap = (routeData, mapDivName = 'map') => {
    return new Promise(resolve => {
        map.value = new window.google.maps.Map(document.getElementById(mapDivName), {
            zoom: initialZoom,
            disableDefaultUI: true,
            scaleControl: false,
            zoomControl: false,
            draggable: false,
            scrollwheel: false
        })

        // Hides business icons.
        map.value.set('styles', [
            {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }]
            },
        ])

        // Wait for the map to load before render route
        window.google.maps.event.addListenerOnce(map.value, 'idle', () => {
            renderRoute(routeData.value.routes)
                .then(() => {
                    // Resolve the promise once renderRoute is complete
                    resolve()
                })
        })
    })
}

const renderRoute = (routes) => {
    return new Promise(resolve => {
        // Calculate the geographic extent of all routes.
        const bounds = new window.google.maps.LatLngBounds()

        // Draw polylines on the map
        routes.forEach((route) => {
            route.legs.forEach((leg) => {
                // Add markers to each start and finish of the routes
                addMarker(leg.startLocation.latLng, 'Start')
                addMarker(leg.endLocation.latLng, 'Finish')

                const path = window.google.maps.geometry.encoding.decodePath(leg.polyline.encodedPolyline)

                // Create a polyline and add it to the map.
                const polyline = new window.google.maps.Polyline({
                    path,
                    geodesic: true,
                    strokeColor: '#345beb',
                    strokeOpacity: 1.0,
                    strokeWeight: 5
                })

                polyline.setMap(map.value)

                // Extend the map boundaries based on the polyline.
                path.forEach((point) => {
                    bounds.extend(point)
                })

                // Get the center and zoom based on the geographical bounds
                initialCoords = bounds.getCenter()
                initialZoom = getZoom(bounds, map.value.getDiv(), map.value.getProjection())

                // Adjust the map with the new coordinates and zoom
                map.value.setCenter(initialCoords)
                map.value.setZoom(initialZoom)
            })
        })

        // Resolve the promise once rendering is complet
        resolve()
    })
}

// Calculate the appropriate zoom level based on the map dimensions and geographical bounds
export const getZoom = (bounds, mapDiv, projection) => {
    const maximumZoomValueAllowedByGoogleMap = 21

    const zoomMax = maximumZoomValueAllowedByGoogleMap
    const zoomMin = 0

    const ne = projection.fromLatLngToPoint(bounds.getNorthEast())
    const sw = projection.fromLatLngToPoint(bounds.getSouthWest())

    const worldCoordWidth = Math.abs(ne.x - sw.x)
    const worldCoordHeight = Math.abs(ne.y - sw.y)

    const pixelWidth = mapDiv.offsetWidth
    const pixelHeight = mapDiv.offsetHeight

    const zoomX = Math.floor(Math.log(pixelWidth / worldCoordWidth) / Math.LN2)
    const zoomY = Math.floor(Math.log(pixelHeight / worldCoordHeight) / Math.LN2)

    const zoom = Math.min(zoomX, zoomY)

    return Math.min(Math.max(zoom, zoomMin), zoomMax)
}

// Add markers to the start or end of the routes.
const addMarker = (location, title) => {
    const marker = new window.google.maps.Marker({
        position: {
            lat: location.latitude,
            lng: location.longitude
        },
        map: map.value,
        title
    })

    return marker
}

// Capture the map, convert it, and insert it into HTML as an image.
const captureAndConvertMapToImage = (mapImg) => {
    // Div that contains the map
    const mapContainer = document.getElementById('map')

    const timeToWaitMapRendering = 200

    setTimeout(() => {
        html2canvas(mapContainer, {
            useCORS: true
        }).then(canvas => {
            mapImg.value = canvas.toDataURL('image/png')

            const imgElement = document.createElement('img')

            imgElement.src = mapImg.value
        })
    }, timeToWaitMapRendering)
}
