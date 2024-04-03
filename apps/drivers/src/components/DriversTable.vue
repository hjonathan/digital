<script setup>
import { inject, computed, ref, watch, onUnmounted, onMounted } from 'vue'
import { Table } from 'table'
import { ActionButtons, Slideover } from 'layout'
import { configTable } from './configTable'
import { configColumns } from './configColumns'
import { configButtons } from './configButtons'
import Save from './Save.vue'
import { tableStartupVars } from 'shared'

const props = defineProps({
    idThread: {
        type: String,
        default: null
    },
    action: {
        type: String,
        default: null
    }
})

const useGlobalStore = inject('useGlobalStore')
const driversStore = useGlobalStore('drivers')
const rapidStore = useGlobalStore('rapidStore')

const key = tableStartupVars(inject)

const apiGrid = ref()

const driverData = ref()

const configSlideOver = ref({
    open: false,
    close: false
})

const actionView = ref({
    title: null,
    id: null
})

const driversSelected = rapidStore.reactiveProperty(`${props.idThread}-selected-drivers`, [])

const updateSelectedDrivers = () => {
    const ids = driversSelected.value.map(item => item.id)

    if (props.idThread) {
        apiGrid.value.deselectAll()

        apiGrid.value.forEachNode(node => {
            if (ids.includes(node.data.id)) node.setSelected(true)
        })
    }
}

rapidStore.$registerGlobalEvent(`selectedDriversSync:${props.action}`, updateSelectedDrivers)

const columns = configColumns({ useGlobalStore, driverData, key, configSlideOver, actionView, driversSelected, idThread: props.idThread, actionThread: props.action })
const buttons = configButtons({ useGlobalStore, driverData, key, configSlideOver, actionView, driversSelected, idThread: props.idThread, actionThread: props.action })

const configuration = configTable({ apiGrid, useGlobalStore, key, updateSelectedDrivers })

const data = computed(() => {
    return driversStore.getData()
})

// Watch driverStore while is fetching
const unwatch = watch(() => driversStore.fetching, () => {
    driversStore.fetching && apiGrid.value.showLoadingOverlay()

    !driversStore.fetching && apiGrid.value.hideOverlay()

    apiGrid.value.deselectAll()
})

const driverForm = ref()

// Call to api to save driver activating loading button
const onSave = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    const response = await driverForm.value.save()

    if (response.success) {
        driversStore.fetch()

        configSlideOver.value.close = !configSlideOver.value.close
    }

    setButtonToLoading(false)
}

// Event to close slideover
const onClose = () => {
    driversStore.fetch()

    configSlideOver.value.close = !configSlideOver.value.close
}

// Unregister watch
onUnmounted(() => unwatch())

onMounted(async () => {
    await driversStore.fetch()

    updateSelectedDrivers()
})
</script>

<template>
    <Table
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-if="!idThread" v-slot:start-buttons>
            <ActionButtons :items="buttons" />
        </template>

        <template v-if="idThread" v-slot:aditional-end-buttons>
            <ActionButtons :items="buttons" />
        </template>
    </Table>

    <Slideover
        :title="actionView.title"
        :id="actionView?.id"
        has-cancel-button
        has-save-button
        :open="configSlideOver.open"
        :close="configSlideOver.close"
        @clickOnSave="onSave" >
            <Save
                ref="driverForm"
                :data="driverData"
                @close="onClose" />
    </Slideover>
</template>
