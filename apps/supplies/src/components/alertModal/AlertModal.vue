<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConfirmationModal } from 'layout'

const { t } = useI18n()

const props = defineProps({
    useAlertModal: Object
})

const templates = {
/*     submitDispatchNote: {
        title: t('Confirmation'),
        description: t('Are you sure to dispatch the request? With this action no more receives will be made.'),
        confirmButtonLabel: t('Yes, dispatch it'),
        confirm () {},
        note: false,
        confirmation: null
    }, */
    /*     submitDispatchNoteMR: {
        title: t('Confirmation'),
        description: t('Are you sure to dispach the request?'),
        confirmButtonLabel: t('Yes, dispatch'),
        confirm () {},
        note: false,
        confirmation: null
    }, */
    /*     approveDispatchNote: {
        title: t('Confirmation'),
        description: t('Are you sure to receive the materials? This action will end the receiving process.'),
        confirmButtonLabel: t('Yes, receive'),
        confirm () {},
        note: true,
        confirmation: null
    }, */
    /*     rejectDispatchNote: {
        title: t('Confirmation'),
        description: t('Are you sure to reject the materials?'),
        confirmButtonLabel: t('Yes, reject'),
        confirm () {},
        type: 'danger',
        note: true,
        confirmation: null
    }, */
    /*     submitMaterialRequest: {
        title: t('Submit material request?'),
        // description: t('Please confirm you want to proceed.'),
        confirmButtonLabel: t('Yes, submit it'),
        confirm () {},
        note: false,
        confirmation: null
    }, */
    /*     approveMaterialRequest: {
        title: t('Approve material request?'),
        // description: t('Are you sure to approve the material request?'),
        confirmButtonLabel: t('Yes, approve it'),
        confirm () {},
        note: true,
        confirmation: null
    }, */
    /*     rejectMaterialRequest: {
        title: t('Reject material request?'),
        // description: t('Include a note why you are rejecting the material request'),
        confirmButtonLabel: t('Yes, reject it'),
        confirm () {},
        note: true,
        type: 'danger',
        confirmation: null
    }, */
    /*     approvePurchaseRequest: {
        title: t('Confirmation'),
        description: t('Are you sure to approve the purchase request?'),
        confirmButtonLabel: t('Yes, approve'),
        confirm () {},
        note: true,
        confirmation: null
    }, */
    /*     rejectPurchaseRequest: {
        title: t('Confirmation'),
        description: t('Are you sure to reject the purchase request? The process will stop and you will not be able to continue with the request'),
        confirmButtonLabel: t('Yes, reject'),
        confirm () {},
        note: true,
        type: 'danger',
        confirmation: null
    }, */
    /*     sendPurchaseRequest: {
        title: t('Confirmation'),
        description: t('Are you sure to send the purchase request?'),
        confirmButtonLabel: t('Yes, submit'),
        confirm () {},
        note: false,
        confirmation: null
    }, */
    /*     sendInvoice: {
        title: t('Confirmation'),
        description: t('Are you sure to send the receive data?'),
        confirmButtonLabel: t('Send'),
        confirm () {},
        note: false,
        confirmation: null
    }, */
    /*     sendRequestForQuotation: {
        title: t('Confirmation'),
        description: t('Are you sure to submit the request for quotation?'),
        confirmButtonLabel: t('Yes, submit'),
        confirm () {},
        note: false,
        confirmation: null
    }, */
    /*     sendPurchaseOrder: {
        title: t('Confirmation'),
        description: t('Are you sure to send the purchase order?'),
        confirmButtonLabel: t('Yes, submit'),
        confirm () {},
        note: false,
        confirmation: null
    }, */
    /*     approvePurchaseOrder: {
        title: t('Confirmation'),
        description: t('Are you sure to approve the purchase order?'),
        confirmButtonLabel: t('Yes, approve'),
        confirm () {},
        note: true,
        confirmation: null
    }, */
    /*     rejectPurchaseOrder: {
        title: t('Confirmation'),
        description: t('Are you sure to reject the purchase order? The process will stop and you will not be able to continue with the request'),
        confirmButtonLabel: t('Yes, reject'),
        confirm () {},
        note: true,
        type: 'danger',
        confirmation: null
    }, */
    default: {
        title: t('Title'),
        description: t('Default description?'),
        confirmButtonLabel: t('Cancel'),
        confirm () {},
        confirmation: null
    }
    /*     submitSalesOrder: {
        title: t('Confirmation'),
        description: t('Are you sure to submit the sales order?'),
        confirmButtonLabel: t('Yes, submit'),
        confirm () {},
        confirmation: null
    }, */
    /*     submitWarehouseReceipt: {
        title: t('Confirmation'),
        description: t('Are you sure to submit the warehouse receipt?'),
        confirmButtonLabel: t('Submit'),
        confirm () {},
        confirmation: null
    }, */
    /*     cancelProcess: {
        title: t('Confirmation'),
        description: t('Request and all related data will be deleted. Are you sure to cancel the process?'),
        confirmButtonLabel: t('Accept'),
        confirm () {},
        type: 'danger',
        note: true,
        confirmation: null
    }, */
/*     terminateProcess: {
        title: t('Confirmation'),
        description: t('Are you sure to finish the receiving process?'),
        confirmButtonLabel: t('Accept'),
        confirm () {},
        type: 'danger',
        note: true,
        confirmation: null
    } */
}

const { showAlert, configModal } = props.useAlertModal

const modalView = computed(() => {
    if (configModal.value.template && templates[configModal.value.template]) {
        return mergeObjects(templates[configModal.value.template], configModal.value)
    }

    return mergeObjects(templates.default, configModal.value)
})

const mergeObjects = (obj1, obj2) => {
    for (const key in obj2) {
        if (obj2[key] !== null) {
            obj1[key] = obj2[key]
        }
    }

    return obj1
}
</script>

<template>
    <ConfirmationModal
        :title="modalView.title"
        :description="modalView.description"
        v-model="showAlert"
        @confirm="modalView.confirm"
        :type="modalView.type"
        :link-cancel-button="true"
        :note="modalView.note"
        :confirmation="modalView.confirmation"
        :confirmation-button-label="modalView.confirmButtonLabel"
        :show-errors="false"
        class="z-50" />
</template>
