import {
    TagIcon
} from '@heroicons/vue/24/outline'

export default () => {
    return {
        name: 'Labels',
        path: '/labels',
        icon: TagIcon,
        children: [
            {
                path: '/labels',
                name: 'Labels',
                meta: {
                    title: 'Home'
                }
            },
            {
                path: '/labels/create',
                name: 'LabelsCreate',
                meta: {
                    title: 'Create'
                }
            },
            {
                path: '/labels/print',
                name: 'labels-print',
                meta: {
                    title: 'Print'
                }
            },
        ]
    }
}
