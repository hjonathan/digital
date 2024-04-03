import App from './createApp'

export default () => {
    return [
        {
            path: '/parameters',
            name: 'Parameters',
            meta: {
                home: true,
                title: 'Parameters'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
