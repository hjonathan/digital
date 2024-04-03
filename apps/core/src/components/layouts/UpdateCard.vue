<script setup>
import { inject, computed } from 'vue'
import { ConfirmCard } from 'layout'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const useStore = inject('useStore')

const layoutManagerStore = useStore('layoutManager')
const coreStore = useStore('core')
const rapidStore = useStore('rapidStore')

const props = defineProps({
    position: {
        type: String,
        default: 'bottom'
    }
})

const cancelUpdate = () => {
    layoutManagerStore.setVersionUpdater({
        button: true,
        card: false,
        position: 'top'
    })

    coreStore.setAppVersion({ cancelled: true })
}

const confirmUpdate = async () => {
    coreStore.setAppVersion({ cancelled: null })

    rapidStore.$emitGlobalEvent('updateVersion:init')
}

const styleContainer = computed(() => {
    return {
        '!z-50 absolute': true,
        'top-12 m-0 p-0 right-0 translate-x-1': props.position === 'top'
    }
})

const styleCard = computed(() => {
    const style = {
        'shadow-lg border': true,
        '!m-0 !w-screen !max-w-lg': props.position === 'top',
        'w-full bottom-0 right-0 sm:bottom-20 sm:right-20 fixed': props.position === 'bottom'
    }

    return style
})

</script>

<template>
    <div :class="styleContainer">
        <ConfirmCard
            :class="styleCard"
            :icon="{ icon: ExclamationTriangleIcon, color: 'red'}"
            :title="t('Version Update')"
            :descriptions="[t('A new Version is available.', 'Do you want to update?')]"
            :confirmationButton="{
                label: $t('Yes, refresh'),
                color: 'primary',
                action: confirmUpdate
            }"
            :cancelButton="{
                label: $t('Cancel'),
                color: 'primary',
                action: cancelUpdate
            }" />
    </div>
</template>
