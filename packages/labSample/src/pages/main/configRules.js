import { genericRules } from 'jsonRules'

/**
 * Lab sample main rules configuration
 */
export const rules = {
    sendLabSample: {
        all: [
            { var: 'selectedRows' },
            {
                and: [{ notIn: [{ var: 'status.slug' }, ['awaiting-lab-results', 'passed-lab-results', 'cancelled-lab-sample', 'failed-lab-results', 'second-failed-lab-results', 'third-failed-lab-results', 'awaiting-2nd-and-3rd-lab-results']] }]
            },
        ]
    },
    resendLabSample: {
        all: [
            { var: 'selectedRows' },
            { '===': [{ var: 'status.slug' }, 'failed-lab-results'] },
        ]
    },
    receiveResults: {
        all: [
            { var: 'selectedRows' },
            {
                or: [
                    { in: [{ var: 'status.slug' }, ['awaiting-lab-results']] },
                ]
            },
        ]
    },
    receive2ndResults: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { '===': [{ var: 'status.slug' }, 'awaiting-2nd-and-3rd-lab-results'] },
                    {
                        some: [
                            { var: 'item_laboratory_results' },
                            {
                                and: [
                                    { in: [{ var: 'lab_result_number' }, [2, '2']] },
                                    { '===': [{ var: 'laboratory_pass' }, null] },
                                ]
                            },
                        ]
                    },
                ]
            },
        ]
    },
    receive3rdResults: {
        all: [
            { var: 'selectedRows' },
            {
                and: [
                    { '===': [{ var: 'status.slug' }, 'awaiting-2nd-and-3rd-lab-results'] },
                    {
                        some: [
                            { var: 'item_laboratory_results' },
                            {
                                and: [
                                    { in: [{ var: 'lab_result_number' }, [3, '3']] },
                                    { '===': [{ var: 'laboratory_pass' }, null] },
                                ]
                            },
                        ]
                    },
                    {
                        some: [
                            { var: 'item_laboratory_results' },
                            {
                                and: [
                                    { in: [{ var: 'lab_result_number' }, [2, '2']] },
                                    { '!==': [{ var: 'laboratory_pass' }, null] },
                                ]
                            },
                        ]
                    },
                ]
            },
        ]
    },
    labSampleTakenStatus: {
        all: [
            { var: 'selectedRows' },
            { in: [{ var: 'status.slug' }, ['lab-sample-taken']] },
        ]
    },
    awaitingLabResultsStatus: {
        all: [
            { var: 'selectedRows' },
            { in: [{ var: 'status.slug' }, ['awaiting-lab-results']] },
        ]
    },
    show: {
        all: [
            { var: 'selectedRows' },
            { notIn: [{ var: 'status.slug' }, ['awaiting-lab-results', 'lab-sample-taken, ']] },
        ]
    }
}

export const actionRules = {
    sendLabSample: {
        and: [
            rules.sendLabSample,
            genericRules.oneSelected,
        ]
    },
    resendLabSample: {
        and: [
            rules.resendLabSample,
            genericRules.oneSelected,
        ]
    },
    receiveResults: {
        and: [
            rules.receiveResults,
            genericRules.oneSelected,
        ]
    },
    receive2Results: {
        and: [
            rules.receive2ndResults,
            genericRules.oneSelected,
        ]
    },
    receive3Results: {
        and: [
            rules.receive3rdResults,
            genericRules.oneSelected,
        ]
    },
    move: {
        and: [
            {
                or: [rules.labSampleTakenStatus]
            },
            genericRules.oneSelected,
        ]
    },
    convert: {
        and: [
            {
                or: [rules.labSampleTakenStatus]
            },
            genericRules.oneSelected,
        ]
    },
    lock: {
        and: [
            {
                or: [rules.labSampleTakenStatus]
            },
            genericRules.oneSelected,
        ]
    },
    reweight: {
        and: [
            {
                or: [rules.labSampleTakenStatus]
            },
            genericRules.oneSelected,
        ]
    },
    recall: {
        and: [
            {
                or: [rules.labSampleTakenStatus]
            },
            genericRules.oneSelected,
        ]
    },
    show: {
        and: [
            {
                or: [rules.show]
            },
            genericRules.oneSelected,
        ]
    }
}
