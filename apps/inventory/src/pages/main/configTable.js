import { configTable as config } from 'table'
import {
    mdiTablePivot,
    mdiTable
} from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { jsonLogic, lockRules } from 'jsonRules'
import { businessRules } from '../configRules'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ apiGrid, useGlobalStore, key, idThread, actionThread, updateSelectedRows, invoiceItemSelected, pivotTable }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    return config({
        suppressRowClickSelection: true,
        rowSelection: 'multiple',
        onReady (config) {
            apiGrid.value = config.api

            updateSelectedRows && updateSelectedRows()
        },
        selectionChanged: ({ api }) => {
            selectedRows.value = api.getSelectedRows()
        },
        isRowSelectable: ({ data }) => {
            if (idThread && actionThread === 'transfers') {
                const preSelectedItemsIds = invoiceItemSelected.value.map(item => item.id)

                return jsonLogic.apply(businessRules.selectItemByTransfer, data) || preSelectedItemsIds.includes(data.id)
            }

            if (idThread) {
                const preSelectedItemsIds = invoiceItemSelected.value.map(item => item.id)

                return (data.children_count === 0 && jsonLogic.apply(lockRules.unlocked, data)) ||
                    preSelectedItemsIds.includes(data.id)
            }

            return data.children_count === 0
        },
        modelUpdated: ({ api }) => {},
        cellClicked: (event) => {
            // Columns to select by clicking on the cell: ID and checkbox
            const cells = ['id', 'checkbox']

            // If the cell is selected, it is deselected when clicked
            if (cells.includes(event.column.colId)) {
                event.api.setNodesSelected({ nodes: [event.node], newValue: !event.node.isSelected() })
            }
        },
        headerButtons: () => {
            const buttons = []

            if (!idThread) {
                buttons.push({
                    icon: mdiTablePivot,
                    classType: 'gray',
                    label: t('Pivot Table'),
                    action () {
                        pivotTable.value = true
                    }
                })
            }

            return buttons
        }
    })
}

/**
 * Default pivot table configurations
 */
export const configPivotTable = ({ pivotTable }) => {
    const { t } = useI18n()

    return config({
        pagination: true,
        paginationAutoPageSize: true,
        paginationPageSize: 10,
        multiSortKey: 'ctrl',
        rowSelection: null,
        width: '100%',
        height: '58.5vh',
        alwaysShowHorizontalScroll: true,
        alwaysShowVerticalScroll: true,
        rowMultiSelectWithClick: true,
        suppressRowClickSelection: true,
        singleClickEdit: false,
        enableRangeSelection: true,
        pivotMode: true,
        sidebar: ['columns'],
        pivotColumnGroupTotals: 'before',
        enableCharts: true,
        aggFuncs: {},
        getMainMenuItems: null,
        headerButtons: () => {
            return [
                {
                    icon: mdiTable,
                    classType: 'gray',
                    label: t('Table'),
                    action () {
                        pivotTable.value = false
                    }
                },
            ]
        }
    })
}
