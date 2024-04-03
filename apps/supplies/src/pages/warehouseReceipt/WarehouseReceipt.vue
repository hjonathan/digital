<script setup>
import { Title, TableUI, Button } from 'layout'
import { Input, TextArea, Treeselect, AutoComplete, InputLabel } from 'form'
import ReceiverInformation from '../../components/ReceiverInformation.vue'
import { cloneDeep, isObject, isString } from 'lodash'
import { showUuid, round } from 'shared'
import { compile, computed, inject, nextTick, onMounted, ref } from 'vue'
import { mdiPlus, mdiChevronDown, mdiTrashCanOutline } from '@mdi/js'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const SUPPLY_ID = '4fe13238-cus1-16f3-b184-b772fabf2zzz'
// import ZeroStockGrid from './ZeroStockGrid.vue'

const props = defineProps({
    useWarehouseReceipt: Object
})

const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')
const parametersStore = useGlobalStore('parameters')
const suppliesStore = useGlobalStore('supplies')
const vendorStore = useGlobalStore('vendors')

const { data, schema, errors, permissions } = props.useWarehouseReceipt

const tableRef = ref()

const getColumns = computed(() => {
    const columns = [
        {
            field: 'name',
            name: t('Name'),
            align: 'left',
            customClass: '!w-5/12'
        },
        {
            field: 'quantity',
            name: t('Quantity'),
            align: 'left',
            customClass: '!w-1/12'
        },
        {
            field: 'uom',
            name: t('Unit of measure'),
            align: 'left',
            customClass: '!w-3/12'
        },
        {
            field: 'price',
            name: t('Price'),
            align: 'left',
            customClass: '!w-1/12'
        },
        {
            field: 'supply_order_status.name',
            name: '',
            align: 'left',
            customClass: '!w-1/12'
        }]

    return columns
})

vendorStore.fetch()

const vendors = computed(() => {
    return vendorStore.getData()
})

const add = (newItem) => {
    data.value.supplies.push(newItem || { name: null })

    nextTick(() => {
        tableRef.value.toggleExpansion(data.value.supplies.length - 1)
    })
}

const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

// Retrieves all supplies categories
const suppliesCategories = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('categories').filter(category => {
        return category.data.slug === 'supplies'
    })[0]?.children
})

const warehouseLocations = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('locations').filter(location => {
        return location.data.slug === 'warehouse-area'
    })[0]?.children
})

const supplies = computed(() => {
    return suppliesStore.getData()
})

const getMeasureByID = (id) => {
    return measures.value.filter(measure => measure.id === Number(id))[0]
}

const onChangeItem = (row, index) => {
    const element = cloneDeep(row)

    if (isObject(element.supply)) {
        row.name = element.supply.name
        row.measure = element.supply.measure
        row.measure_id = element.supply.measure_id
        row.custom_product = false
    }

    if (isString(element.supply)) {
        row.supply_id = SUPPLY_ID
        row.custom_product = true
        row.name = element.supply
    }
}

const removeItem = (index) => {
    data.value.supplies.splice(index, 1)
}

const verifyErrorRow = (row, index) => {
    if (errors.value) {
        const response = Object.keys(errors.value).find(e => e.includes(`order_supplies.${index}`))

        return !!response
    }

    return false
}

onMounted(() => {
    data.value.supplies.push({ name: null, isOpen: true })
})

const getCategoryByID = (id) => {
    return suppliesCategories.value.filter(category => category.id === Number(id))[0]
}

const getLocationByID = (id) => {
    return warehouseLocations.value.filter(location => location.id === Number(id))[0]
}
</script>

<template>
    <section
        id="WHPrintableArea"
        class="paper">
        <Title
            :title="`${$t('Warehouse receipt')} ${ data?.id ? `#${showUuid(data?.id)}` : ''} `"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold" />

        <!-- Receiver information section -->
        <Title
            :title="$t('Receiver information')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <ReceiverInformation
            :schema="schema"
            v-model="data.receiver"
            :permissions="permissions" />

        <div class="row cols-2">
            <div>
                <!-- Vendor information -->
                <Title
                    :title="$t('Receipt information')"
                    :hasBorderBottomLine="false"
                    titleType="h2"
                    class="font-semibold" />

                    <div class="gutter-xs">
                        <!-- Vendor -->
                        <AutoComplete
                            v-if="schema.role === 'creator'"
                            :readonly="!!data.id"
                            v-model="data.vendor"
                            :placeholder="$t('Vendor')"
                            :options="vendors"
                            :forceSelection="false"
                            :errors="errors?.vendor_id ? errors.vendor_id[0] : null" />

                        <InputLabel
                            v-else-if="data.vendor?.name"
                            v-model="data.vendor.name"
                            :label="$t('Vendor name')"
                            :mode="schema.role === 'creator'? 'edit':'readonly' "
                            outline
                            dense />

                        <InputLabel
                            v-model="data.tracking_id"
                            :label="$t('Tracking ID')"
                            :mode="schema.role === 'creator'? 'edit':'readonly' "
                            outline
                            dense
                            :error="errors?.tracking_id"
                            class="mt-3" />
                    </div>
            </div>
        </div>

        <!-- Invoice section -->
        <section v-if="schema.role ==='creator'">
            <Title
                :title="$t(`Items`)"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="font-semibold" />

            <TableUI
                ref="tableRef"
                :columns="getColumns"
                :multipleOpen="false"
                :data="data.supplies">
                    <template v-slot:row="{ row, index, toggleExpansion }">
                        <tr
                            :class="{
                                'border-b border-gray-100 print-custom-leading': true,
                                'bg-gray-200': row.isOpen,
                                'bg-red-100':verifyErrorRow(row, index) }">
                            <!-- Name -->
                            <td class="pl-4 print-custom-leading !py-2">
                                {{ row.name || '' }}
                            </td>

                            <!-- Quantity -->
                            <td class="text-right pr-10 print-custom-leading">
                                {{ round(row.quantity) || 0 }}
                            </td>

                            <!-- Measure -->
                            <td class="print-custom-leading">
                                {{ getMeasureByID(row.measure_id)?.data?.name }}
                            </td>

                            <!-- Price -->
                            <td class="text-right pr-10">
                                ${{ round(row.unit_price) || 0 }}
                            </td>

                            <td>
                                <div class="flex items-center h-full justify-end !pr-3">
                                    <Button
                                        :icon="mdiChevronDown"
                                        color="secondary"
                                        flat
                                        size="lg"
                                        rounded
                                        iconClass="hover:text-primary-500"
                                        @click="toggleExpansion(index)"
                                        :class="[ row.isOpen ? 'rotate-180' : '' ]"
                                        class="!px-2" />

                                    <Button
                                        v-if="schema.role === 'creator'"
                                        :icon="mdiTrashCanOutline"
                                        size="lg"
                                        flat
                                        rounded
                                        color="secondary"
                                        iconClass="hover:text-red-500"
                                        @click="removeItem(index)" />
                                </div>
                            </td>
                        </tr>
                    </template>

                    <template v-slot:row-expansible="{ row, index, toggleExpansion }">
                        <div class="border p-2 bg-gray-100">
                            <div
                                :id="`item-form-${index}`"
                                class="row cols-2 p-5">
                                <!-- This DIV and Padding is necessary because of the opening and closing animation -->
                                <div>
                                    <!-- Name -->
                                    <AutoComplete
                                        v-if="schema.role==='creator'"
                                        :label="$t('Name')"
                                        @change="onChangeItem(row, index)"
                                        v-model="row.supply"
                                        :force-selection="false"
                                        :options="supplies"
                                        :errors="errors && errors[`order_supplies.${index}.name`] ? [] : null"
                                        :placeholder="t('Select')" />

                                    <!-- Quantity -->
                                    <Input
                                        v-model="row.quantity"
                                        :errors="errors && errors[`order_supplies.${index}.quantity`] ? [] : null"
                                        :readonly="mode === 'readonly'"
                                        :inputClass="'text-right'"
                                        type="number"
                                        min="0"
                                        :label="$t('Quantity')"
                                        :placeholder="$t('Quantity')" />

                                    <!-- Sku -->
                                    <Input
                                        v-model="row.sku"
                                        :errors="errors && errors[`order_supplies.${index}.sku`] ? [] : null"
                                        :readonly="mode === 'readonly'"
                                        :label="$t('SKU')"
                                        :placeholder="$t('SKU')" />

                                    <!-- Location -->
                                    <Treeselect
                                        v-model="row.location_id"
                                        :errors="errors && errors[`order_supplies.${index}.location_id`] ? [] : null"
                                        :readonly="mode === 'readonly'"
                                        :options="warehouseLocations"
                                        :label="$t('Location')"
                                        :placeholder="$t('Select')" />
                                </div>

                                <div>
                                    <!-- Price -->
                                    <Input
                                        v-model="row.unit_price"
                                        :errors="errors && errors[`order_supplies.${index}.unit_price`] ? [] : null"
                                        :label="$t('Price')"
                                        :placeholder="$t('Price')"
                                        :inputClass="'text-right'"
                                        type="number"
                                        min="0"
                                        inline-label-left="$"
                                        class="md:!mt-8" />

                                    <!-- Unit of measure -->
                                    <div>
                                        <InputLabel
                                            @change="onChangeItem(row, index)"
                                            v-if="row.supply?.measure"
                                            v-model="row.supply.measure.name"
                                            :label="$t('Unit of measure')"
                                            mode="readonly"
                                            outline
                                            white-mode
                                            dense
                                            :has-border="false"
                                            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
                                            label-class="text-sm print-text-base-md !font-normal" />

                                        <Treeselect
                                            v-else
                                            @change="onChangeItem(row, index)"
                                            :input-id="`measure_select-${index}`"
                                            v-model="row.measure_id"
                                            :errors="errors && errors[`order_supplies.${index}.measure_id`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :options="measures"
                                            :label="$t('Unit of measure')"
                                            :placeholder="$t('Select')" />
                                    </div>

                                    <!-- Category -->
                                    <Treeselect
                                        v-model="row.category_id"
                                        :errors="errors && errors[`order_supplies.${index}.category_id`] ? [] : null"
                                        :options="suppliesCategories"
                                        :label="$t('Category')"
                                        :placeholder="$t('Select')" />

                                    <!-- Description -->
                                    <TextArea
                                        v-model="row.description"
                                        :errors="errors && errors[`order_supplies.${index}.description`] ? [] : null"
                                        :label="$t('Description')"
                                        :placeholder="$t('Description')" />
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- <template #total>
                        <td colspan="4"></td>
                        <td class="text-right py-4 px-4">
                            <Button
                                @click="add(index)"
                                size="sm"
                                rounded
                                color="success"
                                :icon="mdiPlus"/>
                        </td>
                    </template> -->
            </TableUI>

            <div class="flex flex-row-reverse px-9">
                <Button
                @click="add(index)"
                size="sm"
                rounded
                color="success"
                :icon="mdiPlus"/>
            </div>
        </section>

        <section v-if="schema.role ==='show'">
            <Title
                :title="$t(`Items`)"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="font-semibold" />

            <table class="table-without-borders w-full">
                <thead class="bg-gray-200 border-b border-t border-b-gray-300 border-t-gray-200">
                    <tr>
                        <!-- Name -->
                        <th class="font-semibold text-start pl-4 py-2">
                            {{ $t('Name') }}
                        </th>

                        <!-- Quantity -->
                        <th class="w-[10%] text-start">
                            {{ $t('Quantity') }}
                        </th>

                        <!-- Unit of measure -->
                        <th class="w-[13%] text-start">
                            {{ $t('Unit of measure') }}
                        </th>

                        <!-- Price -->
                        <th class="w-[10%] text-start">
                            {{ $t('Price') }}
                        </th>

                        <!-- Sku -->
                        <th class="w-[12%] text-start">
                            {{ $t('SKU') }}
                        </th>

                        <!-- Category -->
                        <th class="w-[15%] text-start">
                            {{ $t('Category') }}
                        </th>

                        <th class="w-[15%] text-start">
                            {{ $t('Location') }}
                        </th>

                        <th class="w-[8%] text-start">
                            {{ $t('Match Item') }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <template
                        v-for="(order, index) in data.supply"
                        :key="index">
                        <tr class="border-b border-gray-100 print-custom-leading">
                            <!-- Name -->
                            <td class="pl-4 print-custom-leading !py-2">
                                {{ order.name }}
                            </td>

                            <!-- Quantity -->
                            <td class="text-right pr-10 print-custom-leading">
                                {{ round(order.quantity) }}
                            </td>

                            <!-- Measure -->
                            <td class="print-custom-leading">
                                {{ getMeasureByID(order.measure_id)?.data?.name }}
                            </td>

                            <!-- Price -->
                            <td class="text-right pr-10">
                                ${{ round(order.unit_price) }}
                            </td>

                            <!-- SKU -->
                            <td class="print-custom-leading">
                                {{ order.sku }}
                            </td>

                            <!-- Category -->
                            <td class="print-custom-leading">
                                {{ getCategoryByID(order.category_id)?.data?.name }}
                            </td>

                            <!-- Location -->
                            <td class="print-custom-leading">
                                {{ getLocationByID(order.location_id)?.data?.name }}
                            </td>

                            <td class="print-custom-leading">
                                {{ 'Is a part' }}
                            </td>
                        </tr>

                        <!-- Description row -->
                        <tr>
                            <td
                                colspan="8"
                                class="pl-4">
                                <div class="flex gap-2">
                                    <p class="mt-0 font-semibold">
                                        {{ $t('Description:') }}
                                    </p>

                                    <p class="mt-0">
                                        {{ order.description || `${ $t('No description given') }` }}
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Divide row -->
                        <tr v-if="index !== data.supply.length - 1">
                            <td
                                colspan="8"
                                class="h-2 bg-red-200" />
                        </tr>
                    </template>
                </tbody>
            </table>
        </section>
    </section>
</template>
