/**
 * Initialize stores at this method
 * @param {*} useStore
 */
export const initStores = async (useStore) => {
    const inventoryStore = useStore('inventory')
    const itemTypesStore = useStore('itemTypes')
    const finishedGoodTypes = useStore('finishedGoodTypes')

    inventoryStore.fetch()
    itemTypesStore.fetch()
    finishedGoodTypes.fetch()
}
