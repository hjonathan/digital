import App from './createApp'

export default () => {
    return [
        {
            path: '/login',
            name: 'login',
            meta: {
                requiresAuth: false,
                route: true
            },
            entry: {
                id: 'Login',
                component: App
            },
            components: {
                default: () => import('./components/Login.vue')
            }
        },
        {
            path: '/logout',
            name: 'logout',
            meta: {
                requiresAuth: false,
                route: true
            },
            entry: {
                id: 'Logout',
                component: App
            }
        },
    ]
}
