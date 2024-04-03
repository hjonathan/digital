import { jsonLogic } from 'jsonRules'

const getRules = (dataRules) => {
    const { user_id, area_id, permissions } = dataRules

    return {
        creator: {
            and: [
                { '===': [{ var: 'id' }, null] },
            ]
        },
        approval: {
            and: [
                {
                    or: [
                        { in: [{ var: 'approval_user_id' }, [user_id]] },
                        { in: [{ var: 'request_area_id' }, [area_id]] },
                        { in: [{ var: 'permission' }, permissions] },
                    ]
                },
                { in: [{ var: 'process.active_process' }, [1]] },
                { notIn: [{ var: 'supply_order_status.slug' }, ['delivered', 'dispatch-rejected']] },
            ]
        }
    }
}

export const configSchema = ({ useGlobalStore, data, create }) => {
    const coreStore = useGlobalStore('core')

    const dataRules = {
        ...data,
        user_id: coreStore.getUserId(),
        area_id: coreStore.credentials.user.area_id,
        permission: 'supplies.global.super_document_approval',
        permissions: coreStore.getPermissions()
    }

    const schema = {
        role: getRole(dataRules),
        document: {
            title: 'Dispatch Note'
        },
        requestNumber: getRequestNumber(dataRules),
        status: getStatus(dataRules),
        requester: getRequester(dataRules),
        materialDetails: getMaterialDetails(dataRules),
        note: getNote(dataRules),
        deliveryInformation: getDeliveryInformation(dataRules),
        managerApproval: getManagerApproval(dataRules)
    }

    return schema
}

const getRole = (dataRules) => {
    if (!dataRules.id) return 'creator'

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return 'approval'
    }

    return 'show'
}

const getRequestNumber = (dataRules) => {
    return { mode: 'readonly' }
}

const getStatus = (dataRules) => {
    if (jsonLogic.apply(getRules(dataRules).creator, dataRules)) {
        return { mode: 'hidden' }
    }

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return { mode: 'hidden' }
    }

    return { mode: 'readonly' }
}

const getRequester = (dataRules) => {
    if (jsonLogic.apply(getRules(dataRules).creator, dataRules)) {
        return { mode: 'readonly' }
    }

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return { mode: 'readonly' }
    }

    return { mode: 'readonly' }
}

const getMaterialDetails = (dataRules) => {
    if (jsonLogic.apply(getRules(dataRules).creator, dataRules)) {
        return { mode: 'readonly' }
    }

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return { mode: 'readonly' }
    }

    return { mode: 'readonly' }
}

const getNote = (dataRules) => {
    if (jsonLogic.apply(getRules(dataRules).creator, dataRules)) {
        return { mode: 'readonly' }
    }
    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return { mode: 'readonly' }
    }

    return { mode: 'readonly' }
}

const getDeliveryInformation = (dataRules) => {
    if (jsonLogic.apply(getRules(dataRules).creator, dataRules)) {
        return { mode: 'readonly' }
    }

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return { mode: 'readonly' }
    }

    return { mode: 'readonly' }
}

const getManagerApproval = (dataRules) => {
    if (jsonLogic.apply(getRules(dataRules).creator, dataRules)) {
        return { mode: 'hidden' }
    }

    if (jsonLogic.apply(getRules(dataRules).approval, dataRules)) {
        return { mode: 'readonly' }
    }

    return { mode: 'readonly' }
}
