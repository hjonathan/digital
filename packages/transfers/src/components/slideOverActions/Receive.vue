<script setup>
import { TextArea } from 'form'
import { Alert } from 'layout'
import { ref } from 'vue'
import { api } from '@/config'

const props = defineProps({
    transferId: {
        type: String,
        default: null
    }
})

const receiveTransfer = ref({})
const errors = ref({})

const save = async () => {
    const response = await api.post('/transfers/transfer_receive', {
        id: props.transferId,
        receive_reason: receiveTransfer.value.receive_reason
    })

    return response
}

defineExpose({ save })
</script>

<template>
    <section class="full">
        <!-- Note -->
        <TextArea
            v-model="receiveTransfer.receive_reason"
            :errors="errors?.receive_reason"
            :placeholder="$t('Note')"
            :label="$t('Note')" />

        <!-- General messages -->
        <Alert
            type="success"
            :hasCloseButton="false"
            :content="$t('Agree to take custody of this shipment as indicated.')" />
    </section>
</template>
