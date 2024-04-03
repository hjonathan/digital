import {
    mdiWeight,
    mdiMotherHeart,
    mdiContentCut,
    mdiSprout,
    mdiPlus,
    mdiCardMultipleOutline,
    mdiApplicationOutline,
    mdiForest,
    mdiFlowerTulip,
    mdiMinus,
    mdiSlashForward,
    mdiCursorMove,
    mdiRefresh,
    mdiCallSplit,
    mdiLockOutline,
    mdiSwapHorizontal,
    mdiSourceMerge,
    mdiPackageVariant,
    mdiBoxCutter,
    mdiCoffeeMaker,
    mdiLockOpenOutline,
    mdiBottleTonicSkullOutline,
    mdiSkullCrossbones,
    mdiDeleteEmpty,
    mdiTrashCanOutline,
    mdiInboxArrowDown,
    mdiFlowerOutline,
    mdiAlert,
    mdiAlphaQ,
    mdiFlaskEmptyOutline,
    mdiFlaskOutline,
    mdiTestTubeEmpty,
    mdiCheck
} from '@mdi/js'

import { computed } from 'vue'
import { jsonLogic } from 'jsonRules'
import { actionRules } from './configRules'
import { useI18n } from 'vue-i18n'

/**
 * Button configuration for main inventory table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, key, idThread, actionThread, invoiceItemSelected }) => {
    return computed(() => {
        if (idThread) {
            return invoicingButtons({ useGlobalStore, key, idThread, actionThread, invoiceItemSelected })
        }

        return selectedRowsButtons({ useGlobalStore, key })
    })
}

/**
 * Buttons when: INVOICING is open this inventory
 */
export const invoicingButtons = ({ useGlobalStore, key, idThread, actionThread, invoiceItemSelected }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    return [
        {
            icon: mdiInboxArrowDown,
            classType: 'teal',
            label: t(`Add to ${actionThread}`),
            disabled: !selectedRows.value.length,
            action () {
                invoiceItemSelected.value = selectedRows.value

                rapidStore.$emitGlobalEvent(`selectedItems:${actionThread}`, selectedRows.value)

                tabsStore.closeTab(`${actionThread}Inventory`)
            }
        },
    ]
}

/**
 * Buttons
 */
export const selectedRowsButtons = ({ useGlobalStore, key }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')
    const inventoryStore = useGlobalStore('inventory')

    const slideAction = rapidStore.reactiveProperty(`slide-${key}`)
    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    const data = {
        selectedRows: selectedRows.value
    }

    const query = {
        id: selectedRows.value.map(row => row.id)
    }

    if (key !== 'Inventory') query.child = true

    const openSlide = rapidStore.$getCallback(`open-slide-action-${key}`)

    return [
        // Move out quarantine
        {
            icon: mdiAlphaQ,
            classType: 'sky',
            label: t('Move out quarantine'),
            disabled: !jsonLogic.apply(actionRules.quarantine, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'RemoveQuarantine' }
            }
        },

        /**
         * Primary buttons
         */
        // Increase
        {
            icon: mdiPlus,
            classType: 'primary',
            label: t('Increase'),
            disabled: !jsonLogic.apply(actionRules.genericAction, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Increase' }
            }
        },
        // Decrease
        {
            icon: mdiMinus,
            classType: 'primary',
            label: t('Decrease'),
            disabled: !jsonLogic.apply(actionRules.genericAction, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Decrease' }
            }
        },
        // Subdivide
        {
            icon: mdiSlashForward,
            classType: 'primary',
            label: t('Subdivide'),
            disabled: !jsonLogic.apply(actionRules.genericAction, data),
            action: () => {
                tabsStore.closeTab('inventory-subdivide')

                tabsStore.openTab({
                    path: `/inventory/subdivide/${selectedRows.value[0].id}`,
                    query
                })
            }
        },
        // Move
        {
            icon: mdiCursorMove,
            classType: 'primary',
            label: t('Move'),
            disabled: !jsonLogic.apply(actionRules.move, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Move' }
            }
        },
        // Convert
        {
            icon: mdiRefresh,
            classType: 'primary',
            label: t('Convert'),
            disabled: !jsonLogic.apply(actionRules.convert, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Convert' }
            }
        },
        // Split
        {
            icon: mdiCallSplit,
            classType: 'primary',
            label: t('Split'),
            disabled: !jsonLogic.apply(actionRules.split, data),
            action: () => {
                tabsStore.closeTab('inventory-split')

                tabsStore.openTab({
                    path: `/inventory/split/${selectedRows.value[0].id}`,
                    query: { type: 'child' }
                })
            }
        },
        // Combine
        {
            icon: mdiSourceMerge,
            classType: 'primary',
            label: t('Combine'),
            disabled: !jsonLogic.apply(actionRules.combine, data),
            action: () => {
                inventoryStore.setDataCombine(selectedRows)

                tabsStore.openTab({
                    path: '/inventory/combine/'
                })
            }
        },
        // Rejoin
        {
            icon: mdiSourceMerge,
            classType: 'primary',
            label: t('Rejoin'),
            show: jsonLogic.apply(actionRules.rejoin, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Grouping' }
            }
        },
        // Change stage
        {
            icon: mdiSwapHorizontal,
            classType: 'primary',
            label: t('Change stage'),
            disabled: !jsonLogic.apply(actionRules.genericAction, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'ChangeStage' }
            }
        },
        /**
         * Lock section
         **/
        // Lock
        {
            icon: mdiLockOutline,
            classType: 'primary',
            label: t('Lock'),
            disabled: !jsonLogic.apply(actionRules.lock, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Lock' }
            }
        },
        // Unlock
        {
            icon: mdiLockOpenOutline,
            classType: 'primary',
            label: t('Unlock'),
            show: jsonLogic.apply(actionRules.unlock, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Unlock' }
            }
        },
        // Lot
        {
            icon: mdiCheck,
            classType: 'primary',
            label: t('Make Lot'),
            show: jsonLogic.apply(actionRules.toLot, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'ToLot' }
            }
        },
        /**
         * Teal buttons
         */
        // Cull
        {
            icon: mdiTrashCanOutline,
            classType: 'teal',
            label: t('Cull'),
            show: jsonLogic.apply(actionRules.cull, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Cull' }
            }
        },
        // Propagate
        {
            icon: mdiSprout,
            classType: 'teal',
            label: t('Propagate'),
            show: jsonLogic.apply(actionRules.propagate, data),
            action: () => {
                tabsStore.openTab({
                    path: '/inventory/propagate',
                    query
                })
            }
        },
        // Create mom
        {
            icon: mdiMotherHeart,
            classType: 'teal',
            label: t('Create mom'),
            show: jsonLogic.apply(actionRules.createMom, data),
            action: () => {
                tabsStore.openTab({
                    path: '/inventory/create-mom',
                    query
                })
            }
        },
        // Makes clones
        {
            icon: mdiCardMultipleOutline,
            classType: 'teal',
            label: t('Make clones'),
            show: jsonLogic.apply(actionRules.makeClones, data),
            action: () => {
                tabsStore.openTab({
                    path: '/inventory/make-clone',
                    query
                })
            }
        },
        // Begin vegetation
        {
            icon: mdiForest,
            classType: 'teal',
            label: t('Begin vegetation'),
            show: jsonLogic.apply(actionRules.beginVegetation, data),
            action: () => {
                tabsStore.openTab({
                    path: '/inventory/begin-vegetation',
                    query
                })
            }
        },
        // Begin flower
        {
            icon: mdiFlowerTulip,
            classType: 'teal',
            label: t('Begin flower'),
            show: jsonLogic.apply(actionRules.beginFlower, data),
            action: () => {
                tabsStore.openTab({
                    path: '/inventory/begin-flower',
                    query
                })
            }
        },
        // Harvest
        {
            icon: mdiContentCut,
            classType: 'teal',
            label: t('Harvest'),
            show: jsonLogic.apply(actionRules.harvest, data),
            action: () => {
                tabsStore.openTab({
                    path: '/inventory/harvest',
                    query
                })
            }
        },
        // Seed up
        {
            icon: mdiApplicationOutline,
            classType: 'teal',
            label: t('Seed up'),
            show: jsonLogic.apply(actionRules.seedUp, data),
            action: () => {
                tabsStore.openTab({
                    path: '/inventory/seed-up',
                    query
                })
            }
        },
        /**
         * Yellow buttons
         */
        // Destem
        {
            icon: mdiFlowerOutline,
            classType: 'warning',
            label: t('De stem'),
            show: jsonLogic.apply(actionRules.destem, data),
            action () {
                tabsStore.openTab({
                    path: '/inventory/de-stem',
                    query
                })
            }
        },
        // Debud
        {
            icon: mdiBoxCutter,
            classType: 'warning',
            label: t('Debud'),
            show: jsonLogic.apply(actionRules.debud, data),
            action () {
                tabsStore.openTab({
                    path: '/inventory/debud',
                    query
                })
            }
        },
        // Machine trim
        {
            icon: mdiCoffeeMaker,
            classType: 'warning',
            label: t('Machine trim'),
            show: jsonLogic.apply(actionRules.machineTrim, data),
            action () {
                tabsStore.openTab({
                    path: '/inventory/machine-trim',
                    query
                })
            }
        },
        // Packaging
        {
            icon: mdiPackageVariant,
            label: 'Packaging',
            classType: 'warning',
            type: 'button',
            show: jsonLogic.apply(actionRules.packaging, data),
            action: (data) => {
                tabsStore.openTab({ path: '/inventory/packaging', name: 'Packaging', query: { id: selectedRows.value[0].id } })
            }
        },
        // Reweight
        {
            icon: mdiWeight,
            label: 'Reweight',
            classType: 'warning',
            type: 'button',
            show: jsonLogic.apply(actionRules.reweight, data),
            action: (data) => {
                openSlide()

                slideAction.value = { action: 'Reweight' }
            }
        },
        // Take Lab Sample
        {
            icon: mdiFlaskEmptyOutline,
            label: t('Take lab sample'),
            classType: 'warning',
            type: 'button',
            show: jsonLogic.apply(actionRules.takeLabSample, data),
            action: (data) => {
                openSlide()

                slideAction.value = { action: 'TakeLabSample' }
            }
        },
        // Retake Lab Sample
        {
            icon: mdiFlaskOutline,
            label: t('Retake lab sample'),
            classType: 'warning',
            type: 'button',
            show: jsonLogic.apply(actionRules.retakeLabSample, data),
            action: (data) => {
                openSlide()

                slideAction.value = { action: 'RetakeLabSample' }
            }
        },
        // Manage Lab Sample
        {
            icon: mdiTestTubeEmpty,
            label: t('Manage lab sample'),
            classType: 'warning',
            type: 'button',
            show: jsonLogic.apply(actionRules.manageLabSample, data),
            action: (data) => {
                tabsStore.openTab({ path: '/lab-sample', name: 'lab-sample', query })
            }
        },
        /**
         * Red buttons
         */
        // Possible contamination
        {
            icon: mdiAlert,
            classType: 'red',
            label: t('Possible contamination'),
            show: jsonLogic.apply(actionRules.possibleContamination, data),
            action () {
                openSlide()

                slideAction.value = { action: 'PossibleContamination' }
            }
        },
        // Confirm contamination
        {
            icon: mdiSkullCrossbones,
            classType: 'red',
            label: t('Confirm contamination'),
            show: jsonLogic.apply(actionRules.confirmContamination, data),
            action () {
                openSlide()

                slideAction.value = { action: 'ConfirmContamination' }
            }
        },
        // Dispose
        {
            icon: mdiDeleteEmpty,
            classType: 'red',
            label: t('Dispose'),
            show: jsonLogic.apply(actionRules.dispose, data),
            action () {
                openSlide()

                slideAction.value = { action: 'Dispose' }
            }
        },
        // Recall
        {
            icon: mdiBottleTonicSkullOutline,
            classType: 'red',
            label: t('Recall'),
            show: jsonLogic.apply(actionRules.recall, data),
            action () {
                openSlide()

                slideAction.value = { action: 'Recall' }
            }
        },
    ]
}
