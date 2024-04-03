import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { setJSON, getJSON, removeItem, setSessionJSON } from 'shared'
import { VARIABLES } from '@/config/globalVariables'

export default defineStore('core', () => {
    const permissions = ref(getJSON('permissions'))
    const credentials = ref(getJSON('credentials'))
    const appVersion = ref(getJSON(VARIABLES.appVersion))
    const serverUrl = ref(VARIABLES.serverUrl)

    const setCredentials = (nCredentials) => {
        credentials.value = nCredentials

        // Save credentials in localStorage
        nCredentials ? setJSON('credentials', credentials.value) : removeItem('credentials')

        nCredentials?.user?.facility_id && setSessionJSON('facility_id', nCredentials?.user?.facility_id)
    }

    const setPermissions = (nPermissions) => {
        permissions.value = nPermissions

        // Save permitions in localStorage
        nPermissions ? setJSON('permissions', permissions.value) : removeItem('permissions')
    }

    const setAppVersion = (value) => {
        appVersion.value = {
            ...appVersion.value,
            ...value
        }

        value ? setJSON(VARIABLES.appVersion, appVersion.value) : removeItem(VARIABLES.appVersion)
    }

    const getAppVersion = () => {
        return appVersion.value
    }

    const getUserId = () => {
        return credentials.value?.user?.id
    }

    const hasPermission = (permission) => {
        return permissions.value.includes(permission)
    }

    const getPermissions = () => {
        return cloneDeep(permissions.value)
    }

    return {
        setCredentials,
        setPermissions,
        setAppVersion,
        credentials,
        permissions,
        appVersion,
        getAppVersion,
        getUserId,
        hasPermission,
        getPermissions,
        serverUrl
    }
})
