import { configTable as config } from 'table'
import { ref } from 'vue'

export const configTable = ({ apiGrid, selectedRows, totalRow, t }) => {
    const gridColumnApi = ref(null)

    return config({
        suppressRowClickSelection: true,
        rowSelection: 'single',
        sizeColumnsToFit: true,
        autoSizeAll: false,
        treeData: true,
        groupDefaultExpanded: 1,
        getRowStyle: (params) => {
            if (params.node.rowPinned) {
                return { fontWeight: 'bold', backgroundColor: '#E0E0E0' };
            }
        },
        pinnedBottomRowData: totalRow.value,
        getDataPath: (data) => {
            return data.path
        },
        autoGroupColumnDef: {
            headerName: t('Name'),
            cellRendererParams: {
                suppressCount: true
            },
            valueGetter: ({ data }) => {
                return data?.name
            }
        },
        onReady (config) {
            apiGrid.value = config.api

            gridColumnApi.value = config.gridColumnApi
        },
        getFilteredData: () => {
            let rowData = [];

            apiGrid.value?.forEachNodeAfterFilter(function(node) {
                rowData.push(node.data);
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
