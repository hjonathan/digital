import { defineStore } from 'pinia'
import { getSessionJSON, setSessionJSON, validatePermission } from 'shared'
import { ref, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import { isEqual } from 'lodash'
import useCore from './core'

/**
 * Store that is used at the core level, for the entire application that manages the views based on the open and active tabs.
 */
export default defineStore('tabs', () => {
    const router = useRouter()

    const tabs = ref([])
    const keepAliveTabs = ref([])
    const sessionTabsCode = 'sessionTabs'
    const coreStore = useCore()

    // Invalid position in list type elements.
    const negativeIndex = -1

    // Default number of items to remove from a list
    const numberRemoveElements = 1

    /**
     * Returns the list of first-level tabs or tabs dependent on another tab.
     * @param {*} parentName Name of the parent tab, to return the tabs related to parent.
     * @returns Tab list
     */
    const getTabs = (parentName = null) => {
        return tabs.value.filter(tab => tab.parentName === parentName)
    }

    /**
     * Returns the activated tab, either first level or an active tab that is related to the parentName.
     * @param {*} parentName Name of the parent tab, to return the asset related to that parent.
     * @returns Tab index and tab object active
     */
    const getActiveTab = (parentName = null) => {
        const indexTab = tabs.value.findIndex(tab => tab.parentName === parentName && tab.active)

        return indexTab > negativeIndex ? { indexTab, tab: tabs.value[indexTab] } : {}
    }

    /**
     * Adds the component name to the list of cached components.
     * @param {*} name name of the component to cache.
     */
    const addKeepAliveTab = (name) => {
        const cachedComponent = keepAliveTabs.value.find(component => component === name)

        !cachedComponent && keepAliveTabs.value.push(name)
    }

    /**
     * Adds the component name to the list of cached components.
     * @param {*} name name of the component to cache.
     */
    const removeKeepAliveTab = (name) => {
        const cachedComponentPosition = keepAliveTabs.value.findIndex(component => component === name)

        cachedComponentPosition > negativeIndex && keepAliveTabs.value.splice(cachedComponentPosition, numberRemoveElements)
    }

    /**
     * Activate a tab and deactivate the others that belong to the same level of tabs.
     * @param {*} name Name of the tab that is already open
     */
    const activeParentTab = (name) => {
        tabs.value.forEach((tab) => {
            if (!tab.parentName) {
                tab.active = tab.name === name
            }
        })
    }

    /**
     * Activate a tab and deactivate the others that belong to the same level of tabs.
     * @param {*} name Name of the tab that is already open
     */
    const activeChildTab = (name, parentName) => {
        tabs.value.forEach((tab) => {
            !tab.parentName && (tab.active = tab.name === parentName)

            tab.parentName === parentName && (tab.active = tab.name === name)
        })
    }

    /**
     * Activate the indicated tab and its related and save tab list status on session storage
     * @param {*} nTab Tab object to activate
     */
    const activateTab = (nTab) => {
        const currentTab = tabs.value.find(tab => tab.name === nTab.name && tab.parentName === nTab.parentName)

        if (currentTab) {
            currentTab.parentName
                ? activeChildTab(currentTab.name, currentTab.parentName)
                : activeParentTab(currentTab.name)

            setSessionJSON(sessionTabsCode, tabs.value)

            const { tab: parentTab } = getActiveTab()

            // if (!parentTab) {
            //     // router.push(childTab)

            //     return
            // }

            const { tab: childTab } = getActiveTab(parentTab.name)

            router.push(childTab)
        }
    }

    /**
     * Opens a tab related by name.
     * @param {*} name Name of the tab that is related.
     */
    const openRelatedTab = (name) => {
        const currentTab = router.getRoutes().find(route => route.name === name)

        currentTab && openTab(tabFormat(currentTab))
    }

    /**
     * Opens a tab searched by its name, path, query, params. And also opens the parent tab and related tabs.
     * @param {*} name Name for current route declared by vue-router
     * @param {*} path Path for current route declared by vue-router
     * @param {*} query Queries for current route declared by vue-router
     * @param {*} params Params for current route declared by vue-router
     * @param {*} options Options for the current route that determine if your relationships will be opened and which of them will be opened.
     */
    const openTab = ({ name, alias, path, query = {}, params = {} }, options = { openRelations: null }) => {
        const objectSearch = {}

        name && (objectSearch.name = name)

        path && (objectSearch.path = path)

        Object.keys(query).length && (objectSearch.query = query)

        Object.keys(params).length && (objectSearch.params = params)

        const currentRoute = router.resolve(objectSearch)

        // PERMISSION PER ROUTE
        if (currentRoute.meta?.permission && !validatePermission(currentRoute.meta?.permission, coreStore.getPermissions())) {
            return router.push({ name: 'WithoutPermission' })
        }

        if (currentRoute.meta?.route) {
            return router.push(currentRoute)
        }

        currentRoute.alias = alias

        const formattedTab = tabFormat(currentRoute)

        // PERMISSION PER ROUTE IN PARENT
        if (formattedTab.parentName) {
            const parent = router.getRoutes().find(e => e.name === formattedTab.parentName)

            if (parent.meta?.permission && !validatePermission(parent.meta?.permission, coreStore.getPermissions())) {
                return router.push({ name: 'WithoutPermission' })
            }
        }

        const currentTab = tabs.value.find(tab => tab.name === formattedTab.name && tab.parentName === formattedTab.parentName)

        // If the tab is already open, update its queries and parameters.
        if (currentTab) {
            const { query: oldQuery, params: oldParams } = currentTab

            // If it is the same route, but with different query and params, it is closed and reopened.
            if (!isEqual(query, oldQuery) || !isEqual(params, oldParams)) {
                closeTab(currentTab.name)

                nextTick(() => {
                    openTab({ name: currentTab.name, path: currentTab.path, query, params })
                })
            }
        }

        // If the tab is not open, it opens it and if it is configured as home, it opens a child tab Home.
        if (!currentTab && formattedTab) {
            // Get current parent tab active
            const { tab: parentTab } = getActiveTab()

            if (parentTab) {
                const { tab: childTab } = getActiveTab(parentTab.name)

                // Register activator tab for return at close tab
                childTab && (formattedTab.activatorTab = childTab.name)
            }

            tabs.value.push(formattedTab)

            if (formattedTab.home) {
                const existsHome = tabs.value.find(tab => tab.name === formattedTab.name && tab.parentName === formattedTab.name && tab.child)

                if (!existsHome) {
                    const homeTab = { ...formattedTab, parentName: formattedTab.name, child: true }

                    tabs.value.unshift(homeTab)
                }
            }

            formattedTab.parentName && openRelatedTab(formattedTab.parentName)

            addKeepAliveTab(currentRoute.name)
        }

        activateTab({
            name: formattedTab.name,
            parentName: formattedTab.home ? formattedTab.name : formattedTab.parentName
        })

        router.push(formattedTab)

        // If the openRelations parameter is a list of tab names, then it opens the related tabs specified in that list.
        if (options.openRelations) {
            let relations = router.getRoutes().filter(tab => tab.meta.relationName === formattedTab.name)

            options.openRelations.length && (relations = relations.filter(relation => options.openRelations.includes(relation.name)))

            relations.forEach(relation => openRelatedTab(relation.name))
        }

        setSessionJSON(sessionTabsCode, tabs.value)
    }

    /**
     * Activates the next tab if the tab that was active is closed.
     * @param {*} name Name of the tab that will be opened.
     * @param {*} parentName Parent name of the tab that will be opened.
     */
    const activateTabAfterClose = (name, parentName = null) => {
        const partialTabs = getTabs(parentName)

        const currentPositionTab = partialTabs.findIndex(tab => tab.name === name)

        if (currentPositionTab > negativeIndex) {
            const oldTab = partialTabs[currentPositionTab]

            const newTab = partialTabs[currentPositionTab - 1]

            newTab && oldTab.active && activateTab(newTab, newTab?.parentName)
        }
    }

    /**
     * Close tab and close all tabs related by name, in addition to deleting cached components related to the tab.
     * @param {*} name Name of the tab that will be closed along with its related tabs
     */
    const closeTab = (name) => {
        let currentTab = tabs.value.find(tab => tab.name === name)

        if (currentTab) {
            if (currentTab.home && currentTab.child) {
                currentTab = tabs.value.find(tab => tab.name === name && !tab.child && tab.home)
            }

            const tabPosition = tabs.value.findIndex(tab => tab.name === currentTab.name && tab.parentName === currentTab.parentName)

            activateTabAfterClose(currentTab.name, currentTab.parentName)

            //  the tab is open, if it is configured as Home, also close the home tab and delete the components from the KeepAlive list.
            if (tabPosition > negativeIndex) {
                if (tabs.value[tabPosition].activatorTab) {
                    const activatorTab = tabs.value.find(tab => tab.name === tabs.value[tabPosition].activatorTab &&
                        tab.parentName === tabs.value[tabPosition].parentName)

                    activatorTab && activateTab(activatorTab)
                }

                removeKeepAliveTab(tabs.value[tabPosition].name)

                tabs.value.splice(tabPosition, numberRemoveElements)

                if (currentTab?.home) {
                    const homeIndex = tabs.value.findIndex(tab => tab.home && tab.parentName === currentTab.name)

                    removeKeepAliveTab(tabs.value[homeIndex].name)

                    tabs.value.splice(homeIndex, numberRemoveElements)
                }
            }

            const relationsTabs = getRelationsTab([currentTab.name])

            for (const relation of relationsTabs) {
                relation !== currentTab.name && closeTab(relation)
            }

            setSessionJSON(sessionTabsCode, tabs.value)
        }
    }

    /**
     * Restores all previously opened tabs that are stored in session storage.
     * @param {*} defaultRoutes All routes that are configured with opening by default.
     */
    const restoreSessionTabs = () => {
        if (!tabs.value.length) {
            const defaultRoutes = router.getRoutes().filter(route => route?.meta?.default)

            tabs.value = getSessionJSON(sessionTabsCode) || []

            const defaultNames = tabs.value.map(route => route.name)

            // Iterate and open all default routes configured.
            for (const defaultRoute of defaultRoutes) {
                if (defaultRoute.meta?.default && !defaultNames.includes(defaultRoute.name)) {
                    // Open child tab Home if current route is configured as home.
                    if (defaultRoute?.meta?.home) {
                        tabs.value.unshift(tabFormat({
                            ...defaultRoute,
                            meta: {
                                ...defaultRoute.meta,
                                parentName: defaultRoute.name,
                                child: true
                            }
                        }))
                    }

                    // Open default route as tab
                    tabs.value.unshift(tabFormat({
                        ...defaultRoute,
                        meta: {
                            ...defaultRoute.meta,
                            parent: true
                        }
                    }))
                }
            }

            // Adds open tabs to the list of cached components.
            for (const tab of tabs.value) {
                tab.name && addKeepAliveTab(tab.name)
            }

            let { tab: parentTab } = getActiveTab()

            !parentTab && (parentTab = getTabs()[0])

            let { tab: childTab } = getActiveTab(parentTab.name)

            !childTab && (childTab = getTabs(parentTab.name)[0])

            return activateTab({ name: childTab.name, parentName: parentTab.name })
        }
    }

    /**
     * Checks if a tab is related to a list of tab names.
     * @param {*} tabNames Tab names where it is checked if it is related.
     * @param {*} relation Tab to check if it is related.
     * @returns Return true if related
     */
    const isRelatedTab = (tabNames, tab) => {
        return (tabNames.includes(tab.parentName) && !tabNames.includes(tab.name)) || tabNames.includes(tab.relationName)
    }

    /**
     * Recursive function that returns all the names of related tabs, whether parents or relations.
     * @param {*} tabNames Array of tab names to search for their relations.
     * @param {*} relationsTabs array where the names of the related tabs are stored
     * @returns Array with the names of the related tabs.
    */
    const getRelationsTab = (tabNames, relationsTabs = []) => {
        relationsTabs = relationsTabs.concat(tabNames)

        if (!tabNames.length) {
            return relationsTabs
        }

        // Obtain the names of the tabs directly related to the searched tabs.
        const relations = tabs.value.filter(relation => isRelatedTab(tabNames, relation)).map(item => item.name)

        if (relations.length) {
            return getRelationsTab(relations, relationsTabs)
        }

        return relationsTabs
    }

    /**
     * Formats a vue router object for use by tabs
     * @param {*} route Objeto de vue-router con todos sus datos para ser formateado.
     * @returns Tab formatted with the fields used by the tabs.
     */
    const tabFormat = (route) => {
        const formattedTab = {
            name: route.name,
            path: route.path,
            parentName: route.meta?.parentName || null,
            parent: route.meta?.parent || false,
            child: route.meta?.child || false,
            relationName: route.meta?.relationName,
            home: route.meta?.home || false,
            title: route.alias || route.meta?.title || route.name,
            query: route.query || {},
            params: route.params || {},
            active: route.meta?.active || false,
            default: route.meta?.default || false
        }

        return formattedTab
    }

    /**
     * Close all tabs, clear sessionstorage and delete cached components
     */
    const reset = () => {
        tabs.value = []

        keepAliveTabs.value = []

        setSessionJSON(sessionTabsCode, [])
    }

    return {
        tabs,
        keepAliveTabs,
        getRelationsTab,
        tabFormat,
        openTab,
        activateTab,
        getActiveTab,
        getTabs,
        closeTab,
        restoreSessionTabs,
        reset
    }
})
