/**
 * Machine trim component main rules configuration
 */
export const actionRules = {
    genericCultivation: {
        and: [
            { '===': [{ var: 'totalInAllSteps' }, { var: 'totalProduct' }] },
            { '===': [{ var: 'allStepsComplete' }, true] },
            { '===': [{ var: 'saveButton' }, false] },
        ]
    },
    saveClone: {
        and: [
            { '>': [{ var: 'totalInContainers' }, 0] },
            { '===': [{ var: 'allStepsComplete' }, true] },
            { '===': [{ var: 'saveButton' }, false] },
        ]
    },
    genericProcessing: {
        and: [
            { '===': [{ var: 'totalInAllSteps' }, { var: 'totalProduct' }] },
            { '===': [{ var: 'allStepsComplete' }, true] },
            { '===': [{ var: 'saveButton' }, false] },
        ]
    },
    saveHarvest: {
        and: [
            { '>': [{ var: 'totalInContainers' }, 0] },
            { '<=': [{ var: 'totalWasteRemaining' }, { var: 'totalProduct' }] },
            {
                or: [
                    { '>': [{ var: 'totalWaste' }, 0] },
                    { '>': [{ var: 'totalRemaining' }, 0] },
                ]
            },
            { '===': [{ var: 'allStepsComplete' }, true] },
        ]
    },
    saveDebud: {
        and: [
            { '>': [{ var: 'totalInContainers' }, 0] },
            { '<=': [{ var: 'totalInAllSteps' }, { var: 'totalProduct' }] },
            { '===': [{ var: 'allStepsComplete' }, true] },
        ]
    },
    saveMachineTrim: {
        and: [
            { '>': [{ var: 'totalInContainers' }, 0] },
            { '<=': [{ var: 'totalInAllSteps' }, { var: 'totalProduct' }] },
            { '===': [{ var: 'allStepsComplete' }, true] },
        ]
    }
}

export const genericLoading = {
    and: [
        { '===': [{ var: 'saveButton' }, true] },
    ]
}
