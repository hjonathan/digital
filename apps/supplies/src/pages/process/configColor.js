import { useI18n } from 'vue-i18n'

export const getStatus = (status, index) => {
    const { t } = useI18n()

    if (index === 0) return t('Requested')

    if (status === 1) return t('Approved')

    if (status === 0) return t('Rejected')

    return t('Pending')
}

export const getStatusColor = (status) => {
    const statuses = {
        attended: 'success',
        approved: 'success',
        delivered: 'success',
        dispatched: 'success',
        received: 'success',
        rejected: 'danger',
        cancel: 'danger',
        requested: 'success',
        pending: 'empty',
        'pending-purchase-approval': 'warning',
        'purchased-quotation': 'warning',
        'pending-warehouse-manager-approval': 'warning',
        'pending-department-manager-approval': 'warning',
        'pending-purchase-approval': 'warning'
    }

    return statuses[status] || ''
}

export const getBooleanStatus = (status, index) => {
    if (status === 1 || index === 0) return 'success'

    if (status === 0) return 'danger'

    return 'info'
}

const departmentColors = {
    'Sales and Marketing': 'border-l-purple-600',
    Warehouse: 'border-l-lime-600'
}

export const getDeparmentColor = (obj) => {
    return departmentColors[obj] || 'border-l-amber-600'
}
