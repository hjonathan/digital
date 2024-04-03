/**
 * Lab result main rules configuration
 */
export const actionRules = {
    print: {
        and: [
            { '===': [{ var: 'printButton' }, false] },
        ]
    },
    save: {
        and: [
            { '===': [{ var: 'saveButton' }, false] },
        ]
    }
}
