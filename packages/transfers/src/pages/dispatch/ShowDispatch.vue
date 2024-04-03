<script setup>
import { inject, onMounted, ref } from 'vue'
import DispatchView from './DispatchView.vue'
import { api } from '@/config'

const router = inject('router')

const dispatchId = router.currentRoute.value.params.id

const dispatch = ref()

onMounted(async () => {
    const response = await api.get(`/dispatch-transfers/${dispatchId}`)

    if (response.success) dispatch.value = response.data[0]
})
</script>

<template>
    <DispatchView
        v-if="dispatch"
        mode="edit"
        :dispatch="dispatch" />
</template>
