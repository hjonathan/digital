import App from './createApp'

export default () => {
    return [
        {
            path: '/drivers',
            name: 'Drivers',
            meta: {
                home: true,
                title: 'Drivers'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        // Transfer routes
        {
            path: '/dispatch/drivers',
            name: 'DispatchDrivers',
            meta: {
                parentName: 'transfers',
                title: 'Drivers'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
