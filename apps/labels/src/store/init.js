/**
 * Initialize stores at this method
 * @param {*} useStore
 */
export const initStores = async (useStore) => {
    const labelsStore = useStore('labels')

    labelsStore.fetch()
}
