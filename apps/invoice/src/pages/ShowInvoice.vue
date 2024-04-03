<script setup>
import { inject, onMounted, ref } from 'vue';
import ShowInvoice from '../components/ShowInvoice.vue'

const router = inject('router')
const useGlobalStore = inject('useGlobalStore')
const invoicingStore = useGlobalStore('invoicing')

const invoiceId = router.currentRoute.value.params.id
const element = ref()

const getInvoiceData = async () => {
    const response = await invoicingStore.fetchInvoiceById(invoiceId)

    response.success && (element.value = response.data)
}

onMounted(async () => {
    getInvoiceData()
})

</script>

<template>
    <ShowInvoice
        v-if="element"
        :invoice="element"
        mode="show"/>
</template>
