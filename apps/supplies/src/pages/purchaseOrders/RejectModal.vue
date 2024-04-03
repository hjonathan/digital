<script setup>
import { ref } from 'vue'
import { ConfirmationModal } from 'layout'

const props = defineProps({
    config: Object
})

const configModal = ref(props.config)
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
        :note="configModal.note"
        :type="configModal.type"
        class="z-50" />
</template>
