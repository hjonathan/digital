/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/
import * as Modules from '@/register'
import { isFunction } from 'lodash'
import { HomeIcon } from '@heroicons/vue/24/outline'

export const navigation = () => {
    const lessThan = -1
    const greaterThan = 1
    const equal = 0

    const navs = [
        {
            path: '/',
            name: 'Home',
            meta: {
                title: 'Home'
            },
            icon: HomeIcon,
            index: 1
        },
    ]

    // Statement to add navs from registered modules
    for (const key in Modules) {
        const routeModule = Modules[key]?.nav

        if (routeModule && isFunction(routeModule)) {
            const response = routeModule()

            response && navs.push(routeModule())
        }
    }

    // Navigation menu reordering
    navs.sort((a, b) => {
        // a is less than b by some ordering criterion
        if ((a.index && !b.index) || (a.index && b.index && a.index <= b.index)) {
            return lessThan
        }

        // a is greater than b by the ordering criterion
        if ((!a.index && b.index) || (a.index && b.index && a.index >= b.index)) {
            return greaterThan
        }

        // a must be equal to b
        return equal
    })

    return navs
}
