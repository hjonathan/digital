import App from './createApp'

export default () => {
    return [
        {
            path: '/vendors',
            name: 'vendors',
            meta: {
                home: true,
                title: 'Vendors'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        // Invoicing
        {
            path: '/receptions/vendors',
            name: 'ReceptionsVendors',
            meta: {
                relationName: 'ReceptionsVendors',
                parentName: 'Receptions',
                title: 'Vendors'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },

        // For PurchaseOrder
        {
            path: '/receptions/vendors',
            name: 'PurchaseOrderVendor',
            meta: {
                relationName: 'PurchaseOrderVendor',
                parentName: 'Supplies',
                title: 'Vendors'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
