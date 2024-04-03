<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue'
import { Title, Button, Slider } from 'layout'
import { InputLabel, Treeselect, Input, TextArea } from 'form'

import { api } from '@/config'

import {
    mdiChevronDown,
    mdiTrashCanOutline,
    mdiPlus
} from '@mdi/js'

import { gsap } from 'gsap'
import { showUuid } from 'shared'

const props = defineProps({
    useSalesOrder: Object,
    useAdditionalCosts: Object,
    modelValue: Object,
    salesOrderNumber: String,
    errors: Object,
    mode: String,
    data: Object
})

const { data, uniqueItem } = props.useSalesOrder
const { setAdditionalCostsSchema } = props.useAdditionalCosts

const useGlobalStore = inject('useGlobalStore')

const tabStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')
const parametersStore = useGlobalStore('parameters')

const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

const getMeasureByID = (id) => {
    return measures.value.filter(measure => measure.id === Number(id))[0]
}

const getCategoryByID = (id) => {
    return suppliesCategories.value.filter(category => category.id === Number(id))[0]
}

// Retrieves all supplies categories
const suppliesCategories = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('categories').filter(category => {
        return category.data.slug === 'supplies'
    })[0].children
})

const thread = ref({
    idThread: 'PurchaseOrdersList',
    action: 'Sales Order'
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

    setAdditionalCostsSchema({ ...selectedPurchaseOrder.value, id: data.value.id })

    setTimeout(() => {
        showContent.value = true
    }, timeToWaitFinishRendering)
}

const isSalesOrderLoading = ref(false)

const getPurchaseOrder = async (id) => {
    isSalesOrderLoading.value = true

    const response = await api.get(`supplies/sales_order_show/${id}`)

    isSalesOrderLoading.value = false

    purchaseOrder.value = formatData(response.data)
}

const formatData = (object) => {
    return {
        ...object,
        proccesed_id: showUuid(object.id),
        supply: object.supply?.map((supply) => {
            return {
                ...supply
            }
        })
    }
}

const removeItem = (index) => {
    purchaseOrder.value.supply.splice(index, 1)
}

rapidStore.$registerGlobalEvent(`selectedRows:${thread.value.idThread}`, addPurchaseOrder)

const onClick = () => tabStore.openTab({ name: 'PurchaseOrdersList', query: { ...thread.value } })

const openRowExpansion = (order, index) => {
    if (!order.isOpen) {
        purchaseOrder.value.supply.forEach((order, indexItem) => {
            indexItem !== index && (order.isOpen = false)
        })

        order.isOpen = !order.isOpen

        gsap.fromTo(`#item-form-${index}`,
            {
                height: 0,
                opacity: 0
            },
            {
                height: 'auto',
                opacity: 1,
                duration: 0.3
            })

        return
    }

    gsap.fromTo(`#item-form-${index}`,
        {
            height: 300,
            opacity: 1
        },
        {
            height: 0,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                purchaseOrder.value.supply.forEach((e, indexItem) => {
                    indexItem !== index && (e.isOpen = false)
                })

                order.isOpen = !order.isOpen
            }
        })
}

const saveNewItem = () => {
    purchaseOrder.value.supply.forEach((e, indexItem) => {
        e.isOpen = false
    })

    purchaseOrder.value.supply.push({

    })

    setTimeout(() => {
        gsap.fromTo(`#item-form-${purchaseOrder.value.supply.length - 1}`,
            {
                height: 0,
                opacity: 0
            },
            {
                height: 'auto',
                opacity: 1,
                duration: 0.3,
                onComplete: () => {
                    openRowExpansion(purchaseOrder.value.supply[purchaseOrder.value.supply.length - 1], purchaseOrder.value.supply.length - 1)
                }
            }
        )
    }, 10)
}

const hasRowErrors = (id) => {
    for (const key in props.errors) {
        if (key.includes(`.${id}.`)) {
            return true
        }
    }

    return false
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

onMounted(() => {
    if (Object.keys(props.data.order_supplies).length) {
        purchaseOrder.value = formatData(data.value.order_supplies)

        showContent.value = true
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
        openRowExpansion(purchaseOrder.value.supply[purchaseOrder.value.supply.length - 1], purchaseOrder.value.supply.length - 1)
    }
})
</script>

<template>
    <!-- Actions section -->
<!--     <div
        v-if="mode === 'edit'"
        class="flex flex-row space-x-5">
            <Title
                :title="$t('Select purchase order')"
                title-type="h3"
                :has-border-bottom-line="false" />

            <Button
                v-if="Object.keys(purchaseOrder).length === 0 && !uniqueItem"
                @click="onClick"
                :label="$t('Select Purchase Order')"
                color="primary"
                class="mt-1" />

            <button
                v-if="Object.keys(purchaseOrder).length > 0 && !uniqueItem"
                @click="onClick"
                class="link primary mt-1">
                {{ $t('Change purchase order') }}
            </button>

            <Overlay
                v-if="isSalesOrderLoading"
                class="z-50 w-14 top-10" />
    </div> -->

    <!-- Purchase Order information, Grid and table section -->
    <Slider
        :isOpen="showContent">
        <div class="space-y-6">
            <!-- Purchase order information (vendor name & purchase order) -->
            <div class="row cols-2">
                <div
                    v-if="Object.keys(purchaseOrder).length > 0"
                    class="gutter-xs">
                    <!-- Vendor name -->
                    <InputLabel
                        v-if="purchaseOrder.vendor"
                        v-model="purchaseOrder.vendor.name"
                        :label="$t('Vendor name')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Purchase order -->
                    <InputLabel
                        v-model="purchaseOrder.proccesed_id"
                        :label="$t('Purchase order')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="data.document_number"
                        :label="$t('Sales order information')"
                        :mode="mode"
                        :error="errors?.document_number"
                        outline
                        dense />
                </div>
            </div>

            <!-- Grid (for edit mode) -->
            <div
                v-if="mode === 'edit'"
                class="overflow-auto">
                <table
                    class="w-full table">
                    <thead>
                        <tr>
                            <th class="w-4/12 pl-4 text-start">
                                {{ $t('Name') }}
                            </th>

                            <th class="w-2/12 text-start">
                                {{ $t('Quantity') }}
                            </th>

                            <th class="w-3/12 text-start">
                                {{ $t('Unit of measure') }}
                            </th>

                            <th class="w-1/12 text-start">
                                {{ $t('Price') }}
                            </th>

                            <!-- Actions -->
                            <th
                                v-if="mode === 'edit'"
                                class="w-2/12 notPrintableArea" />
                        </tr>
                    </thead>

                    <tbody
                        v-for="(order, index) in purchaseOrder.supply"
                        :key="index">
                        <!-- First row -->
                        <tr
                            :class="[`${ order.isOpen ? 'bg-gray-200' : 'bg-white' } ${ hasRowErrors(index) ? '!bg-red-100' : '' }`]"
                            class="text-sm transition duration-300 print-custom-leading">
                            <td class="pl-5 font-medium">
                                {{ order.name }}
                            </td>

                            <!-- Quantity -->
                            <td class="!pr-24 text-right">
                                {{ order.quantity }}
                            </td>

                            <!-- Measure -->
                            <td class="">
                                {{ getMeasureByID(order.measure_id)?.data.name }}
                            </td>

                            <!-- Price -->
                            <td
                                class="text-right">
                                <span :class="{ '!pr-8' : mode === 'readonly' }">
                                    ${{ order.unit_price }}
                                </span>
                            </td>

                            <td
                                v-if="mode === 'edit'"
                                class="notPrintableArea">
                                <div class="flex items-center h-full justify-end !pr-3">
                                    <Button
                                        :icon="mdiChevronDown"
                                        color="secondary"
                                        flat
                                        size="lg"
                                        rounded
                                        iconClass="hover:text-primary-500"
                                        @click="openRowExpansion(order, index)"
                                        :class="[ order.isOpen ? 'rotate-180' : '' ]"
                                        class="!px-2" />

                                    <Button
                                        :disabled="uniqueItem"
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

                        <!-- Second row (for forms) -->
                        <tr
                            v-show="order.isOpen"
                            class="overflow-hidden">
                            <td
                                colspan="12"
                                class="!mx-0 !pb-5 !pt-0 !my-0 border-t-2">
                                <div
                                    :id="`item-form-${index}`"
                                    class="overflow-hidden">
                                    <!-- This DIV and Padding is necessary because of the opening and closing animation -->
                                    <div class="p-8 grid grid-cols-2 gap-x-8">
                                        <!-- Name -->
                                        <Input
                                            v-model="order.name"
                                            :errors="errors && errors[`order_supplies.${index}.name`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :label="$t('Name')"
                                            :placeholder="$t('Name')" />

                                        <!-- Price -->
                                        <Input
                                            v-model="order.unit_price"
                                            :errors="errors && errors[`order_supplies.${index}.unit_price`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :label="$t('Price')"
                                            :placeholder="$t('Price')"
                                            :inputClass="'text-right'"
                                            type="number"
                                            min="0"
                                            inline-label-left="$" />

                                        <!-- Quantity -->
                                        <Input
                                            v-model="order.quantity"
                                            :errors="errors && errors[`order_supplies.${index}.quantity`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :inputClass="'text-right'"
                                            type="number"
                                            min="0"
                                            :label="$t('Quantity')"
                                            :placeholder="$t('Quantity')" />

                                        <!-- Unit of measure -->
                                        <Treeselect
                                            v-model="order.measure_id"
                                            :errors="errors && errors[`order_supplies.${index}.measure_id`] ? [] : null"
                                            :readonly="mode === 'readonly' || uniqueItem"
                                            :options="measures"
                                            :label="$t('Unit of measure')"
                                            :placeholder="$t('Select')" />

                                        <!-- Sku -->
                                        <Input
                                            v-model="order.sku"
                                            :errors="errors && errors[`order_supplies.${index}.sku`] ? [] : null"
                                            :readonly="mode === 'readonly'"
                                            :label="$t('SKU')"
                                            :placeholder="$t('SKU')" />

                                        <!-- Category -->
                                        <Treeselect
                                            v-model="order.category_id"
                                            :errors="errors && errors[`order_supplies.${index}.category_id`] ? [] : null"
                                            :readonly="mode === 'readonly'"
                                            :options="suppliesCategories"
                                            :label="$t('Category')"
                                            :placeholder="$t('Select')"
                                            :clearable="false" />

                                        <!-- Description -->
                                        <TextArea
                                            v-model="order.description"
                                            :errors="errors && errors[`order_supplies.${index}.description`] ? [] : null"
                                            :readonly="mode === 'readonly'"
                                            :label="$t('Description')"
                                            :placeholder="$t('Description')" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Add new item button -->
            <div
                v-if="mode === 'edit' && !uniqueItem"
                class="flex justify-end pr-3 !my-3">
                <Button
                    rounded
                    color="success"
                    :icon="mdiPlus"
                    @click="saveNewItem" />
            </div>
        </div>
    </Slider>

    <Title
        v-if="mode === 'readonly'"
        :title="$t('Purchase orders')"
        :hasBorderBottomLine="false"
        titleType="h2"
        class="font-semibold !pt-0 mb-0 mt-12 print-reset-mt" />

    <!-- Table for show and print view -->
    <table v-if="mode === 'readonly'"
        class="table-without-borders w-full">
        <thead class="bg-gray-200 border-b border-t border-b-gray-300 border-t-gray-200">
            <tr>
                <!-- Name -->
                <th class="font-semibold text-start pl-4 py-2">
                    {{ $t('Name') }}
                </th>

                <!-- Quantity -->
                <th class="w-[12%] text-start">
                    {{ $t('Quantity') }}
                </th>

                <!-- Unit of measure -->
                <th class="w-[15%] text-start">
                    {{ $t('Unit of measure') }}
                </th>

                <!-- Price -->
                <th class="w-[12%] text-start">
                    {{ $t('Price') }}
                </th>

                <!-- Sku -->
                <th class="w-[12%] text-start">
                    {{ $t('SKU') }}
                </th>

                <!-- Category -->
                <th class="w-[22%] text-start">
                    {{ $t('Category') }}
                </th>
            </tr>
        </thead>

        <tbody>
            <template
                v-for="(order, index) in purchaseOrder.supply"
                :key="index">
                <tr class="border-b border-gray-100 print-custom-leading">
                    <!-- Name -->
                    <td class="pl-4 print-custom-leading !py-2">
                        {{ order.name }}
                    </td>

                    <!-- Quantity -->
                    <td class="text-right pr-10 print-custom-leading">
                        {{ order.quantity }}
                    </td>

                    <!-- Measure -->
                    <td class="print-custom-leading">
                        {{ getMeasureByID(order.measure_id)?.data?.name }}
                    </td>

                    <!-- Price -->
                    <td class="text-right pr-10">
                        ${{ order.unit_price }}
                    </td>

                    <!-- SKU -->
                    <td class="print-custom-leading">
                        {{ order.sku }}
                    </td>

                    <!-- Category -->
                    <td class="print-custom-leading">
                        {{ getCategoryByID(order.category_id)?.data?.name }}
                    </td>
                </tr>

                <!-- Description row -->
                <tr>
                    <td
                        class="pl-4"
                        colspan="6">
                        <div class="flex gap-2 text-md">
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
                        colspan="6"
                        class="h-2 bg-gray-200" />
                </tr>
            </template>
        </tbody>
    </table>
</template>
