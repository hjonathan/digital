import { configTable as config } from 'table'

export const configTable = ({ apiGrid, useGlobalStore, key }) => {
    const rapidStore = useGlobalStore('rapidStore')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    return config({
        sizeColumnsToFit: true,
        autoSizeAll: false,
        suppressRowClickSelection: true,
        rowSelection: 'single',
        onReady (config) {
            apiGrid.value = config.api
        },
        selectionChanged: ({ api }) => {
            selectedRows.value = api.getSelectedRows()
        },
        cellClicked: (event) => {
            // Columns to select by clicking on the cell: name and checkbox
            const cells = ['id', 'checkbox']

            // If the cell is selected, it is deselected when clicked
            if (cells.includes(event.column.colId)) {
                event.api.setNodesSelected({ nodes: [event.node], newValue: !event.node.isSelected() })
            }
        }
    })
}
