<script setup>
import { Title } from 'layout'
import ReceiverInformation from '../../components/ReceiverInformation.vue'
import PurchaseOrder from './PurchaseOrder.vue'
import AdditionalCosts from '../../components/AdditionalCosts.vue'
import { showUuid } from 'shared'

const props = defineProps({
    useSalesOrder: Object,
    useAdditionalCosts: Object
})

const { data, schema, errors, permissions, subTotal, total } = props.useSalesOrder
const { additionalCosts, schemaCosts, isRecovered } = props.useAdditionalCosts
</script>

<template>
    <section
        id="SOPrintableArea"
        class="paper">
        <Title
            :title="`${$t('Sales order')} ${ data?.id ? `#${showUuid(data?.id)}` : ''} `"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold !pt-0" />

        <!-- Receiver information section -->
        <Title
            :title="$t('Receiver information')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <!-- Receiver information -->
        <ReceiverInformation
            :schema="schema"
            v-model="data.receiver"
            :permissions="permissions" />

        <!-- Purchase order information title -->
        <Title
            :title="$t('Purchase order information')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold !pt-0" />

        <!-- Purchase order section -->
        <PurchaseOrder
            v-if="data.order_supplies"
            v-model:salesOrderNumber="data.sales_order_number"
            v-model="data.order_supplies"
            :mode="schema.purchase_order.mode"
            :data="data"
            :useSalesOrder="useSalesOrder"
            :useAdditionalCosts="useAdditionalCosts"
            @resetErrors="() => { errors = {} }"
            :errors="errors" />

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
    </section>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
  opacity: 0 ;
}
</style>
