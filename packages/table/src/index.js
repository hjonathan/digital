import routes from './routes'
import locales from './locale'
import * as stores from './store'
import { initStores } from './store/init'
import nav from './nav'
import Table from './components/Table.vue'

export { routes, locales, nav, stores, initStores, Table }

export * from './components/cellInterface'
export * from './components/content'
export * from './components/filterParams'
export * from './components/filterTemplates'
export * from './components/configTable'
