import App from './createApp'

export default () => {
    return [
        {
            path: '/transfers',
            name: 'transfers',
            meta: {
                home: true,
                title: 'Transfers'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/transfers-list',
            name: 'TransfersList',
            meta: {
                parentName: 'transfers',
                title: 'Transfers'
            },
            entry: {
                id: 'TransfersList',
                component: App
            }
        },
        {
            path: '/transfers',
            name: 'transfers',
            meta: {
                home: true,
                title: 'Transfers'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/transfers/create',
            name: 'CreateTransfer',
            meta: {
                parentName: 'transfers',
                title: 'Create transfer'
            },
            entry: {
                id: 'CreateTransfer',
                component: App
            }
        },
        {
            path: '/transfers/assignment',
            name: 'CreateAssignment',
            meta: {
                parentName: 'transfers',
                title: 'Lost & found'
            },
            entry: {
                id: 'CreateAssignment',
                component: App
            }
        },
        {
            path: '/transfers/edit/:id',
            name: 'EditTransfer',
            meta: {
                parentName: 'transfers',
                title: 'Edit transfer'
            },
            entry: {
                id: 'EditTransfer',
                component: App
            }
        },
        {
            path: '/transfers/show/:id',
            name: 'ShowTransfers',
            meta: {
                parentName: 'transfers',
                title: 'Show'
            },
            entry: {
                id: 'ShowTransfer',
                component: App
            }
        },
        // ReceiveAdjustment
        {
            path: '/transfers/receive/:id',
            name: 'Receive',
            meta: {
                parentName: 'transfers',
                title: 'Receive'
            },
            entry: {
                id: 'ReceiveAdjustment',
                component: App
            }
        },
        // ReceiveAdjustment
        {
            path: '/transfers/adjustments/:id',
            name: 'Adjustments',
            meta: {
                parentName: 'transfers',
                title: 'Adjustments'
            },
            entry: {
                id: 'Adjustments',
                component: App
            }
        },
        // Dispatch
        {
            path: '/dispatches',
            name: 'Dispatches',
            meta: {
                parentName: 'transfers',
                title: 'Dispatches'
            },
            entry: {
                id: 'Dispatches',
                component: App
            }
        },
        {
            path: '/dispatch/create',
            name: 'CreateDispatch',
            meta: {
                parentName: 'transfers',
                title: 'Create trip plan'
            },
            entry: {
                id: 'CreateDispatch',
                component: App
            }
        },
        {
            path: '/dispatch/edit/:id',
            name: 'EditDispatch',
            meta: {
                parentName: 'transfers',
                title: 'Edit trip plan'
            },
            entry: {
                id: 'EditDispatch',
                component: App
            }
        },
        {
            path: '/dispatch/show/:id',
            name: 'ShowDispatch',
            meta: {
                parentName: 'transfers',
                title: 'Show trip plan'
            },
            entry: {
                id: 'ShowDispatch',
                component: App
            }
        },
        {
            path: '/transfers/all/',
            name: 'TransfersAll',
            meta: {
                parentName: 'transfers',
                title: 'Transfers'
            },
            entry: {
                id: 'TransfersAll',
                component: App
            }
        },
    ]
}
