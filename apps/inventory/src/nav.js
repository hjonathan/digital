import { RectangleStackIcon } from '@heroicons/vue/24/outline'

export default () => {
    return {
        name: 'Inventory',
        icon: RectangleStackIcon,
        children: [
            {
                name: 'Inventory',
                path: '/inventory',
                meta: {
                    title: 'Home'
                },
                icon: RectangleStackIcon
            },
            {
                name: 'Receptions',
                path: '/receptions',
                meta: {
                    title: 'Receive'
                },
                icon: RectangleStackIcon
            }]
    }
}
