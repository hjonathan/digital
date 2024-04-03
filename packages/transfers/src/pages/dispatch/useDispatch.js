import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import { formatDate } from 'shared'

// Dispatch variables
export const useDispatch = ({ dispatch, mode }) => {
    const { t } = useI18n()

    const useGlobalStore = inject('useGlobalStore')
    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    const inventoryStore = useGlobalStore('inventory')
    const transfersStore = useGlobalStore('transfers')
    const dispatchesStore = useGlobalStore('dispatches')

    const dispatchId = ref(dispatch?.id)

    const syncStores = () => {
        transfersStore.fetch()

        inventoryStore.fetch()

        dispatchesStore.fetch()
    }

    const thread = ref({
        idThread: mode !== 'create' ? dispatchId.value : 'dispatch',
        action: 'Dispatch'
    })

    const loadings = ref({
        saveButton: false,
        deleteButton: false,
        printButton: false,
        finishButton: false
    })

    const configSaving = ref({
        saving: false,
        saved: false
    })

    const errors = ref()
    const errorsValidation = ref()

    const driversSelected = rapidStore.reactiveProperty(`${thread.value.idThread}-selected-drivers`, [], true)

    const vehicle = ref({
        title: t('Vehicle'),
        data: null,
        rawData: null
    })

    const drivers = ref({
        title: t('Drivers'),
        data: [],
        rawData: []
    })

    const transfers = ref({
        title: t('Transfers'),
        data: [],
        rawData: []
    })

    const dispatchDate = ref()

    const addVehicle = (newVehicle, autoSave = true) => {
        if (!newVehicle) return

        vehicle.value.rawData = newVehicle

        vehicle.value.title = newVehicle.license_plate
        vehicle.value.name = newVehicle.certificate

        vehicle.value.data = {
            make: `${t('Make')}: ${newVehicle.make}`,
            model: `${t('Model')}: ${newVehicle.model}`,
            color: `${t('Color')}: ${newVehicle.color}`,
            year: `${t('Year')}: ${newVehicle.year}`,
            capacity: `${t('Capacity')}: ${newVehicle.passengers} ${newVehicle.passengers === 1 ? t('person') : t('people')}`,
            engine_capacity: `${t('Engine capacity')}: ${newVehicle.engine_capacity} cc`
        }

        autoSave && save()
    }

    const addDrivers = (newDrivers, autoSave = true) => {
        drivers.value.rawData = newDrivers

        driversSelected.value = newDrivers

        autoSave && save()
    }

    const addTransfers = (newTransfer, autoSave = true) => {
        const transferPosition = transfers.value.rawData.findIndex(transfer => transfer.id === newTransfer.id)

        transferPosition > -1 ? transfers.value.rawData[transferPosition] = newTransfer : transfers.value.rawData.push(newTransfer)

        autoSave && save()
    }

    const formatApiData = () => {
        const apiData = {
            vehicle_id: vehicle.value?.rawData?.id,
            drivers: drivers.value?.rawData.map(driver => ({ driver_id: driver.id })),
            transfers: transfers.value.rawData.map(transfer => ({ transfer_id: transfer.id })),
            dispatch_on: formatDate(dispatchDate.value, 'utcDateTime')
        }

        if (dispatchId.value) apiData.id = dispatchId.value

        return apiData
    }

    const save = async () => {
        errors.value = null

        errorsValidation.value = null

        loadings.value.saveButton = true

        configSaving.value = { saving: true, saved: false }

        const response = await api.postWithAlert('/transfers/dispatch_transfer', formatApiData())

        if (response && (!response.success || response.errors)) {
            errors.value = {
                isOpen: true,
                type: 'danger',
                message: t(response.message)
            }
        }

        if (response && response.success && !response.errors) {
            dispatchId.value = response.data?.id

            syncStores()
        }

        configSaving.value = { saving: false, saved: true }

        loadings.value.saveButton = false
    }

    const deleteDispatch = async (tabNameInput) => {
        errors.value = null

        loadings.value.saveButton = true

        const response = await api.delete(`/dispatch-transfers/${dispatchId.value}`, formatApiData())

        if (response.success && !response.errors) {
            let tabName = dispatch?.id ? 'EditDispatch' : 'CreateDispatch'

            tabNameInput && (tabName = tabNameInput)

            dispatchId.value = response.data?.id

            syncStores()

            tabsStore.closeTab(tabName)
        }

        loadings.value.saveButton = false
    }

    const validateDataDispatch = async () => {
        loadings.value.saveButton = true

        errorsValidation.value = null

        const response = await api.postWithAlert('/transfers/dispatch_transfer_validate', formatApiData())

        response.errors && (errorsValidation.value = response.errors)

        loadings.value.saveButton = false

        return errorsValidation.value
    }

    const validateData = computed(() => {
        const validateData = {
            ...formatApiData(),
            ...loadings.value,
            transfersLength: transfers.value.rawData.length
        }

        return validateData
    })

    const saveMessage = computed(() => {
        if (errors.value && configSaving.value.saved && !configSaving.value.saving) {
            return {
                label: t('Not saved'),
                type: 'danger'
            }
        }

        if (configSaving.value.saved && !configSaving.value.saving && !errors.value) {
            return {
                label: t('Saved'),
                type: 'success'
            }
        }

        if (configSaving.value.saving && !configSaving.value.saved && !errors.value) {
            return {
                label: t('Saving...'),
                type: 'default'
            }
        }

        return null
    })

    const vehicleValidation = computed(() => {
        if (vehicle.value?.rawData?.passengers < drivers.value?.rawData?.length) {
            return { drivers: [t('The number of passengers must not exceed the capacity of the vehicle')] }
        }

        return {}
    })

    return {
        thread,
        vehicle,
        drivers,
        transfers,
        dispatchDate,
        driversSelected,
        validateData,
        loadings,
        dispatchId,
        saveMessage,
        errors,
        errorsValidation,
        vehicleValidation,
        addVehicle,
        addDrivers,
        addTransfers,
        save,
        formatApiData,
        deleteDispatch,
        syncStores,
        validateDataDispatch
    }
}
