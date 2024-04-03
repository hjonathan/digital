import { computed } from 'vue'
import { round, formatDate } from 'shared'
import { api } from '@/config'
import {
    totalInItems,
    totalInSteps,
    isEnableSaveButton,
    sumTotal,
    isCompletedSteps
} from './operations'

const wasteId = 'waste'
const remainingId = 'items_remaining'

// Veify if error exists on data sended to api
const verifyErrorsByPrefix = (errors, prefix) => {
    let flag = false

    for (const key in errors) {
        if (Object.hasOwnProperty.call(errors, key)) {
            flag = key.includes(prefix)

            if (flag) break
        }
    }

    return flag
}

export function useStep ({ selectedRows, steps, step, validateEvaporation, generalMessage, loadings, generalData, t }) {
    // Total product quantity used on machine trim process
    const totalInContainers = computed(() => {
        return totalInItems(steps.value)
    })

    const totalInAllSteps = computed(() => {
        return totalInSteps(steps.value)
    })

    // Get total quantity in products selected for validate rules on step and summary
    const totalProduct = computed(() => {
        return selectedRows.value.reduce((sum, product) => {
            sum += Number(product.quantity)

            return round(sum)
        }, 0)
    })

    const totalWaste = computed(() => {
        const wasteStep = steps.value.find(localStep => localStep.id === wasteId)

        if (wasteStep) return sumTotal(wasteStep.items, wasteStep.quantityField)

        return 0
    })

    const totalRemaining = computed(() => {
        const remainingStep = steps.value.find(localStep => localStep.id === remainingId)

        if (remainingStep) return sumTotal(remainingStep.items, remainingStep.quantityField)

        return 0
    })

    const totalEvaporation = computed(() => {
        return totalProduct.value - (totalInContainers.value + totalWaste.value + totalRemaining.value)
    })

    const currentStep = computed(() => {
        const currentStepIndex = steps.value.findIndex(localStep => localStep.id === step.value)

        if (currentStepIndex < 0) return { currentStep: null, position: null }

        return { step: steps.value[currentStepIndex], position: currentStepIndex }
    })

    const idsItems = computed(() => {
        return selectedRows.value.map(item => item.id)
    })

    const quantitySummaryObject = computed(() => {
        const items = [
            {
                title: t('Total in items'),
                quantity: round(totalProduct.value)
            },
            {
                title: t('Total used in containers'),
                quantity: totalInContainers.value
            },
            {
                title: t('Total available'),
                quantity: round(totalProduct.value - totalInAllSteps.value),
                isBold: true,
                containerClass: round(totalProduct.value - totalInAllSteps.value) >= 0
                    ? 'border-t-2 border-t-gray-400'
                    : 'text-error-500 border-t-2 border-t-gray-400'
            },
        ]

        return items
    })

    const summaryObject = computed(() => {
        const items = []

        for (const step of steps.value) {
            items.push({
                title: step.name,
                quantity: round(sumTotal(step.items, step.quantityField))
            })
        }

        items.push({
            title: t('Total (in containers)'),
            quantity: round(totalInContainers.value),
            isBold: true,
            containerClass: 'border-t-2 border-t-gray-400'
        })

        if (validateEvaporation.value) {
            items.push({
                title: t('Resulting evaporation'),
                quantity: round(totalProduct.value - totalInAllSteps.value),
                isBold: true,
                containerClass: 'mt-20'
            })
        }

        return items
    })

    const enableButtonObject = computed(() => {
        return isEnableSaveButton({
            steps: steps.value,
            totalInContainers: totalInContainers.value,
            quantity: totalProduct.value,
            validateEvaporation: validateEvaporation.value
        })
    })

    const dataToValidate = computed(() => {
        return {
            totalInContainers: totalInContainers.value,
            totalInAllSteps: totalInAllSteps.value,
            totalProduct: totalProduct.value,
            availableQuantity: totalProduct.value - totalInAllSteps.value,
            totalWaste: totalWaste.value,
            totalRemaining: totalRemaining.value,
            totalWasteRemaining: totalWaste.value + totalRemaining.value,
            enableAdd: currentStep.value.step?.enableAdd,
            selectedOption: currentStep.value.step?.selectedOption,
            complete: currentStep.value.step?.complete,
            optional: currentStep.value.step?.optional,
            first: currentStep.value.position === 0,
            last: currentStep.value.position === (steps.value.length - 1),
            position: currentStep.value.position,
            allStepsComplete: isCompletedSteps(steps.value),
            saveButton: loadings.value.saveButton
        }
    })

    // Disable the next button, if it does not meet the condition.
    const disableNextButton = computed(() => {
        if (dataToValidate.value.position >= 0) {
            return !dataToValidate.value?.complete ||
                !dataToValidate.value?.selectedOption ||
                totalInAllSteps?.value > totalProduct?.value ||
                dataToValidate.value.position === steps.value.length - 1
        }

        return false
    })

    // Disable the back button, if it does not meet the condition.
    const disablePreviousButton = computed(() => {
        return totalInAllSteps.value > totalProduct.value || dataToValidate.value.position === 0
    })

    // Get measure name from product  for show in summary
    const measure = computed(() => {
        return selectedRows.value[0]?.measure.name || null
    })

    // Cree el formato de pasos para enviar datos a la API para validaciones o guardar
    const formatStepData = () => {
        const data = { ids: idsItems.value }

        validateEvaporation.value && (data.evaporation = totalEvaporation.value)

        generalData.value?.updated_at && (data.updated_at = formatDate(generalData.value?.updated_at, 'utcDateTime'))

        for (const step of steps.value) {
            if (step.id !== 'waste') {
                step.items?.length && (data[step.id] = step.items)
            }

            if (step.id === 'waste' && step.items.length) {
                data.waste = step.items[0].waste || 0
                data.reason_id = step.items[0].reason_id || null
            }
        }

        return data
    }

    // Send data to api for elements validation on steps
    const validateStep = async (stepId, url) => {
        const currentStepPosition = steps.value.findIndex(step => step.id === stepId)

        for (const localStep of steps.value) {
            localStep.errors = []
        }

        const response = await api.post(url, formatStepData())

        if (response.errors) {
            steps.value[currentStepPosition].errors = response.errors

            if (currentStep.value.step?.id === wasteId) {
                const errors = {}

                response.errors.reason_id && (errors['waste.0.reason_id'] = response.errors.reason_id)

                response.errors.waste && (errors['waste.0.waste'] = response.errors.waste)

                steps.value[currentStepPosition].errors = errors
            }
        }

        if (!response.success && !response.errors) {
            generalMessage.value = {
                isOpen: true,
                type: 'danger',
                message: response.message
            }

            return false
        }

        return !verifyErrorsByPrefix(steps.value[currentStepPosition].errors, stepId)
    }

    // Calculate if a step is optional or required
    const calculateOptionalStep = (stepId) => {
        const currentStepPosition = steps.value.findIndex(step => step.id === stepId)

        if (currentStepPosition > -1) {
            steps.value[currentStepPosition].enableAdd = totalInAllSteps.value < totalProduct.value

            steps.value[currentStepPosition].selectedOption = totalInAllSteps.value === totalProduct.value ||
                (steps.value[currentStepPosition].complete && steps.value[currentStepPosition].selectedOption)
        }
    }

    // Calculate if remaining step is optional or required
    const calculateWaste = (stepIdWaste) => {
        const currentStepPosition = steps.value.findIndex(step => step.id === stepIdWaste)

        if (currentStepPosition > -1) {
            steps.value[currentStepPosition].enableAdd = totalInAllSteps.value < totalProduct.value

            steps.value[currentStepPosition].selectedOption = (totalInContainers.value + totalRemaining.value) === totalProduct.value ||
                steps.value[currentStepPosition].complete
        }
    }

    // Calculate if remaining step is optional or required
    const calculateRemaning = (stepIdRemaining) => {
        const currentStepPosition = steps.value.findIndex(step => step.id === stepIdRemaining)

        if (currentStepPosition > -1) {
            if (!totalRemaining.value) {
                steps.value[currentStepPosition].complete = false

                steps.value[currentStepPosition].items = []
            }

            steps.value[currentStepPosition].enableAdd = totalInAllSteps.value < totalProduct.value

            steps.value[currentStepPosition].optional = (totalInContainers.value + totalWaste.value) === totalProduct.value

            steps.value[currentStepPosition].selectedOption = totalInAllSteps.value === totalProduct.value
        }
    }

    const navigationIsEnable = computed(() => {
        return totalInAllSteps.value <= totalProduct.value
    })

    const getGeneralMessage = computed(() => {
        if (totalInAllSteps.value < totalProduct.value && totalInAllSteps.value > 0 && dataToValidate.value.last) {
            if (validateEvaporation.value) return {}

            let message = t('The entire quantity must be used.') + t(' You have ') + `${round(totalProduct.value - totalInContainers.value)} ${measure.value} ` + t('left.')

            if (wasteId === currentStep.value.step?.id) {
                message = t('The entire quantity must be used.') + t(' You have ') + `${round(totalProduct.value - totalInContainers.value - totalRemaining.value)} ${measure.value} ` + t('left.')
            }

            if (remainingId === currentStep.value.step?.id) {
                message = t('The entire quantity must be used.') + t(' You have ') + `${round(totalProduct.value - totalInContainers.value - totalWaste.value)} ${measure.value} ` + t('left.')
            }

            return {
                isOpen: true,
                type: 'warning',
                message
            }
        }

        if (totalInAllSteps.value > totalProduct.value) {
            let message = t('The quantity must not exceed the available quantity.') + t(' You have ') + `${round(totalProduct.value - dataToValidate.value.totalWasteRemaining)} ${measure.value} ` + t('left.')

            if (currentStep.value.position === 0) {
                message = t('The quantity must not exceed the available quantity.') + t(' You have ') + `${round(totalProduct.value - dataToValidate.value.totalWasteRemaining)} ${measure.value}.`
            }

            if (wasteId === currentStep.value.step?.id) {
                message = t('The quantity must not exceed the available quantity.') + t(' You have ') + `${round(totalProduct.value - totalInContainers.value - totalRemaining.value)} ${measure.value} ` + t('left.')
            }

            if (remainingId === currentStep.value.step?.id) {
                message = t('The quantity must not exceed the available quantity.') + t(' You have ') + `${round(totalProduct.value - totalInContainers.value - totalWaste.value)} ${measure.value} ` + t('left.')
            }

            return {
                isOpen: true,
                type: 'danger',
                message
            }
        }

        return generalMessage
    })

    return {
        getGeneralMessage,
        dataToValidate,
        totalEvaporation,
        currentStep,
        totalWaste,
        totalRemaining,
        calculateOptionalStep,
        calculateWaste,
        calculateRemaning,
        validateStep,
        formatStepData,
        navigationIsEnable,
        quantitySummaryObject,
        summaryObject,
        enableButtonObject,
        totalInContainers,
        totalProduct,
        measure,
        // For button
        disableNextButton,
        disablePreviousButton,
        totalInAllSteps
    }
}
