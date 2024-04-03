// Rules for invoice edit buttons
export const buttonRulesDisable = {
    save: {
        or: [
            { '===': [{ var: 'saveButton' }, true] },
            { '===': [{ var: 'validateSaveInvoice' }, false] },
        ]
    },
    invoice: {
        or: [
            { '===': [{ var: 'validateSaveInvoice' }, false] },
            { in: [{ var: 'client' }, [undefined, null, '']] },
            { '===': [{ var: 'invoiceButton' }, true] },
            { '===': [{ var: 'lengthItemList' }, 0] },
            { '!!': [{ var: 'errors' }] },
        ]
    },
    print: {
        or: [
            { '===': [{ var: 'validateSaveInvoice' }, false] },
            { in: [{ var: 'client' }, [undefined, null, '']] },
            { '===': [{ var: 'printButton' }, true] },
            { '===': [{ var: 'lengthItemList' }, 0] },
            { '!!': [{ var: 'errors' }] },
        ]
    },
    deleteDraft: {
        in: [{ var: 'id' }, [undefined, null, '']]
    }
}
