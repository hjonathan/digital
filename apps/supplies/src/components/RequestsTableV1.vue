<script setup>
import { TableUI, Badge } from 'layout'
import { markRaw, ref } from 'vue'
import { MarkerType } from '@vue-flow/core'
import GraphFlow from './Graph/GraphFlow.vue'
import {
    mdiFileDocumentArrowRight,
    mdiTruckCheck,
    mdiCashMultiple,
    mdiCartPlus
} from '@mdi/js'
import StageNode from './Graph/StageNode.vue'

const nodeTypes = {
    StageNode: markRaw(StageNode)
}

const materialRequestFlow = ref([
    {
        id: '1',
        type: 'StageNode',
        data: {
            type: ['source'],
            icon: mdiFileDocumentArrowRight,
            label: 'Material request',
            customClass: 'text-teal-600'
        },
        position: { x: 0, y: 0 }
    },
    {
        id: '2',
        type: 'StageNode',
        data: {
            type: ['target'],
            icon: mdiTruckCheck,
            label: 'Dispatch material',
            customClass: 'text-primary-500'
        },
        position: { x: 200, y: 0 }
    },
    { id: 'MR-1-2', source: '1', target: '2', animated: true, markerEnd: MarkerType.ArrowClosed },
])

const purchaseRequestFlow = ref([
    {
        id: '1',
        type: 'StageNode',
        data: {
            type: ['source'],
            icon: mdiFileDocumentArrowRight,
            label: 'Purchase request',
            customClass: 'text-teal-600',
            action: () => {
                console.log('SHOW MESSAGE ======')
                console.log('FROM ACTION:')
            }

        },
        position: { x: 0, y: 0 }
    },
    {
        id: '2',
        type: 'StageNode',
        data: {
            type: ['source', 'target'],
            icon: mdiCashMultiple,
            label: 'Quotation',
            customClass: 'text-teal-600'
        },
        position: { x: 200, y: 0 }
    },
    {
        id: '3',
        type: 'StageNode',
        data: {
            type: ['source', 'target'],
            icon: mdiCartPlus,
            label: 'Buy',
            customClass: 'text-primary-500'
        },
        position: { x: 400, y: 0 }
    },
    {
        id: '4',
        type: 'StageNode',
        data: {
            type: ['target'],
            icon: mdiTruckCheck,
            label: 'Dispatch',
            customClass: 'text-gray-400'
        },
        position: { x: 600, y: 0 }
    },
    { id: 'PR-1-2', source: '1', target: '2', animated: true, markerEnd: MarkerType.ArrowClosed },
    { id: 'PR-2-3', source: '2', target: '3', animated: true, markerEnd: MarkerType.ArrowClosed },
    { id: 'PR-3-4', source: '3', target: '4', animated: true, markerEnd: MarkerType.ArrowClosed },
])

// General table
const columns = ref([
    { field: 'id', name: 'ID', align: 'left', customClass: '' },
    { field: 'request_user.name', name: 'Type', align: 'left', customClass: '' },
    { field: 'approval_name', name: 'Progress', align: 'left', customClass: '' },
    { field: 'supply_order_status.name', name: 'Status', align: 'left', customClass: '' },
])

const data = ref([
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
    {
        id: 'SSJ12312',
        type: 'Material request',
        status: 'Pending for aproval'
    },
    {
        id: '65DF234',
        type: 'Purchase request',
        status: 'Pending for Dispatch'
    },
])

const getProcess = (request) => {
    if (request.type === 'Material request') {
        return materialRequestFlow
    }

    if (request.type === 'Purchase request') {
        return purchaseRequestFlow
    }
}

const processTypeBadgeColor = {
    'Material request': 'info',
    'Purchase request': 'success'
}

const processStatusBadgeColor = {
    'Pending for aproval': 'warning',
    'Pending for Dispatch': 'orange'
}

</script>

<template>
    <div class="grid grid-cols-1">
        <TableUI
            :columns="columns"
            :data="data">
            <template v-slot:row="{ row }">
                <tr>
                    <td class="!w-2/12">
                        <span class="flex flex-col !w-12">
                            {{ row.id }}
                        </span>
                    </td>

                    <td class="!w-2/12">
                        <span class="!w-24">
                                {{ row.type }}
                            
                        </span>
                    </td>

                    <td class="!w-6/12">
                        <div class="flex flex-col !w-full">
                            <GraphFlow
                                :flow="getProcess(row)"
                                :nodeTypes="nodeTypes"/>
                        </div>
                    </td>

                    <td class="!w-2/12">
                        <span class="!w-24">
                            <Badge
                                :type="processStatusBadgeColor[row.status]">
                                {{ row.status }}
                            </Badge>
                        </span>
                    </td>
                </tr>
            </template>
        </TableUI>
    </div>
</template>
