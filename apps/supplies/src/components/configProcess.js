import { MarkerType } from '@vue-flow/core'
import {
    mdiFileDocumentArrowRight,
    mdiTruckCheck,
    mdiCashMultiple,
    mdiCartPlus
} from '@mdi/js'
import { uuid } from 'shared'

const showDocuments = (graph, stageDocument, originId, position, action) => {
    const newPosition = { x: position.x, y: 100 }

    const newId = uuid()
    const newIdEdge = uuid()

    graph.push({
        id: newId,
        type: 'StageNode',
        data: {
            closable: true,
            type: ['source', 'target'],
            icon: mdiFileDocumentArrowRight,
            label: stageDocument.name,
            customClass: stageDocument.active ? 'text-blue-500' : 'text-gray-400',
            handlers: ['source_top'],
            action
        },
        position: newPosition
    })

    graph.push({
        id: newIdEdge,
        source: originId,
        target: newId,
        sourceHandle: 'source_bottom',
        targetHandle: 'target_top',
        animated: true,
        markerEnd: MarkerType.ArrowClosed
    })
}

const documentTypesCreate = {
    'material-request': 'MaterialRequest',
    'purchase-request': 'CreatePurchaseRequest',
    'request-for-quotation-rfq': 'CreateRequestForQuotation',
    'purchase-order-po': 'CreatePurchaseOrder',
    'dispatch-note': 'DispatchNote',
    'dispatch-note-pr': 'DispatchNotePr'
}

const documentTypesShow = {
    'material-request': 'ShowMaterialRequest',
    'purchase-request': 'ShowPurchaseRequest',
    'request-for-quotation-rfq': 'ShowRequestForQuotation',
    'purchase-order-po': 'ShowPurchaseOrder',
    'dispatch-note': 'DispatchNote',
    'dispatch-note-pr': 'DispatchNotePr'
}

const icons = {
    'Material Dispatch': mdiTruckCheck,
    Requests: mdiFileDocumentArrowRight,
    Quotations: mdiCashMultiple,
    Purchases: mdiCartPlus,
    Dispatches: mdiTruckCheck
}

const getColor = (stage) => {
    let color = 'text-gray-400'

    if (stage.active) color = 'text-primary-600'

    return color
}

export const buildRequestSchema = (requests, mainIndex, tabsStore) => {
    requests[mainIndex].graph = []

    let startPosition = 0

    for (let index = 0; index < requests[mainIndex].supply_process_stages.length; index++) {
        const stage = requests[mainIndex].supply_process_stages[index]
        const nextStage = requests[mainIndex].supply_process_stages[index + 1]

        let conectors = ['target_left', 'source_right', 'source_bottom']

        if (!index) conectors = ['source_right', 'source_bottom']

        if (index === requests[mainIndex].supply_process_stages.length - 1) conectors = ['target_left', 'source_bottom']

        requests[mainIndex].graph.push({
            id: stage.id.toString(),
            type: 'StageNode',
            data: {
                type: ['source', 'target'],
                icon: icons[stage.name],
                label: stage.name,
                customClass: getColor(stage),
                handlers: conectors,
                action: () => {
                    requests[mainIndex].defaultHeight = 200

                    const currentNode = requests[mainIndex].graph.find(x => x.id === stage.id.toString())

                    let documentPosition = currentNode.position.x

                    for (let i = requests[mainIndex].graph.length - 1; i >= 0; i--) {
                        if (requests[mainIndex].graph[i].data?.closable) {
                            requests[mainIndex].graph.splice(i, 1)
                        }
                    }

                    for (let indexDocument = 0; indexDocument < stage.supply_process_stage_documents.length; indexDocument++) {
                        const stageDocument = stage.supply_process_stage_documents[indexDocument]

                        showDocuments(requests[mainIndex].graph, stageDocument, stage.id.toString(), { x: documentPosition, y: 100 }, () => {
                            if (stageDocument.supply_order_id) {
                                tabsStore.openTab({
                                    name: documentTypesShow[stageDocument.supply_order_type.slug],
                                    query: {
                                        stageId: stage?.id,
                                        processId: requests[mainIndex].id,
                                        supplyOrderId: stageDocument.supply_order_id,
                                        supplyOrderTypeId: stageDocument.supply_order_type.id
                                    },
                                    params: {
                                        id: stageDocument.supply_order_id
                                    }
                                })

                                return
                            }

                            tabsStore.openTab({
                                name: documentTypesCreate[stageDocument.supply_order_type.slug],
                                query: {
                                    processId: requests[mainIndex].id,
                                    supplyOrderId: stageDocument.supply_order_id,
                                    stageId: stage?.id,
                                    supplyOrderTypeId: stageDocument.supply_order_type.id
                                }
                            })
                        })

                        documentPosition += 200
                    }
                }
            },
            position: { x: startPosition, y: 0 }
        })

        if (nextStage) {
            requests[mainIndex].graph.push({ id: `${stage.id}-${nextStage.id}`, source: stage.id.toString(), target: nextStage.id.toString(), sourceHandle: 'source_right', targetHandle: 'target_left', animated: true, markerEnd: MarkerType.ArrowClosed })
        }

        startPosition += 200
    }

    return requests[mainIndex].graph
}
