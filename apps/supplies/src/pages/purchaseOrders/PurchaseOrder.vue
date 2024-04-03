<script setup>
import { Title } from 'layout'
import { InputLabel, AnimatedTextArea, DatePicker, Label, AutoComplete } from 'form'
import PurchaseOrderGrid from './PurchaseOrderGrid.vue'
import { inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate, showUuid } from 'shared'
import AdditionalCosts from '../../components/AdditionalCosts.vue'
import ApprovalStatus from '../../components/ApprovalStatus.vue'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const processStore = useGlobalStore('process')
const quotationRequestStore = useGlobalStore('quotationRequest')
const vendorsStore = useGlobalStore('vendors')
const rapidStore = useGlobalStore('rapidStore')

const props = defineProps({
    usePurchaseOrder: Object,
    useAdditionalCosts: Object
})

const slideVariables = ref({
    deliveryInformation: false,
    billingPayments: false,
    termsConditions: false,
    note: false
})

const { data, errors, total, subTotal, schema, permissions, variables, uniqueItem } = props.usePurchaseOrder

const { setAdditionalCostsSchema, additionalCosts, schemaCosts, isRecovered } = props.useAdditionalCosts

const quotationRequests = ref([])

onMounted(async () => {
    uniqueItem.value = !!variables.value.processId

    if (variables.value.processId) {
        const requests = await processStore.fetchRequestById(variables.value.processId)

        const quotationStage = requests.process_stages.find(stage => stage.id.toString() === (variables.value.stageId - 1).toString())

        quotationRequests.value = quotationStage?.process_stage_document_types[0]?.process_stage_documents.map(quotation => ({
            ...quotation,
            label: `${showUuid(quotation?.supply_order?.id)} - ${quotation?.supply_order?.vendor?.name}`,
            name: `${showUuid(quotation?.supply_order?.id)} - ${quotation?.supply_order?.vendor?.name}`,
            vendor_id: quotation?.supply_order?.vendor?.id,
            supply_quotation_id: quotation?.supply_order?.id
        }))

        if (data.value?.id) {
            data.value.quotation = quotationRequests.value?.find(quotation => quotation.supply_quotation_id.toString() === data.value?.parent_id?.toString())
        }

        if (variables.value.processId && !data.value?.id) {
            if (variables.value.supplyOrderId) {
                data.value.quotation = quotationRequests.value.find(quotation => quotation.supply_quotation_id.toString() === variables.value.supplyOrderId.toString())

                if (data.value.quotation) {
                    const quotationSelected = await quotationRequestStore.fetchRequestById(variables.value.supplyOrderId)

                    data.value.requisition_supplies = quotationSelected.supply
                }
            }
        }
    }

    if (!variables.value.processId) {
        const vendors = await vendorsStore.fetch()

        quotationRequests.value = vendors.map(vendor => ({
            label: vendor.name,
            name: vendor.name,
            vendor_id: vendor.id,
            supply_quotation_id: null
        }))
    }

    setAdditionalCostsSchema(data.value)
})

// To sync data with Vendors module (on create, edit, clone and delete)
rapidStore.$registerGlobalEvent('syncVendorsWithSuppliesPurchaseOrder', async payload => {
    if (!variables.value.processId) {
        const vendors = await vendorsStore.fetch()

        quotationRequests.value = vendors.map(vendor => ({
            label: vendor.name,
            name: vendor.name,
            vendor_id: vendor.id,
            supply_quotation_id: null
        }))
    }
})
</script>

<template>
    <section
        id="POPrintableArea"
        class="paper">
        <Title
            :title="`${$t(`Purchase Order`) } ${data?.id ? `(PO) #${showUuid(data?.id)}` : ''}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <Title
            :title="$t('Buyer information')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Buyer information section -->
        <div class="row cols-2 mb-2">
            <!-- Buyer information -->
            <div
                v-if="data.facility"
                class="gutter-xs">
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
            <div class="gutter-xs">
                <!-- Date -->
                <InputLabel
                    v-model="data.request_date.date"
                    :label="$t('Date')"
                    :mode="permissions.includes('supplies.global.custom_date') && schema.role ==='creator' ? 'edit' : 'readonly'"
                    outline
                    dense>
                    <template v-if="permissions.includes('supplies.global.custom_date')" v-slot:form-field>
                        <DatePicker
                            v-if="schema.role ==='creator'"
                            v-model="data.request_date.date"
                            size="sm"
                            outline
                            container-class="none"
                            :minDate="null"/>

                        <Label
                            v-if="schema.role !=='creator'">
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

        <!-- Vendor -->
        <div class="row cols-2 mb-2">
            <div>
                <Title
                    :title="$t('Vendor')"
                    :hasBorderBottomLine="false"
                    titleType="h2"
                    class="font-semibold" />

                <AutoComplete
                    v-if="schema.requisitionSupplies?.mode === 'edit'"
                    v-model="data.quotation"
                    :readonly="schema.sellerInformation.mode === 'readonly' || variables.supplyOrderId"
                    :placeholder="$t('Vendor')"
                    :options="quotationRequests"
                    :forceSelection="false"
                    :errors="errors?.vendor_id ? errors.vendor_id[0] : null"  />

                <span v-if="schema.requisitionSupplies?.mode === 'readonly'">
                    {{ data.vendor.name || $t('- No vendor selected -') }}
                </span>

                <!-- Company -->
                <InputLabel
                    v-model="data.document_number"
                    :label="$t('Quotation number')"
                    :mode="schema.documentNumber.mode"
                    outline
                    dense
                    :error="errors && errors?.document_number" />
            </div>
        </div>

        <!-- Item description section (Grid) -->
        <Title
            :title="$t('Item description')"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <!-- Purchase Order Grid -->
        <PurchaseOrderGrid
            :data="data.requisition_supplies"
            :errors="errors"
            :mode="schema.requisitionSupplies?.mode"
            :usePurchaseOrder="usePurchaseOrder"
            @reset-errors="() => { errors = {} }"
            class="font-semibold" />

        <!-- Shipping cost section -->
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

        <!-- Delivery information -->
        <div class="row cols-2">
            <div class="gutter-xs">
                <!-- Title and actions -->
                <Title
                    :title="$t('Delivery information')"
                    titleType="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!slideVariables.deliveryInformation && schema.deliveryInformation.mode == 'edit'"
                            @click="slideVariables.deliveryInformation = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="slideVariables.deliveryInformation && schema.deliveryInformation.mode == 'edit'"
                            @click="slideVariables.deliveryInformation = false; data.delivery_information = null; errors.delivery_information = null"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Textarea form -->
                <AnimatedTextArea
                    :placeholder="$t('Delivery information')"
                    v-model="data.delivery_information"
                    :open="slideVariables.deliveryInformation"
                    :mode="schema.deliveryInformation.mode"
                    :default-message="$t('No delivery information given')"
                    :errors="errors?.delivery_information" />
            </div>
        </div>

        <!-- Billig and payments terms -->
        <div class="row cols-2">
            <div class="gutter-xs">
                <!-- Title and actions -->
                <Title
                    :title="$t('Billing and payments terms')"
                    titleType="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold !pt-0">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!slideVariables.billingPayments && schema.billingPayments.mode == 'edit'"
                            @click="slideVariables.billingPayments = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="slideVariables.billingPayments && schema.billingPayments.mode == 'edit'"
                            @click="slideVariables.billingPayments = false; data.billing_payment_terms = null; errors.billing_payment_terms = null"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Textarea form -->
                <AnimatedTextArea
                    :placeholder="$t('Billing and payments terms')"
                    v-model="data.billing_payment_terms"
                    :open="slideVariables.billingPayments"
                    :mode="schema.billingPayments.mode"
                    :default-message="$t('No billing and payments terms given')"
                    :errors="errors?.billing_payment_terms" />
            </div>
        </div>

        <!-- Terms and conditions -->
        <div class="row cols-2">
            <div class="gutter-xs">
                <!-- Title and actions -->
                <Title
                    :title="$t('Terms and conditions')"
                    titleType="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold !pt-0">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!slideVariables.termsConditions && schema.termsConditions.mode == 'edit'"
                            @click="slideVariables.termsConditions = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="slideVariables.termsConditions && schema.termsConditions.mode == 'edit'"
                            @click="slideVariables.termsConditions = false; data.terms_conditions = null; errors.terms_conditions = null"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Textarea form -->
                <AnimatedTextArea
                    v-model="data.terms_conditions"
                    :placeholder="$t('Terms and conditions')"
                    :open="slideVariables.termsConditions"
                    :mode="schema.termsConditions.mode"
                    :default-message="$t('No terms and conditions given')"
                    :errors="errors?.terms_conditions" />
            </div>
        </div>

        <Title
            v-if="schema?.approvalList?.mode !== 'hidden' && data.approvals"
            :title="$t('Approval status')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold !pt-0" />

        <!-- Approval user list -->
        <div class="row cols-2"
            v-if="schema?.approvalList?.mode !== 'hidden' && data.approvals">
            <template
                v-for="(approval, index) in data.approvals"
                :key="index">
                <div
                    v-if="schema?.approvalList?.mode !== 'hidden'">
                    <Title
                        :title="$t(approval.position)"
                        titleType="h3"
                        :has-border-bottom-line="false"
                        class="font-semibold" />

                    <!-- Approval Status -->
                    <ApprovalStatus
                        :mode="schema?.approvalList?.mode"
                        v-model="data.approvals[index]" />
                </div>
            </template>
        </div>
    </section>
</template>

<style>
td.last {
    width: 1px;
    white-space: nowrap;
}
</style>
