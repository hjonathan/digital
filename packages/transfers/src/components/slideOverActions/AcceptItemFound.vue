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
    const response = await api.post('/transfers/transfer_item_found_receive', {
        id: props.transferId,
        note: receiveTransfer.value.note
    })

    return response
}

defineExpose({ save })
</script>

<template>
    <section class="full">
        <!-- Note -->
        <TextArea
            v-model="receiveTransfer.note"
            :errors="errors?.note"
            :placeholder="$t('Note')"
            :label="$t('Note')" />

        <div class="flex flex-col mt-10 gap-10">
            <!-- General messages -->
            <Alert
                type="success"
                :hasCloseButton="false"
                :content="$t('Confirm that contents of this request')" />
        </div>
    </section>
</template>
