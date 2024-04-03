<script setup>
import { Input } from 'form'
import { ref, inject, onMounted } from 'vue'
import { api } from '@/config'
import { Alert, Button, ConfirmationModal } from 'layout'

const props = defineProps({
    useSlideOver: {
        type: Object,
        default: null
    }
})

const mode = ref('create')
const { data, setConfig, configSlideOver } = props.useSlideOver

const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')
const vendorsStore = useGlobalStore('vendors')

const vendorModel = ref(
    {
        name: null,
        address: null,
        address_2: null,
        zip_code: null,
        contact: null,
        phone: null,
        state: null,
        city: null,
        website: null,
        email: null
    }
)

const errors = ref()

const save = async () => {
    let response

    if (!data.value?.id) {
        response = await api.postWithAlert('/vendors', vendorModel.value)
    }

    if (data.value?.id) {
        response = await api.put(`/vendors/${vendorModel.value.id}`, vendorModel.value)
    }

    if (response.success) {
        vendorsStore.fetch()

        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: response.message })

        // To reset RowsSelects value
        rapidStore.$emitGlobalEvent('vendorsAfterSuccess')

        // To sync with supplies (invoice & purchaseOrders)
        rapidStore.$emitGlobalEvent('syncVendorsWithSuppliesInvoice')
        rapidStore.$emitGlobalEvent('syncVendorsWithSuppliesPurchaseOrder')
    }

    if (response.errors) {
        errors.value = response.errors
    }

    return response
}

onMounted(() => {
    if (data.value?.id) {
        vendorModel.value = data.value

        mode.value = 'edit'
    }
})

defineExpose({ save })

const cloneRecord = () => {
    if (data.value?.id) {
        delete data.value.id

        setConfig({
            action: 'Clone'
        })
    }
}

const showModal = ref(false)

// Opens the deletion confirmation modal
const openDeleteConfirmationModal = (label) => {
    showModal.value = !showModal.value
}

const remove = async () => {
    const response = await api.delete(`vendors/${data.value?.id}`)

    if (response.success) {
        vendorsStore.fetch()

        setConfig({
            close: !configSlideOver.value.close
        })

        // To Global Alert
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: response.message })

        // To reset RowsSelects value
        rapidStore.$emitGlobalEvent('vendorsAfterSuccess')

        // To sync with supplies (invoice & purchaseOrders)
        rapidStore.$emitGlobalEvent('syncVendorsWithSuppliesInvoice')
        rapidStore.$emitGlobalEvent('syncVendorsWithSuppliesPurchaseOrder')
    }
}
</script>

<template>
    <!-- Confirmation modal to delete vendor -->
    <ConfirmationModal
        :description="$t('Are you sure you want to delete this label?')"
        title="Delete confirmation"
        type="danger"
        v-model="showModal"
        @confirm="remove"
        class="!z-50" />

    <section class="full">
        <Input
            v-model="vendorModel.name"
            :label="$t('Name')"
            :placeholder="$t('Name')"
            :errors="errors?.name"/>

        <!-- Address -->
        <Input
            v-model="vendorModel.address"
            :label="$t('Address')"
            :placeholder="$t('Address')"
            :errors="errors?.address" />

        <!-- Address 2 -->
        <Input
            v-model="vendorModel.address_2"
            :label="$t('Address 2')"
            :placeholder="$t('Address 2')"
            :errors="errors?.address_2" />

        <!-- Zip -->
        <Input
            v-model="vendorModel.zip_code"
            :label="$t('Zip')"
            :placeholder="$t('Zip')"
            :errors="errors?.zip_code" />

        <!-- Contact -->
        <Input
            v-model="vendorModel.contact"
            :label="$t('Contact')"
            :placeholder="$t('Contact')"
            :errors="errors?.contact" />

        <!-- Phone -->
        <Input
            v-model="vendorModel.phone"
            :label="$t('Phone')"
            :placeholder="$t('Phone')"
            :errors="errors?.phone" />

        <!-- State -->
        <Input
            v-model="vendorModel.state"
            :label="$t('State')"
            :placeholder="$t('State')"
            :errors="errors?.state" />

        <!-- City -->
        <Input
            v-model="vendorModel.city"
            :label="$t('City')"
            :placeholder="$t('City')"
            :errors="errors?.city" />

        <!-- Website -->
        <Input
            v-model="vendorModel.website"
            :label="$t('Web site')"
            :placeholder="$t('Web site')"
            :errors="errors?.website" />

        <!-- Email -->
        <Input
            v-model="vendorModel.email"
            :label="$t('Email')"
            :placeholder="$t('Email')"
            :errors="errors?.email" />

        <!-- Update options -->
        <div
            v-if="data?.id"
            class="mt-24" >
            <!-- Clone -->
            <h2>
                {{ $t(`Clone record`) }}
            </h2>

            <Alert
                :icon="() => null"
                content-text-color="text-secondary-700"
                border-color="border-secondary-500"
                background-color="bg-secondary-100"
                :has-close-button="false">
                <div class="flex justify-between items-center">
                    <span class="text-base">
                        {{ $t(`Do you want to clone this record?`) }}
                    </span>

                    <Button
                        color="secondary"
                        :label="$t('Clone')"
                        @click="cloneRecord" />
                </div>
            </Alert>

            <!-- Delete -->
            <h2>
                {{ $t(`Delete record`) }}
            </h2>

            <Alert
                :icon="() => null"
                type="danger"
                :has-close-button="false">
                <div class="flex justify-between items-center">
                    <span class="text-base">
                        {{ $t(`Do you want to delete this record?`) }}
                    </span>

                    <Button
                        color="danger"
                        :label="$t('Delete')"
                        @click="openDeleteConfirmationModal" />
                </div>
            </Alert>
        </div>
    </section>
</template>
