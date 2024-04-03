<script setup>
import { Title } from 'layout'
import { InputLabel, AnimatedTextArea, DatePicker, Label } from 'form'
import DeliveryInformation from '../../components/DeliveryInformation.vue'
import RequestForQuotationGrid from './RequestForQuotationGrid.vue'
import VendorsGrid from './VendorsGrid.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'

const { t } = useI18n()
const props = defineProps({
    useRequestForQuotation: Object
})

const slideVariables = ref({
    deliveryInformation: false,
    note: false,
    termsConditions: false,
    evaluationCriteria: false
})

const { data, errors, schema, permissions } = props.useRequestForQuotation
</script>

<template>
    <section
        id="RFQPrintableArea"
        class="paper">
        <Title
            :title="`${$t(`Request for quotation`) } ${data?.id ? `#${showUuid(data?.id)}` : ''}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <!-- Contact information -->
        <Title
            :title="$t('Contact information')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Requester (contact) information -->
        <div class="row cols-2 mb-2">
            <div class="gutter-xs">
                <!-- Name -->
                <InputLabel
                    v-model="data.facility.facility_name"
                    :label="$t('Company')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Address -->
                <InputLabel
                    v-model="data.facility.address"
                    :label="$t('Address')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Address 2 -->
                <InputLabel
                    v-model="data.facility.address_2"
                    :label="$t('Address 2')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Phone -->
                <InputLabel
                    v-model="data.facility.phone"
                    :label="$t('Phone')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Zip -->
                <InputLabel
                    v-model="data.facility.zip_code"
                    :label="$t('Zip code')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- City -->
                <InputLabel
                    v-model="data.facility.city"
                    :label="$t('City')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- State -->
                <InputLabel
                    v-model="data.facility.state"
                    :label="$t('State')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />
            </div>

            <div class="gutter-xs">
                <!-- Department -->
                <InputLabel
                    v-model="data.department"
                    :label="$t('Department')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Name -->
                <InputLabel
                    v-model="data.name"
                    :label="$t('Name')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Position -->
                <InputLabel
                    v-model="data.position"
                    :label="$t('Position')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Email -->
                <InputLabel
                    v-model="data.email"
                    :label="$t('Email')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Phone -->
                <InputLabel
                    v-model="data.phone"
                    :label="$t('Phone')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />

                <!-- Phone extension -->
                <InputLabel
                    v-model="data.phone_extension"
                    :label="$t('Phone extension')"
                    :mode="schema.contactInformation.mode"
                    outline
                    dense />
            </div>
        </div>

        <Title
            title-type="h2"
            :title="$t('Material details')"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <!-- Material details (Grid) -->
        <RequestForQuotationGrid
            :data="data.requisition_supplies"
            :errors="errors"
            :mode="schema.materialDetails.mode"
            :useRequestForQuotation="useRequestForQuotation" />

        <!-- Terms and conditions -->
        <div class="row cols-2">
            <div class="gutter-xs">
                <!-- Title and actions -->
                <Title
                    :title="$t('Terms and conditions')"
                    titleType="h2"
                    class="font-semibold"
                    :has-border-bottom-line="false">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!slideVariables.termsConditions && schema.termsConditions.mode == 'edit'"
                            @click="slideVariables.termsConditions = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="slideVariables.termsConditions && schema.termsConditions.mode == 'edit'"
                            @click="slideVariables.termsConditions = false; data.terms_conditions = ''"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Textarea form -->
                <AnimatedTextArea
                    class="w-full"
                    v-model="data.terms_conditions"
                    :placeholder="$t('Terms and conditions')"
                    :default-message="$t('No terms and conditions given')"
                    :open="slideVariables.termsConditions"
                    :mode="schema.termsConditions.mode"
                    :errors="errors && errors['terms_conditions']" />
            </div>
        </div>

        <!-- Evaluation criteria -->
        <div class="row cols-2">
            <div class="gutter-xs">
                <!-- Title and actions -->
                <Title
                    :title="$t('Evaluation criteria')"
                    titleType="h2"
                    class="font-semibold !pt-0"
                    :has-border-bottom-line="false">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!slideVariables.evaluationCriteria && schema.evaluationCriteria.mode == 'edit'"
                            @click="slideVariables.evaluationCriteria = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="slideVariables.evaluationCriteria && schema.evaluationCriteria.mode == 'edit'"
                            @click="slideVariables.evaluationCriteria = false; data.evaluation_criteria = ''"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Textarea form -->
                <AnimatedTextArea
                    class="w-full"
                    v-model="data.evaluation_criteria"
                    :default-message="$t('No evaluation criteria given')"
                    :placeholder="$t('Evaluation criteria')"
                    :open="slideVariables.evaluationCriteria"
                    :mode="schema.evaluationCriteria.mode"
                    :errors="errors && errors['evaluation_criteria']" />
            </div>
        </div>

        <!-- Delivery information -->
        <div
            v-if="schema.deliveryInformation.mode != 'hidden'"
            class="row cols-2" >
            <div class="gutter-xs">
                <!-- Title and actions -->
                <Title
                    :title="$t('Delivery information')"
                    titleType="h2"
                    class="font-semibold !mt-0 !pt-0"
                    :has-border-bottom-line="false">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!slideVariables.deliveryInformation && schema.deliveryInformation.mode == 'edit'"
                            @click="slideVariables.deliveryInformation = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="slideVariables.deliveryInformation && schema.deliveryInformation.mode == 'edit'"
                            @click="slideVariables.deliveryInformation = false; data.delivery_information = {}"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Delivery information -->
                <DeliveryInformation
                    :open="slideVariables.deliveryInformation"
                    v-model="data.delivery_information"
                    :mode="schema.deliveryInformation.mode"
                    :permissions="permissions" />
            </div>
        </div>

        <!-- Submission details -->
        <div class="row cols-2 mb-2">
            <div class="gutter-xs">
                <Title
                    :title="$t('Submission details')"
                    title-type="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold !pt-0" />

                <div class="py-2 print-reset-py">
                    {{ $t('Information on how and where the suppliers should submit their quotations, including the deadline for submission.') }}
                </div>

                <!-- Name -->
                <InputLabel
                    v-model="data.submit_name"
                    :label="$t('Submit to')"
                    :mode="schema.submissionDetails.mode"
                    outline
                    dense
                    :error="errors?.submit_name" />

                <!-- Email -->
                <InputLabel
                    v-model="data.submit_email"
                    type="email"
                    :label="$t('Email')"
                    :mode="schema.submissionDetails.mode"
                    outline
                    dense
                    :error="errors?.submit_email" />

                <!-- Date -->
                <InputLabel
                    v-model="data.submit_date"
                    :label="$t('Deadline for submission')"
                    :mode="schema.submissionDetails.mode"
                    outline
                    dense
                    :error="errors?.submit_date">
                    <template #form-field>
                        <Label v-if="schema.submissionDetails.mode === 'readonly'">
                            {{ data.submit_date }}
                        </Label>

                        <DatePicker
                            v-if="schema.submissionDetails.mode === 'edit'"
                            v-model="data.submit_date"
                            :placeholder="$t('Deadline for submission')"
                            size="sm"
                            outline
                            dense
                            container-class="none"
                            :errors="errors?.submit_date ? [] : null" />
                    </template>
                </InputLabel>
            </div>
        </div>

        <Title
            :title="schema.materialDetails.mode === 'edit' ? $t('Vendors') : $t('Vendor')"
            title-type="h2"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <!-- Vendors -->
        <VendorsGrid
            :data="data.vendors"
            :errors="errors"
            :mode="schema.materialDetails.mode" />
    </section>
</template>

<style>
td.last {
    width: 1px;
    white-space: nowrap;
}
</style>
