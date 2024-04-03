import App from './createApp'

export default () => {
    return [
        {
            path: '/facilities',
            name: 'Facilities',
            meta: {
                home: true,
                title: 'Facilities'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        // Transfer routes
        {
            path: '/transfers/facilities',
            name: 'transferFacilities',
            meta: {
                parentName: 'transfers',
                title: 'Facilities'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
