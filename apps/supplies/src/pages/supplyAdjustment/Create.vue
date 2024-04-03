<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import AlertModal from '../../components/alertModal/AlertModal.vue'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { configButtons } from './configButtons'
import SupplyAdjustment from './SupplyAdjustment.vue'
import { useSupplyAdjustment as useComposable } from './useSupplyAdjustment'
import { computed, inject, onMounted, ref } from 'vue'
import moment from 'moment-timezone'
import { configSchema } from './configSchema'
import { Overlay, ConfirmationModal } from 'layout'
import { ToggleSwitch } from 'form'

const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')
const suppliesStore = useGlobalStore('supplies')
const suppliesCostStore = useGlobalStore('suppliesCost')

const useAlertModal = useComposableModal({})
const useSupplyAdjustment = useComposable({ useGlobalStore, create: true, configSchema })
const router = inject('router')

const supplyId = router.currentRoute.value?.params.id

const { data, configModal } = useSupplyAdjustment

const buttons = configButtons({ useAlertModal, useSupplyAdjustment, useGlobalStore, configModal })

onMounted(async () => {
    const response = await suppliesCostStore.fetchById(supplyId)

    data.value = {
        supply: computed(() => {
            return suppliesStore.getItemById(router.currentRoute.value.params.id)
        }),
        ...data.value,
        adjust_supplies: response.map(supply => ({
            ...supply,
            original_cost: supply.cost,
            original_quantity: supply.quantity,
            supply_action: ''
        })),
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
        class="z-50" />

    <DocumentWrapper
        :buttons="buttons">
        <SupplyAdjustment
            :useSupplyAdjustment="useSupplyAdjustment" />
    </DocumentWrapper>

    <AlertModal
        :useAlertModal="useAlertModal" />
</template>
