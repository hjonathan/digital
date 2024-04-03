import App from './createApp'

export default () => {
    return [
        {
            path: '/invoicing',
            name: 'Invoicing',
            meta: {
                home: true,
                title: 'Invoicing'
            },
            entry: {
                id: 'Entry',
                component: App
            }
        },
        {
            path: '/invoicing/create',
            name: 'CreateInvoice',
            meta: {
                parentName: 'Invoicing',
                title: 'Create'
            },
            entry: {
                id: 'CreateInvoice',
                component: App
            }
        },
        {
            path: '/invoicing/edit/:id',
            name: 'EditInvoice',
            meta: {
                parentName: 'Invoicing',
                title: 'Edit'
            },
            entry: {
                id: 'EditInvoice',
                component: App
            }
        },
        {
            path: '/invoicing/draft',
            name: 'EntryDraft',
            meta: {
                parentName: 'Invoicing',
                title: 'Drafts'
            },
            entry: {
                id: 'EntryDraft',
                component: App
            }
        },
        {
            path: '/invoicing/invoiced',
            name: 'EntryInvoiced',
            meta: {
                parentName: 'Invoicing',
                title: 'Invoiced'
            },
            entry: {
                id: 'EntryInvoiced',
                component: App
            }
        },
        {
            path: '/invoicing/show/:id',
            name: 'ShowInvoice',
            meta: {
                parentName: 'Invoicing',
                title: 'Show'
            },
            entry: {
                id: 'ShowInvoice',
                component: App
            }
        },
    ]
}
