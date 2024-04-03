<script setup>
import { Title } from 'layout'
import { InputLabel, AnimatedTextArea, DatePicker } from 'form'
import MaterialsRequestGrid from './MaterialsRequestGrid.vue'
import DeliveryInformation from '../../components/DeliveryInformation.vue'
import ApprovalStatus from '../../components/ApprovalStatus.vue'
import Requester from '../../components/Requester.vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { showUuid, formatDate } from 'shared'

const { t } = useI18n()

const props = defineProps({
    useMaterialRequest: Object
})

const slideVariables = ref({
    deliveryInformation: false,
    note: false
})

const { data, errors, schema, permissions } = props.useMaterialRequest

const requestNumberID = computed(() => {
    return showUuid(data.value.id)
})
</script>

<template>
    <section
        :id="useMaterialRequest.schema.value.role === 'creator' ? 'DNPrintableArea' : 'MRPrintableArea'"
        class="paper">
        <Title
            :title="`${$t(schema.document.title) } ${ data?.id ? `#${showUuid(data?.id)}` : ''}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <!-- Request Number -->
        <div class="row cols-2"
            v-if="schema.requestNumber.mode === 'readonly'">
            <InputLabel
                v-model="requestNumberID"
                :label="$t('Request number')"
                mode="readonly"
                outline
                dense />
        </div>

        <Title
            v-if="schema.status.mode !== 'hidden'"
            :title="$t('Status')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Status -->
        <div class="row cols-2"
            v-if="schema.status.mode !== 'hidden'">
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

        <!-- Requester title -->
        <Title
            :title="$t('Requester')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Requester -->
        <Requester
            v-if="data.requester"
            :data="data"
            :permissions="permissions">
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
                                v-if="schema.role ==='creator'"
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

        <!-- Material details title -->
        <Title
            :title="$t('Material details')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <!-- Material details grid -->
        <MaterialsRequestGrid
            :schema="schema"
            :data="data.requisition_supplies"
            :errors="errors"
            :mode="schema.materialDetails.mode" />

        <!-- Note -->
        <div class="row cols-2">
            <div>
                <!-- Title and actions -->
                <Title
                    :title="$t('Note')"
                    titleType="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold">
                    <template #leftTitleAddon="{ }">
                        <button
                            v-if="!slideVariables.note && schema.note.mode == 'edit'"
                            @click="slideVariables.note = true"
                            class="link primary text-sm font-normal">
                            {{ t('Add') }}
                        </button>

                        <button
                            v-if="slideVariables.note && schema.note.mode == 'edit'"
                            @click="slideVariables.note = false; data.note = ''"
                            class="link !text-red-500 text-sm font-normal">
                            {{ t('Remove') }}
                        </button>
                    </template>
                </Title>

                <!-- Textarea form for note -->
                <AnimatedTextArea
                    v-model="data.note"
                    :default-message="$t('The requester did not provide any notes')"
                    :open="slideVariables.note"
                    :mode="schema.note.mode" />
            </div>
        </div>

        <!-- Delivery information -->
        <div
            class="row cols-2"
            v-if="schema.deliveryInformation.mode != 'hidden'">
            <div>
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
                        @click="slideVariables.deliveryInformation = false; data.deliveryInformation = {}"
                        class="link !text-red-500 text-sm font-normal">
                        {{ t('Remove') }}
                    </button>
                </template>
            </Title>

            <DeliveryInformation
                :open="slideVariables.deliveryInformation"
                v-model="data.deliveryInformation"
                :mode="schema.deliveryInformation.mode"
                :permissions="permissions" />
            </div>
        </div>

        <Title
            v-if="schema.managerApproval.mode != 'hidden' && data.approvals"
            :title="$t('Approval status')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <div class="row cols-2"
            v-if="schema.managerApproval.mode != 'hidden' && data.approvals">
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
