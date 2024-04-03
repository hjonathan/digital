<script setup>
import { TextArea } from 'form'
import { Alert } from 'layout'
import { inject, ref } from 'vue'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const useGlobalStore = inject('useGlobalStore')
const transfersStore = useGlobalStore('transfers')
const inventoryStore = useGlobalStore('inventory')
const tabsStore = useGlobalStore('tabs')

const note = ref()
const errors = ref({})

const syncStores = () => {
    transfersStore.fetch()

    inventoryStore.fetch()
}

const save = async () => {
    const apiData = props.useSlideOver?.data?.value

    apiData.note = note.value

    const response = await api.post('/transfers/transfer_item_found', apiData)

    if (!response.success || response.errors) {
        errors.value = {
            isOpen: true,
            type: 'danger',
            message: t(response.message)
        }
    }

    syncStores()

    tabsStore.closeTab('CreateAssignment')

    return response
}

defineExpose({ save })
</script>

<template>
    <section class="full">
        <!-- Note -->
        <TextArea
            v-model="note"
            :errors="errors?.addignment_reason"
            :placeholder="$t('Note')"
            :label="$t('Note')" />
            <!-- General messages -->
        <Alert
            type="success"
            :hasCloseButton="false"
            :content="$t('Confirm that the items and quantities are correct to make the assignment.')" />
    </section>
</template>
