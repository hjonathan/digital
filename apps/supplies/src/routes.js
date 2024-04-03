import App from './createApp'

export default () => {
    return [
        {
            path: '/supplies',
            name: 'Supplies',
            meta: {
                home: true,
                title: 'Supplies',
                permission: 'supplies'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
        {
            path: '/supplies/report',
            name: 'ReportSupplies',
            meta: {
                title: 'Reports',
                parentName: 'Supplies',
                permission: 'supplies.reports'
            },
            entry: {
                id: 'ReportSupplies',
                component: App
            }
        },
        {
            path: '/supplies/cost',
            name: 'SuppliesCost',
            meta: {
                title: 'Supplies cost',
                parentName: 'Supplies',
                permission: 'supplies.cost'
            },
            entry: {
                id: 'SuppliesCost',
                component: App
            }
        },
        {
            path: '/supplies/transaction',
            name: 'SuppliesTransactions',
            meta: {
                title: 'Supplies transactions',
                parentName: 'Supplies',
                permission: 'supplies.transactions'
            },
            entry: {
                id: 'SuppliesTransactions',
                component: App
            }
        },
        {
            path: '/supplies/list',
            name: 'SuppliesList',
            meta: {
                title: 'Supplies',
                parentName: 'Supplies',
                permission: 'supplies.supplies'
            },
            entry: {
                id: 'SuppliesList',
                component: App
            }
        },

        // SALES ORDERS
        {
            path: '/supplies/create-sales-order',
            name: 'CreateSalesOrder',
            meta: {
                title: 'Create sales order',
                parentName: 'Supplies',
                permission: 'supplies.sales_order.create'
            },
            entry: {
                id: 'CreateSalesOrder',
                component: App
            }
        },
        {
            path: '/supplies/sales-order-list',
            name: 'SalesOrderList',
            meta: {
                title: 'Sales Orders',
                parentName: 'Supplies'
            },
            entry: {
                id: 'SalesOrderList',
                component: App
            }
        },
        {
            path: '/supplies/sales-order/:id',
            name: 'ShowSalesOrder',
            meta: {
                title: 'ShowSalesOrder',
                parentName: 'Supplies',
                permission: 'supplies.sales_order.show'
            },
            entry: {
                id: 'ShowSalesOrder',
                component: App
            }
        },

        // WAREHOUSE RECEIPT
        {
            path: '/supplies/create-warehouse-receipt',
            name: 'CreateWarehouseReceipt',
            meta: {
                title: 'Create warehouse receipt',
                parentName: 'Supplies',
                permission: 'supplies.warehouse_receipt.create'
            },
            entry: {
                id: 'CreateWarehouseReceipt',
                component: App
            }
        },
        {
            path: '/supplies/warehouse-receipt-list',
            name: 'WarehouseReceiptList',
            meta: {
                title: 'Warehouse Receipts',
                parentName: 'Supplies'
            },
            entry: {
                id: 'WarehouseReceiptList',
                component: App
            }
        },
        {
            path: '/supplies/warehouse-receipt/:id',
            name: 'ShowWarehouseReceipt',
            meta: {
                title: 'ShowWarehouseReceipt',
                parentName: 'Supplies',
                permission: 'supplies.warehouse_receipt.show'
            },
            entry: {
                id: 'ShowWarehouseReceipt',
                component: App
            }
        },
        // SUPPLIES PROCESS
        {
            path: '/supplies-process',
            name: 'SuppliesProcess',
            meta: {
                parentName: 'Supplies',
                title: 'Supplies process'
            },
            entry: {
                id: 'SuppliesProcess',
                component: App
            }
        },

        // MATERIAL REQUEST
        {
            path: '/supplies/material-request-list',
            name: 'MaterialRequestList',
            meta: {
                parentName: 'Supplies',
                title: 'Material requests'
            },
            entry: {
                id: 'MaterialRequestList',
                component: App
            }
        },
        {
            path: '/supplies/material-request',
            name: 'CreateMaterialRequest',
            meta: {
                parentName: 'Supplies',
                title: 'Material request',
                permission: 'supplies.material_request.create'
            },
            entry: {
                id: 'CreateMaterialRequest',
                component: App
            }
        },
        {
            path: '/supplies/show-material-request/:id',
            name: 'ShowMaterialRequest',
            meta: {
                parentName: 'Supplies',
                title: 'Material request',
                permission: 'supplies.material_request.show'
            },
            entry: {
                id: 'ShowMaterialRequest',
                component: App
            }
        },

        // Purchase request
        {
            path: '/supplies/purchase-orders-list',
            name: 'PurchaseOrdersList',
            meta: {
                title: 'Purchases Orders',
                parentName: 'Supplies'
            },
            entry: {
                id: 'PurchaseOrdersList',
                component: App
            }
        },
        {
            path: '/supplies/purchase-request-list',
            name: 'PurchaseRequestList',
            meta: {
                parentName: 'Supplies',
                title: 'Purchase requests'
            },
            entry: {
                id: 'PurchaseRequestList',
                component: App
            }
        },
        {
            path: '/supplies/create-purchase-request',
            name: 'CreatePurchaseRequest',
            meta: {
                parentName: 'Supplies',
                title: 'Create purchase request',
                permission: 'supplies.purchase_request.create'
            },
            entry: {
                id: 'CreatePurchaseRequest',
                component: App
            }
        },
        {
            path: '/supplies/purchase-request/:id',
            name: 'ShowPurchaseRequest',
            meta: {
                parentName: 'Supplies',
                title: 'Purchase request',
                permission: 'supplies.purchase_request.show'
            },
            entry: {
                id: 'ShowPurchaseRequest',
                component: App
            }
        },

        // QUOTATION REQUEST
        {
            path: '/supplies/quotation-request-list',
            name: 'QuotationRequestList',
            meta: {
                parentName: 'Supplies',
                title: 'Quotation requests'
            },
            entry: {
                id: 'QuotationRequestList',
                component: App
            }
        },
        {
            path: '/supplies/create-request-for-quotation',
            name: 'CreateRequestForQuotation',
            meta: {
                parentName: 'Supplies',
                title: 'Add quotation',
                permission: 'supplies.quotation_request.create'
            },
            entry: {
                id: 'CreateRequestForQuotation',
                component: App
            }
        },
        {
            path: '/supplies/request-for-quotation/:id',
            name: 'ShowRequestForQuotation',
            meta: {
                parentName: 'Supplies',
                title: 'Request for quotation',
                permission: 'supplies.quotation_request.show'
            },
            entry: {
                id: 'ShowRequestForQuotation',
                component: App
            }
        },
        // PURCHASE ORDERS
        {
            path: '/supplies/create-purchase-order',
            name: 'CreatePurchaseOrder',
            meta: {
                parentName: 'Supplies',
                title: 'Create purchase order',
                permission: 'supplies.purchase_order.create'
            },
            entry: {
                id: 'CreatePurchaseOrder',
                component: App
            }
        },
        {
            path: '/supplies/purchase-order/:id',
            name: 'ShowPurchaseOrder',
            meta: {
                parentName: 'Supplies',
                title: 'Purchase order',
                permission: 'supplies.purchase_order.show'
            },
            entry: {
                id: 'ShowPurchaseOrder',
                component: App
            }
        },

        // DISPATCH NOTES
        {
            path: '/supplies/dispatch-notes-list',
            name: 'DispatchNotesList',
            meta: {
                parentName: 'Supplies',
                title: 'Dispatch notes'
            },
            entry: {
                id: 'DispatchNotesList',
                component: App
            }
        },
        {
            path: '/supplies/create-dispatch-note/:id',
            name: 'CreateDispatchNote',
            meta: {
                parentName: 'Supplies',
                title: 'Create Dispatch Note',
                permission: 'supplies.dispatch_note.create'
            },
            entry: {
                id: 'CreateDispatchNote',
                component: App
            }
        },
        {
            path: '/supplies/create-dispatch-note-mr/:id',
            name: 'CreateDispatchNoteMR',
            meta: {
                parentName: 'Supplies',
                title: 'Create Dispatch Note',
                permission: 'supplies.dispatch_note.create'
            },
            entry: {
                id: 'CreateDispatchNoteMR',
                component: App
            }
        },
        {
            path: '/supplies/dispatch-note/:id',
            name: 'ShowDispatchNote',
            meta: {
                parentName: 'Supplies',
                title: 'Show dispatch note',
                permission: 'supplies.dispatch_note.show'
            },
            entry: {
                id: 'ShowDispatchNote',
                component: App
            }
        },
        {
            path: '/supplies/dispatch-note-ma/:id',
            name: 'ShowDispatchNoteMA',
            meta: {
                parentName: 'Supplies',
                title: 'Show dispatch note',
                permission: 'supplies.dispatch_note.show'
            },
            entry: {
                id: 'ShowDispatchNoteMA',
                component: App
            }
        },
        {
            path: '/supplies/dispatch-note-pr/:id',
            name: 'DispatchNotePr',
            meta: {
                parentName: 'Supplies',
                title: 'Dispatch Note',
                permission: 'supplies.dispatch_note.show'
            },
            entry: {
                id: 'DispatchNotePr',
                component: App
            }
        },

        // PROCESS TRELLO
        {
            path: '/supplies/process/:id',
            name: 'ShowProcess',
            meta: {
                parentName: 'Supplies',
                title: 'Show process',
                permission: 'supplies.process'
            },
            entry: {
                id: 'ShowProcess',
                component: App
            }
        },
        // INVOICE
        {
            path: '/supplies/create-invoice',
            name: 'SuppliesCreateInvoice',
            meta: {
                parentName: 'Supplies',
                title: 'Receive by invoice',
                permission: 'supplies.invoice.create'
            },
            entry: {
                id: 'SuppliesCreateInvoice',
                component: App
            }
        },
        {
            path: '/supplies/invoice/:id',
            name: 'SuppliesShowInvoice',
            meta: {
                parentName: 'Supplies',
                title: 'Invoice',
                permission: 'supplies.invoice.show'
            },
            entry: {
                id: 'SuppliesShowInvoice',
                component: App
            }
        },
        {
            path: '/supplies/invoice-list',
            name: 'InvoiceList',
            meta: {
                parentName: 'Supplies',
                title: 'Invoices'
            },
            entry: {
                id: 'InvoiceList',
                component: App
            }
        },
        {
            path: '/supplies/item-transactions/:id',
            name: 'ItemTransactions',
            meta: {
                parentName: 'Supplies',
                title: 'Item transactions',
                permission: 'supplies.transactions.show'
            },
            entry: {
                id: 'ItemTransactions',
                component: App
            }
        },

        // Labels
        {
            path: '/supplies/labels',
            name: 'SuppliesLabels',
            meta: {
                title: 'Labels',
                parentName: 'Supplies',
                permission: 'supplies.labels'
            },
            entry: {
                id: 'Labels',
                component: App
            }
        },
        {
            path: '/supplies/labels/create',
            name: 'SuppliesLabelsCreate',
            meta: {
                title: 'Create template',
                permission: 'supplies.labels.create',
                parentName: 'Supplies'
            },
            entry: {
                id: 'CreateTemplate',
                component: App
            }
        },
        {
            path: '/supplies/labels/edit/:id',
            name: 'SuppliesLabelsEdit',
            meta: {
                title: 'Edit template',
                parentName: 'Supplies',
                permission: 'supplies.labels.edit'
            },
            entry: {
                id: 'EditTemplate',
                component: App
            }
        },
        {
            path: '/supplies/labels/clone/:id',
            name: 'SuppliesLabelsClone',
            meta: {
                title: 'Clone template',
                parentName: 'Supplies',
                permission: 'supplies.labels.clone'
            },
            entry: {
                id: 'CloneTemplate',
                component: App
            }
        },

        // Material assign
        {
            path: '/supplies/start-material-assign',
            name: 'StartMaterialAssign',
            meta: {
                parentName: 'Supplies',
                title: 'Create material assign',
                permission: 'supplies.material_assignment.create'
            },
            entry: {
                id: 'StartMaterialAssign',
                component: App
            }
        },
        {
            path: '/supplies/show-material-assign/:id',
            name: 'ShowMaterialAssign',
            meta: {
                parentName: 'Supplies',
                title: 'Show material assign',
                permission: 'supplies.material_assignment.show'
            },
            entry: {
                id: 'ShowMaterialAssign',
                component: App
            }
        },

        {
            path: '/supplies/create-dispatch-note-ma/:id',
            name: 'CreateDispatchNoteMA',
            meta: {
                parentName: 'Supplies',
                title: 'Create Dispatch Note',
                permission: 'supplies.dispatch_note.create'
            },
            entry: {
                id: 'CreateDispatchNoteMA',
                component: App
            }
        },
        // Addjust supply
        {
            path: '/supplies/supply-adjustment-list',
            name: 'SupplyAdjustmentList',
            meta: {
                parentName: 'Supplies',
                title: 'Supply adjustment list',
                permission: 'supplies.adjustment'

            },
            entry: {
                id: 'SupplyAdjustmentList',
                component: App
            }
        },
        {
            path: '/supplies/supply-adjustment/:id',
            name: 'CreateSupplyAdjustment',
            meta: {
                parentName: 'Supplies',
                title: 'Supply adjustment',
                permission: 'supplies.adjustment.create'
            },
            entry: {
                id: 'CreateSupplyAdjustment',
                component: App
            }
        },
        {
            path: '/supplies/show-supply-adjustment/:id',
            name: 'ShowSupplyAdjustment',
            meta: {
                parentName: 'Supplies',
                title: 'Show supply adjustment',
                permission: 'supplies.adjustment.show'
            },
            entry: {
                id: 'ShowSupplyAdjustment',
                component: App
            }
        },
        // PUBLIC SUPPLY
        {
            path: '/public/supply',
            name: 'PublicSupply',
            meta: {
                requiresAuth: false,
                route: true
            },
            entry: {
                id: 'PublicSupply',
                component: App
            }
        },
        // WAREHOUSE RECEIPT
        {
            path: '/supplies/create-receipt',
            name: 'CreateReceipt',
            meta: {
                title: 'Warehouse receipt',
                parentName: 'Supplies'
            },
            entry: {
                id: 'CreateWR',
                component: App
            }
        },
        {
            path: '/supplies/show-receipt',
            name: 'ShowReceipt',
            meta: {
                title: 'Warehouse receipt',
                parentName: 'Supplies'
            },
            entry: {
                id: 'ShowWR',
                component: App
            }
        },
        {
            path: '/supplies/show-receipt/:id',
            name: 'ShowReceipt',
            meta: {
                title: 'Warehouse receipt',
                parentName: 'Supplies'
            },
            entry: {
                id: 'ShowWR',
                component: App
            }
        },
        // UNKNOWN SUPPLIES
        {
            path: '/unknown-supplies/list',
            name: 'UnknownSuppliesList',
            meta: {
                parentName: 'Supplies',
                title: 'Unknown supplies list'
            },
            entry: {
                id: 'UnknownSuppliesList',
                component: App
            }
        },
        {
            path: '/supplies/combination',
            name: 'SuppliesCombination',
            meta: {
                parentName: 'Supplies',
                title: 'Supply combinations'
            },
            entry: {
                id: 'SuppliesCombination',
                component: App
            }
        },
        {
            path: '/supplies/combination/:id',
            name: 'ShowSuppliesCombination',
            meta: {
                title: 'ShowSuppliesCombination',
                parentName: 'Supplies'
                // permission: 'supplies.sales_order.show'
            },
            entry: {
                id: 'ShowSuppliesCombination',
                component: App
            }
        },
    ]
}
