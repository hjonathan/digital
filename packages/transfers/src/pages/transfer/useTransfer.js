import { computed, inject, ref } from 'vue'
import { mdiOfficeBuilding, mdiAccountTie } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { getSessionJSON, downloadBase64PDF } from 'shared'
import { api } from '@/config'

export const useTransfer = ({ step, steps, transfer, mode, useStepper, parentThread }) => {
    const { t } = useI18n()

    const useGlobalStore = inject('useGlobalStore')
    const router = inject('router')

    const transfersStore = useGlobalStore('transfers')
    const inventoryStore = useGlobalStore('inventory')
    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')

    const transferId = ref(transfer?.id)

    const syncStores = () => {
        transfersStore.fetch()

        inventoryStore.fetch()
    }

    const thread = ref({
        idThread: mode !== 'create' ? transferId.value : 'transfers',
        action: 'transfers'
    })

    const loadings = ref({
        saveButton: false,
        deleteButton: false,
        printButton: false
    })

    const configSaving = ref({
        saving: false,
        saved: false
    })

    const errors = ref()

    const facility = ref({
        icon: mdiOfficeBuilding,
        title: t('Destination'),
        name: null,
        data: null,
        rawData: null
    })

    const items = ref({
        icon: mdiAccountTie,
        title: t('Items'),
        name: null,
        data: null,
        rawData: []
    })

    const addFacility = (data) => {
        if (!data) return

        facility.value.rawData = data

        facility.value.title = data.facility_name
        facility.value.name = data.city

        facility.value.data = {
            address: data.address,
            email: data.email,
            website: data.website,
            zip_code: data.zip_code
        }
    }

    const formatApiData = () => {
        const apiData = {
            origin_facility_id: getSessionJSON('facility_id'),
            traveled_route: '',
            destination_facility_id: facility.value.rawData?.id,
            transfer_item: items.value.rawData.map(item => ({
                item_id: item.id,
                quantity: item.quantity,
                original_quantity: item.quantity,
                cost: item.item_type?.price || 0
            }))
        }

        if (transferId.value) apiData.id = transferId.value

        return apiData
    }

    const formatApiDataAssignment = () => {
        const apiData = {
            origin_facility_id: getSessionJSON('facility_id'),
            traveled_route: '',
            destination_facility_id: facility.value.rawData?.id,
            transfer_item: items.value.rawData.map(item => ({
                item_id: item.item_id,
                original_quantity: item.original_quantity,
                quantity: item.quantity,
                cost: item.item_type?.price || 0,
                item_transfer_type_id: item.item_transfer_type_id || null
            }))
        }

        if (transferId.value) apiData.id = transferId.value

        return apiData
    }

    const currentStep = computed(() => {
        const stepPosition = steps.value.findIndex(localStep => localStep.id === step.value)

        if (stepPosition < 0) return { index: null, step: null }

        return {
            index: stepPosition,
            step: steps.value[stepPosition]
        }
    })

    const visibleNext = computed(() => {
        return currentStep.value.index < steps.value.length - 1
    })

    const enablePrevius = computed(() => {
        return !!currentStep.value.index
    })

    const save = async () => {
        configSaving.value = { saving: true, saved: false }

        loadings.value.saveButton = true

        errors.value = null

        const response = await api.post('/transfers/transfer_build', formatApiData())

        if (!response.success || response.errors) {
            errors.value = {
                isOpen: true,
                type: 'danger',
                message: t(response.message)
            }
        }

        if (response.success && !response.errors) {
            const tabName = transferId.value ? 'EditTransfer' : 'CreateTransfer'

            transferId.value = response.data?.id

            syncStores()

            rapidStore.$emitGlobalEvent(`addTransfers:${parentThread.idThread}`, response.data[0])

            tabsStore.closeTab(tabName)
        }

        configSaving.value = { saving: false, saved: true }

        loadings.value.saveButton = false
    }

    const sendAssignment = async () => {
        configSaving.value = { saving: true, saved: false }

        loadings.value.saveButton = true

        errors.value = null

        const response = await api.post('/transfers/transfer_item_found', {
            origin_facility_id: getSessionJSON('facility_id'),
            traveled_route: '',
            destination_facility_id: facility.value.rawData?.id,
            transfer_item: items.value.rawData.map(item => ({
                item_id: item.item_id,
                original_quantity: item.original_quantity,
                quantity: item.quantity,
                item_transfer_type_id: item.item_transfer_type_id || null
            }))
        })

        if (!response.success || response.errors) {
            errors.value = {
                isOpen: true,
                type: 'danger',
                message: t(response.message)
            }
        }

        if (response.success && !response.errors) {
            syncStores()

            tabsStore.closeTab('CreateAssignment')
        }

        configSaving.value = { saving: false, saved: true }

        loadings.value.saveButton = false
    }

    const saveMessage = computed(() => {
        if (errors.value && configSaving.value.saved && !configSaving.value.saving) {
            return {
                label: t('Saved with errors'),
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

    const deleteDraft = async () => {
        loadings.value.deleteButton = true
        const response = await api.delete(`/transfers/${transferId.value}`)

        if (response.success && !response.errors) {
            router.currentRoute.value.params.id ? tabsStore.closeTab('EditTransfer') : tabsStore.closeTab('CreateTransfer')

            syncStores()
        }

        loadings.value.deleteButton = false
    }

    const printPreview = async () => {
        loadings.value.printButton = true

        const printableArea = document.getElementById('printableArea')

        const data = { data: printableArea.innerHTML }

        const response = await api.post('/pdf/manifest/create', data)

        response.success && downloadBase64PDF(response.data.content, response.data.name)

        loadings.value.printButton = false
    }

    return {
        loadings,
        configSaving,
        errors,
        enablePrevius,
        facility,
        saveMessage,
        transferId,
        mode,
        items,
        thread,
        step,
        steps,
        currentStep,
        visibleNext,
        formatApiData,
        save,
        addFacility,
        deleteDraft,
        printPreview,
        sendAssignment,
        formatApiDataAssignment,
        useStepper
    }
}
