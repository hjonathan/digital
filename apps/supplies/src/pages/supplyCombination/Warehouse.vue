<script setup>
import { Title } from 'layout'
import { InputLabel, AutoComplete, Input, Treeselect, TextArea } from 'form'
import { showUuid } from 'shared'
import CombinationsGrid from './CombinationsGrid.vue'
import { computed, inject } from 'vue'

const props = defineProps({
    useWarehouse: Object,
    useAdditionalCosts: Object,
})

const useGlobalStore = inject('useGlobalStore')
const parametersStore = useGlobalStore('parameters')

// Retrieves all warehouse locations
const warehouseLocations = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('locations').filter(location => {
        return location.data.slug === 'warehouse-area'
    })[0]?.children
})

// Retrieves all supplies categories
const suppliesCategories = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('categories').filter(category => {
        return category.data.slug === 'supplies'
    })[0]?.children
})

// Retrieves all measures
const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

const { data, schema, errors, permissions, vendor, receptionItems } = props.useWarehouse

const { additionalCosts, schemaCosts, isRecovered } = props.useAdditionalCosts
</script>

<template>
    <section
        id="WHCPrintableArea"
        class="paper">
        <Title
            :title="`${$t('Combination')} ${ data?.id ? `#${showUuid(data?.id)}` : ''} `"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <!-- Receiver information section -->
        <Title
            :title="$t('Vendor information')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />
        
        <!-- Receiver information -->
        <div class="row cols-2">
            <div class="gutter-xs">
                <!-- Name or title -->
                <InputLabel
                    v-model="vendor.name"
                    :label="$t('Vendor name')"
                    mode="readonly"
                    outline
                    dense />
                
                <!-- Address -->
                <InputLabel
                    v-model="vendor.address"
                    :label="$t('Address')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Address 2 -->
                <InputLabel
                    v-model="vendor.address_2"
                    :label="$t('Address 2')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Zip code -->
                <InputLabel
                    v-model="vendor.zip_code"
                    :label="$t('Zip code')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Contact -->
                <InputLabel
                    v-model="vendor.contact"
                    :label="$t('Contact')"
                    mode="readonly"
                    outline
                    dense />
            </div>

            <div class="gutter-xs">
                <!-- Phone -->
                <InputLabel
                    v-model="vendor.phone"
                    :label="$t('Phone')"
                    mode="readonly"
                    outline
                    dense />

                <!-- State -->
                <InputLabel
                    v-model="vendor.state"
                    :label="$t('State')"
                    mode="readonly"
                    outline
                    dense />

                <!-- City -->
                <InputLabel
                    v-model="vendor.city"
                    :label="$t('City')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Email -->
                <InputLabel
                    v-model="vendor.email"
                    :label="$t('Email')"
                    mode="readonly"
                    outline
                    dense />
            </div>
        </div>

        <!-- Combined item information -->
        <Title
            :title="$t('Combined item information')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Combined item information -->
        <div
            class="row cols-2">
            <!-- This DIV and Padding is necessary because of the opening and closing animation -->
            <div>
                <!-- Name -->
<!--                 <AutoComplete
                    v-if="schema.role==='creator'"
                    :label="$t('Name')"
                    @change="onChangeItem(row, index)"
                    v-model="row.supply"
                    :force-selection="false"
                    :options="supplies"
                    :errors="errors && errors[`order_supplies.${index}.name`] ? [] : null"
                    :placeholder="t('Select')" /> -->

                <!-- Name -->
                <Input
                    v-model="data.name"
                    :errors="null"
                    :readonly="mode === 'readonly'"
                    type="number"
                    min="0"
                    :label="$t('Supply')"
                    :placeholder="$t('Search...')" />

                <!-- Quantity -->
                <Input
                    v-model="data.unit_price"
                    :errors="null"
                    :label="$t('Price')"
                    :placeholder="$t('Price')"
                    :inputClass="'text-right'"
                    type="number"
                    min="0"
                    inline-label-left="$"
                    class="md:!mt-8" />

                <!-- Sku -->
                <Input
                    v-model="data.sku"
                    :errors="null"
                    :readonly="mode === 'readonly'"
                    :label="$t('SKU')"
                    :placeholder="$t('SKU')" />

                <!-- Location -->
                <Treeselect
                    v-model="data.location_id"
                    :errors="null"
                    :readonly="schema.mode === 'readonly'"
                    :options="warehouseLocations"
                    :label="$t('Location')"
                    :placeholder="$t('Select')" />
            </div>

            <div>
                <!-- Quantity -->
                <Input
                    v-model="data.quantity"
                    :errors="null"
                    :readonly="mode === 'readonly'"
                    :inputClass="'text-right'"
                    type="number"
                    min="0"
                    :label="$t('Total of resulting items')"
                    :placeholder="$t('Quantity')" />

                <!-- Unit of measure -->
                <div>
                    <!-- For show view -->
                    <InputLabel
                        @change="onChangeItem(row, index)"
                        v-if="false"
                        v-model="row.supply.measure.name"
                        :label="$t('Unit of measure')"
                        mode="readonly"
                        outline
                        white-mode
                        dense
                        :has-border="false"
                        input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
                        label-class="text-sm print-text-base-md !font-normal" />

                    <!-- For editor view -->
                    <Treeselect
                        v-else
                        @change="onChangeItem(row, index)"
                        :input-id="`measure_select-${index}`"
                        v-model="data.measure_id"
                        :errors="null"
                        :readonly="schema.mode === 'readonly'"
                        :options="measures"
                        :label="$t('Unit of measure')"
                        :placeholder="$t('Select')" />
                </div>

                <!-- Category -->
                <Treeselect
                    v-model="data.category_id"
                    :errors="null"
                    :options="suppliesCategories"
                    :label="$t('Category')"
                    :placeholder="$t('Select')" />

                <!-- Description -->
                <TextArea
                    v-model="data.description"
                    :errors="null"
                    :label="$t('Description')"
                    :placeholder="$t('Description')" />
            </div>
        </div>

        <!-- Invoice section -->
        <section>
            <CombinationsGrid
                v-model:items="receptionItems"
                :mode="schema.role" />
        </section>
    </section>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
  opacity: 0 ;
}
</style>
