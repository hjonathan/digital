import App from './createApp'

export default () => {
    return [
        {
            path: '/clients',
            name: 'Clients',
            meta: {
                home: true,
                title: 'Clients'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        // Invoicing
        {
            path: '/invoicing/clients',
            name: 'InvoicingClients',
            meta: {
                relationName: 'CreateInvoice',
                parentName: 'Invoicing',
                title: 'Clients'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
