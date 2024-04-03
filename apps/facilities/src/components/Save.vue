<script setup>
import { Input, AutoComplete } from 'form'
import { Button, Alert } from 'layout'
import { computed, inject, onMounted, ref } from 'vue'
import { api } from '@/config'
import { formatDiffForHumans } from 'shared'
const errors = ref({})

const props = defineProps({
    data: Object,
    countries: Array
})

const useGlobalStore = inject('useGlobalStore')
const facilityTypesStore = useGlobalStore('facilityTypes')

// Facility data created from props
const facilityModel = ref(props.data ? Object.assign({}, props.data) : {})

const emit = defineEmits(['close'])

// Save facility
const save = async () => {
    if (facilityModel.value.id) {
        return await update()
    }

    return await create()
}

// Create action with API.
const create = async () => {
    errors.value = {}

    const response = await api.post('facilities', Object.assign({}, facilityModel.value))

    response.errors && (errors.value = response.errors)

    return response
}

// Update action in API.
const update = async () => {
    errors.value = {}

    const response = await api.put(`facilities/${facilityModel.value.id}`, facilityModel.value)

    response.errors && (errors.value = response.errors)

    return response
}

// Remove id for facility for create new facility
const cloneRecord = () => {
    delete facilityModel.value.id
}

// Call api to remove facility
const remove = async () => {
    const response = await api.delete(`facilities/${facilityModel.value.id}`)

    response.success && emit('close')
}

const facilityTypes = computed(() => {
    return facilityTypesStore.getData()
})

// Format updatedAt and createdAt if exists
onMounted(() => {
    facilityModel.value.updated_at && (facilityModel.value.updated_at = formatDiffForHumans(facilityModel.value.updated_at))

    facilityModel.value.created_at && (facilityModel.value.created_at = formatDiffForHumans(facilityModel.value.created_at))
})

defineExpose({ save })
</script>

<template>
    <div class="space-y-4">
        <!-- Company name -->
        <Input
            v-model="facilityModel.facility_name"
            :label="$t('Facility name')"
            :placeholder="$t('Facility name')"
            :errors="errors.facility_name"/>

        <!-- License number -->
        <Input
            v-model="facilityModel.license_number"
            :label="$t('License number')"
            :placeholder="$t('License number')"
            :errors="errors.license_number"/>

        <!-- Address -->
        <Input
            v-model="facilityModel.address"
            :label="$t('Address')"
            :placeholder="$t('Address')"
            :errors="errors.address" />

        <!-- Address 2 -->
        <Input
            v-model="facilityModel.address_2"
            :label="$t('Address 2')"
            :placeholder="$t('Address 2')"
            :errors="errors.address_2" />

        <!-- City -->
        <AutoComplete
            v-model="facilityModel.country_id"
            :label="$t('Country')"
            :placeholder="$t('Country')"
            :options="countries"
            option-label="name"
            option-value="id"
            emitValue
            mapOptions
            :errors="errors.country_id" />

        <!-- City -->
        <Input
            v-model="facilityModel.city"
            :label="$t('City')"
            :placeholder="$t('City')"
            :errors="errors.city" />

        <!-- Email -->
        <Input
            v-model="facilityModel.email"
            :label="$t('Email')"
            :placeholder="$t('Email')"
            :errors="errors.email" />

        <!-- Phone -->
        <Input
            v-model="facilityModel.phone"
            :label="$t('Phone')"
            :placeholder="$t('Phone')"
            :errors="errors.phone" />

        <!-- Contact -->
        <Input
            v-model="facilityModel.contact_name"
            :label="$t('Contact name')"
            :placeholder="$t('Contact name')"
            :errors="errors.contact_name" />

        <!-- Contact phone -->
        <Input
            v-model="facilityModel.contact_phone"
            :label="$t('Contact phone')"
            :placeholder="$t('Contact phone')"
            :errors="errors.contact_phone" />

        <!-- State -->
        <Input
            v-model="facilityModel.state"
            :label="$t('State')"
            :placeholder="$t('State')"
            :errors="errors.state" />

        <!-- Website -->
        <Input
            v-model="facilityModel.website"
            :label="$t('Website')"
            :placeholder="$t('Website')"
            :errors="errors.website" />

        <!-- Zip code -->
        <Input
            v-model="facilityModel.zip_code"
            :label="$t('Zip code')"
            :placeholder="$t('Zip code')"
            :errors="errors.zip_code" />

        <!-- City -->
        <AutoComplete
            v-model="facilityModel.facility_type_id"
            :label="$t('Facilitty type')"
            :placeholder="$t('Facilitty type')"
            :options="facilityTypes"
            option-label="name"
            option-value="id"
            emitValue
            mapOptions
            :errors="errors.facility_type_id" />

        <!-- Latitude -->
        <Input
            v-model="facilityModel.latitude_location"
            :label="$t('Latitude')"
            :placeholder="$t('Latitude')"
            :errors="errors.latitude_location" />

        <!-- Longitude -->
        <Input
            v-model="facilityModel.longitude_location"
            :label="$t('Longitude')"
            :placeholder="$t('Longitude')"
            :errors="errors.longitude_location" />

        <!-- Readonly updated at -->
        <Input
            v-if="facilityModel.updated_at"
            v-model="facilityModel.updated_at"
            :label="$t('Updated at')"
            :placeholder="$t('Updated at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />

        <!-- Readonly created at -->
        <Input
            v-if="facilityModel.created_at"
            v-model="facilityModel.created_at"
            :label="$t('Created at')"
            :placeholder="$t('Created at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />
    </div>

    <!-- Update options -->
    <div
        v-if="facilityModel?.id"
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
