<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { round } from 'shared'
import { Input } from 'form'
import ProductsGrid from './ProductsGrid.vue'
import BillingItem from './BillingItem.vue'
import Shipping from './Shipping.vue'
import { useInvoice } from './useInvoice'
import { mdiAccount, mdiMapMarkerAccount } from '@mdi/js'
import { api } from '@/config'
import { configButtonsInvoice } from './configButtons'
import { useI18n } from 'vue-i18n'

import {
    Card,
    Slideover,
    Alert,
    ConfirmationModal,
    Overlay,
    ActionButtons,
    EntityInformation,
    CardHeader
} from 'layout'

const { t } = useI18n()

const props = defineProps({
    invoice: {
        type: Object,
        default: null
    },
    mode: {
        type: String,
        default: 'show'
    }
})

const useGlobalStore = inject('useGlobalStore')
const invoicingStore = useGlobalStore('invoicing')
const inventoryStore = useGlobalStore('inventory')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const router = inject('router')

const thread = ref({
    idThread: router.currentRoute.value.params?.id ? 'edit-invoice' : 'create-invoice',
    action: 'invoice'
})

const localItemSelected = ref([])
const itemsSelected = rapidStore.reactiveProperty(`${thread.value.idThread}-selected-items`, [], true)
const showConfirmDeleteModal = ref(false)
const isInEdit = !!router.currentRoute.value.params?.id
const errors = ref()

const loadingInventory = rapidStore.reactiveProperty(`${thread.value.idThread}-inventory-overlay`, true, true)

// Invoice saving types
const saveWithSync = { type: 'auto-save', sync: true }
const savewithoutSync = { type: 'auto-save', sync: false }
const saveForInvoiced = { type: 'build', sync: true }

// RapidStore variable to save client selection
const selectedClient = ref()

const shippingData = ref()
const shippingRef = ref()

// Config slideover for shipping
const configSlideOver = ref({
    title: shippingData.value?.name || t('Shipping'),
    showAlert: false,
    open: false,
    close: false
})

// Config for button list
const loadings = ref({
    saveButton: false,
    invoiceButton: false,
    printButton: false,
    syncItems: false
})

const data = ref({
    client: null,
    products: [],
    shipping_cost: null,
    discount: null
})

// Time for autosave when changing item list
const saveTime = 750

const configSaving = ref({
    saved: false,
    saving: false,
    error: false
})

// Autosave when changing item list
const timeOutAutoSave = ref()

const autoSave = () => {
    timeOutAutoSave.value && clearTimeout(timeOutAutoSave.value)

    timeOutAutoSave.value = setTimeout(async () => {
        await saveInvoice(savewithoutSync)
    }, saveTime)
}

// Sync selected items with new selected and restrictions
const syncItemsInformation = async (autoSave = true) => {
    loadings.value.syncItems = true

    errors.value = null

    const ids = itemsSelected.value.map(item => item.id)

    if (!ids.length) {
        loadings.value.syncItems = false

        saveInvoice(saveWithSync)

        return
    }

    const response = await inventoryStore.getInventoryItems(ids)

    if (response.success) {
        itemsSelected.value = response.data.map(item => {
            const existsItem = localItemSelected.value?.find(oldItem => oldItem.id === item.id)

            return {
                id: existsItem?.id || item.id,
                price: existsItem ? existsItem.price : item.price,
                discount: existsItem ? existsItem?.discount : item.discount || 0,
                quantity: item.quantity,
                lockType: item.item_lock_type?.slug,
                lockTypeName: item.item_lock_type?.slug !== 'unlock' ? lockReason[item.item_lock_type?.slug]?.formatter(item) : '',
                valid: true
            }
        })

        const IsValidSelectedItems = validateSelectedItems()

        if (IsValidSelectedItems && props.mode === 'edit' && validateSaveInvoice.value && autoSave) {
            saveInvoice(saveWithSync)
        }
    }

    loadings.value.syncItems = false
}

const syncClientSelected = (newClient) => {
    selectedClient.value = newClient

    if (props.mode === 'edit' && validateSaveInvoice.value) saveInvoice(saveWithSync)
}

// Register events to sync data from other tab
rapidStore.$registerGlobalEvent(`selectedItems:${thread.value.action}`, syncItemsInformation)

rapidStore.$registerGlobalEvent('selectedClientInvoiceSync', syncClientSelected)

// Computed properties for invoice operations
const {
    orderTotal,
    subtotal,
    tax,
    validateSaveInvoice,
    formatApiData,
    validateSelectedItems,
    lockReason
} = useInvoice(itemsSelected, selectedClient, shippingData, data, t)

const onSaveShipping = () => {
    shippingData.value = shippingRef.value.save()

    configSlideOver.value.close = !configSlideOver.value.close

    if (props.mode === 'edit' && validateSaveInvoice.value) saveInvoice(saveWithSync)
}

const openSliderOverShipping = (showAlert) => {
    configSlideOver.value.showAlert = showAlert

    configSlideOver.value.open = !configSlideOver.value.open
}

const onClearShipping = () => {
    shippingRef.value.clear()

    onSaveShipping()
}

const addClient = () => tabsStore.openTab({ name: 'InvoicingClients', query: { idThread: thread.value.idThread } })

const addItems = () => {
    loadingInventory.value = true

    inventoryStore.fetch().then(() => {
        rapidStore.$emitGlobalEvent('selectedRowsInventorySync')

        loadingInventory.value = false
    })

    localItemSelected.value = itemsSelected.value

    tabsStore.openTab({ name: 'invoiceInventory', query: thread.value })
}

const invoiced = async () => await saveInvoice(saveForInvoiced)

const saveInvoice = async ({ type, sync = true }) => {
    if (!validateSaveInvoice.value) return

    errors.value = null

    loadings.value = {
        saveButton: true,
        invoiceButton: true
    }

    configSaving.value = {
        saving: true,
        saved: false,
        error: false
    }

    const apiData = formatApiData()

    const url = type === 'build' ? 'invoice_build' : 'invoice_draft'

    const response = await invoicingStore.postWithoutToast(url, apiData, sync)

    response && response.success && type === 'build' && tabsStore.closeTab(props.invoice?.id ? 'EditInvoice' : 'CreateInvoice')

    // Set the ID in the invoice draft and update the products with draft
    if (response && response.success && type !== 'build') {
        data.value.id = response.data.id

        data.value.products = response.data.invoice_product || data.value.products

        data.value.invoice_status = invoicingStore.getStatusById(response.data.invoice_status_id)

        configSaving.value = {
            saving: false,
            saved: true,
            error: false
        }
    }

    if (!response.success && response.message) {
        errors.value = { ...response.errors }

        configSaving.value = {
            saving: false,
            saved: false,
            error: true
        }
    }

    if (response.errors) {
        response.errors?.id && (data.value.id = response.errors.id[0])

        errors.value = { ...response.errors }

        configSaving.value = {
            saving: false,
            saved: false,
            error: true
        }
    }

    loadings.value = {
        saveButton: false,
        invoiceButton: false

    }

    if (sync) {
        inventoryStore.fetch().then(() => {
            rapidStore.$emitGlobalEvent('selectedRowsInventorySync')
        })

        invoicingStore.fetch()
    }
}

// Call to api to delete invoice draft
const deleteInvoice = async () => {
    const response = await invoicingStore.post('draft_delete', { id: data.value?.id ?? null })

    inventoryStore.fetch()

    invoicingStore.fetch()

    response?.success && tabsStore.closeTab(props.invoice?.id ? 'EditInvoice' : 'CreateInvoice')
}

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

    console.log('SHOW MESSAGE ======')
    console.log('FROM data:', printableArea)

    const response = await api.post('pdf/create', data)

    !response.success && (loadings.value.printButton = false)

    response.success && downloadPDF(response)
}

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

const dataValidate = computed(() => {
    return {
        id: data.value?.id,
        client: selectedClient.value?.id,
        status: data.value?.invoice_status?.slug,
        validateSaveInvoice: validateSaveInvoice.value,
        saveButton: loadings.value.saveButton,
        printButton: loadings.value.printButton,
        invoiceButton: loadings.value.invoiceButton,
        errors: errors.value,
        lengthItemList: itemsSelected.value.length
    }
})

const buttons = configButtonsInvoice({
    useGlobalStore,
    actions: {
        saveInvoice,
        invoiced,
        print,
        deleteInvoice: () => (showConfirmDeleteModal.value = true)
    },
    dataValidate
})

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
    itemsSelected.value = []

    if (props.invoice && ['edit', 'show'].includes(props.mode)) {
        data.value = props.invoice

        selectedClient.value = props.invoice?.client

        itemsSelected.value = props.invoice.invoice_draft_items?.map(item => ({
            discount: item.discount || 0,
            id: item.item_id,
            price: item.price,
            quantity: item.quantity,
            lockType: '',
            lockTypeName: '',
            valid: true
        }))

        localItemSelected.value = itemsSelected.value

        rapidStore.$emitGlobalEvent(`selectedItems:${thread.value.actionThread}`, false)

        shippingData.value = {
            name: props.invoice.shipping_name,
            address: props.invoice.shipping_address,
            address_2: props.invoice.shipping_address_2,
            zip_code: props.invoice.shipping_zip_code,
            state: props.invoice.shipping_state,
            city: props.invoice.shipping_city,
            phone: props.invoice.shipping_phone
        }

        autoSave()
    }
})

const actionMessage = computed(() => {
    if (configSaving.value.error && !configSaving.value.saved && !configSaving.value.saving) {
        return {
            label: 'Saved with errors',
            type: 'danger'
        }
    }

    if (configSaving.value.saved && !configSaving.value.saving && !configSaving.value.error) {
        return {
            label: 'Saved',
            type: 'success'
        }
    }

    if (configSaving.value.saving) {
        return {
            label: 'Saving...',
            type: 'default'
        }
    }

    return {}
})
</script>

<template>
    <!-- Overlay for load data and sync -->
    <Overlay v-if="loadings.syncItems || loadings.printButton"/>

    <!-- Confirmation modal to delete invoice -->
    <ConfirmationModal
        :description="$t('Are you sure you want to delete this draft?')"
        :title="$t('Delete confirmation')"
        v-model="showConfirmDeleteModal"
        @confirm="deleteInvoice"
        class="z-50" />

    <div class="max-w-8xl mx-auto">
        <div class="flex justify-start">
            <ActionButtons
                :items="buttons" />
        </div>

        <Card
            class="px-10 py-5"
            hasMargins
            :placeContentCenter="false"
            :id="isInEdit ? 'printableArea' : 'newInvoincePrinableArea'">
            <!-- Draft watermark -->
            <div
                v-if="mode === 'edit'"
                class="absolute text-[12rem] font-black top-0 left-0 grid place-content-center h-full tracking-widest z-10 uppercase overflow-hidden w-full opacity-10"
                style="pointer-events: none;">
                <p class="-rotate-45">
                    {{ $t('Draft') }}
                </p>
            </div>

            <!-- Title and Company name -->
            <CardHeader
                class="mb-3"
                :title="data?.id ? $t(`Edit invoice draft`) : $t(`Create invoice`)"
                :action-label="actionMessage.label"
                :action-label-type="actionMessage.type"
                :date="data.updated_at"
                :print-view-id="data.id"
                :print-view-title="$t('Invoice')" />

            <hr class="block mt-5 !mb-0 border-[1px] border-gray-500">

            <!-- Main content -->
            <div class="mx-auto w-full">
                <!-- Actions (Bill to and Ship To) -->
                <div class="gap-8 flex w-full mt-5">
                    <!-- Bill to -->
                    <div class="w-full">
                        <h2 class="flex flex-row font-medium !my-0 mr-4 whitespace-nowrap items-center">
                            {{ $t('Bill to:') }}
                        </h2>

                        <EntityInformation
                            :hasCard="!selectedClient"
                            :action="!selectedClient ? addClient : void 0"
                            :icon="mdiAccount"
                            :name="selectedClient?.company_name"
                            :data="{
                                address:selectedClient?.address,
                                state:selectedClient?.state,
                                zipCode:selectedClient?.zip_code,
                                email:selectedClient?.email,
                                phone:selectedClient?.phone,
                            }"
                            >
                            <div v-if="!selectedClient">
                                <div class="font-semibold">
                                    {{ $t('Select client') }}
                                </div>

                                {{ $t('Choose an existing client.') }}
                            </div>

                            <button
                                v-if="selectedClient && mode === 'edit'"
                                @click="addClient"
                                class="link primary notPrintableArea mt-2">
                                {{ $t('Change') }}
                            </button>
                        </EntityInformation>
                    </div>

                    <!-- Ship to -->
                    <div class="w-full">
                        <h2 class="flex flex-row font-medium !my-0 mr-4 whitespace-nowrap items-center">
                            {{ $t('Ship to:') }}
                        </h2>

                        <!-- Show on prin if exists shipping -->
                        <EntityInformation
                            :class="!existShipping ? 'notPrintableArea' : ''"
                            :hasCard="!existShipping"
                            :action="!existShipping ? () => openSliderOverShipping(false) : void 0"
                            :icon="mdiMapMarkerAccount"
                            :name="shippingData?.name"
                            :data="{
                                address:shippingData?.address,
                                address_2:shippingData?.address_2,
                                zipCode:shippingData?.zip_code,
                                state:shippingData?.state,
                                city:shippingData?.city,
                                phone:shippingData?.phone,
                            }">
                            <div v-if="!existShipping">
                                <div class="font-semibold">
                                    {{ $t('Same as billing address') }}
                                </div>

                                {{ $t('Or select a different shipping address.') }}
                            </div>

                            <button
                                v-if="existShipping && mode === 'edit'"
                                @click="openSliderOverShipping(true)"
                                class="link primary notPrintableArea mt-2">
                                {{ $t('Change') }}
                            </button>
                        </EntityInformation>

                        <!-- If not exists shipping duplicate data of client -->
                        <EntityInformation
                            class="justForPrintView"
                            v-if="!existShipping"
                            :hasCard="!selectedClient"
                            :action="!selectedClient ? addClient : void 0"
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
                                    {{ $t('Select client') }}
                                </div>

                                {{ $t('Choose an existing client.') }}
                            </div>

                            <button
                                v-if="selectedClient && mode === 'edit'"
                                @click="addClient"
                                class="link primary notPrintableArea mt-2">
                                {{ $t('Change') }}
                            </button>
                        </EntityInformation>
                    </div>

                    <div class="w-full">
                        <!-- Empty space for layout -->
                    </div>
                </div>

                <!-- Orders -->
                <div class="mt-5">
                    <!-- Products -->
                    <h2 class="text-xl font-medium !py-0 !my-0">
                        {{ $t('Items') }}
                    </h2>

                    <!-- Alert for items locked -->
                    <Alert
                        v-if="!validateSelectedItems()"
                        type="danger"
                        :content="$t('There are items that cannot be processed, removed from the list and proceed with invoicing.')"
                        :has-close-button="false" />

                    <!-- Grid items -->
                    <ProductsGrid
                        v-model:products="itemsSelected"
                        :action-thread="thread.action"
                        :in-create="mode !== 'show'"
                        :errors="errors"
                        @autoSave="autoSave" />

                    <!-- Card for add new items -->
                    <div class="flex air-sm">
                        <Card
                            v-if="mode === 'edit'"
                            class="notPrintableArea w-full border-2 !border-primary-200 hover:!border-primary-600 cursor-pointer"
                            @click="addItems">
                            <div
                                @click="addItems"
                                class="text-primary-600 font-semibold">
                                {{ $t('Add item') }}
                            </div>
                        </Card>
                    </div>

                    <!-- Supplies (Under development) -->
                    <!-- <div class="cursor-not-allowed hover:bg-gray-50 notPrintableArea">
                        <h2 class="text-xl font-bold tracking-tight text-gray-600 air-2xl">
                            {{ $t('Supplies') }}
                        </h2>

                        <div class="text-center py-4 font-bold tracking-tight text-gray-600">
                            {{ $t('Under Development') }}
                        </div>
                    </div>

                    <hr class="my-8 notPrintableArea"> -->
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
                        <dl class="divide-y divide-gray-200 text-sm md:col-span-12 mt-5 md:pl-10">
                            <!-- Subtotal -->
                            <BillingItem
                                :title="$t('Subtotal')"
                                :value="`$${round(subtotal)}`" />

                            <!-- Discount -->
                            <BillingItem :title="$t('Discount')">
                                <template #value>
                                    <div class="flex items-center justify-between">
                                        <!-- Link to enable discount -->
                                        <button
                                            v-if="data.discount === null  && mode === 'edit'"
                                            @click="(e)=> data.discount = 0"
                                            class="link primary notPrintableArea">
                                            {{ $t('Add discount') }}
                                        </button>

                                        <!-- For show invoice -->
                                        <span
                                            v-if="mode === 'show'"
                                            class="notPrintableArea h-full flex items-center mt-3 mx-2">
                                            {{ data.discount ? `${data.discount}%` : '0%' }}
                                        </span>

                                        <!-- For print view -->
                                        <span class="justForPrintView block !my-0 -ml-2">
                                            {{ data.discount ? `${data.discount}%` : '0%' }}
                                        </span>

                                        <Input
                                            v-if="data.discount !== null && mode === 'edit'"
                                            v-model="data.discount"
                                            :inputClass="'text-right'"
                                            type="number"
                                            min="0"
                                            max="100"
                                            class="!mt-0 !w-32 notPrintableArea"
                                            inline-label-right="%"
                                            @update:model-value="autoSave"
                                            :errors="errors?.discount ? ' ' : ''" />
                                    </div>
                                </template>
                            </BillingItem>

                            <!-- Tax -->
                            <BillingItem
                                :title="$t('Tax')"
                                :value="`$${round(tax)}`" />

                            <!-- Shipping -->
                            <BillingItem :title="$t('Shipping')">
                                <template #value>
                                    <div class="flex items-center justify-center">
                                        <!-- Link to enable shipping_cost -->
                                        <button
                                            v-if="data.shipping_cost === null && mode === 'edit'"
                                            class="link primary notPrintableArea"
                                            @click="(e)=> data.shipping_cost = 0">
                                            {{ $t('Add shiping cost') }}
                                        </button>

                                        <!-- For show invoice -->
                                        <span
                                            v-if="mode === 'show'"
                                            class="notPrintableArea h-full flex items-center mt-3 mx-2">
                                            {{ data.shipping_cost ? `$${data.shipping_cost}` : '$0' }}
                                        </span>

                                        <!-- For print view -->
                                        <span class="justForPrintView block !my-0 -ml-2">
                                            {{ data.shipping_cost ? `$${data.shipping_cost}` : '$0' }}
                                        </span>

                                        <Input
                                            v-if="data.shipping_cost !== null && mode === 'edit'"
                                            v-model="data.shipping_cost"
                                            class="!mt-0 !w-32 notPrintableArea"
                                            :inputClass="'text-right'"
                                            type="number"
                                            min="0"
                                            max="100"
                                            inline-label-left="$"
                                            @update:model-value="autoSave"
                                            :errors="errors?.shipping_cost ?  ' ' : ''" />
                                    </div>
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

            <Slideover
                :title="shippingData?.name || $t('Shipping')"
                :open="configSlideOver.open"
                :close="configSlideOver.close"
                has-cancel-button
                has-save-button
                @clickOnSave="onSaveShipping">
                <Shipping
                    ref="shippingRef"
                    :data="shippingData"
                    :showAlert="configSlideOver.showAlert"
                    @clear="onClearShipping" />
            </Slideover>
        </Card>
    </div>
</template>

<style>
.justForPrintView {
    display: none;
}
</style>
