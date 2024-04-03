import { jsonLogic } from 'jsonRules'

const getRules = (dataRules) => {
    const { user_id, permissions } = dataRules

    return {
        approval: {
            and: [
                {
                    or: [
                        { in: [{ var: 'approval_user_id' }, [user_id]] },
                        { in: [{ var: 'permission' }, permissions] },
                    ]
                },
                { in: [{ var: 'process.active_process' }, [1]] },
                { notIn: [{ var: 'supply_order_status.slug' }, ['attended', 'awaiting-delivery-confirmation', 'rejected', 'delivered']] },
            ]
        }
    }
}

export const configSchema = (data) => {
    const { useGlobalStore } = data

    const coreStore = useGlobalStore('core')

    const dataRules = {
        permissions: coreStore.getPermissions(),
        permission: 'supplies.global.super_document_approval',
        user_id: coreStore.getUserId(),
        ...data
    }

    const schema = {
        role: getRole(dataRules),
        status: getStatusSchema(dataRules),
        requester: { mode: 'readonly' },
        itemDescription: getItemDescriptionSchema(dataRules),
        justification: getJustificationSchema(dataRules),
        budgetInformation: getBudgetInformationSchema(dataRules),
        note: getNoteSchema(dataRules),
        deliveryInformation: getDeliveryInformationSchema(dataRules),
        managerApproval: getApprovals(dataRules),
        warehouseApproval: getApprovals(dataRules),
        timeline: getTimelineSchema(dataRules)
    }

    return schema
}

const getRole = (dataRules) => {
    const { id } = dataRules

    if (!id) return 'creator'

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) { return 'approval' }

    return 'show'
}

const getStatusSchema = (dataRules) => {
    const { id } = dataRules

    if (!id) return { mode: 'hidden' }

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return { mode: 'hidden' }
    }

    return { mode: 'readonly' }
}

const getItemDescriptionSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getJustificationSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getBudgetInformationSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getNoteSchema = ({ id }) => {
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

const getTimelineSchema = (dataRules) => {
    const { id } = dataRules

    if (!id) return { mode: 'hidden' }

    return { mode: 'readonly' }
}

const getApprovals = (dataRules) => {
    const { id } = dataRules

    if (!id) return { mode: 'hidden' }

    return { mode: 'readonly' }
}
