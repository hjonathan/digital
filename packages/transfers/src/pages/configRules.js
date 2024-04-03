import { genericRules } from 'jsonRules'
import { getSessionJSON } from 'shared'

const currentFacilityId = getSessionJSON('facility_id')

export const baseRules = {
    destination: {
        and: [
            { '===': [{ var: 'destination_facility_id' }, currentFacilityId] },
            { '!==': [{ var: 'origin_facility_id' }, currentFacilityId] },
        ]
    },
    origin: {
        and: [
            { '!==': [{ var: 'destination_facility_id' }, currentFacilityId] },
            { '===': [{ var: 'origin_facility_id' }, currentFacilityId] },
        ]
    },
    adjustmentRejected: {
        and: [
            { in: [{ var: 'transfer_status.slug' }, ['adjustment-rejected']] },
        ]
    },
    inTransit: {
        and: [
            { in: [{ var: 'transfer_status.slug' }, ['in-transit']] },
        ]
    },
    inTransitRejected: {
        and: [
            { in: [{ var: 'transfer_status.slug' }, ['in-transit-rejected']] },
        ]
    }
}

// Rules for transfer buttons
export const rules = {
    rejectTransfer: {
        and: [
            baseRules.destination,
            { '===': [{ var: 'transfer_status.slug' }, 'in-transit'] },
        ]
    },
    receiveTransfer: {
        or: [
            {
                and: [
                    baseRules.destination,
                    baseRules.inTransit,
                ]
            },
            {
                and: [
                    baseRules.origin,
                    baseRules.inTransitRejected,
                ]
            },
        ]
    },
    adjustTransfer: {
        and: [
            baseRules.destination,
            { '===': [{ var: 'transfer_status.slug' }, 'received'] },
        ]
    },
    acceptTransfer: {
        and: [
            baseRules.destination,
            { '===': [{ var: 'transfer_status.slug' }, 'received'] },
        ]
    },
    cancelTransfer: {
        and: [
            baseRules.origin,
            { '===': [{ var: 'transfer_status.slug' }, 'in-transit'] },
        ]
    },
    adjustOrigin: {
        and: [
            baseRules.origin,
            { '===': [{ var: 'transfer_status.slug' }, 'pending-adjustment-approval-origin'] },
        ]
    },
    adjustDestination: {
        and: [
            baseRules.destination,
            { in: [{ var: 'transfer_status.slug' }, ['received', 'adjustment-rejected']] },
        ]
    },
    acceptItemFound: {
        and: [
            baseRules.destination,
            { '===': [{ var: 'transfer_status.slug' }, 'items-found-pending-approval'] },
        ]
    },
    cancelAdjust: {
        and: [
            baseRules.destination,
            { '===': [{ var: 'transfer_status.slug' }, 'adjustment-rejected'] },
        ]
    }
}

// Rules for transfer buttons
export const listingRules = {
    transfers: {
        or: [
            {
                and: [
                    baseRules.destination,
                    { notIn: [{ var: 'transfer_status.slug' }, ['pending-dispatch']] },
                ]
            },
            baseRules.origin,
        ]
    }
}
