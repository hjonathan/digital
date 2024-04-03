<script setup>
import DriversGrid from './DriversGrid.vue'
import { Overlay, EntityInformation } from 'layout'
import { useI18n } from 'vue-i18n'
import { ref, inject } from 'vue'
import { mdiAccountTie } from '@mdi/js'
import TransferStepTitle from './TransferStepTitle.vue'

const { t } = useI18n()

const props = defineProps({
    step: {
        type: Object,
        default: () => ({})
    },
    useTransfer: Object
})

const useGlobalStore = inject('useGlobalStore')

const loaders = ref({
    syncItems: false
})

// Drivers sync
const rapidStore = useGlobalStore('rapidStore')
const tabsStore = useGlobalStore('tabs')

const { thread, drivers, save, saveMessage, allErrors } = props.useTransfer

const driversList = rapidStore.reactiveProperty(`${thread.value.idThread}-selected-drivers`, [])

const syncDriversSelected = (driversSelected) => {
    drivers.value.rawData = driversSelected

    driversList.value = driversSelected

    save()
}

rapidStore.$registerGlobalEvent(`selectedDrivers:${thread.value.idThread}`, syncDriversSelected)

const addDrivers = () => {
    tabsStore.openTab({ name: 'transfersDrivers', query: thread.value })
}
</script>

<template>
    <Overlay
        v-if="loaders.syncItems"
        class="max-w-8xl" />

    <section class="paper">
        <TransferStepTitle
            :title="$t('Drivers')"
            :saveMessage="saveMessage"
            :errors="allErrors" />

        <div v-if="!driversList.length" class="flex justify-center">
            <EntityInformation
                :hasCard="true"
                :action="addDrivers"
                :icon="mdiAccountTie"
                :title="t('Drivers')"
                class="!w-96">
                <div>
                    {{ $t('Please select drivers') }}
                </div>
            </EntityInformation>
        </div>

        <DriversGrid
            v-if="driversList.length"
            :action-thread="thread.action"
            :items="driversList"
            @save="save">
        </DriversGrid>
    </section>
</template>
