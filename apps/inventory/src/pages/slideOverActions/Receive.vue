<script setup>
import { ref, inject, onMounted } from 'vue'
import { AutoComplete, Input, Treeselect } from 'form'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const api = inject('api')

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')
const inventoryStore = useGlobalStore('inventory')
const itemTypesStore = useGlobalStore('itemTypes')

const vendors = ref([])

onMounted(() => {
    getVendors()
})

// Get Vendors from API
const getVendors = async () => {
    const response = await api.get('/vendors')

    if (response && response.success) {
        vendors.value = response.data
    }
}

const productToReceive = ref({
    quantity: 0,
    vendor_item_id: null,
    vendor: null,
    strain: null,
    brand: null,
    item_id: null,
    location: null,
    type: null,
    measure: null,
    note: null
})

const errors = ref({})

const save = async () => {
    const response = await api.post('/received-items/complete_receive', {
        vendor_id: productToReceive.value.vendor?.id,
        item_type_id: productToReceive.value.item_type?.id,
        location_id: productToReceive.value.location,
        measure_id: productToReceive.value.measure,
        brand_id: productToReceive.value.brand,
        strain_id: productToReceive.value.strain,
        quantity: productToReceive.value.quantity,
        vendor_item_id: productToReceive.value.vendor_item_id
    })

    // response.success && inventoryStore.fetch()

    response.errors && (errors.value = response.errors)

    return response
}

// Returns only grams and units
const getMeasures = () => {
    const allMeasures = parametersStore.getTreeSelectDataBySlug('measures')

    return allMeasures.filter((param) => {
        return param.data.slug === 'grams' || param.data.slug === 'units'
    })
}

// Returns only the categories allowed
const getItemTypes = () => {
    return itemTypesStore.getData()
}

// Returns only the children locations of Inventory room
const getLocations = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('locations')

    return allLocations.filter((param) => {
        return param.data.slug === 'final-room'
    })[0].children
}

defineExpose({ save })
</script>

<template>
    <div class="space-y-6">
        <AutoComplete
            v-model="productToReceive.vendor"
            :options="vendors"
            :errors="errors.vendor_id"
            placeholder="Select a vendor">
            <template #label>{{ $t('Vendor') }}</template>
        </AutoComplete>

        <Input
            :placeholder="$t('Vendor Product ID')"
            :errors="errors.vendor_item_id"
            v-model="productToReceive.vendor_item_id">
            <template #label>{{ $t('Vendor Product ID') }}</template>
        </Input>

        <Treeselect
            :label="t(`Strain`)"
            :class="{'!bg-red-100': errors?.strain_id }"
            v-model="productToReceive.strain"
            :options="parametersStore.getTreeSelectDataBySlug('strains')"
            placeholder="Select Item"
            class="input" />

        <Treeselect
            :label="t('Brand')"
            :class="{'!bg-red-100': errors?.brand_id }"
            v-model="productToReceive.brand"
            :options="parametersStore.getTreeSelectDataBySlug('brands')"
            placeholder="Select Item"
            class="input" />

        <AutoComplete
            v-model="productToReceive.item_type"
            :options="getItemTypes()"
            :errors="errors.item_type_id"
            placeholder="Select item">
            <template #label>{{ $t('Item type') }}</template>
        </AutoComplete>

        <Treeselect
            :label="t(`Location`)"
            :errors="errors?.location_id"
            :class="{'!bg-red-100': errors?.location_id }"
            v-model="productToReceive.location"
            :options="getLocations()"
            placeholder="Select Item"
            class="input" />

        <Treeselect
            :label="t(`Measure`)"
            :errors="errors?.measure_id"
            :class="{'!bg-red-100': errors?.measure_id }"
            v-model="productToReceive.measure"
            :options="getMeasures()"
            placeholder="Select Item"
            class="input mb-2" />

        <Input
            v-model="productToReceive.quantity"
            inputClass="text-right"
            :type="'number'" :step="'1'"
            :min="'0'"
            :errors="errors?.quantity">
            <template #label>{{ $t('Quantity') }}</template>

            <template #inlineLabelRight>{{ product?.measure?.name }}</template>
        </Input>
    </div>
</template>
