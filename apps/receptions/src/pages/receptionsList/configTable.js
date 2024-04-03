import { configTable as config } from 'table'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ apiGrid, selectedRows }) => {
    return config({
        suppressRowClickSelection: true,
        rowSelection: 'single',
        sizeColumnsToFit: true,
        autoSizeAll: false,
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
        }
    })
}
