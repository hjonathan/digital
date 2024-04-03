import App from './createApp'

export default () => {
    return [
        {
            path: '/inventory',
            name: 'Inventory',
            meta: {
                home: true,
                title: 'Inventory'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/inventory/propagate',
            name: 'Propagate',
            meta: {
                title: 'Propagate',
                parentName: 'Inventory'
            },
            entry: {
                id: 'Propagate',
                component: App
            }
        },
        {
            path: '/inventory/harvest',
            name: 'Harvest',
            meta: {
                title: 'Harvest',
                parentName: 'Inventory'
            },
            entry: {
                id: 'Harvest',
                component: App
            }
        },
        {
            path: '/inventory/make-clone',
            name: 'MakeClone',
            meta: {
                title: 'Make clone',
                parentName: 'Inventory'
            },
            entry: {
                id: 'MakeClone',
                component: App
            }
        },
        {
            path: '/inventory/begin-vegetation',
            name: 'BeginVegetation',
            meta: {
                title: 'Begin vegetation',
                parentName: 'Inventory'
            },
            entry: {
                id: 'BeginVegetation',
                component: App
            }
        },
        {
            path: '/inventory/begin-flower',
            name: 'BeginFlower',
            meta: {
                title: 'Begin flower',
                parentName: 'Inventory'
            },
            entry: {
                id: 'BeginFlower',
                component: App
            }
        },
        {
            path: '/inventory/seed-up',
            name: 'SeedUp',
            meta: {
                title: 'Seed up',
                parentName: 'Inventory'
            },
            entry: {
                id: 'SeedUp',
                component: App
            }
        },
        {
            path: '/inventory/create-mom',
            name: 'CreateMom',
            meta: {
                title: 'Create mom',
                parentName: 'Inventory'
            },
            entry: {
                id: 'CreateMom',
                component: App
            }
        },
        {
            path: '/inventory/machine-trim',
            name: 'MachineTrim',
            meta: {
                title: 'Machine trim',
                parentName: 'Inventory'
            },
            entry: {
                id: 'MachineTrim',
                component: App
            }
        },
        {
            path: '/inventory/packaging',
            name: 'Packaging',
            meta: {
                title: 'Packaging',
                parentName: 'Inventory'
            },
            entry: {
                id: 'Packaging',
                component: App
            }
        },
        {
            path: '/inventory/subitem/:id',
            name: 'inventory subitem',
            meta: {
                parentName: 'Inventory'
            },
            entry: {
                id: 'SubitemList',
                component: App
            }
        },
        {
            path: '/inventory/split/:id',
            name: 'inventory-split',
            meta: {
                parentName: 'Inventory',
                title: 'Inventory split'
            },
            entry: {
                id: 'Split',
                component: App
            }
        },
        {
            path: '/inventory/combine',
            name: 'inventory-combine',
            meta: {
                parentName: 'Inventory',
                title: 'Combine'
            },
            entry: {
                id: 'Combine',
                component: App
            }
        },
        {
            path: '/inventory/subdivide/:id',
            name: 'inventory-subdivide',
            meta: {
                parentName: 'Inventory',
                title: 'Inventory subdivide'
            },
            entry: {
                id: 'Subdivide',
                component: App
            }
        },
        // Routes for processing
        {
            path: '/inventory/de-stem',
            name: 'DeStem',
            meta: {
                title: 'DeStem',
                parentName: 'Inventory'
            },
            entry: {
                id: 'DeStem',
                component: App
            }
        },
        {
            path: '/inventory/debud',
            name: 'Debud',
            meta: {
                title: 'Debud',
                parentName: 'Inventory'
            },
            entry: {
                id: 'Debud',
                component: App
            }
        },
        {
            path: '/inventory/machine-trim',
            name: 'MachineTrim',
            meta: {
                title: 'MachineTrim',
                parentName: 'Inventory'
            },
            entry: {
                id: 'MachineTrim',
                component: App
            }
        },
        // Invoicing route
        {
            path: '/invoicing/inventory',
            name: 'invoiceInventory',
            meta: {
                relationName: 'CreateInvoice',
                parentName: 'Invoicing',
                title: 'Inventory'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        // Transfers route
        {
            path: '/transfers/inventory',
            name: 'transfersInventory',
            meta: {
                relationName: 'TransfersInventory',
                parentName: 'transfers',
                title: 'Inventory'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
