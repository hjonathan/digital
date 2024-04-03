import { configTable as config } from 'table'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ apiGrid }) => {
    return config({
        suppressRowClickSelection: true,
        rowSelection: 'multiple',
        sizeColumnsToFit: true,
        autoSizeAll: false,
        onReady (config) {
            apiGrid.value = config.api
        },
        selectionChanged: ({ api }) => {},
        modelUpdated: ({ api }) => {},
        isRowSelectable: ({ data }) => {
            return true
        }
    })
}
