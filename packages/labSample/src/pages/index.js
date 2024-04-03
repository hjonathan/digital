import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./main/Main.vue')),
    SendLabSample: defineAsyncComponent(() => import('./sendLabSample/SendLabSample.vue')),
    ReceiveLabResult: defineAsyncComponent(() => import('./receiveLabResult/ReceiveLabResult.vue')),
    ShowLabSample: defineAsyncComponent(() => import('./showLabSample/ShowLabSample.vue'))
}
