<script setup>
import { inject, onMounted, ref } from 'vue'
import Invoice from '../components/Invoice.vue'

const router = inject('router')
const useGlobalStore = inject('useGlobalStore')
const invoicingStore = useGlobalStore('invoicing')

const invoiceId = router.currentRoute.value.params.id
const element = ref()

const getInvoiceData = async () => {
    const response = await invoicingStore.fetchInvoiceDraftById(invoiceId)

    response.success && (element.value = response.data)
}

onMounted(async () => {
    getInvoiceData()
})

</script>

<template>
    <Invoice
        v-if="element"
        :invoice="element"
        mode="edit"/>
</template>
