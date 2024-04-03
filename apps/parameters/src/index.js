import routes from './routes'
import locales from './locale'
import * as stores from './store'
import { initStores } from './store/init'
import { initBefore } from './tasks/initTasks'
import nav from './nav'

export { routes, locales, nav, stores, initStores, initBefore }
