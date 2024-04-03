<script setup>
import { Card, Title, ActionButtons } from 'layout'
import { inject, ref, onMounted, computed } from 'vue'
import ItemsGrid from '../../components/ItemsGrid.vue'
import { cloneDeep } from 'lodash'
import SlideOverActions from '../../components/slideOverActions/SlideOverActions.vue'
import AlertModal from '../../components/alertModal/AlertModal.vue'
import { useReceiveAdjustment as useComposable } from './useAdjustments'
import { useSlideOver as useComposableSlideOver } from '../../components/slideOverActions/useSlideOver'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { jsonLogic } from 'jsonRules'
import { rules, baseRules } from '../configRules'
import { configButtons } from './configButtons'
import { showUuid } from 'shared'
import StatusBadge from '../../components/StatusBadge.vue'

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const transfersStore = useGlobalStore('transfers')

const transferId = router.currentRoute.value.params.id

const transferData = ref()

const items = ref([])
const initialItems = ref([])

// COMPOSABLES
const useAdjustments = useComposable({ useGlobalStore, transferId, transferData, items })
const useSlideOver = useComposableSlideOver({})
const useAlertModal = useComposableModal({})

const buttons = configButtons({ transferData, useSlideOver, useAlertModal, useGlobalStore, useAdjustments, initialItems, items })

const mode = computed(() => {
    if (jsonLogic.apply(rules.adjustOrigin, transferData.value)) { return 'adjustment' }

    if (jsonLogic.apply(rules.adjustDestination, transferData.value)) { return 'destination' }

    return 'show'
})

onMounted(async () => {
    if (transferId) {
        const response = await transfersStore.getTransferItem(transferId)

        transferData.value = response.data

        items.value = formatItems(response.data.item, response.data.item_transfers)
    }

    initialItems.value = cloneDeep(items.value)
})

const formatItems = (items, itemsTransfers) => {
    return items.map(e => {
        const item = itemsTransfers.find(v => v.item_id === e.id)

        if (item) {
            return {
                ...e,
                quantity: item.quantity,
                original_quantity: item.original_quantity,
                item_transfer_type_id: item.item_transfer_type_id,
                is_editable: jsonLogic.apply(baseRules.adjustmentRejected, transferData.value) ? [1, 2].includes(item.item_transfer_type_id) : null
            }
        }
        return e
    })
}
</script>

<template>
    <div class="flex sticky top-0 z-10 justify-center bg-slate-100">
        <div class="max-w-8xl w-full flex justify-end ">
            <ActionButtons 
                :items="buttons" />
        </div>
    </div>

    <section class="full">
        <div class="max-w-8xl mx-auto">
            <Card
                id="printableArea"
                hasMargins
                :placeContentCenter="false"
                :class="{ 'h-80' : true}" >
                    <section class="full">
                        <Title :title="$t('Transfer')">
                            <template v-slot:centerTitle>
                                <StatusBadge
                                    :status="transferData?.transfer_status.slug"
                                    :label="transferData?.transfer_status.name"
                                    size="xl" />
                            </template>

                            <template v-slot:rightTitle>
                                {{ showUuid(transferId) }}
                            </template>
                        </Title>

                        <Title
                            :title="$t('items')"
                            title-type="h2"
                            :has-border-bottom-line="false"/>

                        <ItemsGrid
                            :mode="mode"
                            v-model:items="items">
                        </ItemsGrid>
                    </section>
            </Card>
        </div>
    </section>

    <SlideOverActions 
        :useSlideOver="useSlideOver" />

    <AlertModal 
        :useAlertModal="useAlertModal" />
</template>
