/**
 * Initialize stores at this method
 * @param {*} useStore
 */
export const initStores = async (useStore) => {
    const suppliesStore = useStore('supplies')

    suppliesStore.fetch()
}
