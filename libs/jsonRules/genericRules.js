/**
 * GENERIC RULES
 * File containing general rules to apply to different packages.
 */

// Lock rules
export const lockRules = {
    // Verify if item is lock by some property
    lock: {
        and: [
            { in: [{ var: 'item_lock_type.slug' }, ['invoice-draft', 'transfer-draft', 'by-user', 'possible-contamination', 'recall', 'contaminated', 'in-quarantine', 'lab-sample', 'registered-in-transfer']] },
        ]
    },
    unlocked: {
        and: [
            { notIn: [{ var: 'item_lock_type.slug' }, ['invoice-draft', 'transfer-draft', 'by-user', 'possible-contamination', 'recall', 'contaminated', 'in-quarantine', 'lab-sample', 'registered-in-transfer']] },
        ]
    }
}

// Generic rules to use alone or in combination with others
export const genericRules = {
    oneOrMoreSelected: {
        and: [
            { '>=': [{ var: 'selectedRows.length' }, 1] },
        ]
    },
    oneSelected: {
        and: [
            { '===': [{ var: 'selectedRows.length' }, 1] },
        ]
    },
    noneSelected: {
        and: [
            { '===': [{ var: 'selectedRows.length' }, 0] },
        ]
    },
    moreThanOneSelected: {
        and: [
            { '>': [{ var: 'selectedRows.length' }, 1] },
        ]
    },
    isItem: {
        all: [
            { var: 'selectedRows' },
            { '===': [{ var: 'type.slug' }, 'item'] },
        ]
    },
    isSubitem: {
        all: [
            { var: 'selectedRows' },
            { '===': [{ var: 'type.slug' }, 'sub-item'] },
        ]
    },
    unlocked: {
        all: [
            { var: 'selectedRows' },
            { and: lockRules.unlocked },
        ]
    },
    notParent: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { '===': [{ var: 'children_count' }, 0] },
                ]
            },
        ]
    },
    sameBatch: {
        allEqual: [{ var: 'selectedRows' }, 'batch_id', { var: 'selectedRows.0.batch_id' }]
    }
}
