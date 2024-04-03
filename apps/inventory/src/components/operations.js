import { round } from 'shared'

export const sumTotal = (containers, field) => {
    let total = 0

    if (containers) {
        for (const container of containers) {
            container[field] && (total += Number(container[field]))
        }
    }

    return round(total)
}

export const totalInSteps = (steps) => {
    let total = 0

    for (const step of steps) {
        total += sumTotal(step.items, step.quantityField)
    }

    return round(total)
}

export const totalInItems = (steps ) => {
    const notInclude = ['waste', 'items_remaining']
    let total = 0

    for (const step of steps) {
        if (!notInclude.includes(step.id)) {
            total += sumTotal(step.items, step.quantityField)
        }
    }

    return round(total)
}

export const totalAvailable = (quantityProducts, steps) => {
    const total = quantityProducts - totalInItems(steps)

    return round(total) > 0 ? round(total) : 0
}

export const isCompletedSteps = (steps) => {
    return steps.every(step => step.complete)
}

export const isEnableSaveButton = ({ steps, quantity, totalInContainers, validateEvaporation = false }) => {
    let isEnable = true

    if (!validateEvaporation) {
        quantity !== totalInContainers && (isEnable = false)
    }

    isEnable = isEnable &&
        steps.every(step => step.complete) &&
        steps[steps.length - 1]?.selectedOption

    return isEnable
}
