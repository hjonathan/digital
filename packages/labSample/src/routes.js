import App from './createApp'

export default () => {
    return [
        {
            path: '/lab-sample',
            name: 'lab-sample',
            meta: {
                home: true,
                title: 'Lab Samples'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/send-lab-sample',
            name: 'SendLabSample',
            meta: {
                parentName: 'lab-sample',
                title: 'Send lab sample'
            },
            entry: {
                id: 'SendLabSample',
                component: App
            }
        },
        {
            path: '/receive-lab-result',
            name: 'ReceiveLabResult',
            meta: {
                parentName: 'lab-sample',
                title: 'Lab results'
            },
            entry: {
                id: 'ReceiveLabResult',
                component: App
            }
        },
        {
            path: '/lab-sample/show/:id',
            name: 'lab-sample-show',
            meta: {
                parentName: 'lab-sample',
                title: 'Show Lab Sample'
            },
            entry: {
                id: 'ShowLabSample',
                component: App
            }
        },
    ]
}
