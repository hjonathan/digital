<script setup>
import { inject, onMounted, ref } from 'vue'
import Transfer from '../transfer/Transfer.vue'
import { api } from '@/config'

const router = inject('router')

const transferId = router.currentRoute.value.params.id

const transfer = ref()

onMounted(async () => {
    const response = await api.get(`/transfers/transfer_drafts/${transferId}`)

    if (response.success) {
        transfer.value = response.data
    }
})
</script>

<template>
    <Transfer
        v-if="transfer"
        mode="edit"
        :transfer="transfer"/>
</template>
