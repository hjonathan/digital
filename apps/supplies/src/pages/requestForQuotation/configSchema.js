export const getSchema = ({ id }) => {
    const schema = {
        contactInformation: getContactInformationSchema({ id }),
        materialDetails: getMaterialDetailsSchema({ id }),
        termsConditions: getTermsConditionsSchema({ id }),
        evaluationCriteria: getEvaluationCriteriaSchema({ id }),
        deliveryInformation: getDeliveryInformationSchema({ id }),
        submissionDetails: getSubmissionDetailsSchema({ id })
    }

    return schema
}

const getSubmissionDetailsSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getDeliveryInformationSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getContactInformationSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'readonly' }
}

const getMaterialDetailsSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getTermsConditionsSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}

const getEvaluationCriteriaSchema = ({ id }) => {
    if (id) {
        return { mode: 'readonly' }
    }

    return { mode: 'edit' }
}
