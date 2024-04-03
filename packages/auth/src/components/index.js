import { defineAsyncComponent } from 'vue'

export default {
    Login: defineAsyncComponent(() => import('./Login.vue')),
    Logout: defineAsyncComponent(() => import('./Logout.vue'))
}
