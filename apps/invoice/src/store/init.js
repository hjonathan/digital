/**
 * Initialize stores at this method
 * @param {*} useStore
 */
export const initStores = async (useStore) => {
    const invoicingStore = useStore('invoicing')

    invoicingStore.fetchInvoiceStatuses()
}
