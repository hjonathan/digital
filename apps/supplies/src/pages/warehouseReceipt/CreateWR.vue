<script setup>
import { inject, onMounted, ref } from 'vue'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { configButtons } from './configButtons'
import moment from 'moment-timezone'
import { useWarehouseReceipt as useComposable } from './useWarehouseReceipt'
import WarehouseReceipt from './WarehouseReceipt.vue'
import { ConfirmationModal } from 'layout'

const router = inject('router')

const useGlobalStore = inject('useGlobalStore')
const invoiceStore = useGlobalStore('invoice')

const useWarehouseReceipt = useComposable()

onMounted(async () => {

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

</script>
<template>
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
