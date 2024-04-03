import { ComputerDesktopIcon } from '@heroicons/vue/24/outline'

export default () => {
    return {
        name: 'layout',
        path: '/layout',
        icon: ComputerDesktopIcon,
        children: [
            {
                path: '/layout/stepper',
                name: 'StepperExample',
                icon: ComputerDesktopIcon,
                meta: {
                    title: 'Stepper'
                }
            },
            {
                path: '/layout/cards',
                name: 'Cards',
                icon: ComputerDesktopIcon,
                meta: {
                    title: 'Cards'
                }
            },
            {
                path: '/layout/buttons',
                name: 'Action buttons',
                icon: ComputerDesktopIcon,
                meta: {
                    title: 'Action Buttons'
                }
            },
            {
                path: '/layout/buttons-rules',
                name: 'Action buttons with rules',
                icon: ComputerDesktopIcon,
                meta: {
                    title: 'Action Buttons with rules'
                }
            },
            {
                name: 'Title example',
                path: '/layout/title'
            },
            {
                name: 'Slideover example',
                path: '/layout/slideover'
            },
            {
                name: 'Alert example',
                path: '/layout/alert'
            },
            {
                name: 'ButtonExample',
                path: '/layout/button',
                icon: ComputerDesktopIcon
            },
            {
                name: 'BadgeExample',
                path: '/layout/badge',
                icon: ComputerDesktopIcon
            },
            {
                name: 'SliderExample',
                path: '/layout/slider',
                icon: ComputerDesktopIcon
            },
            {
                name: 'TimelineExample',
                path: '/layout/timeline',
                icon: ComputerDesktopIcon
            },
            {
                name: 'TableUI',
                path: '/layout/table-ui',
                icon: ComputerDesktopIcon
            },
            {
                name: 'Connector',
                path: '/layout/connector',
                icon: ComputerDesktopIcon
            },
            {
                name: 'GridLayoutExample',
                path: '/layout/grid-layout',
                icon: ComputerDesktopIcon
            },
        ]
    }
}
