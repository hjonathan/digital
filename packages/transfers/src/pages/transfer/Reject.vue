<script setup>
import { TextArea, ToggleSwitch } from 'form'
import { Alert } from 'layout'
import { ref } from 'vue'
import { api } from '@/config'

const props = defineProps({
    transferId: {
        type: String,
        default: null
    }
})

const rejectTransfer = ref({
    cancel: false,
    reject_reason: ''
})

const errors = ref({})

const save = async () => {
    const response = await api.post('/transfers/transfer_reject', {
        id: props.transferId,
        cancel: rejectTransfer.value.cancel,
        reject_reason: rejectTransfer.value.reject_reason
    })

    return response
}

defineExpose({ save, rejectTransfer })
</script>

<template>

    <!-- Toggle switch for batch lock (if applicable). -->
    <ToggleSwitch
        v-model="rejectTransfer.cancel"
        :errors="errors?.cancel"
        name="batch_toggle"
        :label="$t('Reject transfer')"
        :tag="$t('Reject transfer')" />

    <!-- Note. -->
    <TextArea
        v-model="rejectTransfer.reject_reason"
        :errors="errors?.reject_reason"
        :placeholder="$t('Note')"
        :label="$t('Note')" />

    <div class="flex flex-col mt-10 gap-10">
        <!-- General messages -->
        <Alert
            type="danger"
            :hasCloseButton="false"
            :content="$t('Are you sure you want to reject the transfer?')" />

        <Alert
            type="danger"
            :hasCloseButton="false"
            :content="$t('All products in the transfer will be rejected.')" />
    </div>
</template>
