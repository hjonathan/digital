<script setup>
import { Card, Overlay, ActionButtons } from 'layout'
import { inject, ref, onMounted } from 'vue'
import TransferManifestPrint from '../show/TransferManifestPrint.vue'
import SlideOverActions from '../../components/slideOverActions/SlideOverActions.vue'
import AlertModal from '../../components/alertModal/AlertModal.vue'
import { useReceiveAdjustment as useComposable } from './useReceiveAdjustment'
import { useSlideOver as useComposableSlideOver } from '../../components/slideOverActions/useSlideOver'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { useMap as useComposableMap } from '../../components/useMap'
import { configButtons } from './configButtons'

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const transfersStore = useGlobalStore('transfers')
const dispatchesStore = useGlobalStore('dispatches')

const transferId = router.currentRoute.value.params.id

const transferData = ref()
const dispatchesData = ref()

// COMPOSABLES
const useReceiveAdjustment = useComposable({ useGlobalStore, transferId, transferData })
const useSlideOver = useComposableSlideOver({})
const useAlertModal = useComposableModal({})
const useMap = useComposableMap({ transferData })

const { getRoute, routeToBeTraveled } = useMap

const buttons = configButtons({ transferId, transferData, useSlideOver, useAlertModal, useGlobalStore, useReceiveAdjustment })

onMounted(async () => {
    if (transferId) {
        const response = await transfersStore.getTransferItem(transferId)

        if (response.success) {
            transferData.value = response.data

            getRoute()

            const dispatchResponse = await dispatchesStore.getTransferItem(transferData.value?.dispatch_transfer_details[0]?.dispatch_transfer_id)

            dispatchResponse.success && (dispatchesData.value = dispatchResponse.data[0])
        }
    }
})

</script>

<template>
    <div class="flex sticky top-0 z-10 justify-center bg-slate-100">
        <div class="max-w-8xl w-full flex justify-end ">
            <ActionButtons :items="buttons" />
        </div>
    </div>

    <section class="full">
        <div class="max-w-8xl mx-auto">
            <Card
                id="printableArea"
                hasMargins
                :placeContentCenter="false"
                :class="{ 'h-80' : !transferData?.id || !routeToBeTraveled }"
                class="px-10 py-5 mx-auto relative">
                <TransferManifestPrint
                    v-if="transferData?.id && routeToBeTraveled"
                    :data="transferData"
                    :dispatchData="dispatchesData"
                    :routeToBeTraveled="routeToBeTraveled" />

                <!-- Overlay for load data and sync -->
                <Overlay
                    class="left-0 top-0"
                    v-if="!transferData?.id || !routeToBeTraveled" />
            </Card>
        </div>
    </section>

    <SlideOverActions :useSlideOver="useSlideOver"/>

    <AlertModal :useAlertModal="useAlertModal" />
</template>
