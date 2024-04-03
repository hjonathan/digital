<script setup>
import { AutoComplete, Input } from 'form'
import { ConfirmationModal, Button, Alert } from 'layout'
import { computed, inject, ref } from 'vue'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import { cloneDeep, isObject, isString } from 'lodash'

const errors = ref({})
const SUPPLY_ID = '4fe13238-cus1-16f3-b184-b772fabf2zzz'

const props = defineProps({
    useSlideOver: Object
})

const { data, configSlideOver } = props.useSlideOver

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')
const rapidStore = useGlobalStore('rapidStore')

const unknownSuppliesStore = useGlobalStore('unknownSupplies')

const vendorsStore = useGlobalStore('vendors')

vendorsStore.fetch()

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const formatApiData = (dataForm) => {
    const apiData = {
        vendor_id: dataForm.vendor?.id,
        tracking_id: dataForm.tracking_id
    }

    if (dataForm.id) apiData.id = dataForm.id

    return apiData
}

const save = async () => {
    let response = {}

    // TODO: Update the endpoint to save WR information
    if (data.value.id) {
        response = await api.post('/supplies/warehouse_receipt_unknown_supply_update', {
            supply_order_id: data.value.id,
            vendor_id: data.value.vendor?.id,
            tracking_id: data.value.tracking_id
        })
    }

    if (!data.value.id) {
        response = await api.post('/supplies', formatApiData(data.value))
    }

    if (response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

        unknownSuppliesStore.fetch()
    }

    if (response.errors) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

        errors.value = response.errors
    }

    return !response.errors && response
}

const deleteRecord = async () => {
    configModal.value = {
        showAlert: true,
        type: 'danger',
        title: t('Confirmation'),
        description: t('Are you sure to delete this Receipt?'),
        confirmButtonLabel: t('Yes, delete'),
        confirmation: async () => {
            // TODO: Change to endpoint to delete receipt
            const response = await api.delete(`/supplies/warehouse_receipt_unknown_supply_delete/${data.value.id}`)

            if (!response.errors) {
                rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                configSlideOver.value.close = !configSlideOver.value.close
            }

            if (response.success) {
                rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

                unknownSuppliesStore.fetch()
            }

            return response
        }
    }
}

const vendors = computed(() => {
    return vendorsStore.getData()
})

const onChangeItem = (item, index) => {
    const element = cloneDeep(item.value)

    if (isObject(element)) {
        data.value.name = element.name
        data.value.measure = element.measure
        data.value.measure_id = element.measure_id
        data.value.custom_product = false
        data.value.supply_id = element.id
    }

    if (isString(element)) {
        data.value.supply_id = SUPPLY_ID
        data.value.custom_product = true
        data.value.name = element
    }
}

defineExpose({ save })
</script>

<template>

    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        :type="configModal.type"
        :show-errors="false"
        class="z-50"
        size="2xl" />

    <div class="space-y-4">
        <!-- Name -->
        <AutoComplete
            :label="$t('Vendor')"
            v-model="data.vendor"
            :force-selection="false"
            :options="vendors"
            :errors="errors.vendor_id"
            :placeholder="t('Select a vendor')" />

        <!-- Name -->
        <Input
            :label="$t('Tracking ID')"
            v-model="data.tracking_id"
            :errors="errors.tracking_id"
            :placeholder="t('Tracking ID')" />

        <!-- Update options -->
        <div
            v-if="data?.id"
            class="!mt-24" >
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
                        @click="deleteRecord" />
                </div>
            </Alert>
        </div>
    </div>
</template>
