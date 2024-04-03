import { RectangleStackIcon } from '@heroicons/vue/24/outline'

export default () => {
    return {
        icon: RectangleStackIcon,
        meta: {
            title: 'Invoicing'
        },
        children: [
            {
                name: 'Invoicing',
                path: '/invoicing',
                icon: RectangleStackIcon,
                meta: {
                    title: 'Home'
                }
            },
            {
                name: 'CreateInvoice',
                path: '/invoicing/create',
                icon: RectangleStackIcon,
                meta: {
                    title: 'Create invoice'
                }
            },
            {
                name: 'EntryDraft',
                path: '/invoicing/draft',
                icon: RectangleStackIcon,
                meta: {
                    title: 'Drafts'
                }
            },
            {
                name: 'EntryInvoiced',
                path: '/invoicing/invoiced',
                icon: RectangleStackIcon,
                meta: {
                    title: 'Past invoices'
                }
            },
        ]
    }
}
