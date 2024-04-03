import { configTable as config } from 'table'

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
