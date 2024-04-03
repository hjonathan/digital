import { computed, ref } from 'vue'
import { round } from 'shared'

export const useAdditionalCosts = () => {
    const isRecovered = ref(false)

    const additionalCosts = ref({
        taxes: 0,
        handling: 0,
        shipping_cost: 0,
        estimated_shipping: 0,
        insurance_cost: 0
    })

    const schemaCosts = ref({
        taxes: {
            mode: 'readonly'
        },
        handling: {
            mode: 'readonly'
        },
        shippingCost: {
            mode: 'readonly'
        },
        estimatedShipping: {
            mode: 'readonly'
        },
        insuranceCost: {
            mode: 'readonly'
        }
    })

    const setAdditionalCostsSchema = ({ id, taxes, handling, shipping_cost, estimated_shipping, insurance_cost }) => {
        schemaCosts.value = {
            taxes: {
                mode: !id && !taxes ? 'edit' : 'readonly'
            },
            handling: {
                mode: !id && !handling ? 'edit' : 'readonly'
            },
            shippingCost: {
                mode: !id && !shipping_cost ? 'edit' : 'readonly'
            },
            estimatedShipping: {
                mode: !id && !estimated_shipping ? 'edit' : 'readonly'
            },
            insuranceCost: {
                mode: !id && !insurance_cost ? 'edit' : 'readonly'
            }
        }

        if (taxes) {
            schemaCosts.value.taxes.mode = 'readonly'

            additionalCosts.value.taxes = taxes
        }

        if (handling) {
            schemaCosts.value.handling.mode = 'readonly'

            additionalCosts.value.handling = handling
        }

        if (shipping_cost) {
            schemaCosts.value.shippingCost.mode = 'readonly'

            additionalCosts.value.shipping_cost = shipping_cost
        }

        if (estimated_shipping) {
            if (!shipping_cost) isRecovered.value = true

            schemaCosts.value.estimatedShipping.mode = 'readonly'

            additionalCosts.value.estimated_shipping = estimated_shipping
        }

        if (insurance_cost) {
            schemaCosts.value.insuranceCost.mode = 'readonly'

            additionalCosts.value.insurance_cost = insurance_cost
        }
    }

    const totalAdditionalCosts = computed(() => {
        let total = 0

        additionalCosts.value.taxes && (total += additionalCosts.value.taxes)

        additionalCosts.value.handling && (total += additionalCosts.value.handling)

        additionalCosts.value.shipping_cost && (total += additionalCosts.value.shipping_cost)

        additionalCosts.value.estimated_shipping && (total += additionalCosts.value.estimated_shipping)

        additionalCosts.value.insurance_cost && (total += additionalCosts.value.insurance_cost)

        return round(total)
    })

    return {
        additionalCosts,
        schemaCosts,
        totalAdditionalCosts,
        isRecovered,
        setAdditionalCostsSchema
    }
}
