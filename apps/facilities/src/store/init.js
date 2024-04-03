/**
 * Initialize stores at this method
 * @param {*} useStore
 */
export const initStores = async (useStore) => {
    const facilityStore = useStore('facilities')
    const coreStore = useStore('core')

    facilityStore.fetch()

    coreStore.credentials?.user && facilityStore.fetchByUser(coreStore.credentials.user.id)
}
