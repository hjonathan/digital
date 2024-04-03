<script setup>
/**
 * Moves a sublot to the main table (lot)
 */

import { ref, inject } from 'vue'
import { TextArea, ToggleSwitch, SelectCustomDate } from 'form'
import { formatDate } from 'shared'

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

// Inject necessary services
const api = inject('api')
const useGlobalStore = inject('useGlobalStore')

// Component state
const itemToLot = ref({
    lot: false,
    updated_at: null
})

const errors = ref({})

const rapidStore = useGlobalStore('rapidStore')
const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)
const tabsStore = useGlobalStore('tabs')

const data = ref(selectedRows.value[0])

// Saves the "to-lot" action
const save = async () => {
    const endPoint = 'stock/to_lot'

    const objectData = {
        id: data.value.id,
        lot: itemToLot.value.lot,
        updated_at: itemToLot.value.updated_at ? formatDate(itemToLot.value.updated_at, 'utcDateTime') : null
    }

    const response = await api.post(endPoint, objectData)

    return response
}

// Expose the save function to parent components
defineExpose({ save })
</script>

<template>
    <section class="space-y-6 full">
        <!-- Make lot -->
        <ToggleSwitch
            v-model="itemToLot.lot"
            :errors="errors?.lot"
            name="lot"
            :label="$t(`Make lot`)" />

        <!-- Notes -->
        <TextArea
            v-model="itemToLot.note"
            :placeholder="$t('Note')"
            :errors="errors?.note"
            :label="$t('Note')" />

        <!-- Custom date -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="itemToLot.updated_at" />
    </section>
</template>
