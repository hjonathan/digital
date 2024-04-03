/**
 * To run tasks before login
 * @param {*} useStore
 */
export const initBefore = async ({ useStore, api }) => {
    const rapidStore = useStore('rapidStore')
    const coreStore = useStore('core')
    const layoutManagerStore = useStore('layoutManager')

    /**
     * Compares the versions and displays the version update message
     */
    rapidStore.$registerGlobalEvent('updateVersion:compare', (data) => {
        const { headers } = data

        const appVersion = coreStore.getAppVersion()

        if (!appVersion) {
            coreStore.setAppVersion({
                frontendversion: headers.frontendversion,
                backendversion: headers.backendversion
            })

            return
        }

        if (headers.frontendversion !== appVersion.frontendversion || headers.backendversion !== appVersion.backendversion) {
            if (appVersion.cancelled) return

            layoutManagerStore.setVersionUpdater({
                position: 'bottom',
                card: true,
                button: false
            })
        }
    })

    /**
     * Init the updates in parameters, permissions and facilities
     */
    rapidStore.$registerGlobalEvent('updateVersion:init', async () => {
        const rawResponse = await api.getRaw('user_information')

        const { data, headers } = rawResponse

        // Permissions
        const newPermissions = data.data?.user?.permissions

        newPermissions && coreStore.setPermissions(newPermissions)

        coreStore.setAppVersion({
            cancelled: false,
            frontendversion: headers.frontendversion,
            backendversion: headers.backendversion
        })

        layoutManagerStore.setVersionUpdater({
            position: 'bottom',
            card: false,
            button: false
        })

        // Facilities
        const facilityStore = useStore('facilities')

        facilityStore.fetch()

        coreStore.credentials?.user && facilityStore.fetchByUser(coreStore.credentials.user.id)

        // Parameters
        const parametersStore = useStore('parameters')

        parametersStore.fetch()

        // Activate Global Overlay
        layoutManagerStore.showOverlay(500)
    })
}
