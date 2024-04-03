import { jsonLogic } from 'jsonRules'

const getRules = (dataRules) => {
    const { user_id, permissions } = dataRules

    return {
        manager: {
            and: [
                {
                    or: [
                        { in: [{ var: 'approval_user_id' }, [user_id]] },
                        { in: [{ var: 'permission' }, permissions] },
                    ]
                },
                { in: [{ var: 'process.active_process' }, [1]] },
            ]
        }
    }
}

export const configSchema = (data) => {
    const { approval_user_id, editable, supply_order_status, useGlobalStore, id, uniqueItem } = data

    const coreStore = useGlobalStore('core')

    const dataRules = {
        id,
        approval_user_id,
        editable,
        permissions: coreStore.getPermissions(),
        permission: 'supplies.global.super_document_approval',
        supply_order_status,
        user_id: coreStore.getUserId(),
        uniqueItem,
        ...data
    }

    const schema = {
        role: getRole(dataRules),
        status: getStatusSchema(dataRules),
        buyerInformation: { mode: 'readonly' },
        requester: { mode: 'readonly' },
        sellerInformation: getSellerInformationSchema(dataRules),
        requisitionSupplies: getRequisitionSuppliesSchema(dataRules),
        documentNumber: getDocumentNumberSchema(dataRules),
        deliveryInformation: getDeliveryInformationSchema(dataRules),
        billingPayments: getBillingPaymentsSchema(dataRules),
        termsConditions: getTermsConditionsSchema(dataRules),
        timeline: getTimelineSchema(dataRules)
    }

    return schema
}

const getStatusSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'hidden' }
}

const getRequisitionSuppliesSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getDocumentNumberSchema = ({ id, uniqueItem }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getDeliveryInformationSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getBillingPaymentsSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getTermsConditionsSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getSellerInformationSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getRole = (dataRules) => {
    const { approval_user_id, id } = dataRules

    if (!id) return 'creator'

    if (approval_user_id && jsonLogic.apply(getRules(dataRules).manager, dataRules)) { return 'manager' }

    return 'show'
}

const getTimelineSchema = (dataRules) => {
    const { id } = dataRules

    if (!id) return { mode: 'hidden' }

    return { mode: 'readonly' }
}
