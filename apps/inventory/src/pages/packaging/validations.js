import { api } from '@/config'

/**
 * Verify the bins for packaging, based in
 * @param {*} bins
 * @returns
 */
export const verifyBins = (bins) => {
    const element = bins.find(e => {
        return e.name && e.location && e.quantity && e.container
    })

    return !!element
}

/**
 * Validation methods for packaging views
 */
export const validationDisabledNext = {
    residue: ({ residue, totalResidue }) => {
        return verifyBins(residue.bins) && totalResidue === 0
    }
}

export const verifyErrorsByPrefix = (errors, prefix) => {
    let flag = false

    for (const key in errors) {
        if (Object.hasOwnProperty.call(errors, key)) {
            flag = key.includes(prefix)

            if (flag) {
                break
            }
        }
    }

    return flag
}

/**
 * Build data to consume the endpoint
 */
export const get = {
    packaging: async ({ packages, items, endpoint }) => {
        const apiData = {
            ids: items.value.map((element) => element.id),
            packaged_items: packages.value.map((e) => {
                return {
                    finished_god_type_id: e.finished_god_type_id,
                    brand_id: e.brand_id,
                    location_id: e.location_id,
                    units_created: e.units_created,
                    quantity_needed: e.quantity_needed,
                    quantity_used: e.quantity_used,
                    waste: e.waste,
                    reason_id: e.reason_id,
                    variance: e.variance,
                    second_reason_id: e.second_reason_id,
                    variance_per_unit: e.variance_per_unit,
                    variance_percent: e.variance_percent,
                    note: e.note
                }
            })
        }

        const response = await api.post('/stock/package_validation', apiData)

        return response
    },
    process: async ({ residue, items, packages, endpoint }) => {
        const apiData = {
            ids: items.value.map((element) => element.id),
            repackage_items: residue.value.bins.map((bin) => {
                return {
                    name: bin?.name,
                    quantity: bin?.quantity,
                    location_id: bin?.location,
                    container_id: bin?.container?.id
                }
            }),
            packaged_items: packages.value.map((e) => {
                const response = {
                    finished_god_type_id: e.finished_god_type_id,
                    brand_id: e.brand_id,
                    location_id: e.location_id,
                    units_created: e.units_created,
                    quantity_needed: e.quantity_needed,
                    quantity_used: e.quantity_used,
                    waste: e.waste,
                    reason_id: e.reason_id,
                    variance: e.variance,
                    second_reason_id: e.second_reason_id,
                    variance_per_unit: e.variance_per_unit,
                    variance_percent: e.variance_percent,
                    note: e.note
                }

                // Remove waste when this is null or undefined
                !response.waste && (delete response.waste)

                return response
            })
        }

        const response = await api.post(endpoint, apiData)

        return response
    }

}

/**
 * Validations with BE  for every step
 */
export const validationNext = {
    residue: async ({ residue, errors, items, packages, endpoint }) => {
        const response = await get.process({ residue, items, packages, endpoint })

        errors.value = {}

        response.errors && (errors.value = response.errors)

        return !verifyErrorsByPrefix(errors.value, 'repackage_items')
    },
    packaging: async ({ packages, errors, items }) => {
        const response = await get.packaging({ packages, items })

        errors.value = {}

        response.errors && (errors.value = response.errors)

        return !verifyErrorsByPrefix(errors.value, 'packaged_items')
    }
}
