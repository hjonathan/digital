import { ArchiveBoxIcon } from '@heroicons/vue/24/outline'

export default () => {
    return {
        icon: ArchiveBoxIcon,
        permission: 'supplies',
        meta: {
            title: 'Supplies'
        },
        children: [
            {
                name: 'Supplies',
                path: '/supplies',
                permission: 'supplies',
                icon: ArchiveBoxIcon,
                meta: {
                    title: 'Home'
                }
            },
            {
                name: 'ReportSupplies',
                path: '/supplies/report',
                permission: 'supplies.reports',
                icon: ArchiveBoxIcon,
                meta: {
                    title: 'Reports'
                }
            },

            {
                name: 'SuppliesList',
                path: '/supplies/list',
                permission: 'supplies.supplies',
                icon: ArchiveBoxIcon,
                meta: {
                    title: 'Supplies'
                }
            },
            {
                name: 'UnknownSuppliesList',
                path: '/unknown-supplies/list',
                permission: 'supplies.supplies',
                icon: ArchiveBoxIcon,
                meta: {
                    title: 'Unknown supplies'
                }
            },
            {
                name: 'SuppliesLabels',
                path: '/supplies/labels',
                permission: 'supplies.labels',
                icon: ArchiveBoxIcon,
                meta: {
                    title: 'Labels'
                }
            },
            {
                name: 'SupplyAdjustmentList',
                path: '/supplies/supply-adjustment-list',
                permission: 'supplies.adjustment',
                icon: ArchiveBoxIcon,
                meta: {
                    title: 'Supply Adjustments'
                }
            },
        ]
    }
}
