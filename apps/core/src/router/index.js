import { app } from '@/createApp'
import * as Modules from '@/register'
import { isFunction, isArray } from 'lodash'
import { createWebHistory, createRouter } from 'vue-router'
import { EntryPackage } from 'packageBuilder'
import { getJSON } from 'shared'

let routes = [
    {
        path: '/',
        name: 'Home',
        components: {
            default: () => import('@/components/home/App.vue')
        },
        meta: {
            default: true,
            home: true
        }
    },
    {
        path: '/without-permission',
        name: 'WithoutPermission',
        components: {
            default: () => import('@/components/pages/WithoutPermission.vue')
        },
        meta: {
            home: true,
            title: 'Permission'
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        components: {
            default: () => import('@/components/pages/Profile.vue')
        },
        meta: {
            home: true,
            title: 'Profile'
        }
    },
    {
        path: '/test-2',
        name: 'TestDos',
        components: {
            default: () => import('@/components/test/TestDos.vue')
        },
        meta: {
            parentName: 'TestUno'
        }
    },
    {
        path: '/test-3',
        name: 'TestTres',
        components: {
            default: () => import('@/components/test/TestTres.vue')
        },
        meta: {
            parentName: 'TestUno',
            relationName: 'TestDos'
        }
    },
    {
        path: '/test-4',
        name: 'TestCuatro',
        components: {
            default: () => import('@/components/test/TestCuatro.vue')
        },
        meta: {
            parentName: 'TestUno',
            relationName: 'TestTres'
        }
    },
    {
        path: '/tailwind',
        name: 'Tailwind',
        components: {
            default: () => import('@/components/tailwind/Tailwind.vue')
        },
        meta: {
            route: true
        },
        children: []
    },
]

// Method for add routes from registered modules
const addRoutes = () => {
    for (const key in Modules) {
        const routeModule = Modules[key].routes

        if (routeModule && isFunction(routeModule)) {
            const routesPack = routeModule(EntryPackage)

            routes = routes.concat(applyEntryPackage(isArray(routesPack) ? routesPack : [routesPack]))
        }
    }

    return routes
}

// Apply EntryPackage Wrapper for new routes, building the new packages
const applyEntryPackage = (routePackage = []) =>
    routePackage.reduce((acc, value) => {
        value.entry && value.entry.id && value.entry.component &&
            acc.push(Object.assign({ ...value }, {
                components: {
                    default: EntryPackage(value.entry, value.name)
                }
            }))

        !value.entry && acc.push(value)

        return acc
    }, [])

const router = createRouter({
    history: createWebHistory(),
    routes: addRoutes()
})

// Add authentication in routes
router.beforeEach((to, from, next) => {
    const credentials = getJSON('credentials')

    if (to.meta && to.meta.requiresAuth === false) return next()

    if (!credentials) return next({ path: '/login' })

    return next()
})

app.provide('router', router)
app.use(router)

export { router }
