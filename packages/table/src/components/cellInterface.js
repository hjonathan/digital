import { CONTENT_TEMPLATE } from './content.js'
import { FILTER_TEMPLATE } from './filterTemplates'
import { FILTER_PARAMS } from './filterParams'

export const actionTextFace = (column) => {
    const formatter = column.formatter
    const action = column.action

    delete column.formatter
    delete column.action

    return Object.assign({}, {
        lockVisible: true,
        pinned: 'left',
        filterParams: {
            caseSensitive: false,
            defaultOption: 'contains'
        },
        cellRendererSelector: (cell) => {
            return {
                component: CONTENT_TEMPLATE.action,
                params: {
                    data: cell.data,
                    action: action || (() => {}),
                    column,
                    formatter
                }
            }
        }
    }, column)
}

export const actionIconFace = (column) => {
    const params = column.params

    delete column.params

    return Object.assign({}, {
        lockVisible: true,
        filterParams: {
            caseSensitive: false,
            defaultOption: 'contains'
        },
        cellRendererSelector: (cell) => {
            return {
                component: CONTENT_TEMPLATE.actionIcon,
                params: {
                    ...params,
                    data: cell.data
                }
            }
        }
    }, column)
}

export const badgeFace = (column) => {
    const params = column.params

    delete column.params

    return Object.assign({}, {
        filterParams: {
            caseSensitive: false,
            defaultOption: 'contains'
        },
        cellRendererSelector: (cell) => {
            return {
                component: CONTENT_TEMPLATE.badge,
                params: {
                    ...params,
                    data: cell.data
                }
            }
        }
    }, column)
}

export const numericFace = (column) => {
    const formatter = column.formatter

    delete column.formatter

    return Object.assign({}, {
        filterParams: {
            caseSensitive: false,
            defaultOption: 'contains'
        },
        cellRendererSelector: (cell) => {
            return {
                component: CONTENT_TEMPLATE.numeric,
                params: {
                    data: cell.data,
                    column,
                    formatter
                }
            }
        }
    }, column)
}

export const textFace = (column) => {
    const formatter = column.formatter

    delete column.formatter

    return Object.assign({}, {
        filterParams: {
            caseSensitive: false,
            defaultOption: 'contains'
        },
        cellRendererSelector: (cell) => {
            return {
                component: CONTENT_TEMPLATE.text,
                params: {
                    data: cell.data,
                    column,
                    formatter
                }
            }
        }
    }, column)
}

export const checkboxFace = (column) => {
    return Object.assign({}, {
        field: null,
        headerName: null,
        sortable: false,
        floatingFilter: false,
        headerCheckboxSelection: true,
        suppressColumnsToolPanel: true,
        suppressFiltersToolPanel: true,
        checkboxSelection: true,
        hide: false,
        pinned: 'left',
        minWidth: 55, // This cell only contains the checkbox, the minimum of 55 is visually pleasing
        maxWidth: 55,
        lockVisible: true,
        resizable: false,
        suppressMovable: true,
        suppressNavigable: true,
        menuTabs: [],
        headerCheckboxSelectionFilteredOnly: false,
        headerCheckboxSelectionCurrentPageOnly: false,
        cellRendererSelector: (cell) => {
            return {
                component: CONTENT_TEMPLATE.inheritCheckbox
            }
        }
    }, column)
}

export const quickActionFace = (column) => {
    const customComponent = column.customComponent
    const options = column.options

    delete column.customComponent
    delete column.options

    return Object.assign({}, {
        pinned: 'right',
        type: 'rightAligned',
        lockVisible: true,
        floatingFilter: false,
        resizable: false,
        sortable: false,
        suppressMovable: true,
        suppressNavigable: true,
        menuTabs: [],
        minWidth: 0.1, // This cell only contains the quick action button, the minimum of 0.1 is initially invisible
        maxWidth: 0.1,
        headerClass: 'buttons-action',
        field: 'actions',
        headerName: 'Actions',
        suppressColumnsToolPanel: true,
        suppressFiltersToolPanel: true,
        hide: false,
        cellRendererSelector: (cell) => {
            return {
                component: customComponent || null,
                params: {
                    data: cell.data,
                    column: {
                        ...column,
                        options
                    }
                }
            }
        }
    }, column)
}
