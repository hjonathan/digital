import { genericRules } from 'jsonRules'
import { getSessionJSON } from 'shared'

const currentFacilityId = getSessionJSON('facility_id')

// Rules for transfer buttons
export const buttonRulesDisable = {
    create: {
        and: [
            genericRules.noneSelected,
        ]
    },
    edit: {
        and: [
            genericRules.oneSelected,
            {
                all: [
                    { var: 'selectedRows' },
                    { '===': [{ var: 'transfer_status.slug' }, 'draft'] },
                ]
            },
        ]
    },
    show: {
        and: [
            genericRules.oneSelected,
            {
                all: [
                    { var: 'selectedRows' },
                    { notIn: [{ var: 'transfer_status.slug' }, ['']] },
                ]
            },
        ]
    },
    receive: {
        and: [
            genericRules.oneSelected,
            {
                or: [
                    {
                        all: [
                            { var: 'selectedRows' },
                            {
                                and: [
                                    { in: [{ var: 'transfer_status.slug' }, ['in-transit']] },
                                    { '===': [{ var: 'destination_facility_id' }, currentFacilityId] },
                                    { '!==': [{ var: 'origin_facility_id' }, currentFacilityId] },
                                ]
                            },
                        ]
                    },
                    {
                        all: [
                            { var: 'selectedRows' },
                            {
                                and: [
                                    { '===': [{ var: 'transfer_status.slug' }, 'in-transit-rejected'] },
                                    { '!==': [{ var: 'destination_facility_id' }, currentFacilityId] },
                                    { '===': [{ var: 'origin_facility_id' }, currentFacilityId] },
                                ]
                            },
                        ]
                    },
                ]
            },
        ]
    },
    adjustment: {
        and: [
            genericRules.oneSelected,
            {
                all: [
                    { var: 'selectedRows' },
                    {
                        and: [
                            { in: [{ var: 'transfer_status.slug' }, ['pending-adjustment-approval']] },
                            { '!==': [{ var: 'destination_facility_id' }, currentFacilityId] },
                            { '===': [{ var: 'origin_facility_id' }, currentFacilityId] },
                        ]
                    },
                ]
            },
        ]
    }
}

export const buttonRuleTransfers = {
    save: {
        and: [
            { notIn: [{ var: 'origin_facility_id' }, [null, undefined, '']] },
            { notIn: [{ var: 'destination_facility_id' }, [null, undefined, '']] },
            { notIn: [{ var: 'itemsLength' }, [null, undefined, '', 0]] },
            { '===': [{ var: 'saveButton' }, false] },
        ]
    }
}

export const dashboardRules = {
    incoming: {
        or: [
            {
                and: [
                    { in: [{ var: 'destination_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['in-transit']] },
                ]
            },
            {
                and: [
                    { in: [{ var: 'origin_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['in-transit-rejected']] },
                ]
            },
        ]

    },
    received: {
        or: [
            {
                and: [
                    { in: [{ var: 'destination_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['received']] },
                ]
            },
        ]
    },
    adjustment: {
        or: [
            {
                and: [
                    { in: [{ var: 'origin_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['pending-adjustment-approval-origin']] },
                ]
            },
            {
                and: [
                    { in: [{ var: 'destination_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['adjustment-rejected']] },
                ]
            },
        ]
    },
    sended: {
        or: [
            {
                and: [
                    { in: [{ var: 'origin_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['in-transit']] },
                ]
            },
        ]
    },
    itemsFound: {
        or: [
            {
                and: [
                    { in: [{ var: 'destination_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['items-found-pending-approval']] },
                ]
            },
            {
                and: [
                    { in: [{ var: 'origin_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['items-found-pending-approval']] },
                ]
            },
        ]
    },
    completedTransfers: {
        or: [
            {
                and: [
                    { in: [{ var: 'origin_facility_id' }, [currentFacilityId]] },
                    { in: [{ var: 'transfer_status.slug' }, ['completed']] },
                ]
            },
        ]
    },
    draftDispatches: {
        and: [
            { in: [{ var: 'dispatch_transfer_status.slug' }, ['draft']] },
        ]
    },
    intransitDispatches: {
        and: [
            { in: [{ var: 'dispatch_transfer_status.slug' }, ['in-transit']] },
        ]
    },
    pendingDispatches: {
        and: [
            { in: [{ var: 'dispatch_transfer_status.slug' }, ['pending-dispatch']] },
        ]
    }
}
