<script setup>
import { inject, computed, ref, watch, onUnmounted, onMounted } from 'vue'
import { Table } from 'table'
import { ActionButtons, Slideover } from 'layout'
import { configTable } from './configTable'
import { configColumns } from './configColumns'
import { configButtons } from './configButtons'
import Save from './Save.vue'

const props = defineProps({
    idThread: {
        type: String,
        default: null
    },
    action: {
        type: String,
        default: ''
    }
})

const useGlobalStore = inject('useGlobalStore')
const vehiclesStore = useGlobalStore('vehicles')

const apiGrid = ref()

const vehicleData = ref()
const configSlideOver = ref({
    open: false,
    close: false
})

const actionView = ref({
    title: null,
    id: null
})

const columns = configColumns({ useGlobalStore, vehicleData, configSlideOver, actionView, idThread: props.idThread, actionThread: props.action })
const buttons = configButtons({ vehicleData, configSlideOver, actionView, idThread: props.idThread, actionThread: props.action })

const configuration = configTable()

const data = computed(() => {
    return vehiclesStore.getData()
})

// Watch vehiclesyStore while is fetching
const unwatch = watch(() => vehiclesStore.fetching, () => {
    vehiclesStore.fetching && apiGrid.value.showLoadingOverlay()

    !vehiclesStore.fetching && apiGrid.value.hideOverlay()

    apiGrid.value.deselectAll()
})

const vehicleForm = ref()

// Call to api to save vehicle activating loading button
const onSave = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    const response = await vehicleForm.value.save()

    if (response.success) {
        vehiclesStore.fetch()

        configSlideOver.value.close = !configSlideOver.value.close
    }

    setButtonToLoading(false)
}

// Event to close slideover
const onClose = () => {
    vehiclesStore.fetch()

    configSlideOver.value.close = !configSlideOver.value.close
}

// Unregister watch
onUnmounted(() => unwatch())

onMounted(async () => {
    vehiclesStore.fetch()
})
</script>

<template>
    <Table
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-slot:start-buttons>
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
                ref="vehicleForm"
                :data="vehicleData"
                @close="onClose" />
    </Slideover>
</template>
