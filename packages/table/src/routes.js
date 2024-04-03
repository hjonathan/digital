import App from './createApp'

export default () => {
    return [
        {
            path: '/table',
            name: 'table',
            meta: {
                home: true,
                title: 'Table Package'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
