import { ref, computed } from 'vue'
import moment from 'moment-timezone'
import { downloadBase64PDF, formatDate } from 'shared'
import { api } from '@/config'
import { useFormComponent } from 'form'

import axios from 'axios'

export const useMaterialAssign = ({ useGlobalStore, create = false, configSchema }) => {
    const coreStore = useGlobalStore('core')
    const suppliesCostStore = useGlobalStore('suppliesCost')
    const suppliesStore = useGlobalStore('supplies')

    const permissions = coreStore.getPermissions()

    const { finalStyles } = useFormComponent()

    const data = ref({
        dateInfo: {
            date: moment(new Date()).format('DD/MM/YYYY')
        },
        register_date: moment(new Date()).format('DD/MM/YYYY'),
        note: '',
        deliveryInformation: {},
        requisition_supplies: [{}],
        approvalStatus: {},
        finalApprovalStatus: {}
    })

    const variables = ref({
        stageId: null,
        processId: null,
        supplyOrderId: null,
        supplyOrderTypeId: null
    })

    const configModal = ref({
        title: null,
        description: null,
        confirmButtonLabel: null,
        confirm: null,
        confirmation: null,
        showAlert: false,
        modelData: {}
    })

    const loadings = ref({
        submit: false
    })

    const errors = ref({})

    const schema = computed(() => {
        return configSchema({
            useGlobalStore,
            data: {
                id: data.value.id,
                approval_user_id: data.value.approval_user_id,
                editable: data.value.editable,
                supply_order_status: data.value.supply_order_status,
                ...data.value
            },
            create
        })
    })

    const isPrintButtonLoading = ref(false)

    const formatApiData = () => {
        return {
            register_date: data.value.register_date,
            requested_delivery_date: data.value.deliveryInformation.requested_delivery_date
                ? formatDate(data.value.deliveryInformation.requested_delivery_date, 'utcDateTime')
                : null,
            request_area_id: data.value?.area?.id,
            note: data.value.note,
            instructions: data.value.deliveryInformation?.instructions,
            create_dispatch: configModal.value.modelData?.create_dispatch,
            requisition_supplies: data.value.requisition_supplies.map(supply => {
                return {
                    measure_id: supply.supply?.measure?.id,
                    quantity: supply.quantity,
                    supply_id: supply.supply?.id,
                    name: supply.supply?.name
                }
            })
        }
    }

    const getTotalCostSupplies = async () => {
        loadings.value.submit = true

        await suppliesCostStore.fetch()

        const transactions = suppliesCostStore.getData()

        const detailCost = {
            totalCost: 0,
            details: []
        }

        for (const element of data.value.requisition_supplies) {
            const supply = element.supply

            if (element.quantity > supply.quantity) {
                detailCost.totalCost = 0
                detailCost.details = null

                loadings.value.submit = false

                return detailCost
            }

            const detail = {
                id: supply.id,
                name: supply.name,
                quantity: element.quantity,
                totalCost: 0,
                operations: []
            }

            if (supply) {
                const supplyTransactions = transactions.filter(transaction => transaction.id === supply.id).reverse()
                let indexTransaction = 0

                let supplyQuantity = element.quantity

                while (supplyQuantity > 0 && indexTransaction < supplyTransactions.length) {
                    const { quantity: quantityTransaction, cost: costTransaction } = supplyTransactions[indexTransaction]

                    if (quantityTransaction <= supplyQuantity) {
                        supplyQuantity -= quantityTransaction

                        detailCost.totalCost += (quantityTransaction * costTransaction)
                        detail.totalCost += (quantityTransaction * costTransaction)

                        detail.operations.push({
                            availableQuantity: quantityTransaction,
                            cost: costTransaction,
                            quantity: quantityTransaction,
                            totalCost: (quantityTransaction * costTransaction)
                        })
                    } else if (supplyQuantity < quantityTransaction) {
                        detailCost.totalCost += (supplyQuantity * costTransaction)
                        detail.totalCost += (supplyQuantity * costTransaction)

                        detail.operations.push({
                            availableQuantity: quantityTransaction,
                            cost: costTransaction,
                            quantity: supplyQuantity,
                            totalCost: (supplyQuantity * costTransaction)
                        })

                        supplyQuantity = 0
                    }

                    indexTransaction++
                }
            }

            detailCost.details.push(detail)
        }

        loadings.value.submit = false

        return detailCost
    }

    const isValidQuantities = computed(() => {
        for (const element of data.value.requisition_supplies) {
            if (element.quantity > getQuantity(element) ||
                !element.quantity ||
                !element.supply ||
                element.quantity < 0 ||
                gridErrors.value.length > 0) return false
        }

        return true
    })

    const getQuantity = (row) => {
        const supply = suppliesStore.getData().find(supply => supply.id === row.supply?.id || supply.id === row.supply_id)

        return supply?.quantity
    }

    const gridErrors = computed(() => {
        const erros = []

        for (let index = 0; index < data.value.requisition_supplies.length; index++) {
            const supply = data.value.requisition_supplies[index]

            if (supply?.quantity > (getQuantity(supply) || 0) || supply.quantity < 0) {
                erros[index] = true
            }
        }

        return erros
    })

    const print = async (element = 'MRPrintableArea') => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById(element)
        
        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)
/*         const res = await axios.post('http://127.0.0.1:8000/api/pdf/manifest/create', data)

        const response = res.data */

        response.success && downloadBase64PDF(response.data.content, `MaterialAssign-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        data,
        schema,
        errors,
        variables,
        permissions,
        isPrintButtonLoading,
        configModal,
        print,
        formatApiData,
        getTotalCostSupplies,
        isValidQuantities,
        loadings,
        getQuantity,
        gridErrors
    }
}
