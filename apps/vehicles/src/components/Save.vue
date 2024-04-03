<script setup>
import { Input } from 'form'
import { Button, Alert } from 'layout'
import { onMounted, ref } from 'vue'
import { api } from '@/config'
import { formatDiffForHumans } from 'shared'
const errors = ref({})

const props = defineProps({
    data: Object,
    countries: Array
})

// Vehicle data created from props
const vehicleModel = ref(props.data ? Object.assign({}, props.data) : {})

const emit = defineEmits(['close'])

// Save vehicle
const save = async () => {
    if (vehicleModel.value.id) {
        return await update()
    }

    return await create()
}

// Create action with API.
const create = async () => {
    errors.value = {}

    const response = await api.post('vehicles', Object.assign({}, vehicleModel.value))

    response.errors && (errors.value = response.errors)

    return response
}

// Update action in API.
const update = async () => {
    errors.value = {}

    const response = await api.put(`vehicles/${vehicleModel.value.id}`, vehicleModel.value)

    response.errors && (errors.value = response.errors)

    return response
}

// Remove id for vehicle for create new vehicle
const cloneRecord = () => {
    delete vehicleModel.value.id
}

// Call api to remove vehicle
const remove = async () => {
    const response = await api.delete(`vehicles/${vehicleModel.value.id}`)

    response.success && emit('close')
}

// Format updatedAt and createdAt if exists
onMounted(() => {
    vehicleModel.value.updated_at && (vehicleModel.value.updated_at = formatDiffForHumans(vehicleModel.value.updated_at))

    vehicleModel.value.created_at && (vehicleModel.value.created_at = formatDiffForHumans(vehicleModel.value.created_at))
})

defineExpose({ save })
</script>

<template>
    <div class="space-y-4">
        <!-- Certificate -->
        <Input
            v-model="vehicleModel.certificate"
            :label="$t('Certificate')"
            :placeholder="$t('Certificate')"
            :errors="errors.certificate"/>

        <!-- License plate -->
        <Input
            v-model="vehicleModel.license_plate"
            :label="$t('License plate')"
            :placeholder="$t('License plate')"
            :errors="errors.license_plate" />

        <!-- VIN -->
        <Input
            v-model="vehicleModel.vin"
            :label="$t('VIN')"
            :placeholder="$t('VIN')"
            :errors="errors.vin" />

        <!-- Make -->
        <Input
            v-model="vehicleModel.make"
            :label="$t('Make')"
            :placeholder="$t('Make')"
            :errors="errors.make" />

        <!-- Model -->
        <Input
            v-model="vehicleModel.model"
            :label="$t('Model')"
            :placeholder="$t('Model')"
            :errors="errors.model" />

        <!-- People number -->
        <Input
            v-model="vehicleModel.people_number"
            :label="$t('People number')"
            :placeholder="$t('People number')"
            :errors="errors.people_number"
            type="number"
            :min="0" />

        <!-- Engine capacity -->
        <Input
            v-model="vehicleModel.engine_capacity"
            :label="$t('Engine capacity')"
            :placeholder="$t('Engine capacity')"
            :errors="errors.engine_capacity"
            type="number"
            :min="0" />

        <!-- Color -->
        <Input
            v-model="vehicleModel.color"
            :label="$t('Color')"
            :placeholder="$t('Color')"
            :errors="errors.color" />

        <!-- Year -->
        <Input
            type="number"
            v-model="vehicleModel.year"
            :label="$t('Year')"
            :placeholder="$t('Year')"
            :errors="errors.year" />

        <!-- Readonly updated at -->
        <Input
            v-if="vehicleModel.updated_at"
            v-model="vehicleModel.updated_at"
            :label="$t('Updated at')"
            :placeholder="$t('Updated at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />

        <!-- Readonly created at -->
        <Input
            v-if="vehicleModel.created_at"
            v-model="vehicleModel.created_at"
            :label="$t('Created at')"
            :placeholder="$t('Created at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />
    </div>

    <!-- Update options -->
    <div
        v-if="vehicleModel?.id"
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
