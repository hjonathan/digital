<script setup>
/*
|    This Vue component handles the process of changing the stage of an item.
*/

import { ref, inject } from 'vue'
import { Treeselect, SelectCustomDate } from 'form'
import { formatDate } from 'shared'

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

// Inject necessary services
const useGlobalStore = inject('useGlobalStore')
const api = inject('api')
const rapidStore = useGlobalStore('rapidStore')

const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)

// Get a reference to the parameters store
const parametersStore = useGlobalStore('parameters')

// Component state
const elementToConvert = ref({
    // Initialize with the stage_id from props or null
    stage_id: selectedRows.value[0]?.stage_id ? selectedRows.value[0].stage_id : null,
    updated_at: null
})

const errors = ref({})

// Save function to update the stage of an item. Use the selected stage_id or null if not selected
const save = async () => {
    const response = await api.post('stock/stage_change', {
        id: selectedRows.value[0].id,
        stage_id: elementToConvert.value.stage_id ? elementToConvert.value.stage_id : null,
        updated_at: elementToConvert.value.updated_at ? formatDate(elementToConvert.value.updated_at, 'utcDateTime') : null
    })

    response.success && props.type === 'inventory subitem' && rapidStore.$emitGlobalEvent('load-subitem-list')

    response.errors && (errors.value = response.errors)

    return response
}

// Expose the save function to the template
defineExpose({ save })
</script>

<template>
    <section class="space-y-6 full">
        <!-- Stages Dropdown -->
        <Treeselect
            :errors="errors?.stage_id"
            v-model="elementToConvert.stage_id"
            :options="parametersStore.getTreeSelectDataBySlug('stages')"
            placeholder="Select Item"
            label="Stage"
            class="input" />

        <!-- Select custom date -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="elementToConvert.updated_at" />
    </section>
</template>
