<script setup>
/*
| Reweighs an inventory item
*/

import { computed, ref, inject } from 'vue'
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

const data = ref(selectedRows.value[0])

const itemToReWeigh = ref({
    quantity: data.value ? data.value.quantity : 0,
    waste: 0,
    new_weigth: 0,
    note: '',
    updated_at: null,
    reason_id: null
})

// Errors
const errors = ref({})

// Saves the re-weigh action
const save = async () => {
    const response = await api.post('stock/re_weigh', {
        id: data.value.id,
        waste: itemToReWeigh.value.waste,
        new_weigth: Number(itemToReWeigh.value.new_weigth),
        reason_id: itemToReWeigh.value.reason_id ? itemToReWeigh.value.reason_id : null,
        updated_at: itemToReWeigh.value.updated_at ? formatDate(itemToReWeigh.value.updated_at, 'utcDateTime') : null
    })

    response.errors && (errors.value = response.errors)

    response.success && props.type === 'inventory subitem' && rapidStore.$emitGlobalEvent('load-subitem-list')

    return response
}

// Retrieves the current quantity
const currentQuantity = computed(() => Object.freeze(itemToReWeigh.value.quantity))

// Expose the save function to parent components
defineExpose({ save })
</script>

<template>
    <section class="space-y-6 full">
        <!-- Current quantity with its measure -->
        <ShowValue
            v-model="currentQuantity"
            justify-end
            :label="$t('Current quantity')">
            {{ props.product?.measure.name }}
        </ShowValue>

        <hr class="air">

        <!-- New weight -->
        <Input
            v-model="itemToReWeigh.new_weigth"
            inputClass="text-right"
            :type="'number'"
            :step="'1'"
            :min="'0'"
            :errors="errors?.new_weigth"
            :label="$t('New weight')"
            :inline-label-right="data.value?.measure.name" />

        <!-- Reason -->
        <Treeselect
            :errors="errors?.reason_id"
            v-model="itemToReWeigh.reason_id"
            :options="parametersStore.getTreeSelectDataBySlug('reasons')"
            placeholder="Select Item"
            label="Reason"
            class="input" />

        <hr class="air">

        <!-- Notes -->
        <TextArea
            :errors="errors?.note"
            :placeholder="$t('Note')"
            v-model="itemToReWeigh.note"
            :label="$t('Note')" />

        <!-- CustomDate -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="itemToReWeigh.updated_at" />
    </section>
</template>
