import { app } from '@/createApp'

import '@/primeVue'
import '@/locale'
import { useStore } from '@/store'
import { router } from '@/router'
import '@/tailwind.css'
import '@/primeVue.css'
import '@/theme/default/_index.css'
import '@/directives/index'
import { api, initBefore } from '@/config'

initBefore({ useStore, api, router })

app.mount('#app')

// It is only possible to provide this object after mounting the vue instance.
app.provide('api', api)
