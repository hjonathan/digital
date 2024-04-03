/**
 * Initializes the variables (in the rapidStore) used in a table view of the application,
 * Selected rows and the slideOver action
 * Returns key string of variable
 * @param {*} key
 * @param {*} rapidStore
 * @returns key
 */
export const tableStartupVars = (inject) => {
    const useGlobalStore = inject('useGlobalStore')
    const router = inject('router')

    const rapidStore = useGlobalStore('rapidStore')

    const currentRoute = router.currentRoute?.value

    const key = currentRoute?.name || 'default'

    rapidStore.reactiveProperty(`slide-${key}`, { action: '' })

    rapidStore.reactiveProperty(`selected-${key}-rows`, [])

    return key
}
