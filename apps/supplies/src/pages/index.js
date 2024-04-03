import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./processList/ProcessList.vue')),
    SuppliesList: defineAsyncComponent(() => import('./suppliesList/SuppliesList.vue')),
    SuppliesProcess: defineAsyncComponent(() => import('./DahboardWarehouse.vue')),

    CreateMaterialRequest: defineAsyncComponent(() => import('./materialRequests/Create.vue')),
    MaterialRequestList: defineAsyncComponent(() => import('./materialRequestList/MaterialRequestList.vue')),
    ShowMaterialRequest: defineAsyncComponent(() => import('./materialRequests/Show.vue')),
    PurchaseOrdersList: defineAsyncComponent(() => import('./purchaseOrdersList/PurchaseOrderList.vue')),
    // Purchase request
    CreatePurchaseRequest: defineAsyncComponent(() => import('./purchaseRequests/Create.vue')),
    PurchaseRequestList: defineAsyncComponent(() => import('./purchaseRequestList/PurchaseRequestList.vue')),
    ShowPurchaseRequest: defineAsyncComponent(() => import('./purchaseRequests/Show.vue')),
    // Quotation request
    CreateRequestForQuotation: defineAsyncComponent(() => import('./requestForQuotation/Create.vue')),
    QuotationRequestList: defineAsyncComponent(() => import('./quotationRequestList/QuotationRequestList.vue')),
    ShowRequestForQuotation: defineAsyncComponent(() => import('./requestForQuotation/Show.vue')),
    // Purchase order
    CreatePurchaseOrder: defineAsyncComponent(() => import('./purchaseOrders/Create.vue')),
    ShowPurchaseOrder: defineAsyncComponent(() => import('./purchaseOrders/Show.vue')),

    // Sales order
    SalesOrderList: defineAsyncComponent(() => import('./salesOrderList/SalesOrderList.vue')),
    CreateSalesOrder: defineAsyncComponent(() => import('./salesOrder/Create.vue')),
    ShowSalesOrder: defineAsyncComponent(() => import('./salesOrder/Show.vue')),

    // Warehouse Receipt
    CreateWarehouseReceipt: defineAsyncComponent(() => import('./warehouse/Create.vue')),
    WarehouseReceiptList: defineAsyncComponent(() => import('./warehouseReceiptList/WarehouseReceiptList.vue')),
    ShowWarehouseReceipt: defineAsyncComponent(() => import('./warehouse/Show.vue')),

    // Dispatch notes
    DispatchNotesList: defineAsyncComponent(() => import('./dispatchNotesList/DispatchNotesList.vue')),
    DispatchNote: defineAsyncComponent(() => import('./dispatchNotes/DispatchNote.vue')),
    CreateDispatchNote: defineAsyncComponent(() => import('./dispatchNotes/CreateDispatchNote.vue')),
    CreateDispatchNoteMR: defineAsyncComponent(() => import('./dispatchNotes/CreateDispatchNoteMR.vue')),
    ShowDispatchNote: defineAsyncComponent(() => import('./dispatchNotes/ShowDispatchNote.vue')),
    ShowDispatchNoteMA: defineAsyncComponent(() => import('./dispatchNotes/ShowDispatchNoteMA.vue')),

    // Process trello
    ShowProcess: defineAsyncComponent(() => import('./process/ShowProcess.vue')),

    // Invoice
    SuppliesCreateInvoice: defineAsyncComponent(() => import('./invoice/Create.vue')),
    SuppliesShowInvoice: defineAsyncComponent(() => import('./invoice/Show.vue')),
    InvoiceList: defineAsyncComponent(() => import('./invoiceList/InvoiceList.vue')),

    ReportSupplies: defineAsyncComponent(() => import('./Reports.vue')),
    SuppliesCost: defineAsyncComponent(() => import('./suppliesCostList/SuppliesList.vue')),
    SuppliesTransactions: defineAsyncComponent(() => import('./suppliesTransactionList/SuppliesList.vue')),

    // Labels
    Labels: defineAsyncComponent(() => import('./labels/Labels.vue')),
    CreateTemplate: defineAsyncComponent(() => import('./labels/Save.vue')),
    EditTemplate: defineAsyncComponent(() => import('./labels/Save.vue')),
    CloneTemplate: defineAsyncComponent(() => import('./labels/Save.vue')),

    // Material assign
    StartMaterialAssign: defineAsyncComponent(() => import('./materialAssign/Create.vue')),
    ShowMaterialAssign: defineAsyncComponent(() => import('./materialAssign/Show.vue')),
    CreateDispatchNoteMA: defineAsyncComponent(() => import('./dispatchNotes/CreateDispatchNoteMA.vue')),
    ItemTransactions: defineAsyncComponent(() => import('./suppliesTransactionList/ItemTransactions.vue')),

    // Adjust Supply
    SupplyAdjustmentList: defineAsyncComponent(() => import('./supplyAdjustmentList/SupplyAdjustmentList.vue')),
    CreateSupplyAdjustment: defineAsyncComponent(() => import('./supplyAdjustment/Create.vue')),
    ShowSupplyAdjustment: defineAsyncComponent(() => import('./supplyAdjustment/Show.vue')),
    UnknownSuppliesList: defineAsyncComponent(() => import('./unknownSuppliesList/List.vue')),

    // Public Supply
    PublicSupply: defineAsyncComponent(() => import('./supply/PublicSupply.vue')),

    CreateWR: defineAsyncComponent(() => import('./warehouseReceipt/CreateWR.vue')),
    ShowWR: defineAsyncComponent(() => import('./warehouseReceipt/ShowWR.vue')),

    // PROCESS WR -> INVOICE
    SuppliesCombination: defineAsyncComponent(() => import('./supplyCombination/Create.vue')),
    ShowSuppliesCombination: defineAsyncComponent(() => import('./supplyCombination/Show.vue'))
}
