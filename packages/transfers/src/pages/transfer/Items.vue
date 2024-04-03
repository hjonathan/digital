<script setup>
import ItemsGrid from '../../components/ItemsGrid.vue'
import { Alert, Overlay } from 'layout'
import { useI18n } from 'vue-i18n'
import { ref, inject } from 'vue'
import TransferStepTitle from './TransferStepTitle.vue'
import NoItemsFound from '../../components/NoItemsFound.vue'
import { showUuid } from 'shared'

const { t } = useI18n()

const props = defineProps({
    step: {
        type: Object,
        default: () => ({})
    },
    itemsMode: {
        type: String,
        default: 'readonly'
    },
    useTransfer: Object
})

const useGlobalStore = inject('useGlobalStore')

const loaders = ref({
    syncItems: false
})

/**
 * INVENTORY SYNC
 */
const rapidStore = useGlobalStore('rapidStore')

const { thread, items, saveMessage, allErrors, step, useStepper, transferId } = props.useTransfer

const itemsSelected = rapidStore.reactiveProperty(`${thread.value.idThread}-selected-items`, [])

const syncItemsSelected = (newItemSelected) => {
    for (const item of newItemSelected) {
        item.item_id = item.id

        item.original_quantity = item.quantity

        const existsItem = items.value.rawData?.find(i => i.id === item.id)

        if (existsItem) {
            item.quantity = existsItem.quantity

            item.is_editable = existsItem.is_editable
        }
    }

    items.value.rawData = newItemSelected

    itemsSelected.value = newItemSelected
}

rapidStore.$registerGlobalEvent(`selectedItems:${thread.value.action}`, syncItemsSelected)
</script>

<template>
    <Overlay
        v-if="loaders.syncItems"
        class="max-w-8xl" />

    <section class="paper">
        <TransferStepTitle
            :title="$t('Items')"
            :subtitle="transferId ? showUuid(transferId) : ''"
            :saveMessage="saveMessage"
            :errors="allErrors" />

        <template
            v-for="(item, index) in useStepper.errors"
            :key="index">
            <Alert
                :has-close-button="false"
                type="danger">
                <div class="flex space-x-2">
                    <span>
                    {{ $t(item.message) }}
                    </span>

                    <a
                        href="#"
                        class="link !text-red-500"
                        @click="()=> step = item.step">
                        {{ $t('Click here to complete the data') }}
                    </a>
                </div>
            </Alert>
        </template>

        <ItemsGrid
            :action-thread="thread.action"
            :items="itemsSelected"
            :mode="itemsMode !== 'assignment' ? 'dispatcher' : 'assignment'" />

        <NoItemsFound
            class="!mt-0"
            v-if="!itemsSelected.length"
            :description="$t('No items selected')"/>
    </section>
</template>
