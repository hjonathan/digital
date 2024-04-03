<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import QRExample from '../show/QRExample.vue'

import { getZoom } from './map'

import html2canvas from 'html2canvas'

const props = defineProps({
    data: Object,
    mapImg: String,
    routeData: Object
})

const getRouteInstructions = (steps) => {
    // Map through each step and extract navigation instructions
    const stepInstructions = steps.map(step => {
        return step.navigationInstruction ? step.navigationInstruction.instructions : ''
    })

    return stepInstructions.filter(instruction => instruction !== '')
}

const map = ref([])

// Initial default zoom. It is recalculated based on the route points.
let initialZoom = 14

// Determines the initial center of the map. It is calculated based on the route points.
let initialCoords = {}

const initMap = () => {
    return new Promise(resolve => {
        const mapContainer = document.querySelectorAll('.map')

        mapContainer.forEach((container, index) => {
            map.value[index] = new window.google.maps.Map(container, {
                zoom: initialZoom,
                disableDefaultUI: true,
                scaleControl: false,
                zoomControl: false,
                draggable: false,
                scrollwheel: false
            })

            // Hides business icons.
            map.value[index].set('styles', [
                {
                    featureType: 'poi.business',
                    stylers: [{ visibility: 'off' }]
                },
            ])

            // Wait for the map to load before render route
            window.google.maps.event.addListenerOnce(map.value[index], 'idle', () => {
                renderRoute(props.routeData[0].legs[index], index)
                    .then(() => {
                        captureAndConvertMapToImage(container, index)
                    })
            })

            window.google.maps.event.addListenerOnce(map.value[index], 'center_changed', () => {
                captureAndConvertMapToImage(container, index)
            })

            resolve()
        })
    })
}

const mapImgDiv = ref([])

const captureAndConvertMapToImage = (container, index) => {
    const timeToWaitMapRendering = 600

    setTimeout(() => {
        html2canvas(container, { useCORS: true }).then(canvas => {
            mapImgDiv.value[index] = canvas.toDataURL('image/png')

            const imgElement = document.createElement('img')

            imgElement.src = mapImgDiv.value
        })
    }, timeToWaitMapRendering)
}

// Renders the route based on all its points.
const renderRoute = (leg, index) => {
    return new Promise(resolve => {
        // Calculate the geographic extent of all routes.
        const bounds = new window.google.maps.LatLngBounds()

        // Add markers to each start and finish of the routes
        addMarker(leg.startLocation.latLng, 'Start', index)
        addMarker(leg.endLocation.latLng, 'Finish', index)

        const path = window.google.maps.geometry.encoding.decodePath(leg.polyline.encodedPolyline)

        // Create a polyline and add it to the map.
        const polyline = new window.google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: '#345beb',
            strokeOpacity: 1.0,
            strokeWeight: 5
        })

        polyline.setMap(map.value[index])

        // Extend the map boundaries based on the polyline.
        path.forEach((point) => {
            bounds.extend(point)
        })

        // Get the center and zoom based on the geographical bounds
        initialCoords = bounds.getCenter()
        initialZoom = getZoom(bounds, map.value[index].getDiv(), map.value[index].getProjection())

        // Adjust the map with the new coordinates and zoom
        map.value[index].setCenter(initialCoords)
        map.value[index].setZoom(initialZoom)

        resolve()
    })
}

// Add markers to the start or end of the routes.
const addMarker = (location, title, index) => {
    const marker = new window.google.maps.Marker({
        position: {
            lat: location.latitude,
            lng: location.longitude
        },
        map: map.value[index],
        title
    })

    return marker
}

onMounted(() => {
    initMap()
})

const isReady = computed(() => {
    return mapImgDiv.value.length === props.routeData[0].legs.length
})

const emit = defineEmits('isReady')

watch(
    () => isReady.value,
    () => {
        const timeToWaitMapsRendering = 500

        setTimeout(() => {
            emit('isReady')
        }, timeToWaitMapsRendering)
    }
)

const generateLink = (leg) => {
    const startCoordinates = `${leg?.startLocation?.latLng?.latitude}, ${leg?.startLocation?.latLng?.longitude}`
    const endCoordinates = `${leg?.endLocation?.latLng?.latitude}, ${leg?.endLocation?.latLng?.longitude}`

    // Build the Google Maps URL with the coordinates
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startCoordinates}&destination=${endCoordinates}`

    return googleMapsUrl
}
</script>

<template>
    <div>
        <template
                v-for="(leg, index) in routeData[0].legs"
                :key="index">
                <div
                    class="w-full aspect-video map notPrintableArea"
                    style="height: 420px;" />
        </template>

        <div class="h-full">
            <!-- Header -->
            <table class="custom w-full mb-4">
                <tr>
                    <!-- QR Code and ID -->
                    <td
                        rowspan="3"
                        class="w-[23%]">
                        <span class="text-xs flex justify-center">
                            <QRExample />
                        </span>

                        <span class="text-xs text-center block">
                            <!-- {{ data?.id }} --> cfb36f92-43b5-4b7a-8676-9c9a56a29f90
                        </span>
                    </td>

                    <!-- Title -->
                    <td
                        rowspan="3"
                        class="w-[62%] text-3xl font-semibold text-center uppercase">
                        {{ $t('Driver travel guide') }}
                    </td>
                </tr>

                <!-- Departure date -->
                <tr>
                    <td class="w-[15%] font-semibold print-custom-leading text-base bg-gray-200 whitespace-nowrap">
                        {{ $t('Departure') }}
                    </td>

                    <td class="text-sm whitespace-nowrap">
                        2023-11-28 150025
                        <!-- {{ data.dispatch_transfer_details[0]?.dispatch_transfer?.dispatch_on ? formatDate(data.dispatch_transfer_details[0].dispatch_transfer.dispatch_on) : '-' }} -->
                    </td>
                </tr>

                <!-- Arrival date -->
                <tr>
                    <td class="w-[15%] font-semibold print-custom-leading text-base bg-gray-200 whitespace-nowrap">
                        {{ $t('Estimated arrival') }}
                    </td>

                    <td class="text-sm whitespace-nowrap">
                        2023-11-28 150025
                        <!-- {{ data?.dispatch_transfer_details[0]?.dispatch_transfer?.arrived_on ? formatDate(data.dispatch_transfer_details[0].dispatch_transfer.arrived_on) : '-' }} -->
                    </td>
                </tr>

                <!-- Note -->
                <tr>
                    <td
                        colspan="4"
                        class="w-[100%] text-xs bg-gray-200">
                        <p class="block text-center font-medium !mt-0">
                            {{ $t('The receiving entity may reject product delivered, but amount delivered must be limited to amount agreed upon in prior sales transaction') }}
                        </p>
                    </td>
                </tr>
            </table>

            <!-- Driver information -->
            <table class="custom w-full mt-4 text-base">
                <tr>
                    <td
                        class="w-full bg-gray-200 uppercase font-semibold text-lg text-center"
                        colspan="6">
                        {{ $t('Driver information') }}
                    </td>
                </tr>

                <!-- Driver 1 -->
                <tr
                    v-for="(driver, index) of data?.driver"
                    :key="index">
                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Driver') }} {{ index === 0 ? '' : index + 1 }}
                    </td>

                    <td class="w-[41%]">
                        {{ driver.name }}
                    </td>

                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Phone') }}
                    </td>

                    <td class="w-[16.5%]">
                        {{ driver.phone }}
                    </td>

                    <td class="w-[8%] bg-gray-200">
                        {{ $t('License #') }}
                    </td>

                    <td>
                        {{ driver.phone }}
                    </td>
                </tr>
            </table>

            <!-- Vehicle and route information -->
            <table class="custom w-full mt-4 text-base">
                <!-- Title -->
                <tr>
                    <td
                        colspan="6"
                        class="w-full font-semibold text-lg bg-gray-200 uppercase text-center">
                        {{ $t('Vehicle & route information') }}
                    </td>
                </tr>

                <!-- Vehicle information -->
                <tr>
                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Vehicle') }}
                    </td>

                    <td
                        colspan="3"
                        class="w-[68.5%]">
                        <span>
                            {{ data?.vehicle?.year }}
                            {{ data?.vehicle?.make }}
                            {{ data?.vehicle?.model }}
                            {{ data?.vehicle?.license_plate }}
                            {{ data?.vehicle?.certificate }}
                        </span>
                    </td>

                    <td class="w-[8%] bg-gray-200">
                        {{ $t('Stops') }}
                    </td>

                    <td class="text-center">
                        <span v-if="routeData">
                            {{ routeData[0].legs.length }}
                        </span>
                    </td>
                </tr>

                <!-- Notes -->
                <tr>
                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Notes') }}
                    </td>

                    <td
                        colspan="5">
                        <!-- Empty cell -->
                    </td>
                </tr>
            </table>

            <!-- Route sumary -->
            <table class="custom w-full mt-4 text-base !border-0 hidden">
                <!-- Title -->
                <tr>
                    <td
                        colspan="6"
                        class="w-full font-semibold text-lg bg-gray-200 uppercase text-center">
                        {{ $t('Route summary') }}
                    </td>
                </tr>

                <!-- Summary -->
                <tr>
                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Stops') }}
                    </td>

                    <!-- Stop number -->
                    <td class="w-[6%]">
                        1st
                    </td>

                    <!-- Stop name -->
                    <td class="w-[14%]">
                        Presscott
                    </td>

                    <!-- Address title -->
                    <td class="w-[14%] bg-gray-200">
                        Address
                    </td>

                    <td class="text-center">

                    </td>
                </tr>

                <tr>
                    <td class="w-[11%] !border-0">

                    </td>

                    <!-- Stop number -->
                    <td class="w-[6%]">
                        2nd
                    </td>

                    <!-- Stop name -->
                    <td class="w-[14%]">
                        Presscott
                    </td>

                    <!-- Address title -->
                    <td class="w-[14%] bg-gray-200">
                        Address
                    </td>

                    <td class="text-center">

                    </td>
                </tr>

                <tr>
                    <td class="w-[11%] !border-0">

                    </td>

                    <!-- Stop number -->
                    <td class="w-[6%]">
                        3rd
                    </td>

                    <!-- Stop name -->
                    <td class="w-[14%]">
                        Presscott
                    </td>

                    <!-- Address title -->
                    <td class="w-[14%] bg-gray-200">
                        Address
                    </td>

                    <td class="text-center">

                    </td>
                </tr>
            </table>

            <!-- Map -->
            <table class="custom w-full mt-4 text-base !border-0">
                <!-- Title -->
                <tr>
                    <td
                        colspan="6"
                        class="w-full font-semibold text-lg bg-gray-200 uppercase text-center">
                        {{ $t('Map') }}
                    </td>
                </tr>

                <!-- Summary -->
    <!--             <tr>
                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Route Link') }}
                    </td>

                    <td colspan="2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </td>
                </tr> -->

                <!-- Map -->
                <tr>
                    <td
                        colspan="2"
                        class="!p-0">
                        <div
                            class="border border-black"
                            v-if="mapImg">
                            <img
                                :src="mapImg"
                                class="object-cover object-center w-full">
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Stops-->
            <template
                v-for="(leg, index) in routeData[0].legs"
                :key="index">
                <table class="custom w-full mt-4 text-base !border-0">
                    <!-- Title -->
                    <tr>
                        <td
                            colspan="6"
                            class="w-full font-semibold text-lg bg-gray-200 uppercase text-center">
                            {{ $t('Stop') }} {{ index + 1 }}
                        </td>
                    </tr>

                    <!-- Summary -->
                    <tr>
                        <td class="w-[11%] bg-gray-200">
                            {{ $t('Route Link') }}
                        </td>

                        <!-- Link -->
                        <td colspan="2">
                            <a
                                :href="generateLink(leg)"
                                target="_blank"
                                class="link !text-blue-500">
                                {{ $t('Open location in google maps') }}.
                            </a>

                            <span class="text-xs">
                                ({{ $t('Google may change the route') }}.)
                            </span>
                        </td>
                    </tr>

                    <!-- Route description -->
                    <tr
                        v-for="(step, index) in getRouteInstructions(leg.steps)"
                        :key="index">
                        <td
                            :class="{
                                '!border-b-0 !border-t-0' : index !== 0,
                                'bg-gray-200' : index === 0,
                                '!border-b' : index === getRouteInstructions(leg.steps).lenght
                            }"
                            class="w-[11%]">
                            {{ index === 0 ? $t('Route') : '' }}
                        </td>

                        <!-- Stop number -->
                        <td>
                            {{ index +1 }}
                        </td>

                        <td>
                            {{ step }}
                        </td>
                    </tr>

                    <tr>
                        <td
                            colspan="3"
                            class="!px-0">
                            <div
                                class="border border-black"
                                v-if="mapImg[index]">
                                <img
                                    :src="mapImgDiv[index]"
                                    class="object-cover object-center w-full">
                            </div>
                        </td>
                    </tr>
                </table>
            </template>
        </div>
    </div>
</template>

<style scoped>
table {
    border: 1px solid black;
    border-collapse: collapse;
}

td {
    border: 2px solid black;
    padding-inline: 10px;
}

.html2canvas-container { width: 3000px !important; height: 3000px !important; }
</style>
