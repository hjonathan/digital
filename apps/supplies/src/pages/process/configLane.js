import { formatAmericanDate, formatAmericanSimplifiedDate, showUuid, formatDiffForHumans, applyProp } from 'shared'
import { useI18n } from 'vue-i18n'
import { getBooleanStatus, getStatus, getDeparmentColor, getStatusColor } from './configColor'
import { getDocumentType } from './configProcess'
import { inject } from 'vue'

const avatars = {
    notAssigned: 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
}

const typesConfig = {
    default: {
        document: (process, type, document) => {
            const { t } = useI18n()

            return [
                document.supply_order.request_user && !document.supply_order.vendor && {
                    label: t('Requester'),
                    value: document.supply_order.request_user.name
                },
                document.supply_order.vendor && {
                    label: t('Vendor'),
                    value: document.supply_order.vendor.name
                },
                {
                    label: t('Requested date'),
                    value: `${formatAmericanDate(document.supply_order.requested_date)}`
                },
                {
                    label: t('Status'),
                    type: 'badge',
                    options: {
                        color: getStatusColor(document.supply_order.supply_order_status.slug)
                    },
                    value: document.supply_order.supply_order_status.name
                },
                document.supply_order_approvals.length && {
                    label: t('Approvals history'),
                    type: 'history',
                    options: {
                        open: !!document.supply_order_approvals?.find(e => e.approval == null)
                    },
                    value: buildApprovalHistory(process, type, document)
                },
            ]
        }
    },
    'material-assignment': {},
    'dispatch-note': {
        document: (process, type, document) => {
            const { t } = useI18n()

            const documentTypeMA = getDocumentType(process, 'material-assignment')

            if (documentTypeMA && documentTypeMA.process_stage_documents.length) {
                return [
                    {
                        label: t('Requester'),
                        value: document.supply_order.request_user.name
                    },
                    {
                        label: t('Register date'),
                        value: `${formatAmericanDate(document.supply_order.requested_date)}`
                    },
                    {
                        label: t('Status'),
                        type: 'badge',
                        options: {
                            color: getStatusColor(document.supply_order.supply_order_status.slug)
                        },
                        value: document.supply_order.supply_order_status.name
                    },
                    document.supply_order_approvals.length && {
                        label: t('Approvals history'),
                        type: 'history',
                        options: {
                            open: !!document.supply_order_approvals?.find(e => e.approval == null)
                        },
                        value: buildApprovalHistory(process, type, document)
                    },
                ]
            }

            const data = typesConfig.default?.document(process, type, document)

            return data
        }
    }
}

export const buildApprovalHistory = (process, type, document) => {
    return document.supply_order_approvals?.map((e, index) => {
        return {
            status: e.approval === 1 ? 'gray' : 'empty',
            type: e.approval_name ? 'user' : 'area',
            data: e.approval_name ? buildUserData(e) : buildAreaData(process, e)
        }
    })
}

export const buildUserData = (e) => {
    const useGlobalStore = inject('useGlobalStore')
    
    const { serverUrl } = useGlobalStore('core')

    return {
        name: e.approval_name,
        email: e.approval_email,
        phone: e.approval_phone,
        department: e.approval_department,
        role: e.approval_position,
        status: e.supply_order_approval_status.name,
        statusColor: getStatusColor(e.supply_order_approval_status.slug),
        containerClass: getDeparmentColor(e.approval_department),
        date: e.date_approval_or_reject ? formatAmericanSimplifiedDate(e.date_approval_or_reject) : null,
        note: e.note_approval_or_reject,
        url: e.user?.avatar ? `${serverUrl}/${e.user.avatar}` : avatars.notAssigned
    }
}

export const buildAreaData = (process, e) => {
    const useGlobalStore = inject('useGlobalStore')
    const { t } = useI18n()

    const parametersStore = useGlobalStore('parameters')

    const area = parametersStore.getItemById(process.request_area_id)

    return {
        name: t('Receiving area'),
        department: area.name,
        status: e.supply_order_approval_status.name,
        statusColor: getStatusColor(e.supply_order_approval_status.slug),
        containerClass: getDeparmentColor(e.approval_department),
        note: t('Anybody belonging to the area can receive'),
        url: avatars.notAssigned
    }
}

export const getDocument = (process, type, document) => {
    return typesConfig[type.slug]?.document ? typesConfig[type.slug]?.document(process, type, document) : typesConfig.default?.document(process, type, document)
}
