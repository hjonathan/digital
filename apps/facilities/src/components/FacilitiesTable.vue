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
const facilitiesStore = useGlobalStore('facilities')
const facilityTypesStore = useGlobalStore('facilityTypes')

facilityTypesStore.fetch()

const apiGrid = ref()

const facilityData = ref()
const countries = ref([])
const configSlideOver = ref({
    open: false,
    close: false
})

const actionView = ref({
    title: null,
    id: null
})

const columns = configColumns({ useGlobalStore, facilityData, configSlideOver, actionView, idThread: props.idThread })
const buttons = configButtons({ facilityData, configSlideOver, actionView, idThread: props.idThread })

const configuration = configTable({ idThread: props.idThread })

const data = computed(() => {
    return facilitiesStore.getData()
})

// Watch facilityStore while is fetching
const unwatch = watch(() => facilitiesStore.fetching, () => {
    facilitiesStore.fetching && apiGrid.value.showLoadingOverlay()

    !facilitiesStore.fetching && apiGrid.value.hideOverlay()

    apiGrid.value.deselectAll()
})

const facilityForm = ref()

// Call to api to save facility activating loading button
const onSave = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    const response = await facilityForm.value.save()

    if (response.success) {
        facilitiesStore.fetch()

        configSlideOver.value.close = !configSlideOver.value.close
    }

    setButtonToLoading(false)
}

// Event to close slideover
const onClose = () => {
    facilitiesStore.fetch()

    configSlideOver.value.close = !configSlideOver.value.close
}

// Unregister watch
onUnmounted(() => unwatch())

onMounted(async () => {
    countries.value = await facilitiesStore.fetchCountries()

    facilitiesStore.fetch()
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
                ref="facilityForm"
                :data="facilityData"
                :countries="countries"
                @close="onClose" />
    </Slideover>
</template>
