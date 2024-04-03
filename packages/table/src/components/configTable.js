/**
 * Default configuration for AgGrid
 */
export const configTable = (input) => {

    return Object.assign({}, {
        pagination: true,
        paginationAutoPageSize: false,
        paginationPageSize: 20,
        multiSortKey: 'ctrl',
        rowSelection: null,
        width: '100%',
        alwaysShowHorizontalScroll: true,
        alwaysShowVerticalScroll: true,
        rowMultiSelectWithClick: false,
        suppressRowClickSelection: true,
        singleClickEdit: false,
        pivotColumnGroupTotals: null,
        sidebar: {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                    toolPanelParams: {
                        suppressPivotMode: true,
                        suppressRowGroups: true,
                        suppressValues: true,
                        suppressSyncLayoutWithGrid: false,
                        suppressColumnMove: false
                    }
                },
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel'
                },
            ]
        },
        onRowSelected: (data) => {},
        selectionChanged ({ api }) {},
        onReady: ({ api }) => {},
        enableRangeSelection: false,
        defaultColDef: {
            editable: false,
            resizable: true,
            sortable: true,
            filter: 'agTextColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            hide: false
        },
        onFirstDataRendered: () => {},
        modelUpdated: () => {},
        noPinnedRight: false,
        rowClassRules: {},
        enableCharts: false,
        aggFuncs: null,
        getMainMenuItems: (params) => {
            const defaultMenus = ['separator', 'autoSizeThis', 'autoSizeAll', 'separator', 'resetColumns']
    
            // The configuration does not allow putting to the right.
            if (!configTable.noPinnedRight) {
                defaultMenus.unshift('pinSubMenu')
            }
    
            // Adds pin left column functionality, controlling table and column settings
            if (!params.column.pinned && !params.column.colDef.lockPinned && configTable.noPinnedRight) {
                defaultMenus.unshift({
                    name: 'Pin column left',
                    icon: '<span class="ag-icon ag-icon-pin" unselectable="on" role="presentation"></span>',
                    action: () => {
                        params.columnApi.applyColumnState({
                            state: [{ colId: params.column.colId, pinned: 'left' }]
                        })
                    }
                })
            }
            // Adds no pin functionality, controlling table and column settings
            if (params.column.pinned && !params.column.colDef.lockPinned && configTable.noPinnedRight) {
                defaultMenus.unshift({
                    name: 'No pin',
                    action: () => {
                        params.columnApi.applyColumnState({
                            state: [{ colId: params.column.colId, pinned: null }]
                        })
                    }
                })
            }
    
            return defaultMenus
        },
        sizeColumnsToFit: false,
        autoSizeAll: true,
        cellClicked: () => {},
        headerButtonsClass: () => {
            return 'flex justify-between gap-4 sticky top-0 z-10 bg-white overflow-y-hidden border-b'
        },
        headerButtons: () => [],
        masterDetail: false,
        detailCellRendererParams: {},
        components: {},
        detailCellRenderer: null,
        detailRowAutoHeight: false,
        isRowMaster: (data) => {
            return true
        },
        treeData: false,
        groupDefaultExpanded: null,
        getDataPath: null,
        autoGroupColumnDef: null,
        groupDisplayType: null,
        groupIncludeFooter: false,
        groupIncludeTotalFooter: false,
        noRowsLabel: 'No records found'
    }, input)
}
