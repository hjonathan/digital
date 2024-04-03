import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./Main.vue'))
}
