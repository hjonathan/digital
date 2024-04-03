import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

export default defineStore('invoicing', () => {
    const statuses = ref()
    const data = ref()
    const draftData = ref()
    const invoiceData = ref()
    const fetching = ref(false)
    const draftSlug = 'draft'
    const invoicedSlug = 'invoiced'

    // Fetch statuses for invoicing
    const fetchInvoiceStatuses = async () => {
        const response = await api.get('/invoice-statuses')

        response.success && (statuses.value = response.data)
    }

    // Fetch an specific status for ID
    const getStatusById = (id) => {
        return statuses.value.find(status => status.id === id)
    }

    // Fetch an specific invoice draft by ID
    const fetchInvoiceDraftById = async (param) => {
        const response = await api.get(`/invoice-drafts/${param}`)

        return response
    }

    // Fetch an specific invoice by ID
    const fetchInvoiceById = async (param) => {
        const response = await api.get(`/invoices/${param}`)

        return response
    }

    // Fetch the endpoints to get the column schema and parameter data.
    const fetch = async () => {
        fetchInvoices()
    }

    // Gets the data from the API parameters
    const fetchInvoices = async () => {
        fetching.value = true

        const response = await api.post('/invoices/invoice_list', { invoice_status_slug: '' })

        fetching.value = false

        if (response?.success) {
            draftData.value = response.data.filter(invoice => invoice?.invoice_status?.slug === draftSlug)

            invoiceData.value = response.data.filter(invoice => invoice?.invoice_status?.slug === invoicedSlug)

            data.value = response.data
        }
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    const getDataByType = (type) => {
        if (type === 'draft') return cloneDeep(draftData.value)

        if (type === 'invoiced') return cloneDeep(invoiceData.value)

        return cloneDeep(data.value)
    }

    const post = async (action, id) => {
        const response = await api.post(`/invoices/${action}`, id)

        if (response && response.success) fetch()

        return response
    }

    const postWithoutToast = async (action, data, sync = true) => {
        const response = await api.postWithoutToast(`/invoices/${action}`, data)

        if (response && response.success && sync) fetch()

        return response
    }

    return {
        fetchInvoiceDraftById,
        fetchInvoiceStatuses,
        getStatusById,
        data,
        fetch,
        getData,
        getDataByType,
        fetchInvoiceById,
        post,
        postWithoutToast,
        fetching
    }
})
