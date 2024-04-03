<script setup>
import { Button } from 'layout'
import { Input, Label, AutoComplete, Treeselect, TextArea } from 'form'
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneDdefineModeleep } from 'lodash'
import { defineModel } from 'shared'

const { t } = useI18n()

const props = defineProps({
    mode: {
        type: String,
        default: () => 'create' // create - edit
    },
    item: {
        type: Object,
        default: () => ({})
    },
    errors: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number
    }
})

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')
const itemTypesStore = useGlobalStore('itemTypes')

const emits = defineEmits(['delete', 'save', 'cancel'])

const itemModel = ref(props.item)
const errors = defineModel('errors')

const deleteItem = () => {
    emits('delete', { oldValue: props.item, newValue: itemModel.value })
}

const cancel = () => {
    emits('cancel')
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

    if (!allLocations.length) return []

    return allLocations.filter((param) => {
        return param.data.slug === 'final-room'
    })[0].children
}
</script>

<template>
    <section class="bg-gray-50">
        <div class="grid grid-cols-12 gap-5 ">
                <Input
                    class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end !mt-0"
                    :label="t('Code')"
                    :errors="errors && errors[`reception_items.${index}.item_cod`] ? ' ': null"
                    v-model="itemModel.item_cod"
                    :placeholder="$t('Code')"/>

                <AutoComplete
                    class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end !mt-0"
                    containerClass="text-left"
                    :label="t('Item type')"
                    v-model="itemModel.item_type"
                    :options="getItemTypes()"
                    :errors="errors && errors[`reception_items.${index}.item_type_id`] ? ' ': null"
                    :placeholder="t('Select item')">
                </AutoComplete>

                <Input
                    :label="t('Quantity')"
                    :type="'number'"
                    :step="'1'"
                    :min="'0'"
                    :errors="errors && errors[`reception_items.${index}.quantity`] ? ' ': null"
                    class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end !mt-0"
                    inputClass="text-right"
                    v-model="itemModel.quantity"
                    :placeholder="$t('Quantity')"/>

                <Treeselect
                    :label="t('Unit of measure')"
                    :errors="errors && errors[`reception_items.${index}.measure_id`] ? ' ' : null"
                    v-model="itemModel.measure_id"
                    :options="getMeasures()"
                    :placeholder="t('Select Item')"
                    containerClass="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end" />

                <Treeselect
                    :label="t('Strain')"
                    :class="{'!bg-red-100': errors? errors[`reception_items.${index}.strain_id`]: null }"
                    v-model="itemModel.strain_id"
                    :options="parametersStore.getTreeSelectDataBySlug('strains')"
                    :placeholder="t('Select Item')"
                    containerClass="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end" />

                <Treeselect
                    :label="t('Brand')"
                    containerClass="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end"
                    :class="{'!bg-red-100': errors?.brand_id}"
                    v-model="itemModel.brand_id"
                    :options="parametersStore.getTreeSelectDataBySlug('brands')"
                    :placeholder="t('Select Item')" />

                <Input
                    :label="t('Price')"
                    :type="'number'"
                    :step="'1'"
                    :min="'0'"
                    class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end !mt-0"
                    inputClass="text-right"
                    v-model="itemModel.price"
                    :errors="errors && errors[`reception_items.${index}.price`] ? ' ': null"
                    :placeholder="$t('Price')"/>

                <Input
                    :label="t('Discount')"
                    :type="'number'"
                    :step="'1'"
                    :min="'0'"
                    inputClass="text-right"
                    class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end !mt-0"
                    v-model="itemModel.discount"
                    :placeholder="$t('Discount')" />

                <Treeselect
                    :label="t('Location')"
                    :errors="errors && errors[`reception_items.${index}.location_id`] ? ' ' : null"
                    v-model="itemModel.location_id"
                    :options="getLocations()"
                    :placeholder="t('Select Item')"
                    containerClass="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end" />

                <div class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 text-end w-full">
                    <TextArea
                        :label="t('Description')"
                        containerClass="text-end w-full"
                        class="!mt-0"
                        v-model="itemModel.description"
                        :placeholder="$t('Description')" />
                </div>
        </div>
    </section>
</template>
