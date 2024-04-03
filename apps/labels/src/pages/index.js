import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./main/Main.vue')),
    Create: defineAsyncComponent(() => import('./Save.vue')),
    Edit: defineAsyncComponent(() => import('./Save.vue')),
    Clone: defineAsyncComponent(() => import('./Save.vue')),
    Print: defineAsyncComponent(() => import('./Print.vue'))
}
