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
const reject = ref({
    cancel: false,
    reject_reason: ''
}
)
const errors = ref({})

const save = async ({ setButtonToLoading }) => {
    setButtonToLoading && setButtonToLoading(true)

    const response = await api.post('/transfers/transfer_adjustment_rejected', {
        id: props.transferId,
        note: reject.value.note
    })

    setButtonToLoading && setButtonToLoading(false)

    return response
}

defineExpose({ save, reject })

</script>

<template>
    <section class="full">
        <TextArea
            v-model="reject.note"
            :errors="errors?.note"
            :placeholder="$t('Note')"
            :label="$t('Note')" />

            <!-- General messages -->
        <Alert
            type="danger"
            :hasCloseButton="false"
            :content="$t('Are you sure you want to reject the adjustment?')" />
    </section>
</template>
