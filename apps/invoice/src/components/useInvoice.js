import { computed, inject } from 'vue'
import { round } from 'shared'

const lockedStatusSlugs = ['in-quarantine', 'by-user', 'possible-contamination', 'recall', 'contaminated']

export function useInvoice (selectedItems, selectedClient, shippingData, data, t) {
    const useGlobalStore = inject('useGlobalStore')
    const coreStore = useGlobalStore('core')

    const subtotal = computed(() => {
        return round(selectedItems.value.reduce((result, value) => {
            result = result +
                Number(value?.quantity) * Number(value?.price || 2) -
                (Number(value?.discount || 0) / 100 *
                Number(value?.quantity) *
                Number(value?.price || 2))
            return result
        }, 0))
    })

    const discount = computed(() => {
        const discountInput = data.value.discount ? Number(data.value.discount || 0) : 0

        return round(subtotal.value * discountInput / 100)
    })

    const tax = computed(() => round((subtotal.value - discount.value) * 0.1))

    const orderTotal = computed(() => {
        const shippingCost = data.value.shipping_cost ? Number(data.value.shipping_cost || 0) : 0

        return round((subtotal.value - discount.value) + tax.value + shippingCost)
    })

    // Check if items isn't locked
    const validateSelectedItems = () => {
        let enableInvoiceButton = true

        selectedItems.value.forEach(item => {
            const validationItem = !lockedStatusSlugs.includes(item.lockType)

            item.valid = validationItem

            !validationItem && (enableInvoiceButton = false)
        })

        return enableInvoiceButton
    }

    // Format invoice data for send to api
    const formatApiData = () => {
        const apiData = {
            user_id: coreStore.credentials?.user?.id,
            invoice_state_id: 1,
            // Client data
            client_id: selectedClient.value?.id,
            company_name: selectedClient.value?.company_name,
            taxpayer_identification_number: selectedClient.value?.taxpayer_identification_number,
            name: selectedClient.value?.name,
            address: selectedClient.value?.address,
            address_2: selectedClient.value?.address_2,
            zip_code: selectedClient.value?.zip_code,
            phone: selectedClient.value?.phone,
            city: selectedClient.value?.city,
            state: selectedClient.value?.state,
            // Shipping data
            shipping_name: shippingData.value?.name || null,
            shipping_address: shippingData.value?.address || null,
            shipping_address_2: shippingData.value?.address_2 || null,
            shipping_zip_code: shippingData.value?.zip_code || null,
            shipping_phone: shippingData.value?.phone || null,
            shipping_city: shippingData.value?.city || null,
            shipping_state: shippingData.value?.state || null,
            discount: data.value.discount || null,
            shipping_cost: data.value.shipping_cost || null,
            // Selected items
            invoice_item: selectedItems.value.map((item) => ({
                item_id: item.id,
                price: item.price,
                quantity: item.quantity,
                discount: item.discount
            }))
        }

        data.value?.id && (apiData.id = data.value?.id)

        return apiData
    }

    // Check if invoice is available to save
    const validateSaveInvoice = computed(() => {
        return validateSelectedItems() &&
            (!!selectedItems.value.length ||
            (!!selectedClient.value && !!Object.keys(selectedClient.value).length))
    })

    // Lock reasons formatter
    const lockReason = {
        'invoice-draft': {
            color: 'primary',
            formatter (data) {
                return `${data.item_lock_type.name} (${data.invoice_draft_items.length ? data.invoice_draft_items[0].invoice_id : ''})`
            }
        },
        recall: {
            color: 'red',
            formatter (data) {
                return `${data.item_lock_type.name}`
            }
        },
        contaminated: {
            color: 'red',
            formatter (data) {
                return `${data.item_lock_type.name}`
            }
        },
        'by-user': {
            color: '',
            formatter (data) {
                return `${t('Locked by:')} ${data.user_name}`
            }
        },
        'multiple-locked-reasons': {
            color: '',
            formatter (data) {
                return `${data.item_lock_type.name}`
            }
        },
        'possible-contamination': {
            color: '',
            formatter (data) {
                return `${data.item_lock_type.name}`
            }
        },
        'in-quarantine': {
            color: '',
            formatter (data) {
                return `${data.item_lock_type.name}`
            }
        }
    }

    return {
        lockReason,
        subtotal,
        discount,
        tax,
        orderTotal,
        validateSaveInvoice,
        formatApiData,
        validateSelectedItems
    }
}
