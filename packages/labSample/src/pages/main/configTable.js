import {
    configTable as config,
    actionTextFace
} from 'table'
import { useI18n } from 'vue-i18n'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ apiGrid, useGlobalStore, key, onFirstDataRendered }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    return config({
        suppressRowClickSelection: true,
        rowSelection: 'multiple',
        onReady (config) {
            apiGrid.value = config.api
        },
        selectionChanged: ({ api }) => {
            selectedRows.value = api.getSelectedRows()
        },
        isRowSelectable: ({ data }) => {
            return true
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
        groupDisplayType: 'custom',
        sizeColumnsToFit: false,
        autoSizeAll: false,
        groupDefaultExpanded: 0,
        getDataPath: (data) => {
            return data.lab_custom_number
        },
        treeData: true,
        autoGroupColumnDef: {
            headerName: 'Lab number',
            cellRendererParams: {
                suppressCount: true
            }
        },
        onFirstDataRendered: ({ api }) => {
            onFirstDataRendered({ api })
        }
    })
}
