import { BeakerIcon } from '@heroicons/vue/24/outline'

export default () => {
    return {
        icon: BeakerIcon,
        meta: {
            title: 'Lab sample'
        },
        children: [
            {
                name: 'lab-sample',
                path: '/lab-sample',
                icon: BeakerIcon,
                meta: {
                    title: 'Home'
                }
            },
        ]
    }
}
