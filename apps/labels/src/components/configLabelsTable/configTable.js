import { configTable as config } from 'table'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ useLabels }) => {
    return config({
        suppressRowClickSelection: true,
        rowSelection: 'single',
        sizeColumnsToFit: true,
        autoSizeAll: false,
        onReady (config) {
            useLabels.apiGrid.value = config.api
        },
        selectionChanged: ({ api }) => {
            useLabels.labelSelected.value = api.getSelectedRows()[0]
        },
        modelUpdated: ({ api }) => {},
        isRowSelectable: ({ data }) => {
            return true
        },
        cellClicked: (event) => {
            // Columns to select by clicking on the cell: ID and checkbox
            const cells = ['name', '0']

            // Prevent go to quantity step if its deselected
            if (event.node.isSelected() && cells.includes(event.column.colId)) {
                event.api.setNodesSelected({ nodes: [event.node], newValue: false })

                return
            }

            useLabels.enableQuantityStep()

            event.api.setNodesSelected({ nodes: [event.node], newValue: !event.node.isSelected() })

            const timeToWaitSelection = 100

            setTimeout(() => {
                useLabels.step.value = 'section_quantity'
            }, timeToWaitSelection)
        },
        onFirstDataRendered: ({ api }) => {
            const nodesToSelect = []

            api.forEachNode((node) => {
                if (useLabels.labelSelected.value?.id === node.data.id) {
                    nodesToSelect.push(node)
                }
            })

            api.setNodesSelected({ nodes: nodesToSelect, newValue: true })
        }
    })
}
