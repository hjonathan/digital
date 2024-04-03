/**
 * To run tasks before login
 * @param {*} useStore
 */
export const initBefore = async ({ useStore }) => {
    const parameterStore = useStore('parameters')

    parameterStore.fetch()
}
