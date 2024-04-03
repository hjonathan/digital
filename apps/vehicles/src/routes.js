import App from './createApp'

export default () => {
    return [
        {
            path: '/vehicles',
            name: 'Vehicles',
            meta: {
                home: true,
                title: 'Vehicles'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        // Transfer routes
        {
            path: '/dispatch/vehicles',
            name: 'DispatchVehicles',
            meta: {
                parentName: 'transfers',
                title: 'Vehicles'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
