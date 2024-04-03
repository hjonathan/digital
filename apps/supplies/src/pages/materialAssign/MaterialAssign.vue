<script setup>
import { Title } from 'layout'
import { InputLabel, AnimatedTextArea, AutoComplete, DatePicker, Label } from 'form'
import MaterialsAssignGrid from './MaterialsAssignGrid.vue'
import DeliveryInformation from '../../components/DeliveryInformation.vue'
import ApprovalStatus from '../../components/ApprovalStatus.vue'
import Requester from '../../components/Requester.vue'
import { ref, computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate, showUuid } from 'shared'
import moment from 'moment'

const { t } = useI18n()

const props = defineProps({
    useMaterialAssign: Object
})

const useGlobalStore = inject('useGlobalStore')
const parametersStore = useGlobalStore('parameters')
const suppliesStore = useGlobalStore('supplies')

const minDate = ref(moment().startOf('month').toDate())

const slideVariables = ref({
    deliveryInformation: false,
    note: false
})

const { data, errors, schema, permissions } = props.useMaterialAssign

const requestNumberID = computed(() => {
    return showUuid(data.value.id)
})

const areas = computed(() => {
    const areas = parametersStore.getAutocompleteDataBySlug('areas')
        .map(area => {
            return {
                id: area.id,
                name: area.label
            }
        })

    return areas
})

const selectedArea = computed(() => {
    return areas.value.find(area => area.id === data.value.request_area_id)
})

suppliesStore.fetch()

</script>

<template>
    <section
        :id="useMaterialAssign.schema.value.role === 'creator' ? 'DNPrintableArea' : 'MRPrintableArea'"
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
        <div class="row cols-2 mb-1"
            v-if="schema.status.mode !== 'hidden'">
            <InputLabel
                v-if="data.supply_order_status?.name"
                v-model="data.supply_order_status.name"
                :label="$t('Status')"
                mode="readonly"
                outline
                dense />

            <!-- Reason -->
            <InputLabel
                v-if="data.supply_order_status?.name === 'rejected'"
                v-model="data.note"
                :label="$t('Reason')"
                mode="readonly"
                outline
                dense />
        </div>

        <Title
            :title="$t('Manager')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <Requester
            v-if="data.requester"
            :data="data"
            :permissions="permissions"
            class="mb-1">
            <template v-slot:requested-date>
                <!-- Date -->
                <InputLabel
                    v-model="data.register_date"
                    :label="$t('Register date')"
                    :mode="permissions.includes('supplies.global.custom_date')? 'edit' : 'readonly'"
                    outline
                    dense>
                    <template v-slot:form-field>
                        <DatePicker
                            v-if="permissions.includes('supplies.global.custom_date') && !data.id"
                            v-model="data.register_date"
                            :placeholder="$t('Requested date')"
                            size="sm"
                            outline
                            container-class="none"
                            :minDate="null"/>

                        <Label
                            v-if="!permissions.includes('supplies.global.custom_date') || data.id">
                            {{ formatDate(data.register_date) }}
                        </Label>
                    </template>
                </InputLabel>
            </template>
        </Requester>

        <Title
            :title="$t('Assigned area')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Receiving area -->
        <div class="row cols-2 mb-1">
            <div v-if="schema.materialDetails.mode === 'readonly'">
                {{ selectedArea?.name }}
            </div>

            <AutoComplete
                v-if="schema.materialDetails.mode === 'edit'"
                v-model="data.area"
                :readonly="schema.materialDetails.mode === 'readonly'"
                :placeholder="$t('Assigned area')"
                :options="areas"
                :forceSelection="false"
                :errors="errors?.request_area_id ? errors.request_area_id[0] : null"
                container-class="none"
                outline  />
        </div>

        <!-- Material details -->

        <Title
            :title="$t('Material details')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <MaterialsAssignGrid
            :schema="schema"
            :useMaterialAssign="useMaterialAssign"
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
                    class="font-semibold !pt-0">
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
                    :default-message="$t('No note provided')"
                    :open="slideVariables.note"
                    :mode="schema.note.mode"
                    :errors="errors && errors.note" />
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
                    class="font-semibold !pt-0">
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
                    :permissions="permissions"
                    :minDate="minDate"
                    :errors="errors" />
            </div>
        </div>

        <Title
            v-if="schema.managerApproval.mode != 'hidden' && data.approvals"
            :title="$t('Approval status')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold !pt-0" />

        <div
            class="row cols-2"
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
