import { configTable as config } from 'table'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ apiGrid, useGlobalStore, key, updateSelectedDrivers }) => {
    const rapidStore = useGlobalStore('rapidStore')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    return config({
        suppressRowClickSelection: true,
        rowSelection: 'multiple',
        onReady (config) {
            apiGrid.value = config.api

            updateSelectedDrivers && updateSelectedDrivers()
        },
        selectionChanged: ({ api }) => {
            selectedRows.value = api.getSelectedRows()
        },
        cellClicked: (event) => {
            // Columns to select by clicking on the cell: name and checkbox
            const cells = ['name', 'checkbox']

            // If the cell is selected, it is deselected when clicked
            if (cells.includes(event.column.colId)) {
                event.api.setNodesSelected({ nodes: [event.node], newValue: !event.node.isSelected() })
            }
        }
    })
}
