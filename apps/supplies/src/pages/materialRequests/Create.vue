<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { configButtons } from './configButtons'
import MaterialRequest from './MaterialRequest.vue'
import { useMaterialRequest as useComposable } from './useMaterialRequest'
import { inject, onMounted, ref } from 'vue'
import moment from 'moment-timezone'
import { configSchema } from './configSchema'
import { Overlay, ConfirmationModal } from 'layout'

const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')

const useMaterialRequest = useComposable({ useGlobalStore, create: true, configSchema })

const { data } = useMaterialRequest

onMounted(() => {
    data.value = {
        ...data.value,
        requester: {
            approval_name: coreStore.credentials?.user?.name,
            approval_position: coreStore.credentials?.user?.position,
            approval_email: coreStore.credentials?.user?.email,
            approval_phone: coreStore.credentials?.user?.phone,
            approval_department: coreStore.credentials?.user?.department,
            requester_date: moment(new Date()).format('DD/MM/YYYY')
        }
    }

    if (coreStore.credentials) {
        overlay.value = false
    }
})

const overlay = ref(true)

const configModal = ref({
    title: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const buttons = configButtons({ useMaterialRequest, useGlobalStore, configModal })
</script>

<template>
    <ConfirmationModal
        :title="configModal.title"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        :show-errors="false"
        class="z-50" />

    <Overlay
        v-if="overlay"
        class="z-50" />

    <DocumentWrapper
        :buttons="buttons">
        <MaterialRequest
            :useMaterialRequest="useMaterialRequest" />
    </DocumentWrapper>
</template>
