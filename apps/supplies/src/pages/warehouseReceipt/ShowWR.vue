<script setup>
import { inject, onMounted, ref } from 'vue'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { configButtons } from './configButtons'
import moment from 'moment-timezone'
import { useWarehouseReceipt as useComposable } from './useWarehouseReceipt'
import WarehouseReceipt from './WarehouseReceipt.vue'
import { ConfirmationModal, Overlay } from 'layout'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import { formatDate } from 'shared'

const { t } = useI18n()
const router = inject('router')

const useGlobalStore = inject('useGlobalStore')
const rapidStore = useGlobalStore('rapidStore')
const tabsStore = useGlobalStore('tabs')

const useWarehouseReceipt = useComposable()

const { data, isLoading } = useWarehouseReceipt

const id = router.currentRoute.value?.params?.id

onMounted(async () => {
    if (id) {
        isLoading.value = true

        const response = await api.get(`/supplies/warehouse_receipt_unknown_supply_show/${id}`)

        isLoading.value = false

        if (response.success) {
            formatData(response.data)
        }

        if (response.errors || !response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }
})

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const buttons = configButtons({ useWarehouseReceipt, useGlobalStore, configModal })

const formatData = (document) => {
    data.value = {
        ...data.value,
        ...document,
        receiver: {
            ...document.request_user,
            reception_date: formatDate(document.requested_date)
        },
        supplies: document.supply
    }
}

</script>
<template>
    <Overlay
        v-if="isLoading"
        class="z-50" />

    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        class="z-50" />
    <DocumentWrapper
        :buttons="buttons">
        <WarehouseReceipt
            :useWarehouseReceipt="useWarehouseReceipt" />
    </DocumentWrapper>
</template>
