<script setup>
import { formatDate, comparatorFilterDate } from 'shared'
import Table from '../components/Table.vue'
import { configTable } from '../components/configTable'
import { actionTextFace, numericFace, textFace, checkboxFace, quickActionFace } from '../components/cellInterface'
import { mdiClipboardTextClockOutline } from '@mdi/js'
import { QuickAction } from 'layout'

const data = [
    {
        make: 'Toyota',
        model: 'Celica',
        update: '2023-09-28T13:26:17.052Z',
        price: 35000,
        normal: 35001
    },
    {
        make: 'Ford',
        model: 'Mondeo',
        update: '2023-09-28T13:26:17.052Z',
        price: 32000,
        normal: 35002
    },
    {
        make: 'Porsche',
        model: 'Boxster',
        update: '2023-09-28T13:26:17.052Z',
        price: 72000,
        normal: 35003
    },
]

const columns = [
    checkboxFace({
        field: 'checkbox'
    }),
    actionTextFace({
        headerName: 'Make',
        valueGetter: ({ data }) => {
            return `${data.make}`
        },
        field: 'make',
        action: (data) => {
            console.log('ACTION:::', data)
        },
        formatter: (data) => {
            return `My custom formatter ${data.make}`
        }
    }),
    textFace({
        headerName: 'Model',
        field: 'model'
    }),
    textFace({
        filter: 'agDateColumnFilter',
        headerName: 'Date',
        field: 'update',
        valueGetter: ({ data }) => {
            return data.update ? formatDate(data.update) : null
        },
        filterParams: {
            comparator: comparatorFilterDate
        },
        formatter: (data) => {
            return formatDate(data.update, 'diffForHumans')
        }
    }),
    numericFace({
        headerName: 'Price',
        field: 'price',
        formatter: (data) => {
            return `${data.price}`
        }
    }),
    {
        headerName: 'Normal',
        field: 'normal'
    },
    quickActionFace({
        customComponent: QuickAction,
        options: {
            customButtons: () => {
                return [
                    {
                        icon: mdiClipboardTextClockOutline,
                        label: 'History',
                        permission: 'inventory.home.actions.item_history',
                        type: 'button',
                        action: (data) => {
                            console.log('Demo click quick action: ', data)
                        }
                    },
                ]
            }
        }
    }),
]

const config = configTable({
    sizeColumnsToFit: false,
    autoSizeAll: false,
    rowSelection: 'multiple',
    cellClicked: (ev) => {
        // Allows you to select the row by clicking on any of these cells.
        const cells = ['make', 'checkbox']

        // If the cell is selected, it is deselected when clicked
        if (ev.node.isSelected() && cells.includes(ev.column.colId)) {
            ev.api.setNodesSelected({ nodes: [ev.node], newValue: false })

            return
        }

        // If the cell is not selected, it is selected when clicked
        if (cells.includes(ev.column.colId)) {
            ev.api.setNodesSelected({ nodes: [ev.node], newValue: true })
        }
    },
    headerButtonsClass: () => {
        return ''
    }
})

</script>

<template>
    <div>
        {{ $t('Table') }}
    </div>

    <Table
        :elements="data"
        :config="config"
        :columns="columns" >
    </Table>
</template>
