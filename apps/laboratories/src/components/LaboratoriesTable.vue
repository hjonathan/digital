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
    }
})

const useGlobalStore = inject('useGlobalStore')
const laboratoriesStore = useGlobalStore('laboratories')

const apiGrid = ref()

const clientData = ref()
const configSlideOver = ref({
    open: false,
    close: false
})

const actionView = ref({
    title: null,
    id: null
})

const columns = configColumns({ useGlobalStore, clientData, configSlideOver, actionView, idThread: props.idThread })
const buttons = configButtons({ clientData, configSlideOver, actionView, idThread: props.idThread })

const configuration = configTable()

const data = computed(() => {
    return laboratoriesStore.getData()
})

// Watch clientStore while is fetching
const unwatch = watch(() => laboratoriesStore.fetching, () => {
    laboratoriesStore.fetching && apiGrid.value.showLoadingOverlay()

    !laboratoriesStore.fetching && apiGrid.value.hideOverlay()

    apiGrid.value.deselectAll()
})

const clientForm = ref()

// Call to api to save client activating loading button
const onSave = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    const response = await clientForm.value.save()

    if (response.success) {
        laboratoriesStore.fetch()

        configSlideOver.value.close = !configSlideOver.value.close
    }

    setButtonToLoading(false)
}

// Event to close slideover
const onClose = () => {
    laboratoriesStore.fetch()

    configSlideOver.value.close = !configSlideOver.value.close
}

// Unregister watch
onUnmounted(() => unwatch())

onMounted(() => {
    laboratoriesStore.fetch()
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
                ref="clientForm"
                :data="clientData"
                @close="onClose" />
    </Slideover>
</template>
