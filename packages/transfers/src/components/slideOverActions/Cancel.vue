<script setup>
import { TextArea } from 'form'
import { Alert } from 'layout'
import { ref } from 'vue'
import { api } from '@/config'
const props = defineProps({
    transferId: {
        type: String,
        default: null
    },
    useSlideOver: {
        type: Object,
        default: null
    }
})

const cancelTransfer = ref({
    reason: ''
})

const errors = ref({})

const save = async () => {
    const response = await api.post('/transfers/transfer_cancel', {
        id: props.transferId,
        cancel: true,
        reason: cancelTransfer.value.reason
    })

    return response
}
defineExpose({ save, cancelTransfer })
</script>

<template>
    <section class="full">
        <!-- Note -->
        <TextArea
            v-model="cancelTransfer.reason"
            :errors="errors?.reason"
            :placeholder="$t('Note')"
            :label="$t('Note')" />

        <!-- General messages -->
        <Alert
            type="danger"
            :hasCloseButton="false"
            :content="$t('Are you sure you want to cancel this transfer?')" />
    </section>
</template>
