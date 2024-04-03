/**
 * Initialize stores at this method
 * @param {*} useStore
 */
export const initStores = async (useStore) => {
    const basePackage = useStore('basePackage')

    basePackage.fetchData()
}
