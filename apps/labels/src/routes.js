import App from './createApp'

export default () => {
    return [
        {
            path: '/labels',
            name: 'Labels',
            meta: {
                home: true,
                title: 'Labels'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/labels/create',
            name: 'LabelsCreate',
            meta: {
                parentName: 'Labels',
                title: 'LabelsCreate'
            },
            entry: {
                id: 'Create',
                component: App
            }
        },
        {
            path: '/labels/edit/:id',
            name: 'LabelsEdit',
            meta: {
                parentName: 'Labels',
                title: 'Edit'
            },
            entry: {
                id: 'Edit',
                component: App
            }
        },
        {
            path: '/labels/clone/:id',
            name: 'LabelsClone',
            meta: {
                parentName: 'Labels',
                title: 'Clone'
            },
            entry: {
                id: 'Clone',
                component: App
            }
        },
        {
            path: '/labels/print',
            name: 'labels-print',
            meta: {
                parentName: 'Labels',
                title: 'Print'
            },
            entry: {
                id: 'Print',
                component: App
            }
        },
    ]
}
