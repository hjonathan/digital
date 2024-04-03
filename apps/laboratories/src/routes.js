import App from './createApp'

export default () => {
    return [
        {
            path: '/laboratories',
            name: 'Laboratories',
            meta: {
                home: true,
                title: 'Laboratories'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        // For lab sample
        {
            path: '/lab-sample-laboratories',
            name: 'LabSampleLaboratories',
            meta: {
                relationName: 'SendLabSample',
                parentName: 'lab-sample',
                title: 'Lab sample laboratories'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
}
