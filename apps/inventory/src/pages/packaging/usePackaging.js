import { ref, watch, computed } from 'vue'
import { sumBy } from 'lodash'

export const usePackaging = (items, steps, step) => {
    const packages = ref([])
    const products = ref([])
    const totalQuantity = ref(0)
    const errors = ref({})

    const errorMessage = ref(null)

    const measure = ref(items.length ? items[0]?.measure.name : '')

    // Residue data for step 1
    const residue = ref({
        main_location: { name: 'Select' },
        bins: [],
        complete: false,
        skipProccess: true
    })

    // Search in packages by id to edit the item
    const searchPackageById = (id) => {
        return packages.value.filter(item => {
            return item.id === id
        })[0]
    }
    // Computed properties total residue
    const totalResidue = computed(() => {
        const residueBins = residue.value.bins.reduce((acc, value) => {
            acc += value.quantity
            return acc
        }, 0)

        const packagesTotal = packages.value.reduce((acc, value) => {
            acc = acc + value.quantity_used + value.waste
            return acc
        }, 0)

        return totalQuantity.value - residueBins - packagesTotal
    })

    const disableNextButton = computed(() => {
        // If step is the first step
        if (step.value === 'packaging-list' && packages.value.length == 0 && totalQuantityPackages.value < totalResidue.value) {
            return true
        }

        if (step.value === 'remaining' && totalResidue.value !== 0) {
            return true
        }

        return false
    })

    const disablePreviousButton = computed(() => {
        // If step is the first step
        if (step.value === 'packaging-list') {
            return true
        }

        return false
    })

    const totalQuantityPackages = computed(() => {
        return sumBy(packages.value, e => e.quantity_used)
    })

    const totalWaste = computed(() => {
        return sumBy(packages.value, (e) => { return e.waste || 0 })
    })

    // Watchers - disabled Residue view
    watch(() => totalResidue.value, (nValue, oValue) => {
        if (!totalResidue.value && ((totalQuantityPackages.value + totalWaste.value) <= totalQuantity.value) && step.value === 'packaging-list') {
            steps.value[1].status = 'disabled'
        }

        if (totalResidue.value > 0 && step.value === 'packaging-list') {
            steps.value[1].status = 'upcoming'
        }
    })

    return {
        residue,
        totalResidue,
        totalQuantity,
        errors,
        products,
        items,
        packages,
        measure,
        disableNextButton,
        disablePreviousButton,
        searchPackageById,
        totalQuantityPackages,
        errorMessage,
        totalWaste
    }
}
