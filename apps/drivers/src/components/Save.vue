<script setup>
import { Input, DatePicker } from 'form'
import { Button, Alert } from 'layout'
import { onMounted, ref } from 'vue'
import { api } from '@/config'
import { formatDate, formatDiffForHumans } from 'shared'
const errors = ref({})

const props = defineProps({
    data: Object,
    countries: Array
})

// Driver data created from props
const driverModel = ref(props.data ? Object.assign({}, props.data) : {})

const emit = defineEmits(['close'])

// Save driver
const save = async () => {
    if (driverModel.value.id) {
        return await update()
    }

    return await create()
}

const formatDataApi = () => {
    const apiData = {
        id: driverModel.value.id || null,
        name: driverModel.value.name,
        certificate: driverModel.value.certificate,
        driver_license: driverModel.value.driver_license,
        phone: driverModel.value.phone,
        email: driverModel.value.email
    }

    if (driverModel.value.license_expiration_date) {
        apiData.license_expiration_date = formatDate(driverModel.value.license_expiration_date, 'utcDateTime')
    }

    if (driverModel.value.date_of_birth) {
        apiData.date_of_birth = formatDate(driverModel.value.date_of_birth, 'utcDateTime')
    }

    return apiData
}

// Create action with API.
const create = async () => {
    errors.value = {}

    const response = await api.post('drivers', Object.assign({}, formatDataApi(driverModel.value)))

    response.errors && (errors.value = response.errors)

    return response
}

// Update action in API.
const update = async () => {
    errors.value = {}

    const response = await api.put(`drivers/${driverModel.value.id}`, formatDataApi(driverModel.value))

    response.errors && (errors.value = response.errors)

    return response
}

// Remove id for driver for create new driver
const cloneRecord = () => {
    delete driverModel.value.id
}

// Call api to remove driver
const remove = async () => {
    const response = await api.delete(`drivers/${driverModel.value.id}`)

    response.success && emit('close')
}

// Format updatedAt and createdAt if exists
onMounted(() => {
    driverModel.value.updated_at && (driverModel.value.updated_at = formatDiffForHumans(driverModel.value.updated_at))

    driverModel.value.created_at && (driverModel.value.created_at = formatDiffForHumans(driverModel.value.created_at))
})

defineExpose({ save })
</script>

<template>
    <div class="space-y-4">
        <!-- Company name -->
        <Input
            v-model="driverModel.name"
            :label="$t('Name')"
            :placeholder="$t('Name')"
            :errors="errors.name"/>

        <!-- Certificate -->
        <Input
            v-model="driverModel.certificate"
            :label="$t('Certificate')"
            :placeholder="$t('Certificate')"
            :errors="errors.certificate" />

        <!-- Driver license -->
        <Input
            v-model="driverModel.driver_license"
            :label="$t('Driver license')"
            :placeholder="$t('Driver license')"
            :errors="errors.driver_license" />

        <DatePicker
            v-model="driverModel.license_expiration_date"
            :label="$t('License expiration date')"
            :placeholder="$t('License expiration date')"
            :errors="errors.license_expiration_date"
            dateFormat="yy-mm-dd"
            :min-date="null" />

        <!-- email -->
        <Input
            v-model="driverModel.email"
            :label="$t('Email')"
            :placeholder="$t('Email')"
            :errors="errors.email" />

        <!-- Phone -->
        <Input
            v-model="driverModel.phone"
            :label="$t('Phone')"
            :placeholder="$t('Phone')"
            :errors="errors.phone" />

        <DatePicker
            v-model="driverModel.date_of_birth"
            :label="$t('Date of birth')"
            :placeholder="$t('Date of birth')"
            :errors="errors.date_of_birth"
            dateFormat="yy-mm-dd"
            :min-date="null" />

        <!-- Readonly updated at -->
        <Input
            v-if="driverModel.updated_at"
            v-model="driverModel.updated_at"
            :label="$t('Updated at')"
            :placeholder="$t('Updated at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />

        <!-- Readonly created at -->
        <Input
            v-if="driverModel.created_at"
            v-model="driverModel.created_at"
            :label="$t('Created at')"
            :placeholder="$t('Created at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />
    </div>

    <!-- Update options -->
    <div
        v-if="driverModel?.id"
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
                    @click="remove" />
            </div>
        </Alert>
    </div>
</template>
