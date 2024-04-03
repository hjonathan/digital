<script setup>
import { Title } from 'layout'
import { InputLabel, DatePicker, Label, AutoComplete } from 'form'
import InvoiceGrid from './InvoiceGrid.vue'
import UnknownSupplyGrid from './UnknownSupplyGrid.vue'
import { computed, inject, onMounted, readonly, ref } from 'vue'
import { formatDate, showUuid } from 'shared'
import AdditionalCosts from '../../components/AdditionalCosts.vue'
import { api } from '@/config'

const PURCHASE_ORDER_SLUG = 'purchase-order-po'
const SALES_ORDER_SLUG = 'sales-order'
const COMBINE_SLUG = 'combine-supply'
const UNKNOWN_WAREHOUSE_RECEIPT = 'warehouse-receipt-unknown-supply'

const useGlobalStore = inject('useGlobalStore')
const purchaseOrderStore = useGlobalStore('purchaseOrder')
const salesOrderStore = useGlobalStore('salesOrder')
const rapidStore = useGlobalStore('rapidStore')

const vendorStore = useGlobalStore('vendors')

const props = defineProps({
    useInvoice: Object,
    useAdditionalCosts: Object
})

const { data, errors, total, subTotal, schema, permissions, variables, unknownItems } = props.useInvoice
const { setAdditionalCostsSchema, additionalCosts, schemaCosts, isRecovered } = props.useAdditionalCosts

const vendors = ref([])

const invoiceGridMode = computed(() => {
    if (unknownItems.value && !data.id) return 'edit'

    if (unknownItems.value && data.id) return 'readonly'

    if (schema.value.requisitionSupplies?.mode === 'readonly') return 'readonly'

    if (variables.value.supplyOrderId) return 'readonly'

    return 'edit'
})

onMounted(async () => {
    vendors.value = await vendorStore.fetch()

    setAdditionalCostsSchema(data.value)

    if (variables.value.documentType === PURCHASE_ORDER_SLUG) {
        const purchaseOrder = await purchaseOrderStore.fetchRequestById(variables.value.supplyOrderId)

        data.value.vendor = purchaseOrder.vendor

        data.value.requisition_supplies = purchaseOrder.supply

        setAdditionalCostsSchema({ ...purchaseOrder, id: data.value.id })
    }

    if (variables.value.documentType === SALES_ORDER_SLUG) {
        const salesOrder = await salesOrderStore.fetchRequestById(variables.value.supplyOrderId)

        data.value.vendor = salesOrder.vendor

        data.value.requisition_supplies = salesOrder.supply

        setAdditionalCostsSchema({ ...salesOrder, id: data.value.id })
    }

    if ([COMBINE_SLUG, UNKNOWN_WAREHOUSE_RECEIPT].includes(variables.value.documentType)) {
        unknownItems.value = true

        const response = await api.get(`/supplies/process_unknown_supply_list/${variables.value.processId}`)

        data.value.requisition_supplies = response.data?.supplies || []

        data.value.vendor = vendors.value.find(vendor => response.data.vendor_id === vendor.id)
    }

})

// To sync data with Vendors module (on create, edit, delete)
rapidStore.$registerGlobalEvent('syncVendorsWithSuppliesInvoice', async payload => {
    vendors.value = await vendorStore.fetch()
})
</script>

<template>
    <section
        id="SuppliesInvoicePrintableArea"
        class="paper">
        <Title
            :title="`${$t(`Invoice`) } ${data?.id ? `#${showUuid(data?.id)}` : ''}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <!-- Buyer information section -->
        <section>
            <Title
                :title="$t('Buyer information')"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="font-semibold" />

            <!-- Buyer information -->
            <div class="grid grid-cols-2 mb-2">
                <div
                    v-if="data.facility"
                    class="space-y-1">
                    <!-- Company -->
                    <InputLabel
                        v-model="data.facility.facility_name"
                        :label="$t('Company')"
                        :mode="schema.buyerInformation.mode"
                        outline
                        dense />

                    <!-- Address -->
                    <InputLabel
                        v-model="data.facility.address"
                        :label="$t('Address')"
                        :mode="schema.buyerInformation.mode"
                        outline
                        dense />

                    <!-- Address 2 -->
                    <InputLabel
                        v-model="data.facility.address_2"
                        :label="$t('Address 2')"
                        :mode="schema.buyerInformation.mode"
                        outline
                        dense />

                    <!-- Phone -->
                    <InputLabel
                        v-model="data.facility.phone"
                        :label="$t('Phone')"
                        :mode="schema.buyerInformation.mode"
                        outline
                        dense />

                    <!-- Zip Code -->
                    <InputLabel
                        v-model="data.facility.zip_code"
                        :label="$t('Zip Code')"
                        :mode="schema.buyerInformation.mode"
                        outline
                        dense />

                    <!-- City -->
                    <InputLabel
                        v-model="data.facility.city"
                        :label="$t('City')"
                        :mode="schema.buyerInformation.mode"
                        outline
                        dense />

                    <!-- State -->
                    <InputLabel
                        v-model="data.facility.state"
                        :label="$t('State')"
                        :mode="schema.buyerInformation.mode"
                        outline
                        dense />
                </div>

                <!-- User logged -->
                <div class="space-y-1">
                    <!-- Date -->
                    <InputLabel
                        v-model="data.request_date.date"
                        :label="$t('Date')"
                        :mode="permissions.includes('supplies.global.custom_date') && schema.role !== 'show' ? 'edit' : 'readonly'"
                        outline
                        dense>
                        <template v-slot:form-field>
                            <DatePicker
                                v-if="permissions.includes('supplies.global.custom_date') && schema.role !== 'show'"
                                v-model="data.request_date.date"
                                size="sm"
                                outline
                                container-class="none"
                                :minDate="null"/>

                            <Label
                                v-if="schema.role === 'show'">
                                {{ formatDate(data.request_date.date) }}
                            </Label>
                        </template>
                    </InputLabel>

                    <!-- Department -->
                    <InputLabel
                        v-model="data.department"
                        :label="$t('Department')"
                        :mode="schema.requester.mode"
                        outline
                        dense />

                    <!-- Name -->
                    <InputLabel
                        v-model="data.name"
                        :label="$t('Name')"
                        :mode="schema.requester.mode"
                        outline
                        dense />

                    <!-- Position -->
                    <InputLabel
                        v-model="data.position"
                        :label="$t('Position')"
                        :mode="schema.requester.mode"
                        outline
                        dense />

                    <!-- Email -->
                    <InputLabel
                        v-model="data.email"
                        :label="$t('Email')"
                        :mode="schema.requester.mode"
                        outline
                        dense />

                    <!-- Phone -->
                    <InputLabel
                        v-model="data.phone"
                        :label="$t('Phone')"
                        :mode="schema.requester.mode"
                        outline
                        dense />
                </div>
            </div>
        </section>

        <!-- Vendor information -->
        <section class="w-1/2">
            <Title
                :title="$t('Vendor')"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="font-semibold" />

            <!-- Vendor -->
            <AutoComplete
                v-if="invoiceGridMode === 'edit' && !unknownItems"
                v-model="data.vendor"
                :readonly="schema.sellerInformation.mode === 'readonly' || variables.supplyOrderId"
                :placeholder="$t('Vendor')"
                :options="vendors"
                :forceSelection="false"
                :errors="errors?.vendor_id ? errors.vendor_id[0] : null"  />

            <span
                v-if="invoiceGridMode === 'readonly' || unknownItems">
                {{ data.vendor?.name }}
            </span>

             <!-- Document number (Invoice number) -->
             <InputLabel
                v-model="data.document_number"
                :label="$t('Invoice number')"
                :mode="schema.documentNumber.mode"
                outline
                dense
                :error="errors?.document_number"
                class="mt-3" />
        </section>

        <!-- Item description section (Grid) -->
        <section>
            <Title
                :title="$t('Item description')"
                :has-border-bottom-line="false"
                class="font-semibold mt-2" />

            <!-- Invoice Grid -->
            <InvoiceGrid
                v-if="!unknownItems"
                :data="data.requisition_supplies"
                :errors="errors"
                @reset-errors="() => { errors = {} }"
                :mode="invoiceGridMode"
                :useInvoice="useInvoice"
                :useAdditionalCosts="useAdditionalCosts"
                class="font-semibold" />

            <!-- Unknown supply grid -->
            <UnknownSupplyGrid
                v-if="unknownItems"
                :data="data.requisition_supplies"
                :errors="errors"
                @reset-errors="() => { errors = {} }"
                :mode="invoiceGridMode"
                :useInvoice="useInvoice"
                :useAdditionalCosts="useAdditionalCosts" />

            <section class="grid grid-cols-3">
                <div class="flex flex-col gap-4 col-start-3 mt-4 reset-margin-top">
                    <AdditionalCosts
                        :isRecovered="isRecovered"
                        v-model:subTotal="subTotal"
                        v-model:taxes="additionalCosts.taxes"
                        v-model:shippingCost="additionalCosts.shipping_cost"
                        v-model:estimatedShipping="additionalCosts.estimated_shipping"
                        v-model:handling="additionalCosts.handling"
                        v-model:insuranceCost="additionalCosts.insurance_cost"
                        v-model:total="total"
                        :schema="schemaCosts"
                        :errors="errors" />
                </div>
            </section>
        </section>
    </section>
</template>

<style>
td.last {
    width: 1px;
    white-space: nowrap;
}
</style>
