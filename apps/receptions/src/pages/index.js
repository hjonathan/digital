import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./main/Main.vue')),
    ReceptionsAll: defineAsyncComponent(() => import('./receptionsList/ReceptionsList.vue')),
    ReceptionCreate: defineAsyncComponent(() => import('./receptionCreate/ReceptionCreate.vue'))
}
