import App from './createApp'

export default () => {
    return [
        {
            path: '/layout',
            name: 'layout',
            meta: {
                home: true,
                title: 'Layout'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/layout/stepper',
            name: 'StepperExample',
            meta: {
                parentName: 'layout',
                title: 'StepperExample'
            },
            entry: {
                id: 'StepperExample',
                component: App
            }
        },
        {
            path: '/layout/badges',
            name: 'BadgeExample',
            meta: {
                parentName: 'layout',
                title: 'Badge Example'
            },
            entry: {
                id: 'BadgeExample',
                component: App
            }
        },
        {
            path: '/layout/cards',
            name: 'Cards',
            meta: {
                parentName: 'layout',
                relationName: 'CardExample'
            },
            entry: {
                id: 'CardExample',
                component: App
            }
        },
        {
            path: '/layout/buttons',
            name: 'Action buttons',
            meta: {
                parentName: 'layout',
                relationName: 'action-buttons'
            },
            entry: {
                id: 'Buttons',
                component: App
            }
        },
        {
            path: '/layout/buttons-rules',
            name: 'Action buttons with rules',
            meta: {
                parentName: 'layout',
                relationName: 'action-buttons-rules'
            },
            entry: {
                id: 'ButtonsWithRules',
                component: App
            }
        },
        {

            path: '/layout/title',
            name: 'Title example',
            entry: {
                id: 'TitleExample',
                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
        {
            path: '/layout/button',
            name: 'ButtonExample',
            entry: {
                id: 'ButtonExample',
                component: App
            },
            meta: {
                parentName: 'layout'
            }
        },
        {
            path: '/layout/slideover',
            name: 'Slideover example',
            entry: {
                id: 'SlideoverExample',
                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
        {

            path: '/layout/alert',
            name: 'Alert example',
            entry: {
                id: 'AlertExample',
                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
        {
            path: '/layout/slider',
            name: 'SliderExample',
            entry: {
                id: 'SliderExample',

                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
        {
            path: '/layout/timeline',
            name: 'TimelineExample',
            entry: {
                id: 'TimelineExample',
                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
        {
            path: '/layout/table-ui',
            name: 'TableUI',
            entry: {
                id: 'TableUIExample',
                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
        {
            path: '/layout/connector',
            name: 'Connector',
            entry: {
                id: 'ConnectorExample',
                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
        {
            path: '/layout/grid-layout',
            name: 'GridLayoutExample',
            entry: {
                id: 'GridLayoutExample',
                component: App
            },
            meta: {
                parentName: 'layout',
                relationName: 'layout'
            }
        },
    ]
}
