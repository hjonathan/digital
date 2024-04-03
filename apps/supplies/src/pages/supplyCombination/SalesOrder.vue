<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue'
import { Button, Slider, TableUI, Title, Icon } from 'layout'
import { InputLabel, Treeselect, Input, TextArea, ToggleSwitch } from 'form'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import {
    mdiPuzzlePlus,
    mdiChevronDown,
    mdiTrashCanOutline,
    mdiPlus
} from '@mdi/js'

import { showUuid, round } from 'shared'

const { t } = useI18n()

const props = defineProps({
    useWarehouse: Object,
    modelValue: Object,
    salesOrderNumber: String,
    errors: Object,
    mode: String,
    data: Object
})

const { data, lockShippingCost, uniqueItem } = props.useWarehouse

const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')
const parametersStore = useGlobalStore('parameters')

const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

const getMeasureByID = (id) => {
    return measures.value.filter(measure => measure.id === Number(id))[0]
}

// Retrieves all supplies categories
const suppliesCategories = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('categories').filter(category => {
        return category.data.slug === 'supplies'
    })[0].children
})

const warehouseLocations = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('locations').filter(location => {
        return location.data.slug === 'warehouse-area'
    })[0]?.children
})

const emit = defineEmits(['update:modelValue', 'update:salesOrderNumber', 'resetErrors'])

const salesOrderNumberModel = computed({
    get: () => props.salesOrderNumber,
    set: newValue => emit('update:salesOrderNumber', newValue)
})

const modelData = computed({
    get: () => props.modelValue,
    set: newValue => emit('update:modelValue', newValue)
})

const selectedPurchaseOrder = ref({})
const purchaseOrder = ref([])

const showContent = ref(false)

const addPurchaseOrder = async (data) => {
    selectedPurchaseOrder.value = data.value[0]

    if (selectedPurchaseOrder.value) {
        await getPurchaseOrder(selectedPurchaseOrder.value.id)
    }

    const timeToWaitFinishRendering = 200

    emit('resetErrors')

    addAdditionalCosts()

    setTimeout(() => {
        showContent.value = true
    }, timeToWaitFinishRendering)
}

const isSalesOrderLoading = ref(false)

const getPurchaseOrder = async (id) => {
    isSalesOrderLoading.value = true

    const response = await api.get(`supplies/invoice_show/${id}`)

    isSalesOrderLoading.value = false

    purchaseOrder.value = formatData(response.data)

    if (purchaseOrder.value?.document_number) {
        purchaseOrder.value.invoiceNumber = purchaseOrder.value?.document_number

        isInvoiceInformationEditable.value = 'readonly'
    }
}

const formatData = (object) => {
    return {
        ...object,
        proccesed_id: showUuid(object.id),
        supply: object.supply?.map((supply) => {
            return {
                ...supply,
                quantity: round(supply.quantity - (supply.quantity_received || 0)),
                quantity_original: round(supply.quantity - (supply.quantity_received || 0))
            }
        })
    }
}

const removeItem = (index) => {
    purchaseOrder.value.supply.splice(index, 1)

    emit('resetErrors')
}

const thread = ref({
    idThread: 'InvoiceList',
    action: 'Invoice'
})

rapidStore.$registerGlobalEvent(`selectedRows:${thread.value.idThread}`, addPurchaseOrder)

// Assign additional costs from invoice selected from url or button
const addAdditionalCosts = () => {
    lockShippingCost.value = false

    data.value.shipping_cost = 0

    data.value.taxes = 0

    data.value.handling = 0

    data.value.estimated_shipping = 0

    if ([modelData.value.shipping_cost, modelData.value.taxe, modelData.value.handling, modelData.value.estimated_shipping].find(e => !!e)) {
        lockShippingCost.value = true

        data.value.shipping_cost = modelData.value.shipping_cost

        data.value.taxes = modelData.value.taxes

        data.value.handling = modelData.value.handling

        data.value.estimated_shipping = modelData.value.estimated_shipping
    }
}

watch(
    () => purchaseOrder.value,
    () => {
        modelData.value = purchaseOrder.value
    },
    {
        deep: true
    }
)

const isInvoiceInformationEditable = ref(props.mode)

const openPartial = (rowIndex) => {
    for (let index = 0; index < purchaseOrder.value.supply.length; index++) {
        purchaseOrder.value.supply[index].isOpen = rowIndex === index
    }
}

onMounted(() => {
    if (Object.keys(props.data.order_supplies).length) {
        purchaseOrder.value = formatData(data.value.order_supplies)

        // Remove items with zero quantity, only in edit view.
        if (props.mode === 'edit') {
            purchaseOrder.value.supply = purchaseOrder.value.supply.filter(element => element.quantity !== 0)
        }

        showContent.value = true
    }

    if (props.data?.document_number) {
        purchaseOrder.value.invoiceNumber = props.data?.document_number
    }

    if (purchaseOrder.value?.document_number) {
        purchaseOrder.value.invoiceNumber = purchaseOrder.value?.document_number

        isInvoiceInformationEditable.value = 'readonly'
    }

    if (props.mode === 'readonly') {
        showContent.value = true

        purchaseOrder.value = props.data

        purchaseOrder.value.proccesed_id = showUuid(purchaseOrder.value.id)

        // Open all rows in show mode
        purchaseOrder.value.supply.forEach((order, indexItem) => {
            order.isOpen = true
        })
    }

    if (purchaseOrder.value?.supply?.length === 1 && uniqueItem.value) {
        purchaseOrder.value.supply[purchaseOrder.value.supply.length - 1].isOpen = true
    }

    for (const item of purchaseOrder.value.supply) {
        if (item.received_parts_json) item.received_parts_json = JSON.parse(item.received_parts_json)

        if (!item.received_parts_json) item.received_parts_json = []
    }

    addAdditionalCosts()
})

const getCategoryByID = (id) => {
    return suppliesCategories.value.filter(category => category.id === Number(id))[0]
}

const getLocationByID = (id) => {
    return warehouseLocations.value.filter(location => location.id === Number(id))[0]
}

const getColumns = computed(() => {
    const columns = [
        // { field: 'request_user.name', name: '', align: 'left', customClass: '!w-1/12' },
        { field: 'request_user.name', name: 'Name', align: 'left', customClass: '!w-4/12' },
        { field: 'approval_name', name: 'Quantity', align: 'left', customClass: '!w-1/12' },
        { field: 'final_approval_name', name: 'Unit of measure', align: 'left', customClass: '!w-3/12' },
        { field: 'supply_order_status.name', name: 'Price', align: 'left', customClass: '!w-1/12' },
        { field: 'supply_order_status.name', name: '', align: 'left', customClass: '!w-1/12' },
    ]

    return columns
})

const getColumnsPartial = computed(() => {
    const columns = [
        { field: 'final_approval_name', name: '', align: 'left', customClass: '!w-1/12' },
        { field: 'id', name: 'Name', align: 'left', customClass: '!w-1/12' },
        { field: 'request_user.name', name: 'Description', align: 'left', customClass: '!w-3/12' },
        { field: 'approval_name', name: 'Quantity', align: 'left', customClass: '!w-1/12' },
        { field: 'final_approval_name', name: 'Location', align: 'left', customClass: '!w-4/12' },
        { field: 'final_approval_name', name: '', align: 'left', customClass: '!w-1/12' },
    ]

    return columns
})

const addPartialItem = (index) => {
    purchaseOrder.value?.supply[index]?.received_parts_json?.push({})
}

const removeItemPartial = (index, indexPartial) => {
    purchaseOrder.value.supply[index].received_parts_json.splice(indexPartial, 1)
}

const openPartReception = (nValue, index, toggleExpansion) => {
    if (nValue && !purchaseOrder.value.supply[index].isOpen) toggleExpansion(index)

    purchaseOrder.value.supply[index].receptionInPart = !purchaseOrder.value.supply[index].receptionInPart

    if (!purchaseOrder.value?.supply[index]?.received_parts_json.length) purchaseOrder.value?.supply[index]?.received_parts_json?.push({})
}

const verifyErrorRow = (row, index) => {
    if (props.errors) {
        const response = Object.keys(props.errors).find(e => e.includes(`order_supplies.${index}`))

        return !!response
    }

    return false
}
</script>

<template>
    <Slider :isOpen="showContent">
        <div>
            <!-- Sales order number -->
            <div
                v-if="Object.keys(purchaseOrder).length > 0"
                class="w-1/2 space-y-1 mb-10">
                <!-- Sales order order -->
                <InputLabel
                    v-model="purchaseOrder.proccesed_id"
                    :label="$t('Invoice')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Vendor name -->
                <InputLabel
                    v-model="purchaseOrder.vendor.name"
                    :label="$t('Vendor name')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Invoice information number -->
                <InputLabel
                    v-if="Object.keys(purchaseOrder).length > 0"
                    v-model="purchaseOrder.invoiceNumber"
                    :label="$t('Invoice information')"
                    :mode="isInvoiceInformationEditable"
                    :error="errors?.invoice_number"
                    outline
                    dense />
            </div>

            <!-- Grid (for edit mode) -->
            <div
                v-if="mode === 'edit'"
                class="overflow-auto">
                <TableUI
                    :columns="getColumns"
                    :multipleOpen="false"
                    :data="purchaseOrder.supply">
                    <template v-slot:row="{ row, index, toggleExpansion }">
                        <tr :class="{ 'border-b border-gray-100 custom-leading': true, 'bg-gray-200': row.isOpen, 'bg-red-100':verifyErrorRow(row, index) }">
                            <!-- Name -->
                            <!-- <td class="pl-4 custom-leading !py-2">
                                <ToggleSwitch
                                    v-model="purchaseOrder.supply[index].receptionInParts"
                                    @update:model-value="(value) => openPartReception(value, index, toggleExpansion)"
                                    container-class="none" />
                            </td> -->

                            <!-- Name -->
                            <td class="pl-4 custom-leading !py-2">
                                {{ row.name }}
                            </td>

                            <!-- Quantity -->
                            <td class="text-right pr-10 custom-leading">
                                {{ round(row.quantity) }}
                            </td>

                            <!-- Measure -->
                            <td class="custom-leading">
                                {{ getMeasureByID(row.measure_id)?.data?.name }}
                            </td>

                            <!-- Price -->
                            <td class="text-right pr-10">
                                ${{ round(row.unit_price) }}
                            </td>

                            <td
                                v-if="mode === 'edit'">
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
                                        :disabled="purchaseOrder.supply.length === 1"
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
                        <div class="border p-2">
                            <div
                                v-if="!row.receptionInParts"
                                class="row">
                                <div
                                    :id="`item-form-${index}`"
                                    class="row cols-2 p-5">
                                    <!-- This DIV and Padding is necessary because of the opening and closing animation -->
                                    <div>
                                        <!-- Name -->
                                        <Input
                                            v-model="row.name"
                                            :errors="errors && errors[`order_supplies.${index}.name`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :label="$t('Name')"
                                            :placeholder="$t('Name')"
                                            class="!mt-8" />

                                        <!-- Quantity -->
                                        <Input
                                            v-model="row.quantity"
                                            :errors="errors && errors[`order_supplies.${index}.quantity`] ? [] : null"
                                            :readonly="mode === 'readonly'"
                                            :inputClass="'text-right'"
                                            type="number"
                                            min="0"
                                            :label="$t('Quantity')"
                                            :placeholder="$t('Quantity')">
                                            <template #extra>
                                                {{ t('Remaining qty:') }} {{ row.quantity_original }}
                                            </template>
                                        </Input>

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
                                            placeholder="Select" />
                                    </div>

                                    <div>
                                        <!-- Price -->
                                        <Input
                                            v-model="row.unit_price"
                                            :errors="errors && errors[`order_supplies.${index}.unit_price`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :label="$t('Price')"
                                            :placeholder="$t('Price')"
                                            :inputClass="'text-right'"
                                            type="number"
                                            min="0"
                                            inline-label-left="$"
                                            class="md:!mt-8" />

                                        <!-- Unit of measure -->
                                        <Treeselect
                                            input-id="measure_select"
                                            v-model="row.measure_id"
                                            :errors="errors && errors[`order_supplies.${index}.measure_id`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :options="measures"
                                            :label="$t('Unit of measure')"
                                            placeholder="Select" />

                                        <!-- Category -->
                                        <Treeselect
                                            v-model="row.category_id"
                                            :errors="errors && errors[`order_supplies.${index}.category_id`] ? [] : null"
                                            :readonly="mode === 'readonly'"
                                            :options="suppliesCategories"
                                            :label="$t('Category')"
                                            placeholder="Select" />

                                        <!-- Description -->
                                        <TextArea
                                            v-model="row.description"
                                            :errors="errors && errors[`order_supplies.${index}.description`] ? [] : null"
                                            :readonly="mode === 'readonly'"
                                            :label="$t('Description')"
                                            :placeholder="$t('Description')" />
                                    </div>
                                </div>
                            </div>

                            <div
                                v-if="row.receptionInParts"
                                class="row">
                                <Title
                                    :title="`${$t('Receive ')} ${row.name} ${$t('as parts')}`"
                                    title-type="h2"
                                    :has-border-bottom-line="false">
                                    <template v-slot:rightTitle>
                                        <Button
                                            :icon="mdiPlus"
                                            rounded
                                            color="success"
                                            @click="addPartialItem(index)" />
                                    </template>
                                </Title>

                                <TableUI
                                    :columns="getColumnsPartial"
                                    :data="row.received_parts_json">
                                    <template v-slot:row="{ row, index: indexPartial, toggleExpansion }">
                                        <td class="!w-1/12 px-5">
                                            <Icon
                                                :icon="mdiPuzzlePlus" />
                                        </td>

                                        <td class="!w-3/12 px-5">
                                            <!-- Name -->
                                            <Input
                                                v-model="row.name"
                                                :errors="errors && errors[`order_supplies.${indexPartial}.name`] ? [] : null"
                                                :placeholder="$t('Name')"
                                                container-class="none" />
                                        </td>

                                        <td class="!w-3/12 px-5">
                                            <!-- Description -->
                                            <Input
                                                v-model="row.description"
                                                :errors="errors && errors[`order_supplies.${indexPartial}.description`] ? [] : null"
                                                :readonly="mode === 'readonly'"
                                                :placeholder="$t('Description')"
                                                container-class="none" />
                                        </td>

                                        <td class="!w-2/12 px-5">
                                            <!-- Quantity -->
                                            <Input
                                                v-model="row.quantity"
                                                :errors="errors && errors[`order_supplies.${indexPartial}.quantity`] ? [] : null"
                                                :readonly="mode === 'readonly'"
                                                :inputClass="'text-right'"
                                                type="number"
                                                min="0"
                                                :placeholder="$t('Quantity')"
                                                container-class="none" />
                                        </td>

                                        <td class="!w-4/12 px-5">
                                            <!-- Location -->
                                            <Treeselect
                                                v-model="row.location_id"
                                                :errors="errors && errors[`order_supplies.${indexPartial}.location_id`] ? [] : null"
                                                :readonly="mode === 'readonly'"
                                                :options="warehouseLocations"
                                                placeholder="Select"
                                                container-class="none" />
                                        </td>

                                        <td>
                                            <Button
                                                :disabled="purchaseOrder.supply.length === 1"
                                                :icon="mdiTrashCanOutline"
                                                size="lg"
                                                flat
                                                rounded
                                                color="secondary"
                                                iconClass="hover:text-red-500"
                                                @click="removeItemPartial(index, indexPartial)" />
                                        </td>
                                    </template>
                                </TableUI>
                            </div>
                        </div>
                    </template>
                </TableUI>
            </div>
        </div>
    </Slider>

    <!-- Table for show and print view -->
    <div
        v-if="mode === 'readonly'">
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
                </tr>
            </thead>

            <tbody>
                <template
                    v-for="(order, index) in purchaseOrder.supply?.filter(item => !item.received_parts_json.length)"
                    :key="index">
                    <tr class="border-b border-gray-100 custom-leading">
                        <!-- Name -->
                        <td class="pl-4 custom-leading !py-2">
                            {{ order.name }}
                        </td>

                        <!-- Quantity -->
                        <td class="text-right pr-10 custom-leading">
                            {{ round(order.quantity) }}
                        </td>

                        <!-- Measure -->
                        <td class="custom-leading">
                            {{ getMeasureByID(order.measure_id)?.data?.name }}
                        </td>

                        <!-- Price -->
                        <td class="text-right pr-10">
                            ${{ round(order.unit_price) }}
                        </td>

                        <!-- SKU -->
                        <td class="custom-leading">
                            {{ order.sku }}
                        </td>

                        <!-- Category -->
                        <td class="custom-leading">
                            {{ getCategoryByID(order.category_id)?.data?.name }}
                        </td>

                        <!-- Location -->
                        <td class="custom-leading">
                            {{ getLocationByID(order.location_id)?.data?.name }}
                        </td>
                    </tr>

                    <!-- Description row -->
                    <tr>
                        <td
                            colspan="7"
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
                    <tr v-if="index !== purchaseOrder.supply.length - 1">
                        <td
                            colspan="7"
                            class="h-2 bg-gray-200" />
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<style>
.hideInView {
    display: none
}
</style>
