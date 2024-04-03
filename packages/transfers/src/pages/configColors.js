export const badgesColors = {
    danger: ['rejected', 'in-transit-rejected'],
    info: ['draft', 'returned'],
    warning: ['pending', 'pending-dispatch', 'pending-adjustment-approval', 'received', 'items-found-pending-approval'],
    success: ['in-transit'],
    orange: ['pending-adjustment-approval-origin']
}

export const getBadgeColor = (transfer) => {
    if (!transfer) return 'secondary'

    for (const key in badgesColors) {
        if (Object.hasOwnProperty.call(badgesColors, key)) {
            const element = badgesColors[key]

            if (element.includes(transfer.transfer_status?.slug || transfer.dispatch_transfer_status?.slug)) return key
        }
    }

    return 'secondary'
}

export const getColor = (status) => {
    if (!status) return 'secondary'

    for (const key in badgesColors) {
        if (Object.hasOwnProperty.call(badgesColors, key)) {
            const element = badgesColors[key]

            if (element.includes(status || status)) return key
        }
    }

    return 'secondary'
}
