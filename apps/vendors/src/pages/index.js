import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./main/Main.vue'))
}
