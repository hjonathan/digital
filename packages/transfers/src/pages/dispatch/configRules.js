import { genericRules } from 'jsonRules'

// Rules for transfer buttons
export const buttonRulesDisable = {
    create: {
        and: [
            genericRules.noneSelected,
        ]
    },
    show: {
        and: [
            genericRules.oneSelected,
            {
                all: [
                    { var: 'selectedRows' },
                    { '!==': [{ var: 'dispatch_transfer_status.slug' }, 'draft'] },
                ]
            },
        ]
    },
    edit: {
        and: [
            genericRules.oneSelected,
            {
                all: [
                    { var: 'selectedRows' },
                    { '===': [{ var: 'dispatch_transfer_status.slug' }, 'draft'] },
                ]
            },
        ]
    }
}

// Rules for dispatch create/edit buttons
export const dispatchButtons = {
    print: {
        and: [
            { '!==': [{ var: 'saveButton' }, true] },
            { '!==': [{ var: 'deleteButton' }, true] },
            { '!==': [{ var: 'printButton' }, true] },
            { '!==': [{ var: 'finishButton' }, true] },
            { notIn: [{ var: 'id' }, ['', null, undefined]] },
        ]
    },
    delete: {
        and: [
            { '!==': [{ var: 'saveButton' }, true] },
            { '!==': [{ var: 'deleteButton' }, true] },
            { '!==': [{ var: 'printButton' }, true] },
            { '!==': [{ var: 'finishButton' }, true] },
            { notIn: [{ var: 'id' }, ['', null, undefined]] },
        ]
    },
    saveProgress: {
        and: [
            { '!==': [{ var: 'saveButton' }, true] },
            { '!==': [{ var: 'deleteButton' }, true] },
            { '!==': [{ var: 'printButton' }, true] },
            { '!==': [{ var: 'finishButton' }, true] },
        ]
    },
    finish: {
        and: [
            { '!==': [{ var: 'saveButton' }, true] },
            { '!==': [{ var: 'deleteButton' }, true] },
            { '!==': [{ var: 'printButton' }, true] },
            { '!==': [{ var: 'finishButton' }, true] },
        ]
    }
}
