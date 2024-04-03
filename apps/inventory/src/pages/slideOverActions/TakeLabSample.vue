<script setup>
/**
 * TakeLabSample
 */

import { ref, inject, computed } from 'vue'
import { TextArea, Input, SelectCustomDate, ShowValue, Treeselect } from 'form'
import { formatDate } from 'shared'
import { Alert } from 'layout'

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

// Inject necessary services
const api = inject('api')
const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')
const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)

const tabsStore = useGlobalStore('tabs')
const labResultsStore = useGlobalStore('labResults')
const slideAction = rapidStore.reactiveProperty(`slide-${props.type}`)

const parametersStore = useGlobalStore('parameters')

const data = ref(selectedRows.value[0])

const errors = ref({})

// Component state
const itemToTakeLabSample = ref({
    available_quantity: data.value ? data.value.quantity : 0,
    quantity: 0,
    take: 0,
    location_id: null,
    updated_at: null,
    note: ''
})

const generalErrors = ref({
    isOpen: false,
    error: ''
})

// Saves the "take lab sample" action
const save = async () => {
    const endPoint = slideAction.value.action === 'TakeLabSample' ? 'stock/take_lab_sample' : 'stock/retake_lab_sample'

    const objectData = {
        id: data.value.id,
        quantity: itemToTakeLabSample.value.quantity,
        location_id: itemToTakeLabSample.value.location_id,
        note: itemToTakeLabSample.value.note,
        updated_at: itemToTakeLabSample.value.updated_at ? formatDate(itemToTakeLabSample.value.updated_at, 'utcDateTime') : null
    }

    const response = await api.post(endPoint, objectData)

    if (response.success && props.type === 'inventory subitem') {
        tabsStore.closeTab('inventory subitem')

        tabsStore.activateTab({ name: 'Inventory', parentName: 'Inventory' })
    }

    if (!response.success && response.message && !response.errors) {
        generalErrors.value = {
            isOpen: true,
            error: response.message
        }
    }

    response.success && labResultsStore.fetch()

    // Processing errors
    response.errors && (errors.value = response.errors)

    return response
}

// Retrieves the current quantity
const currentQuantity = computed(() => Object.freeze(itemToTakeLabSample.value.available_quantity))

// Retrieves the remaining quantity
const remaining = computed(() => Number(itemToTakeLabSample.value.available_quantity) - Number(itemToTakeLabSample.value.quantity))

// Retrieves only 'Final room', 'Freezing Room', 'Cure Room' and 'Vault' locations.
const getLocations = () => {
    const allowedLocations = ['final-room', 'vault', 'freezing-room', 'cure-room']

    const allLocations = parametersStore.getTreeSelectDataBySlug('locations')

    return allLocations.filter(location => allowedLocations.includes(location.data.slug))
}

// Expose the save function to parent components
defineExpose({ save })
</script>

<template>
    <section class="full">
        <!-- Alert for general errors -->
        <Alert
            v-model="generalErrors.isOpen"
            :has-close-button="true"
            :content="generalErrors.error"
            type="danger" />

        <!-- Current quantity with its measure -->
        <ShowValue
            v-model="currentQuantity"
            justify-end
            :label="$t('Available quantity')">
            {{ data?.measure.name }}
        </ShowValue>

        <hr class="air">

        <!-- Quantity taken -->
        <Input
            v-model="itemToTakeLabSample.quantity"
            inputClass="text-right"
            :type="'number'"
            :step="'1'"
            :min="'0'"
            :errors="errors?.quantity"
            :label="$t('Quantity taken')"
            :inline-label-right="data?.measure.name" />

        <!-- Locations -->
        <Treeselect
            :errors="errors?.location_id"
            :label="$t(`Location`)"
            :class="{'!bg-red-100': errors.location_id }"
            v-model="itemToTakeLabSample.location_id"
            :options="getLocations()"
            :placeholder="$t('Select Item')"
            class="input" />

        <hr class="air">

        <!-- Remaining -->
        <ShowValue
            v-model="remaining"
            justify-end
            :label="$t('Remaining')">
            {{ data?.measure.name }}
        </ShowValue>

        <!-- Note -->
        <TextArea
            :errors="errors?.note"
            v-model="itemToTakeLabSample.note"
            :placeholder="$t('Note')"
            :label="$t('Note')" />

        <!-- Select custom date -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="itemToTakeLabSample.updated_at" />
    </section>
</template>
