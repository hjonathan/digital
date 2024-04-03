<script setup>
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CardDocument from './CardDocument.vue'
import { Title, Button } from 'layout'
import { formatAmericanDate, formatAmericanSimplifiedDate, showUuid, formatDiffForHumans, applyProp } from 'shared'
import PlaceholderEmpty from './PlaceholderEmpty.vue'
import PlaceholderCreate from './PlaceholderCreate.vue'
import PlaceholderCancel from './PlaceholderCancel.vue'
import { intersection, isFunction } from 'lodash'
import { mdiFileDocumentPlusOutline } from '@mdi/js'
import { getDocumentType } from './configProcess'
import { getDocument } from './configLane'
import { CombineSupply, WarehouseReceiptUnknown, EnableInStock } from './documents/index'
import { PlaceholderWarehouseReceipt, PlaceholderCombineSupply } from './placeholders/index'

const { t } = useI18n()
const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const coreStore = useGlobalStore('core')

const props = defineProps({
    useProcess: Object,
    config: {
        type: Object,
        default: () => ({})
    }
})

const { cancelProcess, terminateProcess, process } = props.useProcess

const typesConfig = {
    invoice: {
        route: 'SuppliesShowInvoice',
        footer: null,
        title: t('Invoice'),
        description: t('Continue by adding an Invoice'),
        routeCreate: 'SuppliesCreateInvoice',
        permission: {
            create: 'supplies.invoice.create'
        },
        variables: () => {
            const documentTypeSO = getDocumentType(process.value, 'sales-order')
            const documentType = getDocumentType(process.value, 'purchase-order-po')

            const documentTypeCS = getDocumentType(process.value, 'combine-supply')

            if (documentTypeSO?.process_stage_documents.length) {
                return { supplyOrderId: documentTypeSO.process_stage_documents[0].supply_order_id, documentType: 'sales-order' }
            }

            if (documentType?.process_stage_documents.length) {
                return { supplyOrderId: documentType.process_stage_documents[0].supply_order_id, documentType: 'purchase-order-po' }
            }

            if (documentTypeCS?.process_stage_documents.length) {
                return { supplyOrderId: documentTypeCS.process_stage_documents[0].supply_order_id, documentType: 'combine-supply' }
            }

            return { documentType: 'warehouse-receipt-unknown-supply' }
        }
    },
    // 'warehouse-receipt': {
    //     route: 'ShowWarehouseReceipt',
    //     footer: null,
    //     title: t('Receive in warehouse'),
    //     routeCreate: 'CreateWarehouseReceipt',
    //     permission: {
    //         create: 'supplies.warehouse_receipt.create'
    //     },
    //     variables: () => {
    //         const documentType = getDocumentType(process.value, 'invoice')

    //         if (documentType && documentType.process_stage_documents.length) {
    //             return { supplyOrderId: documentType.process_stage_documents[0].supply_order_id }
    //         }

    //         return { }
    //     }
    // },
    'warehouse-receipt': {
        placeholderAdd: PlaceholderWarehouseReceipt,
        routeCreate: 'CreateWarehouseReceipt',

        route: 'ShowWarehouseReceipt',
        footer: null,
        title: t('Receive in warehouse'),
        permission: {
            create: 'supplies.warehouse_receipt.create'
        },
        variables: () => {
            const documentType = getDocumentType(process.value, 'invoice')

            if (documentType && documentType.process_stage_documents.length) {
                return { supplyOrderId: documentType.process_stage_documents[0].supply_order_id }
            }

            return { }
        }
    },
    'warehouse-receipt-unknown-supply': {
        documentComponent: WarehouseReceiptUnknown,
        placeholderAdd: PlaceholderWarehouseReceipt,
        routeCreate: 'CreateWarehouseReceipt'
    },
    'combine-supply': {
        documentComponent: CombineSupply,
        placeholderAdd: PlaceholderCombineSupply,
        routeCreate: 'CreateWarehouseReceipt'
    },
    'enable-in-stock': {
        documentComponent: EnableInStock
    },
    'purchase-order-po': {
        route: 'ShowPurchaseOrder',
        routeCreate: 'CreatePurchaseOrder',
        permission: {
            create: 'supplies.purchase_order.create'
        },
        variables: () => ({}),
        footer: {
            label: t('Add invoice'),
            onClick: (document) => {
                const query = {
                    stageId: props.config.id,
                    processId: process.value.id,
                    supplyOrderId: document.supply_order_id,
                    supplyOrderType: 'invoice',
                    documentType: document.slug
                }

                tabsStore.openTab({ name: 'SuppliesCreateInvoice', query })
            }
        }
    },
    'sales-order': {
        route: 'ShowSalesOrder',
        routeCreate: 'CreateSalesOrder',
        permission: {
            create: 'supplies.sales_order.create'
        },
        variables: () => {
            const documentType = getDocumentType(process.value, 'purchase-order-po')

            return { supplyOrderId: documentType.process_stage_documents[0].supply_order_id }
        },
        footer: {
            label: t('Receive by invoice'),
            onClick: (document) => {
                const query = {
                    stageId: props.config.id,
                    processId: process.value.id,
                    supplyOrderId: document.supply_order_id,
                    supplyOrderType: 'invoice',
                    documentType: document.slug
                }

                tabsStore.openTab({ name: 'SuppliesCreateInvoice', query })
            }
        }
    },
    'material-assignment': {
        route: 'ShowMaterialAssign',
        footer: null,
        routeCreate: 'StartMaterialAssign',
        permission: {
            create: 'supplies.material_assignment.create'
        },
        variables: () => ({}),
        document: {
            user: (type, document) => {
                return t('Manager')
            },
            date: (type, document) => {
                return t('Assigned date')
            }
        }
    },
    'material-request': {
        route: 'ShowMaterialRequest',
        footer: null,
        routeCreate: 'MaterialRequest',
        permission: {
            create: 'supplies.material_request.create'
        },
        variables: () => ({})
    },
    'purchase-request': {
        route: 'ShowPurchaseRequest',
        footer: null,
        routeCreate: 'CreatePurchaseRequest',
        permission: {
            create: 'supplies.purchase_request.create'
        },
        variables: () => ({})
    },
    'dispatch-note': {
        route: (document) => {
            const documentTypeMA = getDocumentType(process.value, 'material-assignment')

            if (documentTypeMA && documentTypeMA.process_stage_documents.length) return 'ShowDispatchNoteMA'

            return 'ShowDispatchNote'
        },
        document: {
            user: (type, document) => {
                const documentTypeMA = getDocumentType(process.value, 'material-assignment')

                if (documentTypeMA && documentTypeMA.process_stage_documents.length) return t('Assigner')

                return t('Requester')
            },
            date: (type, document) => {
                const documentTypeMA = getDocumentType(process.value, 'material-assignment')

                if (documentTypeMA && documentTypeMA.process_stage_documents.length) return t('Assigner')

                return t('Requester')
            }
        },
        footer: null,
        permission: {
            create: 'supplies.dispatch_note.create'
        },
        routeCreate: (type) => {
            const documentTypeMR = getDocumentType(process.value, 'material-request')

            const documentTypeMA = getDocumentType(process.value, 'material-assignment')

            if (documentTypeMA && documentTypeMA.process_stage_documents.length) return 'CreateDispatchNoteMA'

            if (documentTypeMR && documentTypeMR.process_stage_documents.length) return 'CreateDispatchNoteMR'

            return 'CreateDispatchNote'
        },
        variables: () => {
            const documentTypeMR = getDocumentType(process.value, 'material-request')
            const documentTypePR = getDocumentType(process.value, 'purchase-request')
            const documentTypeMA = getDocumentType(process.value, 'material-assignment')

            if (documentTypeMR && documentTypeMR.process_stage_documents.length) {
                return {
                    supplyOrderId: documentTypeMR.process_stage_documents[0].supply_order_id,
                    documentType: 'material-request'
                }
            }

            if (documentTypePR && documentTypePR.process_stage_documents.length) {
                return {
                    supplyOrderId: documentTypePR.process_stage_documents[0].supply_order_id,
                    documentType: 'purchase-request'
                }
            }

            if (documentTypeMA && documentTypeMA.process_stage_documents.length) {
                return {
                    supplyOrderId: documentTypeMA.process_stage_documents[0].supply_order_id,
                    documentType: 'material-assignment'
                }
            }

            return { }
        },
        openDocVariables: () => {
            const documentTypeMR = getDocumentType(process.value, 'material-request')
            const documentTypePR = getDocumentType(process.value, 'purchase-request')
            const documentTypeMA = getDocumentType(process.value, 'material-assignment')

            if (documentTypeMR && documentTypeMR.process_stage_documents.length) {
                return {
                    supplyOrderId: documentTypeMR.process_stage_documents[0].supply_order_id
                }
            }

            if (documentTypePR && documentTypePR.process_stage_documents.length) {
                return {
                    supplyOrderId: documentTypePR.process_stage_documents[0].supply_order_id
                }
            }

            if (documentTypeMA && documentTypeMA.process_stage_documents.length) {
                return {
                    supplyOrderId: documentTypeMA.process_stage_documents[0].supply_order_id
                }
            }

            return { }
        }
    },
    'request-for-quotation-rfq': {
        route: 'ShowRequestForQuotation',
        routeCreate: 'CreateRequestForQuotation',
        title: t('RFQ'),
        description: t('Continue by adding a RFQ'),
        permission: {
            create: 'supplies.quotation_request.create'
        },
        variables: () => {
            const documentType = getDocumentType(process.value, 'purchase-request')

            return { supplyOrderId: documentType.process_stage_documents[0].supply_order_id }
        },
        footer: {
            label: t('Add purchase order'),
            permission: 'supplies.purchase_order.create',
            onClick: (item) => {
                const query = {
                    stageId: props.config.id + 1,
                    processId: process.value.id,
                    supplyOrderId: item.supply_order_id,
                    supplyOrderType: 'purchase-order-po',
                    processStageDocumentTypeId: getPurchaseOrderDocumentType().id
                }
                tabsStore.openTab({ name: 'CreatePurchaseOrder', query })
            }
        }
    }
}

const getPurchaseOrderDocumentType = () => {
    const result = process.value.process_stages[2].process_stage_document_types.find(e => e.slug === 'purchase-order-po')

    return result
}

const documents = computed(() => {
    const all = props.config.process_stage_document_types.reduce((acc, type) => {
        const types = type.process_stage_documents.map(document => {
            return {
                id: `${t(type.name)} #${showUuid(document?.supply_order_id)}`,
                supply_order_id: document?.supply_order_id,
                permission: typesConfig[type.slug].permission,
                // Show mode
                onClick: () => {
                    const query = {
                        stageId: props.config.id,
                        processId: process.value.id,
                        supplyOrderId: document.supply_order_id,
                        supplyOrderType: document.supply_order_type.slug,
                        ...(typesConfig[type.slug].openDocVariables ? typesConfig[type.slug].openDocVariables(document) : {})
                    }

                    tabsStore.openTab({ name: applyProp(typesConfig[document.slug]?.route, [document]), params: { id: document.supply_order.id }, query })
                },
                footer: document.active ? typesConfig[document.slug].footer : null,
                document,
                data: getDocument(process.value, type, document)
            }
        })

        acc = acc.concat(types)

        return acc
    }, [])

    return all
})

const placeholders = computed(() => {
    return props.config.process_stage_document_types.reduce((acc, type) => {
        typesConfig[type.slug].routeCreate && type.active && acc.push({
            label: t(`${typesConfig[type.slug].title || type.name}`),
            description: typesConfig[type.slug].description ? typesConfig[type.slug].description : t(`Continue by adding a ${typesConfig[type.slug].title || type.name}`),
            labelButton: t(`Add ${typesConfig[type.slug].title || type.name}`),
            permission: typesConfig[type.slug].permission?.create,
            onClick: () => {
                const query = {
                    stageId: props.config.id,
                    processId: process.value.id,
                    supplyOrderType: type.slug,
                    processStageDocumentTypeId: type.id
                }

                tabsStore.openTab({ name: isFunction(typesConfig[type.slug].routeCreate) ? typesConfig[type.slug].routeCreate(type) : typesConfig[type.slug].routeCreate, query: Object.assign(query, { ...typesConfig[type.slug].variables(type) }) })
            },
            type
        })

        return acc
    }, [])
})

const placeholderCancelTerminate = computed(() => {
    return {
        onClickTerminate: terminateProcess,
        permission: props.config.process_stage_document_types.map(e => (typesConfig[e.slug].permission)),
        label: t('Finish process'),
        labelButton: t('Finish'),
        description: t('This will complete the receiving process.')
    }
})

const permissions = JSON.parse(JSON.stringify(coreStore.getPermissions() || {}))

const showEmptyPlaceholder = computed(() => {
    const actives = placeholders.value.filter(e => ['warehouse-receipt-unknown-supply', 'combine-supply'].includes(e.type.slug))

    if (actives.length) {
        return false
    }

    const valids = intersection(placeholders.value.map(e => e.permission), permissions)

    if ((!placeholders.value.length || !valids.length) && !documents.value.length) {
        return true
    }

    return false
})

</script>

<template>
    <section>
        <Title
            :title="$t(config.name)"
            title-type="h3"
            :has-border-bottom-line="false" />
    </section>

    <section class="!p-0 !m-0 h-full w-full rounded-lg">
        <PlaceholderCancel
            v-if="config.terminate"
            v-permission="{ name:placeholderCancelTerminate.permission }"
            :onClickCancel="placeholderCancelTerminate.onClickCancel"
            :onClickTerminate="placeholderCancelTerminate.onClickTerminate"
            :label="t(placeholderCancelTerminate.label)"
            :labelButton="placeholderCancelTerminate.labelButton"
            :description="t(placeholderCancelTerminate.description)"/>

        <template
            v-for="(placeholder, index) in placeholders" :key="index" >
            <PlaceholderCreate
                v-if="!['warehouse-receipt'].includes(placeholder.type?.slug)"
                v-permission="{ name:placeholder.permission }"
                :onClick="placeholder.onClick"
                :label="placeholder.label"
                :description="placeholder.description"
                :labelButton="placeholder.labelButton"
                :icon="mdiFileDocumentPlusOutline" />

            <component
                :type="placeholder.type"
                :useProcess="useProcess"
                v-else :is="typesConfig[placeholder.type.slug].placeholderAdd"/>
        </template>

        <PlaceholderEmpty
            v-if="showEmptyPlaceholder"
            :label="$t('Unavailable')" />

        <template
            v-for="(item, index) in documents"
            :key="index" >
            <CardDocument
                v-if="!['warehouse-receipt-unknown-supply', 'combine-supply', 'enable-in-stock'].includes(item.document.slug)"
                @click="item.onClick"
                :title="item.id"
                v-model:data="documents[index].data">
                <template #footer>
                    <div
                        v-if="item.footer"
                        v-permission="{name: item.footer.permission}"
                        class="flex items-center gap-x-4 border-b justify-end border-gray-900/5 px-4 py-2 rounded-b-md w-full">
                        <div class="relative ml-auto space-x-2">
                            <Button
                                class="!px-0 opacity-90 hover:opacity-100"
                                color="primary"
                                size="sm"
                                :label="item.footer.label"
                                @click.stop.prevent="item.footer.onClick(item.document)">
                            </Button>
                        </div>
                    </div>
                </template>
            </CardDocument>

            <component
                v-else
                :document="item.document"
                :useProcess="useProcess"
                :is="typesConfig[item.document.slug].documentComponent"/>
        </template>
    </section>
</template>
