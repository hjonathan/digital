<script setup>
import 'ag-grid-enterprise/styles/ag-grid.css'
import 'ag-grid-enterprise/styles/ag-theme-material.css'
import 'ag-grid-enterprise'
import { ref, watch } from 'vue'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping'
import { ModuleRegistry } from '@ag-grid-community/core'
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel'
import { MenuModule } from '@ag-grid-enterprise/menu'
import { AgGridVue } from 'ag-grid-vue3'
import { isObject, isBoolean, uniqueId } from 'lodash'
import { configButtons } from './configButtons'
import { ActionButtons } from 'layout'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

ModuleRegistry.registerModules([MenuModule, ColumnsToolPanelModule, ClientSideRowModelModule, RowGroupingModule])

const props = defineProps({
    elements: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        default: () => []
    },
    config: {
        type: Object,
        default: null
    },
    search: {
        type: String,
        default: ''
    },
    hasFilters: {
        type: Boolean,
        default: true
    }
})

const configTable = ref(props.config)
const columns = ref(props.columns)

const overlayNoRowsTemplate = ref(`<span class="ag-overlay-loading-center">${t('No records founds')}</span>`)
const overlayLoadingTemplate = ref('<span class="ag-overlay-loading-center">Loading</span>')

const toolPanelOpened = ref()

const id = uniqueId('table_')

let gridApi
let gridColumnApi

const onReady = ({ api, columnApi }) => {
    gridApi = api
    gridColumnApi = columnApi

    configTable.value.onReady && configTable.value.onReady({ api, gridColumnApi })

    toolPanelOpened.value = gridApi.getOpenedToolPanel()
}

/**
 * Resize the table on gridSizeChanged & viewportChanged event
 * @param {*} object
 */
const resizeTable = ({ api, columnApi }) => {
    if (configTable.value.sizeColumnsToFit) {
        isBoolean(configTable.value.sizeColumnsToFit) && api.sizeColumnsToFit(configTable.value.sizeColumnsToFit)

        isObject(configTable.value.sizeColumnsToFit) && api.sizeColumnsToFit({ defaultMinWidth: 150, defaultMaxWidth: 250 })
    }

    configTable.value.autoSizeAll && columnApi.autoSizeAllColumns(false)
}

watch(() => props.search, (nValue, oValue) => {
    gridApi.setQuickFilter(nValue)
})

// Blocks the right pin event
const onPinnedColumn = (column) => {
    if (column.pinned === 'right' && configTable.value.noPinnedRight) {
        column.columnApi.applyColumnState({
            state: [{ colId: column.column.colId, pinned: null }]
        })
    }
}

/**
 * Open tools panel from custom buttons in table header
 * @param {*} key
 */
const openToolPanel = (key) => {
    resizeSidebarMenu()

    const panelOpened = gridApi.getOpenedToolPanel()

    if (panelOpened || panelOpened === key) {
        toolPanelOpened.value = null

        gridApi.closeToolPanel()
    }

    if (panelOpened !== key) {
        toolPanelOpened.value = key

        gridApi.openToolPanel(key)
    }
}

/**
 * Resize the sidebar menu by recalculating the table body size
 */
const resizeSidebarMenu = () => {
    const tableElement = document.getElementById(id)?.querySelector('.ag-root-wrapper-body')

    if (tableElement) {
        const menuElement = tableElement.querySelector('.ag-side-bar')

        menuElement && (menuElement.style.maxHeight = `${tableElement.offsetHeight}px`)
    }
}

const buttons = configButtons({ configTable, openToolPanel })
</script>

<template>
    <div class="flex flex-col">
        <div :class="config.headerButtonsClass()">
            <slot name="start-buttons">
                <div />
            </slot>

            <div class="flex flex-row justify-end items-start">
                <slot
                    name="end-buttons">
                    <slot
                        name="aditional-end-buttons" />

                    <ActionButtons
                        v-if="hasFilters"
                        :items="buttons"
                        class="h-full"/>
                </slot>
            </div>
        </div>

        <div v-if="!elements.length" class="flex flex-col items-center justify-center bg-white p-4">
            <span>
                {{ configTable.noRowsLabel }}
            </span>
        </div>

        <AgGridVue
            :id="id"
            v-if="configTable && elements.length"
            :style="`width:${configTable.width || '100%'}`"
            class="ag-theme-material"
            :paginationPageSize="configTable.paginationPageSize || 10"
            :pagination="configTable.pagination ? true : false"
            :columnDefs="columns"
            :rowData="props.elements"
            :multiSortKey="configTable.multiSortKey"
            :sideBar="configTable.sidebar"
            :rowGroupPanelShow="configTable.rowGroupPanelShow"
            :pivotPanel="configTable.pivotPanel"
            :defaultColDef="configTable.defaultColDef"
            :rowSelection="configTable.rowSelection"
            :rowMultiSelectWithClick="configTable.rowSelection === 'multiple'"
            :isRowSelectable="configTable.isRowSelectable"
            :suppressRowClickSelection="configTable.suppressRowClickSelection"
            :overlayNoRowsTemplate="overlayNoRowsTemplate"
            :overlayLoadingTemplate="overlayLoadingTemplate"
            :enableRangeSelection="configTable.enableRangeSelection"
            @row-selected="configTable.onRowSelected"
            @selection-changed="configTable.selectionChanged"
            @grid-ready="onReady"
            @columnPinned="onPinnedColumn"
            @first-data-rendered="configTable.onFirstDataRendered"
            @gridSizeChanged="resizeTable"
            @viewportChanged="resizeTable"
            @model-updated="configTable.modelUpdated"
            @cell-clicked="config.cellClicked"
            :rowClassRules="config.rowClassRules"
            :getMainMenuItems="config.getMainMenuItems"
            :pivotMode="config.pivotMode"
            :animateRows="true"
            :enableCharts="config.enableCharts"
            :aggFuncs="config.aggFuncs"
            :pivotColumnGroupTotals="config.pivotColumnGroupTotals"
            :autoGroupColumnDef="config.autoGroupColumnDef"
            :masterDetail="config.masterDetail"
            :detailCellRendererParams="configTable.detailCellRendererParams"
            :detailCellRenderer="configTable.detailCellRenderer"
            :detailRowAutoHeight="configTable.detailRowAutoHeight"
            :components="configTable.components"
            :isRowMaster="config.isRowMaster"
            :treeData="config.treeData"
            :groupDefaultExpanded="config.groupDefaultExpanded"
            :getDataPath="config.getDataPath"
            :groupDisplayType="config.groupDisplayType"
            :singleClickEdit="configTable.singleClickEdit"
            :groupIncludeFooter="configTable.groupIncludeFooter"
            :groupIncludeTotalFooter="configTable.groupIncludeTotalFooter"
            :pinnedBottomRowData="configTable.pinnedBottomRowData"
            :getRowStyle="configTable.getRowStyle" />
    </div>
</template>

<style>
/* Change height to fit to rows content */
.ag-root-wrapper-body {
    height: fit-content !important;
}

.ag-layout-auto-height  {
    height: fit-content !important;
}

.ag-side-buttons {
    width: 0px !important; /* By default, two buttons appear vertically, columns and filters, width zero disappears these buttons */
}

/* Visibility for scrollbar horizontal on aggrid */
::-webkit-scrollbar {
    -webkit-appearance: none !important;
}

::-webkit-scrollbar:vertical {
    width: 10px; /* adjust the size of the vertical scroll bar, 10px is visually pleasing */
}

::-webkit-scrollbar:horizontal {
    height: 10px; /* adjust the size of the horizontal scroll bar, 10px is visually pleasing */
}

::-webkit-scrollbar-thumb {
    border-radius: 0px; /* the scroll bar has rounded edges, 8px is visually pleasing */
    border: 2px solid white;
    background-color: rgba(0, 0, 0, .5);
}

/* zero padding is to not block styles in custom components */
.ag-cell {
    padding-left: 0;
    padding-right: 0;
}

/* to show menu icons in each header */
.ag-header-cell-menu-button {
    opacity: 1 !important;
}

/* align checkbox header */
.ag-header-cell.ag-focus-managed {
    padding-left: 18px !important;
}

/* align checkbox cells */
.ag-selection-checkbox {
    padding-left: 18px;
}

.ag-theme-material {
    --ag-header-foreground-color: #495057;
    --ag-header-background-color: #f8f9fa;

    --ag-material-accent-color: #4f46e5;
    --ag-selected-row-background-color: #eef2ff;

    --ag-selected-tab-underline-width: 2px;
    --ag-selected-tab-underline-transition-speed: 0.5s;
}

.ag-checkbox-input-wrapper > .ag-checkbox-input {
    cursor: pointer;
}

.ag-checkbox-input-wrapper.ag-disabled > .ag-checkbox-input {
    cursor: default;
}

.ag-pinned-left-header {
    border-right: solid 1px #b2b2b2; /* 1px is to thicken the header of the pinned elements on the left */
}

.ag-cell-last-left-pinned {
    border-top: none !important;
    border-left: none !important;
    border-bottom: none !important;
    border-right: solid 1px #b2b2b2 !important; /* 1px is to thicken the last of the pinned elements on the left */
}

.ag-pinned-right-header {
    border-left: solid 1px  #b2b2b2; /* 1px is to thicken the header of the pinned elements on the right */
}

.ag-pinned-right-cols-container {
    border-left: solid 1px #b2b2b2 !important; /* 1px is to thicken the border left of the pinned elements on the right */
}

.ag-header-cell-filtered {
    background-color: #eceff1 !important;
    color: #495057 !important;
}

.ag-header-cell-filtered span {
    color: #495057 !important;
}

.action-button {
    pointer-events: all;
}

.ag-pinned-right-cols-container .ag-row:is(.ag-row-selected)  div[col-id="actions"][role="gridcell"] {
    background-color: var(--ag-selected-row-background-color);
}

.ag-cell-wrapper:has(> span > .ag-checkbox-action) {
    background-color: var(--ag-selected-row-background-color);
    border: none !important;
}

.ag-cell-wrapper {
   border: none !important;
}

.ag-cell-wrapper:has(.ag-checkbox):hover {
    cursor: pointer;
}

.ag-cell-wrapper:hover:has(> span > .ag-checkbox-action){
    background-color: rgb(var(--colors-primary-100) / var(--tw-bg-opacity));
}

div[col-id="checkbox"] {
    border: none !important
}

div[col-id="0"] {
    border: none !important
}

/* Override some classes on AgGrid for quick action buttons */
div[col-id="actions"] {
    position: absolute !important;
    left: auto !important;
    right: 0 !important;
    padding: 0 !important;
    width: 0 !important;
}

div[col-id="actions"][role="gridcell"] {
    width: max-content !important;
    right: 100% !important;
    border: 0 !important;
    background-color: #FAFAFA;
    pointer-events: none;
}

.action-button {
    pointer-events: all;
}

.ag-pinned-right-cols-container .ag-row:is(.ag-row-selected)  div[col-id="actions"][role="gridcell"] {
    background-color: var(--ag-selected-row-background-color);
}

.ag-pinned-right-cols-container .ag-row:not(.ag-row-hover) div[col-id="actions"][role="gridcell"] {
    width: 0 !important;
    padding: 0 !important;
}

.ag-cell-wrapper:has(> span > .ag-empty-action) {
   background-color: var(--ag-selected-row-background-color);
   border: none !important;
}

.disabled-row {
    color: #45454582;
    background-color: rgba(200, 200, 200, 0.299) !important;
}

.disabled-row > div > a {
  color:inherit;
  background-color: transparent;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
