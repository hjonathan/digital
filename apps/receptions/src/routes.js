import App from './createApp'

export default () => {
    return [
        // Receptions
        {
            path: '/receptions',
            name: 'Receptions',
            meta: {
                home: true,
                title: 'Receive'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/receptions/all',
            name: 'ReceptionsAll',
            meta: {
                parentName: 'Receptions',
                title: 'Receptions'
            },
            entry: {
                id: 'ReceptionsAll',
                component: App
            }
        },
        {
            path: '/receptions/create',
            name: 'ReceptionCreate',
            meta: {
                parentName: 'Receptions',
                title: 'Create reception'
            },
            entry: {
                id: 'ReceptionCreate',
                component: App
            }
        },
        {
            path: '/receptions/show/:id',
            name: 'ReceptionShow',
            meta: {
                parentName: 'Receptions',
                title: 'Show'
            },
            entry: {
                id: 'ReceptionShow',
                component: App
            }
        },
        {
            path: '/receptions/edit/:id',
            name: 'EditReception',
            meta: {
                parentName: 'Inventory',
                title: 'Edit reception'
            },
            entry: {
                id: 'EditReception',
                component: App
            }
        },

    ]
}
