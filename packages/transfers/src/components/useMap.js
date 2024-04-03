import { ref } from 'vue'
import axios from 'axios'
import moment from 'moment-timezone'

export const useMap = ({ transferData }) => {
    const routeToBeTraveled = ref()

    const getRoute = async () => {
        const response = await axios({
            url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs,routes.optimizedIntermediateWaypointIndex',
                'X-Goog-Api-Key': 'AIzaSyDpr6B79utf03ufcQwJd18pFMmRh-WRNxc'
            },
            data: {
                origin: {
                    location: {
                        latLng: {
                            latitude: parseFloat(transferData.value.origin_facility.latitude_location),
                            longitude: parseFloat(transferData.value.origin_facility.longitude_location)
                        }
                    },
                    sideOfRoad: true
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: parseFloat(transferData.value.destination_facility.latitude_location),
                            longitude: parseFloat(transferData.value.destination_facility.longitude_location)
                        }
                    }
                },
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
        })

        if (response.status === 200) {
            const steps = response.data.routes[0].legs[0].steps

            // Map through each step and extract navigation instructions
            const stepInstructions = steps.map(step => {
                return step.navigationInstruction ? step.navigationInstruction.instructions : ''
            })

            // Filter out empty instructions and join them into a single string
            routeToBeTraveled.value = stepInstructions.filter(instruction => instruction !== '').join(' —  \n')
        }
    }

    return { getRoute, transferData, routeToBeTraveled }
}
