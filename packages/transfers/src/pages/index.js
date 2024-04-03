import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./main/Dashboard.vue')),
    TransfersAll: defineAsyncComponent(() => import('./transfersList/TransfersList.vue')),
    Transfer: defineAsyncComponent(() => import('./transfer/Transfer.vue')),
    CreateTransfer: defineAsyncComponent(() => import('./main/CreateTransfer.vue')),
    CreateAssignment: defineAsyncComponent(() => import('./main/CreateAssignment.vue')),
    EditTransfer: defineAsyncComponent(() => import('./main/EditTransfer.vue')),
    ShowTransfer: defineAsyncComponent(() => import('./show/ShowTransfer.vue')),
    // Dispatch
    Dispatches: defineAsyncComponent(() => import('./dispatch/Dispatches.vue')),
    CreateDispatch: defineAsyncComponent(() => import('./dispatch/CreateDispatch.vue')),
    EditDispatch: defineAsyncComponent(() => import('./dispatch/EditDispatch.vue')),

    ShowDispatch: defineAsyncComponent(() => import('./dispatch/ShowDispatch.vue')),

    ReceiveAdjustment: defineAsyncComponent(() => import('./receiveAdjustment/ReceiveAdjustment.vue')),
    Adjustments: defineAsyncComponent(() => import('./adjustments/Adjustments.vue'))
}
