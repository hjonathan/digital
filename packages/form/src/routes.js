import App from './createApp'

export default () => {
    return [
        {
            path: '/form',
            name: 'Form',
            meta: {
                home: true,
                title: 'Form'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
