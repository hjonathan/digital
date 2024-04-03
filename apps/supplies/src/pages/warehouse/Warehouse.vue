<script setup>
import { Title } from 'layout'
import ReceiverInformation from '../../components/ReceiverInformation.vue'
import SalesOrder from './SalesOrder.vue'
import AdditionalCosts from '../../components/AdditionalCosts.vue'
import { showUuid } from 'shared'
import ZeroStockGrid from './ZeroStockGrid.vue'

const props = defineProps({
    useWarehouse: Object,
    useAdditionalCosts: Object
})

const { data, schema, errors, permissions, subTotal, total } = props.useWarehouse

const { additionalCosts, schemaCosts, isRecovered } = props.useAdditionalCosts
</script>

<template>
    <section
        id="WHPrintableArea"
        class="paper">
        <Title
            :title="`${$t('Warehouse receipt')} ${ data?.id ? `#${showUuid(data?.id)}` : ''} `"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold" />

        <!-- Receiver information section -->
        <section>
            <Title
                :title="$t('Receiver information')"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="font-semibold" />

            <ReceiverInformation
                :schema="schema"
                v-model="data.receiver"
                :permissions="permissions" />
        </section>

        <!-- Invoice section -->
        <section>
            <Title
                :title="data.order_supplies?.invoiceNumber? $t(`Invoice information`) : $t(`Items`)"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="font-semibold" />

            <!-- List -->
            <SalesOrder
                v-if="data.order_supplies"
                v-model:salesOrderNumber="data.sales_order_number"
                v-model="data.order_supplies"
                :data="data"
                :mode="schema.sales_order.mode"
                :useWarehouse="useWarehouse"
                :useAdditionalCosts="useAdditionalCosts"
                @resetErrors="() => { errors = {} }"
                :errors="errors" />
        </section>

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
