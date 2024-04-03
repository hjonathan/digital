<script setup>
import { Card, Overlay, ActionButtons } from 'layout'
import { inject, ref, onMounted, computed } from 'vue'
import TransferManifestPrint from './TransferManifestPrint.vue'
import TransferManifestAdjustPrint from './TransferManifestAdjustPrint.vue'
import LostAndFoundManifestPrint from './LostAndFoundManifestPrint.vue'
import { configButtons } from './configButtons'
import { api } from '@/config'
import axios from 'axios'
import moment from 'moment-timezone'

const props = defineProps({
    useShow: {
        type: Object
    },
    transferId: {
        type: String,
        default: null
    },
    mode: {
        type: String,
        default: 'show'
    }
})

const useGlobalStore = inject('useGlobalStore')
const transfersStore = useGlobalStore('transfers')
const dispatchesStore = useGlobalStore('dispatches')

const transferData = ref([])
const dispatchesData = ref()
const isLoading = ref(false)

const routeToBeTraveled = ref('')

let printableArea = {}

const { globalTransferData } = props.useShow

onMounted(async () => {
    if (props.transferId) {
        const response = await transfersStore.getTransferItem(props.transferId)

        if (response.success) {
            transferData.value = response.data

            globalTransferData.value = response.data

            getRoute()

            const dispatchResponse = await dispatchesStore.getTransferItem(transferData.value?.dispatch_transfer_details[0]?.dispatch_transfer_id)

            dispatchResponse.success && (dispatchesData.value = dispatchResponse.data[0])
        }
    }
})

const getRoute = async () => {
    const response = await axios({
        url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': 'routes.legs,routes.optimizedIntermediateWaypointIndex',
            'X-Goog-Api-Key': 'AIzaSyDpr6B79utf03ufcQwJd18pFMmRh-WRNxc'
        },
        data: {
            origin: {
                location: {
                    latLng: {
                        latitude: parseFloat(transferData.value.origin_facility?.latitude_location),
                        longitude: parseFloat(transferData.value.origin_facility?.longitude_location)
                    }
                },
                sideOfRoad: true
            },
            destination: {
                location: {
                    latLng: {
                        latitude: parseFloat(transferData.value.destination_facility?.latitude_location),
                        longitude: parseFloat(transferData.value.destination_facility?.longitude_location)
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

const timeToWaitContent = 100

setTimeout(() => {
    printableArea = document.getElementById('printableArea')
}, timeToWaitContent)

const print = async () => {
    isLoading.value = true

    printableArea = document.getElementById('printableArea')

    const data = { data: printableArea.innerHTML }

    const response = await api.post('/pdf/manifest/create', data)

    response.success && downloadPDF(response)
}

const downloadPDF = async (response) => {
    const linkSource = `data:application/pdf;base64,${response.data.content}`

    const downloadLink = document.createElement('a')

    const fileName = response.data.name

    downloadLink.href = linkSource

    downloadLink.download = fileName

    downloadLink.click()

    isLoading.value = false
}

const buttons = configButtons({
    actions: {
        print
    },
    isLoading,
    mode: props.mode,
    useShow: props.useShow,
    transferId: props.transferId,
    useGlobalStore
})

const hasAdjustments = computed(() => {
    return transferData.value.item_transfers.some(objeto => objeto.item_transfer_type_id !== null)
})
</script>

<template>
    <section class="pt-0">
        <div class="max-w-8xl mx-auto">
            <div class="flex justify-end">
                <ActionButtons
                    :items="buttons" />
            </div>

            <Card
                v-if="transferData?.id"
                id="printableArea"
                hasMargins
                :placeContentCenter="false"
                :class="{ '!h-80' : !transferData?.id || !routeToBeTraveled.length }"
                class="px-10 py-5 mx-auto relative">
                <div v-if="transferData.transfer_type.slug !== 'lost-and-found'">
                    <!-- Manifest page -->
                    <TransferManifestPrint
                        v-if="transferData?.id && routeToBeTraveled"
                        :data="transferData"
                        :dispatchData="dispatchesData"
                        :routeToBeTraveled="routeToBeTraveled" />

                    <!-- Separator. Not displayed in the print view. -->
                    <hr
                        v-if="transferData?.id && routeToBeTraveled && hasAdjustments"
                        class="border border-gray-700 my-8 notPrintableArea">

                    <div class="pagebreak" />

                    <!-- Manifest page with adjustments -->
                    <TransferManifestAdjustPrint
                        v-if="transferData?.id && hasAdjustments && routeToBeTraveled"
                        :data="transferData"
                        :routeToBeTraveled="routeToBeTraveled" />
                </div>

                <!-- Lost and found page -->
                <div v-if="transferData.transfer_type.slug === 'lost-and-found'">
                    <LostAndFoundManifestPrint
                        v-if="transferData?.id && routeToBeTraveled"
                        :data="transferData"
                        :routeToBeTraveled="routeToBeTraveled" />
                </div>

                <!-- Overlay for load data and sync -->
                <Overlay
                    v-if="!transferData?.id || !routeToBeTraveled.length"
                    class="left-0 top-0" />
            </Card>
        </div>
    </section>
</template>
