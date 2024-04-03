// Rules for transfer buttons
export const buttonRulesDisable = {
    reject: {
        and: [
            { '===': [{ var: 'transfer_status.slug' }, 'in-transit'] },
        ]
    },
    receive: {
        and: [
            { in: [{ var: 'transfer_status.slug' }, ['in-transit', 'in-transit-rejected']] },
        ]
    },
    adjust: {
        and: [
            { in: [{ var: 'transfer_status.slug' }, ['received', 'pending-adjustment-approval']] },
        ]
    },
    accept: {
        and: [
            { in: [{ var: 'transfer_status.slug' }, ['received', 'pending-adjustment-approval']] },
        ]
    }
}
