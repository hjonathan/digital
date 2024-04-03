<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { Card, Overlay, ActionButtons, EntityInformation } from 'layout'
import { formatDate, round } from 'shared'
import ProductsGrid from './ProductsGrid.vue'
import BillingItem from './BillingItem.vue'
import { useInvoice } from './useInvoice'
import { mdiAccount, mdiMapMarkerAccount } from '@mdi/js'
import { api } from '@/config'
import { configButtonsInvoiceShow } from './configButtons'

const props = defineProps({
    invoice: {
        type: Object,
        default: null
    }
})

const router = inject('router')

const isInEdit = !!router.currentRoute.value.params?.id

const selectedClient = ref()
const shippingData = ref()
const itemsSelected = ref([])

const data = ref({
    client: null,
    products: [],
    shipping_cost: null,
    discount: null
})

const loadings = ref({
    saveButton: false,
    invoiceButton: false,
    printButton: false,
    syncItems: false
})

const { orderTotal, subtotal, tax } = useInvoice(itemsSelected, selectedClient, shippingData, data)

// Called to api to print pdf invoice
let printableArea = {}

let newInvoincePrinableArea = {}

const timeToWaitContent = 100

setTimeout(() => {
    printableArea = document.getElementById('printableArea')

    newInvoincePrinableArea = document.getElementById('newInvoincePrinableArea')
}, timeToWaitContent)

const downloadMessage = ref(null)

const timeToResetDownloadMessage = 3000

const print = async () => {
    loadings.value.printButton = true

    const data = { data: isInEdit ? printableArea.innerHTML : newInvoincePrinableArea.innerHTML }

    const response = await api.post('pdf/create', data)

    !response.success && (loadings.value.printButton = false)

    response.success && downloadPDF(response)
}

const buttons = configButtonsInvoiceShow({ loadings, print })

const downloadPDF = async (response) => {
    const linkSource = `data:application/pdf;base64,${response.data.content}`

    const downloadLink = document.createElement('a')

    const fileName = response.data.name

    downloadMessage.value = response.message

    setTimeout(() => {
        downloadMessage.value = null
    }, timeToResetDownloadMessage)

    downloadLink.href = linkSource

    downloadLink.download = fileName

    downloadLink.click()

    loadings.value.printButton = false
}

const existShipping = computed(() => {
    for (const prop in shippingData.value) {
        if (shippingData.value[prop]) {
            return true
        }
    }

    return false
})

// Load data from api
onMounted(() => {
    data.value = props.invoice

    selectedClient.value = props.invoice?.client

    itemsSelected.value = props.invoice.invoice_item.map(item => ({
        discount: item.discount || 0,
        id: item.item_id,
        price: item.price,
        quantity: item.quantity,
        lockType: '',
        valid: true
    }))

    shippingData.value = {
        name: props.invoice.shipping_name,
        address: props.invoice.shipping_address,
        address_2: props.invoice.shipping_address_2,
        zip_code: props.invoice.shipping_zip_code,
        state: props.invoice.shipping_state,
        city: props.invoice.shipping_city,
        phone: props.invoice.shipping_phone
    }
})
</script>

<template>
    <!-- Overlay for load data and sync -->
    <Overlay v-if="loadings.syncItems || loadings.printButton"/>

    <div class="max-w-8xl mx-auto justify-en">
        <div class="flex justify-start">
            <ActionButtons
                :items="buttons" />
        </div>

        <Card
            class="px-10 py-5"
            hasMargins
            :placeContentCenter="false"
            :id="isInEdit ? 'printableArea' : 'newInvoincePrinableArea'">

            <!-- Title and Company name -->
            <div class="flex justify-between">
                <div class="self-end">
                    <h1 class="!my-0 leading-6 text-gray-900 text-lg pb-1 font-semibold w-full">
                        {{ $t('Invoice') }} #

                        <span v-if="data.id">
                            {{ data.id }}
                        </span>
                    </h1>

                    <div class="leading-none -mb-[1px]">
                        {{ formatDate(data.updated_at, 'americanFormat') }}
                    </div>
                </div>

                <!-- Company logo -->
                <EntityInformation
                    informationClasses="custom-text-size"
                    title="Company Name"
                    :data="{
                        address:'300 N. Main street',
                        state:'Monroe, OH 45050',
                        phone:'513-506-1857'
                    }"
                    logo="https://tailwindui.com/img/logos/mark.svg?color=indigo&amp;shade=600" />
            </div>

            <hr class="my-4 border-[1px] border-gray-500">

            <!-- Main content -->
            <div class="mx-auto w-full">
                <!-- Actions (Bill to and Ship To) -->
                <div class="gap-8 flex w-full mt-4">
                    <!-- Bill to -->
                    <div class="w-full">
                        <h2 class="flex flex-row font-medium text-gray-900 mt-0 mr-4 whitespace-nowrap items-center">
                            {{ $t('Bill to:') }}
                        </h2>

                        <EntityInformation
                            :hasCard="false"
                            :icon="mdiAccount"
                            :name="selectedClient?.company_name"
                            :data="{
                                address:selectedClient?.address,
                                state:selectedClient?.state,
                                zipCode:selectedClient?.zip_code,
                                email:selectedClient?.email,
                                phone:selectedClient?.phone,
                            }">
                            <div v-if="!selectedClient">
                                <div class="font-semibold">
                                    {{ $t('No client selected yet') }}
                                </div>
                            </div>
                        </EntityInformation>
                    </div>

                    <!-- Ship to -->
                    <div class="w-full">
                        <h2 class="flex flex-row font-medium text-gray-900 mt-0 mr-4 whitespace-nowrap items-center">
                            {{ $t('Ship to:') }}
                        </h2>

                        <EntityInformation
                            v-if="existShipping"
                            :icon="mdiMapMarkerAccount"
                            :name="shippingData?.name"
                            :data="{
                                address:shippingData?.address,
                                zipCode:shippingData?.zip_code,
                                state:shippingData?.state,
                                city:shippingData?.city,
                                phone:shippingData?.phone,
                            }">
                        </EntityInformation>

                        <EntityInformation
                            v-if="!existShipping"
                            :hasCard="false"
                            :icon="mdiMapMarkerAccount"
                            :name="selectedClient?.company_name"
                            :data="{
                                address:selectedClient?.address,
                                state:selectedClient?.state,
                                zipCode:selectedClient?.zip_code,
                                email:selectedClient?.email,
                                phone:selectedClient?.phone,
                            }">
                            <div v-if="!selectedClient">
                                <div class="font-semibold">
                                    {{ $t('No client selected yet') }}
                                </div>
                            </div>
                        </EntityInformation>
                    </div>

                    <div class="w-full">
                        <!-- Empty space for layout -->
                    </div>
                </div>

                <!-- Orders -->
                <div class="space-y-5 mt-4">
                    <!-- Products -->
                    <h2 class="text-xl font-bold tracking-tight text-gray-600">
                        {{ $t('Items') }}
                    </h2>

                    <ProductsGrid
                        class="!w-full"
                        v-model:products="itemsSelected"
                        :in-create="false"
                        :errors="errors" />

                    <!-- Supplies (Under development) -->
                    <div class="cursor-not-allowed hover:bg-gray-50 notPrintableArea">
                        <h2 class="text-xl font-bold tracking-tight text-gray-600 air-2xl">
                            {{ $t('Supplies') }}
                        </h2>

                        <div class="text-center py-4 font-bold tracking-tight text-gray-600">
                            {{ $t('Under Development') }}
                        </div>
                    </div>

                    <hr class="my-8 notPrintableArea">
                </div>

                <!-- Billing -->
                <div class="flex justify-between">
                    <div class="flex-1 hidden md:block">
                        <!-- Empty space for layout -->
                    </div>

                    <div class="flex-1 justForPrintView">
                        <!-- Empty space for layout -->
                    </div>

                    <div class="flex-1">
                        <dl class="divide-y divide-gray-200 text-sm md:col-span-12 md:mt-0 md:pl-10">
                            <!-- Subtotal -->
                            <BillingItem
                                :title="$t('Subtotal')"
                                :value="`$${round(subtotal)}`" />

                            <!-- Discount -->
                            <BillingItem :title="$t('Discount')">
                                <template #value>
                                    <!-- For print view -->
                                    <span class="block !my-0 -ml-2">
                                        {{ data.discount ? `${data.discount}%` : '0%' }}
                                    </span>
                                </template>
                            </BillingItem>

                            <!-- Tax -->
                            <BillingItem
                                :title="$t('Tax')"
                                :value="`$${round(tax)}`" />

                            <!-- Shipping -->
                            <BillingItem :title="$t('Shipping')">
                                <template #value>
                                    <!-- For print view -->
                                    <span class="block !my-0 -ml-2">
                                        {{ data.shipping_cost ? `$${data.shipping_cost}` : '$0' }}
                                    </span>
                                </template>
                            </BillingItem>

                            <!-- Order total -->
                            <BillingItem
                                :title="$t('Order total')"
                                valueBold
                                :value="`$${round(orderTotal)}`" />
                        </dl>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<style>
.justForPrintView {
    display: none;
}
</style>
