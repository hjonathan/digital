import { isFunction } from 'lodash'
import { computed } from 'vue'

const incompleteStates = ['upcoming', 'error', 'current']

export const useComposable = (input) => {
    const { steps, step } = input

    /**
     * Go to the first step with the 'upcoming, error or current' state if it exists otherwise returns the last step
     **/
    const goToIncompleteStep = () => {
        const dataSteps = steps.value

        const stepData = dataSteps.find(e => incompleteStates.includes(e.status))

        let newStep = dataSteps.at(-1).id

        stepData && (newStep = stepData.id)

        !stepData && (newStep = dataSteps.at(-1).id)

        step.value = newStep
    }

    /**
     * Run manual validations for each of the steps and set complete or upcoming based on the validation.
     */
    const validateAllSteps = () => {
        const dataSteps = steps.value

        dataSteps.forEach(step => {
            const response = step.validation ? step.validation() : true

            if (!step.isCurrent) {
                step.status = response ? 'complete' : 'error'
            }
        })
    }

    /**
     * Errors from all steps
     */
    const errors = computed(() => {
        if (!steps.value) return []

        return steps.value.reduce((errors, step) => {
            if (!step.validation() && step.errorMessage) {
                errors.push({
                    message: step.errorMessage,
                    step: step.id
                })
            }

            return errors
        }, [])
    })

    return {
        ...input,
        goToIncompleteStep,
        validateAllSteps,
        getStepValidation,
        errors
    }
}

/**
 * Returns validation from a step
 * @param {*} step
 * @returns
 */
const getStepValidation = (step) => {
    if (isFunction(step.validation)) {
        return step.validation()
    }

    if (step.validation === false) {
        return false
    }

    return true
}
