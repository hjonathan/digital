import { configTable as config } from 'table'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ apiGrid, useLabels }) => {
    return config({
        suppressRowClickSelection: true,
        rowSelection: 'multiple',
        onReady (config) {
            useLabels.apiGridProducts.value = config.api
        },
        selectionChanged: ({ api }) => {
            useLabels.productsSelected.value = api.getSelectedRows()
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
        },
        onFirstDataRendered: ({ api }) => {
            const nodesToSelect = []

            api.forEachNode((node) => {
                if (useLabels.productsSelected.value.find((label) => label.id === node.data.id)) {
                    nodesToSelect.push(node)
                }
            })

            api.setNodesSelected({ nodes: nodesToSelect, newValue: true })
        }
    })
}
