<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import AlertModal from '../../components/alertModal/AlertModal.vue'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { configButtons } from './configButtons'
import MaterialAssign from './MaterialAssign.vue'
import { useMaterialAssign as useComposable } from './useMaterialAssign'
import { inject, onMounted, ref } from 'vue'
import moment from 'moment-timezone'
import { configSchema } from './configSchema'
import { Overlay, ConfirmationModal } from 'layout'
import { ToggleSwitch } from 'form'

const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')

const useAlertModal = useComposableModal({})
const useMaterialAssign = useComposable({ useGlobalStore, create: true, configSchema })

const { data, configModal } = useMaterialAssign

const buttons = configButtons({ useAlertModal, useMaterialAssign, useGlobalStore, configModal })

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
</script>

<template>
    <Overlay
        v-if="overlay"
        class="z-50"/>

    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        :show-errors="false"
        class="z-50">
        <template
            v-if="!configModal.modelData.requireManagerApproval || coreStore.getPermissions().includes('supplies.adjustment.unrestricted_approval_amount')"
            #content>
            <section class="w-full p-0">
                <ToggleSwitch
                    v-model="configModal.modelData.create_dispatch"
                    name="lot"
                    :label="$t(`Dispatch material assignment now?`)" />
            </section>
        </template>
    </ConfirmationModal>

    <DocumentWrapper
        :buttons="buttons">
        <MaterialAssign
            :useMaterialAssign="useMaterialAssign" />
    </DocumentWrapper>

    <AlertModal
        :useAlertModal="useAlertModal" />
</template>
