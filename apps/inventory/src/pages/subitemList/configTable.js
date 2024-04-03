import { configTable as config } from 'table'

/**
 * Subitem table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ apiGrid, useGlobalStore, key }) => {
    const rapidStore = useGlobalStore('rapidStore')
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
        modelUpdated: ({ api }) => {},
        isRowSelectable: ({ data }) => {
            return true
        },
        cellClicked: (event) => {
            // Columns to select by clicking on the cell: ID and checkbox
            const cells = ['id', 'checkbox']

            // If the cell is selected, it is deselected when clicked
            if (cells.includes(event.column.colId)) {
                event.api.setNodesSelected({ nodes: [event.node], newValue: !event.node.isSelected() })
            }
        }
    })
}
