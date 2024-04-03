<script setup>
import { InputLabel } from 'form'
import { defineModel } from 'shared'
import { computed } from 'vue'

const props = defineProps({
    isRecovered: {
        type: Boolean,
        default: false
    },
    schema: {
        type: Object,
        default: () => ({})
    },
    subTotal: {
        type: Number,
        default: 0
    },
    taxes: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    estimatedShipping: {
        type: Number,
        default: 0
    },
    handling: {
        type: Number,
        default: 0
    },
    insuranceCost: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    errors: {
        type: Object,
        default: () => ({})
    }
})

const subTotalModel = defineModel('subTotal')
const taxesModel = defineModel('taxes')
const shippingCostModel = defineModel('shippingCost')
const estimatedShippingModel = defineModel('estimatedShipping')
const handlingModel = defineModel('handling')
const insuranceCostModel = defineModel('insuranceCost')

const totalModel = defineModel('total')

const shippingCostMode = computed(() => {
    let type = 'readonly'

    if (props.schema.shippingCost.mode === 'readonly' || (estimatedShippingModel.value > 0 && !props.isRecovered)) {
        type = 'readonly'
    }

    if (props.schema.shippingCost.mode === 'edit' && (estimatedShippingModel.value > 0 && !props.isRecovered)) {
        type = 'disabled'
    }

    if (props.schema.shippingCost.mode === 'edit' && (!estimatedShippingModel.value || props.isRecovered)) {
        type = 'edit'
    }

    return type
})

const estimatedShippingCostMode = computed(() => {
    let type = 'readonly'

    if (props.schema.estimatedShipping.mode === 'readonly' || shippingCostModel.value > 0) {
        type = 'readonly'
    }

    if (props.schema.estimatedShipping.mode === 'edit' && shippingCostModel.value > 0) {
        type = 'disabled'
    }

    if (props.schema.estimatedShipping.mode === 'edit' && !shippingCostModel.value) {
        type = 'edit'
    }

    return type
})
</script>

<template>
    <div class="gutter-xs">
        <!-- Subtotal -->
        <InputLabel
            v-model="subTotalModel"
            :label="$t('Subtotal')"
            mode="readonly"
            inputExtraLabelLeft="$"
            outline
            white-mode
            dense
            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
            label-class="text-sm print-text-base-md" />

        <!-- Taxes -->
        <InputLabel
            v-model="taxesModel"
            :label="$t('Taxes')"
            :mode="schema.taxes.mode"
            type="number"
            min="0"
            input-class="text-right !pr-5"
            inputLabelLeft="$"
            inputExtraLabelLeft="$"
            outline
            :error="errors?.taxes"
            white-mode
            dense
            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
            label-class="text-sm print-text-base-md" />

        <!-- Shipping -->
        <InputLabel
            v-model="shippingCostModel"
            :label="$t('Actual shipping')"
            :mode="shippingCostMode"
            type="number"
            min="0"
            input-class="text-right !pr-5"
            inputLabelLeft="$"
            inputExtraLabelLeft="$"
            outline
            :error="errors?.shipping_cost"
            white-mode
            dense
            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
            label-class="text-sm print-text-base-md"
            @update:model-value="() => !isRecovered && (estimatedShippingModel = 0)" />

        <!-- Estimated shipping -->
        <InputLabel
            v-model="estimatedShippingModel"
            :label="$t('Estimated shipping')"
            :mode="estimatedShippingCostMode"
            type="number"
            min="0"
            input-class="text-right !pr-5"
            inputLabelLeft="$"
            inputExtraLabelLeft="$"
            outline
            :error="errors?.estimated_shipping"
            white-mode
            dense
            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
            label-class="text-sm print-text-base-md"
            @update:model-value="shippingCostModel = 0"  />

        <!-- Handling -->
        <InputLabel
            v-model="handlingModel"
            :label="$t('Handling')"
            :mode="schema.handling.mode"
            type="number"
            min="0"
            input-class="text-right !pr-5"
            inputLabelLeft="$"
            inputExtraLabelLeft="$"
            outline
            :error="errors?.handling"
            white-mode
            dense
            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
            label-class="text-sm print-text-base-md" />

        <!-- Insurance cost -->
        <InputLabel
            v-model="insuranceCostModel"
            :label="$t('Insurance cost')"
            :mode="schema.insuranceCost.mode"
            type="number"
            min="0"
            input-class="text-right !pr-5"
            inputLabelLeft="$"
            inputExtraLabelLeft="$"
            outline
            :error="errors?.insurance_cost"
            white-mode
            dense
            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
            label-class="text-sm print-text-base-md" />

        <!-- Total -->
        <InputLabel
            v-model="totalModel"
            :label="$t('Total')"
            inputExtraLabelLeft="$"
            mode="readonly"
            outline
            white-mode
            dense
            input-label-class="text-sm print-text-base-md mr-5 reset-margin-right"
            label-class="text-sm print-text-base-md" />
    </div>
</template>
