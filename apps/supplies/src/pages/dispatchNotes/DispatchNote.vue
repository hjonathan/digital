<script setup>
import { Title } from 'layout'
import { InputLabel, AnimatedTextArea } from 'form'
import MaterialsRequestGrid from '../materialRequests/MaterialsRequestGrid.vue'
import DeliveryInformation from '../../components/DeliveryInformation.vue'
import ApprovalStatus from '../../components/ApprovalStatus.vue'
import Requester from '../../components/Requester.vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'

const { t } = useI18n()

const props = defineProps({
    useDispatchNote: Object
})

const slideVariables = ref({
    deliveryInformation: false,
    note: false
})

const { data, errors, schema, permissions } = props.useDispatchNote

const requestNumberID = computed(() => {
    return showUuid(data.value.idRequest)
})
</script>

<template>
    <section
        :id="'DNPrintableArea'"
        class="paper">
        <Title
            :title="`${$t(schema.document.title) } ${ data?.id ? `#${showUuid(data?.id)}` : ''}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0 mb-3" />

        <!-- Request Number -->
        <div class="row cols-2 mb-2"
            v-if="schema.requestNumber.mode === 'readonly'">
            <div class="gutter-xs">
                <InputLabel
                    v-model="requestNumberID"
                    :label="$t('Request number')"
                    mode="readonly"
                    outline
                    dense />

                <InputLabel
                    v-if="data.supply_order_status?.name && schema.status.mode !== 'hidden'"
                    v-model="data.supply_order_status.name"
                    :label="$t('Status')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Reason -->
                <!-- TODO: verify reason -->
                <InputLabel
                    v-if="data.supply_order_status?.name === 'rejected' && schema.status.mode !== 'hidden'"
                    v-model="data.note"
                    :label="$t('Reason')"
                    mode="readonly"
                    outline
                    dense />
            </div>
        </div>

        <Title
            v-if="data.requester"
            :title="$t('Requester')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Requester -->
        <Requester
            v-if="data.requester"
            :data="data"
            :permissions="permissions"
            class="mb-2">
            <template v-slot:requested-date>
                <!-- Date -->
                <InputLabel
                    v-model="data.requester.requester_date"
                    :label="$t('Requested date')"
                    :mode="'readonly'"
                    outline
                    dense>
                </InputLabel>
            </template>
        </Requester>

        <Title
            :title="$t('Material details')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <MaterialsRequestGrid
            :data="data.requisition_supplies"
            :errors="errors"
            :schema="schema"
            :editable="false"
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
                        @click="slideVariables.note = false"
                        class="link !text-red-500 text-sm font-normal">
                        {{ t('Remove') }}
                    </button>
                </template>
            </Title>

            <!-- Textarea form for note -->
            <AnimatedTextArea
                v-model="data.note"
                :default-message="$t('No note provided')"
                :open="slideVariables.note"
                :mode="schema.note.mode" />
            </div>
        </div>

        <!-- Delivery information -->
        <div class="row cols-2"
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
                            @click="slideVariables.deliveryInformation = false"
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
