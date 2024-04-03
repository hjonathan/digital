<script setup>
import { Title } from 'layout'
import { InputLabel, TextArea, Label } from 'form'
import SupplyAdjustmentGrid from './SupplyAdjustmentGrid.vue'
import ApprovalStatus from '../../components/ApprovalStatus.vue'
import Requester from '../../components/Requester.vue'
import { showUuid } from 'shared'
import { computed } from 'vue'

const props = defineProps({
    useSupplyAdjustment: Object
})

const { data, errors, schema, permissions } = props.useSupplyAdjustment

const processedId = computed(() => {
    return data.value.supply?.id ? showUuid(data.value.supply?.id) : ''
})
</script>

<template>
    <section
        :id="useSupplyAdjustment.schema.value.role === 'creator' ? 'DNPrintableArea' : 'MRPrintableArea'"
        class="paper">
        <Title
            :title="`${$t(schema.document.title) } ${ data?.id ? `#${showUuid(data?.id)}` : ''}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <Title
            v-if="schema.status.mode !== 'hidden'"
            :title="$t('Status')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Status -->
        <div 
            v-if="schema.status.mode !== 'hidden'"
            class="row cols-2 mb-2">
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

        <Title
            :title="$t('Supply to adjust')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Supply to adjust -->
        <div
            v-if="data.supply"
            class="row cols-2 mb-2">
            <div class="gutter-xs">
                <InputLabel
                    v-model="processedId"
                    :label="$t('ID')"
                    mode="readonly"
                    outline
                    dense />

                <InputLabel
                    v-model="data.supply.name"
                    :label="$t('Supply')"
                    mode="readonly"
                    outline
                    dense />

                <InputLabel
                    v-if="data.supply.category"
                    v-model="data.supply.category.name"
                    :label="$t('Category')"
                    mode="readonly"
                    outline
                    dense />

                <InputLabel
                    v-model="data.supply.quantity"
                    :label="$t('Available quantity')"
                    mode="readonly"
                    outline
                    dense />

                <InputLabel
                    v-if="data.supply.measure"
                    v-model="data.supply.measure.name"
                    :label="$t('Units of measure')"
                    mode="readonly"
                    outline
                    dense />

                <InputLabel
                    v-if="data.supply.location"
                    v-model="data.supply.location.name"
                    :label="$t('Location')"
                    mode="readonly"
                    outline
                    dense />
            </div>
        </div>

        <!-- Title -->
        <Title
            :title="$t('Manager')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Requester -->
        <Requester
            v-if="data.requester"
            :data="data"
            :permissions="permissions"
            class="my-2">
            <template v-slot:requested-date>
                <!-- Date -->
                <InputLabel
                    v-model="data.register_date"
                    :label="$t('Register date')"
                    mode="readonly"
                    outline
                    dense />
            </template>
        </Requester>

        <!-- Material details -->
        <Title
            :title="$t('Supply transactions')"
            titleType="h2"
            :has-border-bottom-line="false"
            class="font-semibold" />

        <!-- Supply adjustments grid -->
        <SupplyAdjustmentGrid
            :schema="schema"
            :data="data.adjust_supplies"
            :errors="errors"
            :mode="schema.materialDetails.mode"
            :useSupplyAdjustment="useSupplyAdjustment" />

        <!-- Note -->
        <div class="row cols-2">
            <div>
                <!-- Title and actions -->
                <Title
                    :title="$t('Adjustment reason')"
                    titleType="h2"
                    :has-border-bottom-line="false"
                    class="font-semibold" />

                <div>
                    <Label v-if="schema.materialDetails.mode === 'readonly'">
                        {{ data.adjustment_reason }}
                    </Label>
                </div>

                <TextArea
                    v-if="schema.materialDetails.mode === 'edit'"
                    v-model="data.adjustment_reason"
                    :placeholder="$t('Adjustment reason')"
                    :errors="errors && errors.adjustment_reason" />
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
