/**
 * INVENTORY CONFIG RULES
 * File containing the rules used in the inventory module.
*/

import { showUuid } from 'shared'
import { genericRules } from 'jsonRules'
import { mdiLockOutline, mdiFlaskEmptyOutline } from '@mdi/js'

/**
 * Json Rules for inventory screens : IMPORTANT, These are rules to show the buttons
 */
export const rules = {
    lock: {
        all: [
            { var: 'selectedRows' },
            {
                in: [{ var: 'item_lock_type.slug' }, ['invoice-draft', 'unlock', 'lab-sample']]
            },
        ]
    },
    quarantine: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'item_lock_type.slug' }, ['in-quarantine']] },
                ]
            },
        ]
    },
    unlock: {
        allIn: [{ var: 'selectedRows' }, 'item_lock_type.slug', ['by-user', 'possible-contamination', 'recall']]
    },
    recall: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'item_lock_type.slug' }, ['unlock', 'by-user']] },
                    { '===': [{ var: 'laboratory_pass' }, 1] }, // laboratory_pass state : { 1 => 'Pass' }
                ]
            },
        ]
    },
    possibleContamination: {
        all: [
            { var: 'selectedRows' },
            {
                in: [{ var: 'item_lock_type.slug' }, ['invoice-draft', 'unlock', 'by-user']]
            },
        ]
    },
    confirmContamination: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'item_lock_type.slug' }, ['possible-contamination', 'recall']] },
                ]
            },
        ]
    },
    dispose: {
        all: [
            { var: 'selectedRows' },
            {
                in: [{ var: 'item_lock_type.slug' }, ['contaminated']]
            },
        ]
    },
    /**
     * Cultivation
     */
    cull: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'item_type.slug' }, ['plant', 'tissue', 'clone', 'seed', 'mom']] },
                ]
            },
        ]
    },
    propagate: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'stage.slug' }, ['received']] },
                    { in: [{ var: 'item_type.slug' }, ['seed', 'tissue', 'clone']] },
                    { in: [{ var: 'measure.slug' }, ['units']] },
                ]
            },
        ]
    },
    createMom: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    {
                        or: [
                            {
                                and: [
                                    { in: [{ var: 'stage.slug' }, ['propagation']] },
                                    { in: [{ var: 'item_type.slug' }, ['seed', 'tissue', 'clone']] },
                                ]
                            },
                            {
                                and: [
                                    { in: [{ var: 'stage.slug' }, ['vegetation', 'received']] },
                                    { in: [{ var: 'item_type.slug' }, ['plant']] },
                                ]
                            },
                        ]
                    },
                    { '===': [{ var: 'measure.slug' }, 'units'] },
                ]
            },
        ]
    },
    beginVegetation: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    {
                        and: [
                            { in: [{ var: 'stage.slug' }, ['propagation', 'received']] },
                            { in: [{ var: 'item_type.slug' }, ['seed', 'tissue', 'clone', 'plant']] },
                        ]
                    },
                    { '===': [{ var: 'measure.slug' }, 'units'] },
                ]
            },
        ]
    },
    makeClones: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'stage.slug' }, ['mother']] },
                    { in: [{ var: 'item_type.slug' }, ['mom']] },
                    { in: [{ var: 'measure.slug' }, ['units']] },
                ]
            },
        ]
    },
    seedUp: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'stage.slug' }, ['received']] },
                    { in: [{ var: 'item_type.slug' }, ['seed']] },
                    { in: [{ var: 'measure.slug' }, ['units']] },
                ]
            },
        ]
    },
    beginFlower: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'stage.slug' }, ['vegetation', 'mother']] },
                    { in: [{ var: 'item_type.slug' }, ['plant', 'mom']] },
                    { in: [{ var: 'measure.slug' }, ['units']] },
                ]
            },
        ]
    },
    harvest: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'stage.slug' }, ['flowering']] },
                    { in: [{ var: 'item_type.slug' }, ['plant']] },
                    { in: [{ var: 'measure.slug' }, ['units']] },
                ]
            },
        ]
    },
    packaging: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'stage.slug' }, ['received', 'bulk']] },
                    { notIn: [{ var: 'item_type.slug' }, ['plant']] },
                ]
            },
        ]
    },

    /**
     * Processing
     */
    destem: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'item_type.slug' }, ['harvest-wt']] },
                    { in: [{ var: 'stage.slug' }, ['harvested']] },
                ]
            },
        ]
    },
    debud: {
        all: [
            { var: 'selectedRows' },
            {
                or: [
                    {
                        and: [
                            { in: [{ var: 'item_type.slug' }, ['harvest-wt']] },
                            { in: [{ var: 'stage.slug' }, ['harvested']] },
                        ]
                    },
                    {
                        and: [
                            { in: [{ var: 'item_type.slug' }, ['hang-wt']] },
                            { in: [{ var: 'stage.slug' }, ['drying']] },
                        ]
                    },
                ]
            },
        ]
    },
    machineTrim: {
        all: [
            { var: 'selectedRows' },
            {
                or: [
                    {
                        and: [
                            { in: [{ var: 'item_type.slug' }, ['wet-wt']] },
                            { in: [{ var: 'stage.slug' }, ['harvested']] },
                        ]
                    },
                    {
                        and: [
                            { in: [{ var: 'item_type.slug' }, ['dry-wt', 'bud-wt']] },
                            { in: [{ var: 'stage.slug' }, ['cure']] },
                        ]
                    },
                ]
            },
        ]
    },
    reweight: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { notIn: [{ var: 'measure.slug' }, ['units']] },
                ]
            },
        ]
    },
    takeLabSample: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { notIn: [{ var: 'item_lock_type.slug' }, ['lab-sample']] },
                    { in: [{ var: 'measure.slug' }, ['grams']] },
                    { in: [{ var: 'laboratory_pass' }, [null, 0]] }, // laboratory_pass states : { 0 => 'Failed', null => 'Does not exist' }
                ]
            },
        ]
    },
    retakeLabSample: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { in: [{ var: 'item_lock_type.slug' }, ['lab-sample']] },
                    { notIn: [{ var: 'item_type.slug' }, ['lab-sample']] },
                ]
            },
        ]
    },
    sendLabSample: {
        all: [
            { var: 'selectedRows' },
            {
                and: [{
                    in: [{ var: 'item_type.slug' }, ['lab-sample']]
                }, {
                    notIn: [{ var: 'status.slug' }, ['awaiting-lab-results', 'second-failed-lab-results', 'passed-lab-results', 'third-failed-lab-results']]
                }]
            },
        ]
    },
    manageLabSample: {
        all: [
            { var: 'selectedRows' },
            {
                and: [{ in: [{ var: 'item_type.slug' }, ['lab-sample']] }]
            },
        ]
    },
    labSampleLockType: {
        all: [
            { var: 'selectedRows' },
            {
                in: [{ var: 'item_lock_type.slug' }, 'lab-sample']
            },
        ]
    }
}

/**
 * ACTION RULES
 * Contains the rules for all the rules used in the action buttons used in the inventory
 */
export const actionRules = {
    receive: {
        and: [
            genericRules.noneSelected,
        ]
    },
    /**
     * Primary Rules
     */
    move: {
        and: [
            genericRules.oneSelected,
            genericRules.notParent,
        ]
    },
    convert: {
        and: [
            genericRules.oneSelected,
            genericRules.notParent,
        ]
    },
    genericAction: {
        and: [
            genericRules.oneSelected,
            genericRules.unlocked,
            genericRules.notParent,
        ]
    },
    split: {
        and: [
            genericRules.oneSelected,
            genericRules.isItem,
            genericRules.unlocked,
            genericRules.notParent,
        ]
    },
    combine: {
        and: [
            genericRules.moreThanOneSelected,
            genericRules.isItem,
            genericRules.unlocked,
            genericRules.notParent,
        ]
    },
    rejoin: {
        and: [
            genericRules.moreThanOneSelected,
            genericRules.isSubitem,
            genericRules.unlocked,
        ]
    },
    /**
     * Lock Section
     */
    lock: {
        and: [
            rules.lock,
        ]
    },
    toLot: {
        and: [
            genericRules.isSubitem,
            genericRules.unlocked,
            genericRules.oneSelected,
        ]
    },
    quarantine: {
        and: [
            rules.quarantine,
        ]
    },
    unlock: {
        and: [
            genericRules.sameBatch,
            rules.unlock,
        ]
    },
    /**
     * Teal Rules
     */
    cull: {
        and: [
            rules.cull,
            genericRules.unlocked,
            genericRules.oneSelected,
            genericRules.isItem,
        ]
    },
    propagate: {
        and: [
            rules.propagate,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    createMom: {
        and: [
            rules.createMom,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    makeClones: {
        and: [
            rules.makeClones,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    beginVegetation: {
        and: [
            rules.beginVegetation,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    beginFlower: {
        and: [
            rules.beginFlower,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    harvest: {
        and: [
            rules.harvest,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    seedUp: {
        and: [
            rules.seedUp,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    /**
     * Yellow Color Rules
     */
    destem: {
        and: [
            rules.destem,
            genericRules.unlocked,
            genericRules.oneSelected,
        ]
    },
    debud: {
        and: [
            rules.debud,
            genericRules.unlocked,
            {
                or: [
                    { and: [genericRules.isItem, genericRules.oneSelected] },
                    { and: [genericRules.isSubitem, genericRules.oneOrMoreSelected] },
                ]
            },
        ]
    },
    machineTrim: {
        and: [
            rules.machineTrim,
            genericRules.unlocked,
            genericRules.oneSelected,
            genericRules.isItem,
        ]
    },
    packaging: {
        and: [
            rules.packaging,
            genericRules.unlocked,
            genericRules.oneSelected,
            genericRules.isItem,
        ]
    },
    reweight: {
        and: [
            rules.reweight,
            genericRules.oneSelected,
            genericRules.notParent,
            {
                or: [
                    genericRules.isItem,
                    genericRules.isSubitem,
                ]
            },
            {
                or: [
                    genericRules.unlocked,
                    rules.labSampleLockType,
                ]
            },
        ]
    },
    takeLabSample: {
        and: [
            rules.takeLabSample,
            genericRules.unlocked,
            {
                or: [
                    genericRules.isItem,
                    genericRules.isSubitem,
                ]
            },
        ]
    },
    retakeLabSample: {
        and: [
            rules.retakeLabSample,
            {
                or: [
                    genericRules.isItem,
                    genericRules.isSubitem,
                ]
            },
        ]
    },
    sendLabSample: {
        and: [
            rules.sendLabSample,
            genericRules.isItem,
            genericRules.oneSelected,
        ]
    },
    manageLabSample: {
        and: [
            rules.manageLabSample,
            genericRules.oneSelected,
        ]
    },
    /**
     * Red color rules
     */
    possibleContamination: {
        and: [
            rules.possibleContamination,
            genericRules.sameBatch,
            genericRules.oneOrMoreSelected,
        ]
    },
    dispose: {
        and: [
            rules.dispose,
            genericRules.sameBatch,
            genericRules.oneOrMoreSelected,
        ]
    },
    confirmContamination: {
        and: [
            rules.confirmContamination,
            genericRules.sameBatch,
            genericRules.oneOrMoreSelected,
        ]
    },
    recall: {
        and: [
            rules.recall,
        ]
    }
}

/**
 * ACTION RULES
 * Contains the rules for all the rules used in the action buttons used in the inventory
 */
export const businessRules = {
    selectItemByTransfer: {
        and: [
            { notIn: [{ var: 'item_lock_type.slug' }, ['invoice-draft', 'transfer-draft', 'registered-in-transfer']] },
            { '===': [{ var: 'children_count' }, 0] },
        ]
    }
}

/**
 * Object containing information about the lockReason cell in the inventory table
 */
export const lockReasonBase = {
    primary: {
        color: '',
        icon: mdiLockOutline,
        formatter (data) {
            return `${data.item_lock_type.name}`
        }
    }
}

export const lockReason = {
    'invoice-draft': {
        color: 'primary',
        icon: mdiLockOutline,
        formatter (data) {
            return `${data.item_lock_type.name} (${data.invoice_draft_items?.length ? data.invoice_draft_items[0].invoice_draft_id : ''})`
        }
    },
    'transfer-draft': {
        color: 'primary',
        icon: mdiLockOutline,
        formatter (data) {
            return `${data.item_lock_type.name} (${data.item_transfer_drafs?.length ? showUuid(data.item_transfer_drafs[0].transfer_draft_id) : ''})`
        }
    },
    'registered-in-transfer': lockReasonBase.primary,
    recall: {
        color: 'red',
        icon: mdiLockOutline,
        formatter (data) {
            return `${data.item_lock_type.name}`
        }
    },
    contaminated: {
        color: 'red',
        icon: mdiLockOutline,
        formatter (data) {
            return `${data.item_lock_type.name}`
        }
    },
    'by-user': {
        color: '',
        icon: mdiLockOutline,
        formatter (data) {
            return `${data.item_lock_type.name} ${data.user_name}`
        }
    },
    'multiple-locked-reasons': lockReasonBase.primary,
    'possible-contamination': lockReasonBase.primary,
    'in-quarantine': lockReasonBase.primary,
    'lab-sample': {
        color: '',
        icon: mdiFlaskEmptyOutline,
        formatter (data) {
            return `${data.item_lock_type.name}`
        }
    }
}
