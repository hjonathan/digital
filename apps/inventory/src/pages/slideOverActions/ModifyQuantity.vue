<script setup>
import { watch, computed, inject, ref } from 'vue'
import { Input, ShowValue, TextArea, Treeselect, SelectCustomDate } from 'form'
import { formatDate } from 'shared'

const api = inject('api')

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')
const rapidStore = useGlobalStore('rapidStore')

const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)
const slideAction = rapidStore.reactiveProperty(`slide-${props.type}`)

const item = ref(slideAction.value)
const data = ref(selectedRows.value[0])

const quantity = ref(0)
const errors = ref({})

const apiData = ref({
    quantity: data.value.quantity ? data.value.quantity : 0,
    note: props.product?.note,
    updated_at: null,
    parent_id: null
})

const total = computed(() => {
    if (item.value.action === 'Increase') {
        return Number(quantity.value) + Number(apiData.value.quantity)
    }

    return Number(apiData.value.quantity) - Number(quantity.value)
})

const save = async () => {
    // Object to send to the database.
    const objectData = {
        id: data.value.id,
        note: apiData.value.note,
        quantity: quantity.value,
        reason_id: apiData.value.parent_id,
        updated_at: apiData.value.updated_at ? formatDate(apiData.value.updated_at, 'utcDateTime') : null
    }

    // Select the end point based on the type of resource.
    const endPoint = `/stock/${item.value.action === 'Increase' ? 'increase' : 'decrease'}`

    const response = await api.post(endPoint, objectData)

    response.success && props.type === 'inventory subitem' && rapidStore.$emitGlobalEvent('load-subitem-list')

    // Processing errors
    response.errors && (errors.value = response.errors)

    return response
}

// Prevent negative quantity.
watch(
    () => apiData.value.quantity,
    () => { if (apiData.value.quantity < 0) { apiData.value.quantity = 0 } }
)

defineExpose({ save })
</script>

<template>
    <div class="space-y-6">
        <ShowValue v-model="data.quantity" justify-end>
            {{ data?.measure.name }}

            <template #label>{{ $t('Current quantity') }}</template>
        </ShowValue>

        <hr class="air" />

        <Input
            v-model="quantity"
            inputClass="text-right"
            :type="'number'"
            :step="'1'"
            :min="'0'"
            :errors="errors.quantity ? errors.quantity : errors.cull">
            <template #label>{{ item.action }} {{ item.action === 'Cull' ? '' : 'by' }}</template>

            <template #inlineLabelRight>{{ data?.measure.name }}</template>
        </Input>

        <Treeselect
            :class="{'!bg-red-100': errors?.reason_id }"
            :errors="errors?.reason_id"
            label="Reason"
            v-model="apiData.parent_id"
            :options="parametersStore.getTreeSelectDataBySlug('reasons')"
            placeholder="Select Item"
            class="input" />

        <hr class="air" />

        <ShowValue v-model="total" justify-end>
            {{ data?.measure.name }}

            <template #label>{{ $t('New total') }}</template>
        </ShowValue>

        <hr class="air" />

        <TextArea
            :errors="errors?.note"
            v-model="apiData.note"
            :placeholder="$t('Note')">
            <template #label>{{ $t('Note') }}</template>
        </TextArea>

        <!-- Select custom date -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="apiData.updated_at" />
    </div>
</template>
