<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConfirmationModal } from 'layout'

const { t } = useI18n()

const props = defineProps({
    useAlertModal: Object
})

const templates = {
    cancelAdjust: {
        title: t('Confirmation'),
        description: t('You can not revert this process. Are you sure to cancel the adjust?'),
        confirmButtonLabel: t('Cancel adjust'),
        confirm () {},
        confirmation: null
    },
    rejectAdjust: {
        title: t('Confirmation'),
        description: t('You can not revert this process. Are you sure to reject the adjust?'),
        confirmButtonLabel: t('Reject adjust'),
        confirm () {},
        confirmation: null
    },
    acceptAdjust: {
        title: t('Confirmation'),
        description: t('Are you sure to accept the adjust?'),
        confirmButtonLabel: t('Accept adjust'),
        confirm () {},
        confirmation: null
    },
    cancelReject: {
        title: t('Confirmation'),
        description: t('You can not revert this process. Are you sure to cancel the transfer?'),
        confirmButtonLabel: t('Accept'),
        confirm () {},
        confirmation: null

    },
    cancelTransfer: {
        title: t('Confirmation'),
        description: t('You can not revert this process. Are you sure to cancel the transfer?'),
        confirmButtonLabel: t('Accept'),
        confirm () {},
        confirmation: null

    },
    acceptTransfer: {
        title: t('Confirmation'),
        description: t('Are you sure you accept the transfer?'),
        confirmButtonLabel: t('Accept'),
        confirm () {},
        confirmation: null
    },
    acceptItemFound: {
        title: t('Confirmation'),
        description: t('Are you sure you accept the item?'),
        confirmButtonLabel: t('Accept'),
        confirm () {},
        confirmation: null
    },
    rejectItemFound: {
        title: t('Confirmation'),
        description: t('Are you sure you reject the item?'),
        confirmButtonLabel: t('Reject'),
        confirm () {},
        confirmation: null
    },
    default: {
        title: t('Title'),
        description: t('Default description?'),
        confirmButtonLabel: t('Cancel'),
        confirm () {},
        confirmation: null
    }
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
        :confirmation="modalView.confirmation"
        :confirmation-button-label="modalView.confirmButtonLabel"
        class="z-50" />
</template>
