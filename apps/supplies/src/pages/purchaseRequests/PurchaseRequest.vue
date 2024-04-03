<script setup>
import { Title } from 'layout'
import { InputLabel, TextareaLabel, AnimatedTextArea, TextArea, AutoComplete, DatePicker } from 'form'
import DeliveryInformation from '../../components/DeliveryInformation.vue'
import { computed, inject, ref } from 'vue'
import Requester from '../../components/Requester.vue'
import ApprovalStatus from '../../components/ApprovalStatus.vue'
import { useI18n } from 'vue-i18n'
import { showUuid, formatDate } from 'shared'

const { t } = useI18n()

const props = defineProps({
    usePurchaseRequest: Object,
    schema: {
        type: Object,
        defaul: () => ({})
    }
})

const { data, errors, schema, permissions } = props.usePurchaseRequest

const useGlobalStore = inject('useGlobalStore')
const parametersStore = useGlobalStore('parameters')

const variables = ref({
    deliveryInformation: false,
    note: false
})

const measures = computed(() => {
    return parametersStore.getAutocompleteDataBySlug('measures').map(item => ({ ...item, name: item.label }))
})

const getMeasureByID = (id) => {
    return measures.value.filter(measure => measure.id === Number(id))[0]
}
</script>

<template>
    <section
        id="PRPrintableArea"
        class="paper">
        <Title
            :title="`${$t(`Purchase Request`) } ${data?.id ? `#${showUuid(data?.id)}` : ''}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <div
            v-if="schema.status.mode !== 'hidden'"
            class="row cols-2 mb-2">
            <!-- Status -->
            <div>
                <Title
                    :title="$t('Status')"
                    :hasBorderBottomLine="false"
                    titleType="h2"
                    class="font-semibold" />

                <InputLabel
                    v-if="data.supply_order_status?.name"
                    v-model="data.supply_order_status.name"
                    :label="$t('Status')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Reason -->
                <!-- TODO: verify reason -->
                <InputLabel
                    v-if="data.supply_order_status?.name === 'rejected'"
                    v-model="data.note"
                    :label="$t('Reason')"
                    mode="readonly"
                    outline
                    dense />
            </div>
        </div>

        <Title
            :title="$t('Requester')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <div class="pb-1">
            <!-- Requester -->
            <Requester
                v-if="data.requester"
                :data="data"
                :permissions="permissions"
                class="col-xs-24">
                <template v-if="permissions.includes('supplies.global.custom_date')" v-slot:requested-date>
                    <!-- Date -->
                    <InputLabel
                        v-model="data.requester.requester_date"
                        :label="$t('Requested date')"
                        :mode="schema.role ==='creator'? 'edit' : 'readonly'"
                        outline
                        dense>
                        <template v-slot:form-field>
                            <DatePicker
                                v-if="schema.role ==='creator' "
                                v-model="data.requester.requester_date"
                                :placeholder="$t('Requested date')"
                                size="sm"
                                outline
                                container-class="none"
                                :minDate="null"/>

                            <Label v-if="schema.role !=='creator' ">
                                {{ formatDate(data.requester.requester_date) }}
                            </Label>
                        </template>
                    </InputLabel>
                </template>
            </Requester>
        </div>

        <Title
            :title="$t('Item description')"
            :has-border-bottom-line="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Item description -->
        <div class="row cols-3">
            <div class="col-2/3 gutter-xs">
                <!-- Name or title -->
                <InputLabel
                    v-model="data.request_item[0].name"
                    :label="$t('Name or title')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.name`] ? [] : null"
                    outline
                    dense />

                <!-- Description -->
                <TextareaLabel
                    v-model="data.request_item[0].description"
                    :label="$t('Description')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    outline
                    dense
                    :error="errors && errors[`request_item.0.description`] ? [] : null" />

                <!-- SKU or Part Number -->
                <InputLabel
                    v-model="data.request_item[0].sku_part_number"
                    :label="$t('SKU or Part Number')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.sku_part_number`] ? [] : null"
                    outline
                    dense />

                <!-- Category or classification -->
                <InputLabel
                    v-model="data.request_item[0].category"
                    :label="$t('Category or Classification')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.category`] ? [] : null"
                    outline
                    dense />

                <!-- Manufacturer or Brand -->
                <InputLabel
                    v-model="data.request_item[0].brand"
                    :label="$t('Manufacturer or Brand')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.brand`] ? [] : null"
                    outline
                    dense />

                <!-- Price -->
                <InputLabel
                    v-model="data.request_item[0].price"
                    :label="$t('Price')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.price`] ? [] : null"
                    input-label-left="$"
                    inputExtraLabelLeft="$"
                    type="number"
                    input-class="!text-right"
                    outline
                    dense />

                <!-- Accounting number -->
                <InputLabel
                    v-model="data.request_item[0].accounting_number"
                    :label="$t('Accounting number')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.accounting_number`] ? [] : null"
                    outline
                    dense />

                <!-- Quantity -->
                <InputLabel
                    v-model="data.request_item[0].quantity"
                    :label="$t('Quantity')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.quantity`] ? [] : null"
                    inputClass="text-right"
                    type="number"
                    outline
                    dense />

                <!-- Unit of measure -->
                <InputLabel
                    :label="$t('Unit of measure')"
                    outline
                    dense
                    :error="errors && errors[`request_item.0.measure_id`] ? [] : null"
                    :mode="schema.itemDescription.mode">
                    <template #form-field>
                        <!-- For edit mode -->
                        <AutoComplete
                            v-if="schema.itemDescription.mode === 'edit'"
                            v-model="data.request_item[0].measure_id"
                            :readonly="schema.itemDescription.mode === 'readonly'"
                            :options="measures"
                            optionLabel="label"
                            optionValue="id"
                            emit-value
                            map-options
                            outline
                            size="sm"
                            :placeholder="$t('Unit of measure')"
                            :errors="errors && errors[`request_item.0.measure_id`]"
                            container-class="!m-0 !p-0" />

                        <!-- For show and print mode -->
                        <span v-if="schema.itemDescription.mode === 'readonly'">
                            {{ getMeasureByID(data.request_item[0].measure_id)?.label }}
                        </span>
                    </template>
                </InputLabel>

                <!-- Vendor information -->
                <TextareaLabel
                    v-model="data.request_item[0].vendor_information"
                    :label="$t('Vendor information')"
                    :mode="schema.itemDescription.mode === 'readonly' ? 'readonly' : 'edit'"
                    :error="errors && errors[`request_item.0.vendor_information`] ? [] : null"
                    outline
                    dense />
            </div>
        </div>

        <!-- Justification and budget information -->
        <div class="row cols-2">
            <!-- Justification -->
            <div>
                <Title
                    :title="$t('Justification')"
                    :has-border-bottom-line="false"
                    titleType="h2"
                    class="font-semibold" />

                <p class="text-sm print-text-base-md">
                    {{ $t('The reason for the purchase, such as replacement of existing equipment, new project requirements, or operational needs. It helps provide a context for the purchase request.') }}
                </p>

                <!-- For edit mode -->
                <TextArea
                    v-if="schema.itemDescription.mode === 'edit'"
                    v-model="data.request_item[0].justification"
                    :readonly="schema.justification.mode === 'readonly'"
                    :placeholder="$t('Justification')"
                    :errors="errors && errors[`request_item.0.justification`]" />

                <!-- For show and print mode -->
                <span
                    v-if="schema.itemDescription.mode === 'readonly'"
                    class="p-2 block bg-gray-200">
                    {{ data?.request_item[0]?.justification }}
                </span>
            </div>

            <!-- Budget information -->
            <div>
                <Title
                    :title="$t('Budget information')"
                    :has-border-bottom-line="false"
                    titleType="h2"
                    class="font-semibold" />

                <p class="text-sm print-text-base-md">
                    {{ $t('The estimated or approved budget for the purchase, including any specific budget codes project allocations to be used.') }}
                </p>

                <!-- For edit mode -->
                <TextArea
                    v-if="schema.itemDescription.mode === 'edit'"
                    v-model="data.request_item[0].budget_information"
                    :readonly="schema.budgetInformation.mode === 'readonly'"
                    :placeholder="$t('Budget information')"
                    :errors="errors && errors[`request_item.0.budget_information`]" />

                <!-- For show and print mode -->
                <span
                    v-if="schema.itemDescription.mode === 'readonly'"
                    class="p-2 block bg-gray-200">
                    {{ data?.request_item[0]?.budget_information }}
                </span>
            </div>
        </div>

        <!-- Note -->
        <div class="row cols-2">
            <!-- Note -->
            <div>
                <!-- Title and actions -->
                <Title
                    :title="$t('Note')"
                    titleType="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!variables.note && schema.note.mode == 'edit'"
                            id="addNote"
                            @click="variables.note = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="variables.note && schema.note.mode == 'edit'"
                            @click="variables.note = false; data.note = ''"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Textarea form for note -->
                <AnimatedTextArea
                    v-model="data.note"
                    :open="variables.note"
                    :default-message="$t('No note was added')"
                    :mode="schema.note.mode"
                    class="col-xs-24"
                    :errors="errors && errors[`note`]" />
            </div>

            <!-- Delivery information -->
            <div v-if="schema.deliveryInformation.mode != 'hidden'">
                <Title
                    :title="$t('Delivery information')"
                    titleType="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!variables.deliveryInformation && schema.deliveryInformation.mode == 'edit'"
                            id="addDeliveryInformation"
                            @click="variables.deliveryInformation = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="variables.deliveryInformation && schema.deliveryInformation.mode == 'edit'"
                            @click="variables.deliveryInformation = false; data.deliveryInformation = {}"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <DeliveryInformation
                    :open="variables.deliveryInformation"
                    v-model="data.deliveryInformation"
                    :mode="schema.deliveryInformation.mode"
                    :id="data?.id"
                    :permissions="permissions"
                    :errors="errors" />
            </div>
        </div>

        <Title
            v-if="schema.managerApproval.mode != 'hidden'"
            :title="$t('Approval status')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <div class="row cols-2">
            <template v-for="(approval, index) in data.approvals" :key="index">
                <div
                    v-if="schema.managerApproval.mode != 'hidden'">
                    <Title
                        :title="$t(approval.position)"
                        titleType="h3"
                        :has-border-bottom-line="false"
                        class="font-semibold" />

                    <ApprovalStatus
                        :mode="schema.managerApproval.mode"
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
