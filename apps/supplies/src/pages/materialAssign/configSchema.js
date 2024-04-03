import { jsonLogic } from 'jsonRules'

const getRules = (dataRules) => {
    const { user_id, permissions } = dataRules

    return {
        manager: {
            and: [
                { '===': [{ var: 'editable' }, 0] },
                {
                    or: [
                        { in: [{ var: 'approval_user_id' }, [user_id]] },
                        { in: [{ var: 'permission' }, permissions] },
                    ]
                },
                { in: [{ var: 'process.active_process' }, [1]] },
                { notIn: [{ var: 'supply_order_status.slug' }, ['attended', 'awaiting-delivery-confirmation', 'rejected', 'delivered']] },
            ]
        },
        warehouse: {
            and: [
                { '!==': [{ var: 'editable' }, 0] },
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

export const configSchema = ({ useGlobalStore, data, create }) => {
    const coreStore = useGlobalStore('core')

    const { approval_user_id, editable, supply_order_status, id } = data

    const dataRules = {
        approval_user_id,
        id,
        editable,
        permissions: coreStore.getPermissions(),
        permission: 'supplies.global.super_document_approval',
        supply_order_status,
        ...data,
        user_id: coreStore.getUserId()
    }

    // CREATE
    if (create) {
        return {
            role: getRole(dataRules),
            document: {
                title: 'Assign materials'
            },
            requestNumber: { mode: 'hidden' },
            status: { mode: 'hidden' },
            requester: { mode: 'readonly' },
            materialDetails: { mode: 'edit' },
            note: { mode: 'edit' },
            deliveryInformation: { mode: 'edit' },
            managerApproval: { mode: 'hidden' },
            timeline: { mode: 'hidden' }
        }
    }

    // MANAGER
    if (approval_user_id && jsonLogic.apply(getRules(dataRules).manager, dataRules)) {
        return {
            role: getRole(dataRules),
            document: {
                title: 'Assign materials'
            },
            requestNumber: { mode: 'hidden' },
            status: { mode: 'hidden' },
            requester: { mode: 'readonly' },
            materialDetails: { mode: 'readonly' },
            note: { mode: 'readonly' },
            deliveryInformation: { mode: 'readonly' },
            managerApproval: { mode: 'readonly' },
            timeline: { mode: 'readonly' }
        }
    }

    // WAREHOUSE
    if (approval_user_id && jsonLogic.apply(getRules(dataRules).warehouse, dataRules)) {
        return {
            role: getRole(dataRules),
            document: {
                title: 'Assign materials'
            },
            requestNumber: { mode: 'hidden' },
            status: { mode: 'hidden' },
            requester: { mode: 'readonly' },
            materialDetails: { mode: 'edit' },
            note: { mode: 'readonly' },
            deliveryInformation: { mode: 'readonly' },
            managerApproval: { mode: 'readonly' },
            timeline: { mode: 'readonly' }
        }
    }

    // SHOW
    return {
        role: getRole(dataRules),
        document: {
            title: 'Assign materials'
        },
        requestNumber: { mode: 'hidden' },
        status: { mode: 'readonly' },
        requester: { mode: 'readonly' },
        materialDetails: { mode: 'readonly' },
        note: { mode: 'readonly' },
        deliveryInformation: { mode: 'readonly' },
        managerApproval: { mode: 'readonly' },
        timeline: { mode: 'readonly' }
    }
}

const getRole = (dataRules) => {
    const { approval_user_id, id } = dataRules

    if (!id) return 'creator'

    if (approval_user_id && jsonLogic.apply(getRules(dataRules).warehouse, dataRules)) { return 'warehouse' }

    if (approval_user_id && jsonLogic.apply(getRules(dataRules).manager, dataRules)) { return 'manager' }

    return 'show'
}
