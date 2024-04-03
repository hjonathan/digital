import App from './createApp'

export default () => {
    return [
        {
            path: '/base-package',
            name: 'base-package',
            meta: {
                home: true,
                title: 'Base Package'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
