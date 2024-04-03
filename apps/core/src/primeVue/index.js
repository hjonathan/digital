// Core
import { app } from '@/createApp'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

// Use
app.use(PrimeVue)
app.use(ToastService)

export const use = {
    PrimeVue,
    ToastService
}

app.provide('use', use)
