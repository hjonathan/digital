import { ref } from 'vue'
import { configTable as config } from 'table'
import DetailReceipt from './DetailReceipt.vue'

export const configTable = ({ apiGrid, selectedRows, thread }) => {
    const gridColumnApi = ref(null)

    return config({
        suppressRowClickSelection: true,
        rowSelection: 'multiple',
        sizeColumnsToFit: true,
        autoSizeAll: false,
        onReady (config) {
            apiGrid.value = config.api

            gridColumnApi.value = config.gridColumnApi
        },
        getFilteredData: () => {
            const rowData = []

            apiGrid.value?.forEachNodeAfterFilter(node => {
                rowData.push(node.data)
            })

            return rowData
        },
        getDisplayedColumns: () => {
            return gridColumnApi.value?.columnModel.displayedColumns
        },
        selectionChanged: ({ api }) => {
            selectedRows.value = api.getSelectedRows()
        },
        isRowSelectable: ({ data }) => {
            // IMPORTANT: Only works from WAREHOUSE INVOICE PROCESS
            if (thread.value.idThread) {
                return thread.value.vendorId == data.vendor_id
            }

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

        masterDetail: true,
        detailCellRenderer: 'DetailReceipt',
        components: {
            DetailReceipt
        },
        detailRowAutoHeight: true,
        detailCellRendererParams: {
            getDetailRowData: (params) => {
                return params
            }
        },
        onFirstDataRendered: (params) => {
            setTimeout(() => {
                params.api.getDisplayedRowAtIndex(0).setExpanded(true)
            }, 0)
        }
    })
}
