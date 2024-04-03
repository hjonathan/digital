<script setup>
import { ref, inject, computed } from 'vue'
import { ShowValue, Input, Treeselect, TextArea, SelectCustomDate } from 'form'
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

// Get a reference to the parameters store
const parametersStore = useGlobalStore('parameters')

const rapidStore = useGlobalStore('rapidStore')
const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)

const dataRows = ref(selectedRows.value[0])

// Component state
const data = ref({
    quantity: dataRows.value ? dataRows.value?.quantity : 0,
    note: props.product?.note,
    updated_at: null
})

// Define a separate ref for the cull quantity
const quantity = ref(0)

// Validation errors
const errors = ref({})

// New total quantity after culling
const total = computed(() => {
    return Number(data.value.quantity) - Number(quantity.value)
})

// Retrieves reasons for culling from global parameters
const getReasons = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('reasons')

    return allLocations.filter((param) => {
        return param.data.slug === 'cult-adjust-reasons'
    })[0].children
}

// Saves the culling action
const save = async () => {
    const objectData = {
        id: dataRows.value.id,
        cull: quantity.value,
        reason_id: data.value.reason_id ? data.value.reason_id : null,
        note: data.value.note,
        updated_at: data.value.updated_at ? formatDate(data.value.updated_at, 'utcDateTime') : null
    }

    const response = await api.post('stock/cull', objectData)

    response.success && props.type === 'inventory subitem' && rapidStore.$emitGlobalEvent('load-subitem-list')

    response.errors && (errors.value = response.errors)

    return response
}

// Expose the save function to parent components
defineExpose({ save })
</script>

<template>
    <section class="space-y-6 full">
        <!-- Display current quantity with its measure  -->
        <ShowValue
            v-model="data.quantity"
            justify-end
            label="Current quantity">
            <!-- Measure name -->
            {{ dataRows.measure.name }}
        </ShowValue>

        <hr class="air" />

        <!-- For entering the quantity to cull -->
        <Input
            v-model="quantity"
            inputClass="text-right"
            :type="'number'"
            :step="'1'"
            :min="'0'"
            :errors="errors.quantity ? errors.quantity : errors.cull"
            :inline-label-right="dataRows.measure.name"
            :label="$t('Cull by')" />

        <!-- Reason for culling -->
        <Treeselect
            :errors="errors?.reason_id"
            v-model="data.reason_id"
            :options="getReasons()"
            placeholder="Select Item"
            label="Reason"
            class="input" />

        <hr class="air" />

        <!-- Display the new total quantity after culling with its measure -->
        <ShowValue
            v-model="total"
            justify-end
            label="New total">
            {{ props.product?.measure.name }}
        </ShowValue>

        <hr class="air" />

        <!-- Note -->
        <TextArea
            :errors="errors?.note"
            v-model="data.note"
            :placeholder="$t('Note')">
            <template #label>{{ $t('Note') }}</template>
        </TextArea>

        <!-- Custom date -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="data.updated_at" />
    </section>
</template>
