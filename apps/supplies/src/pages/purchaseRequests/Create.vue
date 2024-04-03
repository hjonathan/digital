<script setup>
import { usePurchaseRequest as useComposable } from './usePurchaseRequest'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import PurchaseRequest from './PurchaseRequest.vue'
import { inject, ref } from 'vue'
import { configButtons } from './configButtons'
import { configSchema } from './configSchema'
import moment from 'moment-timezone'
import { ConfirmationModal } from 'layout'

const usePurchaseRequest = useComposable({ configSchema })
const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')

const { data } = usePurchaseRequest

data.value = {
    ...data.value,
    ...coreStore.credentials?.user,
    requester: {
        approval_name: coreStore.credentials?.user?.name,
        approval_position: coreStore.credentials?.user?.position,
        approval_email: coreStore.credentials?.user?.email,
        approval_phone: coreStore.credentials?.user?.phone,
        approval_department: coreStore.credentials?.user?.department,
        requester_date: moment(new Date()).format('DD/MM/YYYY')
    }
}

delete data.value.id

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const buttons = configButtons({ useGlobalStore, usePurchaseRequest, configModal })
</script>

<template>
    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        :show-errors="false"
        class="z-50" />

    <DocumentWrapper
        :buttons="buttons">
        <PurchaseRequest
            :usePurchaseRequest="usePurchaseRequest" />
    </DocumentWrapper>
</template>
