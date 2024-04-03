<script setup>
import { ref, inject, computed } from 'vue'
import { Card, Title, Button, Alert, TableUI } from 'layout'
import { Input, AnimatedTextArea, InputLabel } from 'form'
import moment from 'moment-timezone'
import AddVendor from '../components/AddVendor.vue'
import { api } from '@/config'
import { getSessionJSON } from 'shared'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiCannabis } from '@mdi/js'

const useGlobalStore = inject('useGlobalStore')

const facilityStore = useGlobalStore('facilities')
const coreStore = useGlobalStore('core')

const facility = computed(() => {
    const facilityId = getSessionJSON('facility_id')

    const facilities = facilityStore.getDataByUser()

    if (facilities) return facilities.find(facility => facility.id === facilityId)

    return null
})

const user = computed(() => {
    return coreStore.credentials?.user
})

const data = {
    contactInformation: {
        company: 'Company Alba',
        address: '1234 Shipping Street',
        address_2: 'Apartment 3c',
        phone: '800-692-7753',
        zip: '90210',
        city: 'Anytown',
        state: 'Arizona'
    },
    requestUser: {
        department: 'Warehouse',
        name: 'Benjamin Reynolds',
        position: 'Manager',
        email: 'contact@contact.com',
        phone: '800-692-7753',
        phone_ext: '800-692-7753'
    },
    dateInfo: {
        date: moment(new Date()).format('YYYY-MM-DD')
    }
}

const shippingData = ref({
    subTotal: 0,
    shipping_cost: 0,
    total: 0,
    delivery_information: '',
    billing_payment_terms: '',
    terms_conditions: '',
    vendor: {}
})

const errors = ref({})
const isLoading = ref(false)

const showAlert = ref(false)

const submit = async () => {
    isLoading.value = true

    const data = {
        vendor_id: shippingData.value.vendor?.id,
        delivery_information: shippingData.value.delivery_information,
        billing_payment_terms: shippingData.value.billing_payment_terms,
        terms_conditions: shippingData.value.terms_conditions,
        requisition_supplies: []
    }

    const response = await api.post('/supplies/purchase_order_build', data)

    if (response.errors) {
        errors.value = response.errors

        errors.value.shipping_cost && (showAlert.value = true)
    }

    isLoading.value = false
}

const columns = ref([
    { field: 'vendor.name', name: '', align: 'left', customClass: '!w-1/12' },
    { field: 'invoice.number', name: 'Item name', align: 'right', customClass: '!w-3/12' },
    { field: 'invoice.number', name: 'Quotation ID', align: 'right', customClass: '!w-2/12' },
    { field: 'invoice.number', name: 'Price', align: 'right', customClass: '!w-1/12' },
    { field: 'invoice.number', name: 'Quantity', align: 'right', customClass: '!w-1/12' },
    { field: 'invoice.number', name: 'Unit of measure', align: 'right', customClass: '!w-2/12' },
    { field: 'invoice.number', name: 'Amount', align: 'right', customClass: '!w-1/12' },
    { field: 'invoice.number', name: '', align: 'right', customClass: '!w-1/12' },
])

const dataTable = ref([
    {
        id: '40EJ09R4',
        vendor: {
            name: 'Vendor 1',
            addres: 'Mesa 123kjqkjw dqwe',
            phone: '+591796215325'
        },
        invoice: {
            number: '209392'
        },
        itemsReceived: [
            { id: 'WE23', name: 'Item 1' },
            { id: 'WE2453', name: 'Item 2' },
        ],
        totalPrice: '1500',
        updatedAt: '2023-12-10'
    },
    {
        id: '40EJ09R4',
        vendor: {
            name: 'Vendor 1',
            addres: 'Mesa 123kjqkjw dqwe',
            phone: '+591796215325'
        },
        invoice: {
            number: '209392'
        },
        itemsReceived: [
            { id: 'WE23', name: 'Item 1' },
            { id: 'WE2453', name: 'Item 2' },
        ],
        totalPrice: '1500',
        updatedAt: '2023-12-10'
    },
])

const configSchema = {
    status: {
        mode: 'hidden'// edit, view, hidden
    },
    requester: {
        mode: 'view' // edit, view, hidden
    },
    materialDetails: {
        mode: 'view' // edit, view, hidden
    },
    note: {
        mode: 'view' // edit, view, hidden
    },
    deliveryInformation: {
        mode: 'view' // edit, view, hidden
    },
    managerAppoval: {
        mode: 'view' // edit, view, hidden
    },
    warehouseAppoval: {
        mode: 'view' // edit, view, hidden
    }
}
</script>

<template>
    <section class="max-w-8xl mx-auto">
        <Card
            class="px-10 py-5"
            hasMargins
            :placeContentCenter="false">
            <Title
                :title="$t('Purchase Order (PO)')"
                :hasBorderBottomLine="false" />

            <Title
                :title="$t('Buyer information')"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="mt-8" />

            <div class="grid grid-cols-1 md:grid-cols-2">
                <!-- Buyer (Facility) information -->
                <div class="space-y-1">
                    <!-- Company -->
                    <InputLabel
                        v-model="facility.facility_name"
                        :label="$t('Company')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Address -->
                    <InputLabel
                        v-model="facility.address"
                        :label="$t('Address')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Address 2 -->
                    <InputLabel
                        v-model="facility.address_2"
                        :label="$t('Address 2')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Phone -->
                    <InputLabel
                        v-model="facility.phone"
                        :label="$t('Phone')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Zip Code -->
                    <InputLabel
                        v-model="facility.zip_code"
                        :label="$t('Zip Code')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- City -->
                    <InputLabel
                        v-model="facility.city"
                        :label="$t('City')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- State -->
                    <InputLabel
                        v-model="facility.state"
                        :label="$t('State')"
                        mode="readonly"
                        outline
                        dense />
                </div>

                <!-- User logged -->
                <div class="space-y-1">
                    <!-- Date -->
                    <InputLabel
                        v-model="data.dateInfo.date"
                        :label="$t('Date')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Department -->
                    <InputLabel
                        v-model="user.department"
                        :label="$t('Department')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Name -->
                    <InputLabel
                        v-model="user.name"
                        :label="$t('Name')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Position -->
                    <InputLabel
                        v-model="user.position"
                        :label="$t('Position')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Email -->
                    <InputLabel
                        v-model="user.email"
                        :label="$t('Email')"
                        mode="readonly"
                        outline
                        dense />

                    <!-- Phone -->
                    <InputLabel
                        v-model="user.phone"
                        :label="$t('Phone')"
                        mode="readonly"
                        outline
                        dense />
                </div>

                <!-- Vendor -->
                <div>
                    <Title
                        :title="$t('Seller information')"
                        :hasBorderBottomLine="false"
                        titleType="h2"
                        class="mt-8" />

                    <AddVendor
                        v-model:vendor="shippingData.vendor"
                        :error="errors?.vendor_id ? errors.vendor_id[0] : null" />
                </div>
            </div>

            <!-- Items table -->
            <Title
                :title="$t('Item description')"
                :hasBorderBottomLine="false"
                titleType="h2"
                class="mt-8" />

            <TableUI
                class="mb-8"
                :columns="columns"
                v-model:data="dataTable"
                :multipleOpen="false">
                <template v-slot:row="{ row, index, toggleExpansion }">
                    <tr>
                        <td>
                            <svg-icon
                                type="mdi"
                                :path="mdiCannabis"
                                class="w-10 h-min'" />
                        </td>

                        <td>
                            <Input
                                :path="mdiCannabis"
                                :placeholder="$t('Insert item details')"
                                container-class="none"
                                class=" h-min'" />
                        </td>

                        <td class="!pxx-0">
                            <Input
                                :path="mdiCannabis"
                                :placeholder="$t('Insert item details')"
                                container-class="none" />
                        </td>

                        <td>
                            <Input
                                :path="mdiCannabis"
                                :placeholder="$t('Insert item details')"
                                container-class="none" />
                        </td>

                        <td>
                            <Input
                                :path="mdiCannabis"
                                :placeholder="$t('Insert item details')"
                                container-class="none" />
                        </td>

                        <td>
                            <Input
                                :path="mdiCannabis"
                                :placeholder="$t('Insert item details')"
                                container-class="none" />
                        </td>

                        <td>
                            <Input
                                :path="mdiCannabis"
                                :placeholder="$t('Insert item details')"
                                container-class="none" />
                        </td>
                    </tr>
                </template>
            </TableUI>

            <!-- Summary and extra information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                <!-- Summary -->
                <div class="md:col-start-2 space-y-8">
                    <InputLabel
                        v-model="shippingData.subTotal"
                        :label="$t('Subtotal')"
                        mode="readonly"
                        inputExtraLabelLeft="$"
                        outline
                        white-mode
                        dense />

                    <InputLabel
                        v-model="shippingData.shipping_cost"
                        :label="$t('Shipping')"
                        mode="edit"
                        type="number"
                        min="0"
                        input-class="text-right"
                        inputLabelLeft="$"
                        outline
                        :error="errors.shipping_cost"
                        white-mode
                        dense />

                    <InputLabel
                        v-model="shippingData.total"
                        :label="$t('Total')"
                        inputExtraLabelLeft="$"
                        mode="readonly"
                        outline
                        white-mode
                        dense />

                    <Alert
                        v-model="showAlert"
                        type="danger"
                        :content="errors?.shipping_cost ? errors?.shipping_cost[0] : null" />
                </div>

                <!-- Extra information -->
                <div class="col-span-1 space-y-3">
                    <!-- Delivery information -->
                    <AnimatedTextArea
                        v-model="shippingData.delivery_information"
                        :title="$t('Delivery information')" />

                    <!-- Billing and payments terms -->
                    <AnimatedTextArea
                        v-model="shippingData.billing_payment_terms"
                        :title="$t('Billing and payments terms')" />

                    <!-- Terms and conditions -->
                    <AnimatedTextArea
                        v-model="shippingData.terms_conditions"
                        :title="$t('Terms and conditions')" />
                </div>
            </div>

            <hr class="my-8">

            <div class="flex justify-end">
                <Button
                    @click="submit"
                    :loading="isLoading"
                    :disabled="isLoading"
                    :label="$t('Submit')"
                    color="primary"
                    class="self-end place-self-end" />
            </div>
        </Card>
    </section>
</template>
