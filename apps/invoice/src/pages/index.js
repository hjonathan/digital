import { defineAsyncComponent } from 'vue'

export default {
    Entry: defineAsyncComponent(() => import('./Entry.vue')),
    EntryDraft: defineAsyncComponent(() => import('./EntryDraft.vue')),
    EntryInvoiced: defineAsyncComponent(() => import('./EntryInvoiced.vue')),
    CreateInvoice: defineAsyncComponent(() => import('./CreateInvoice.vue')),
    EditInvoice: defineAsyncComponent(() => import('./Editinvoice.vue')),
    ShowInvoice: defineAsyncComponent(() => import('./ShowInvoice.vue'))
}
