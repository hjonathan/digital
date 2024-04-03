<script setup>
import { Input } from 'form'
import { Button, Alert } from 'layout'
import { onMounted, ref } from 'vue'
import { api } from '@/config'
import { formatDiffForHumans } from 'shared'
const errors = ref({})

const props = defineProps({
    data: Object
})

// Client data created from props
const clientModel = ref(props.data ? Object.assign({}, props.data) : {})

const emit = defineEmits(['close'])

// Save client
const save = async () => {
    if (clientModel.value.id) {
        return await update()
    }

    return await create()
}

// Create action with API.
const create = async () => {
    errors.value = {}

    const response = await api.post('clients', Object.assign({}, clientModel.value))

    response.errors && (errors.value = response.errors)

    return response
}

// Update action in API.
const update = async () => {
    errors.value = {}

    const response = await api.put(`clients/${clientModel.value.id}`, clientModel.value)

    response.errors && (errors.value = response.errors)

    return response
}

// Remove id for client for create new client
const cloneRecord = () => {
    delete clientModel.value.id
}

// Call api to remove client
const remove = async () => {
    const response = await api.delete(`clients/${clientModel.value.id}`)

    response.success && emit('close')
}

// Format updatedAt and createdAt if exists
onMounted(() => {
    clientModel.value.updated_at && (clientModel.value.updated_at = formatDiffForHumans(clientModel.value.updated_at))

    clientModel.value.created_at && (clientModel.value.created_at = formatDiffForHumans(clientModel.value.created_at))
})

defineExpose({ save })
</script>

<template>
    <div class="space-y-4">
        <!-- Company name -->
        <Input
            v-model="clientModel.company_name"
            :label="$t('Company name')"
            :placeholder="$t('Company name')"
            :errors="errors.company_name"/>

        <!-- Address -->
        <Input
            v-model="clientModel.address"
            :label="$t('Address')"
            :placeholder="$t('Address')"
            :errors="errors.address" />

        <!-- Address 2 -->
        <Input
            v-model="clientModel.address_2"
            :label="$t('Address 2')"
            :placeholder="$t('Address 2')"
            :errors="errors.address_2" />

        <!-- City -->
        <Input
            v-model="clientModel.city"
            :label="$t('City')"
            :placeholder="$t('City')"
            :errors="errors.city" />

        <!-- Email -->
        <Input
            v-model="clientModel.email"
            :label="$t('Email')"
            :placeholder="$t('Email')"
            :errors="errors.email" />

        <!-- Contact -->
        <Input
            v-model="clientModel.contact_name"
            :label="$t('Contact name')"
            :placeholder="$t('Contact name')"
            :errors="errors.contact_name" />

        <!-- Phone -->
        <Input
            v-model="clientModel.phone"
            :label="$t('Phone')"
            :placeholder="$t('Phone')"
            :errors="errors.phone" />

        <!-- State -->
        <Input
            v-model="clientModel.state"
            :label="$t('State')"
            :placeholder="$t('State')"
            :errors="errors.state" />

        <!-- Website -->
        <Input
            v-model="clientModel.website"
            :label="$t('Website')"
            :placeholder="$t('Website')"
            :errors="errors.website" />

        <!-- Zip code -->
        <Input
            v-model="clientModel.zip_code"
            :label="$t('Zip code')"
            :placeholder="$t('Zip code')"
            :errors="errors.zip_code" />

        <!-- Taxpayer identification number -->
        <Input
            v-model="clientModel.taxpayer_identification_number"
            :label="$t('Taxpayer identification number')"
            :placeholder="$t('Taxpayer identification number')"
            :errors="errors.taxpayer_identification_number" />

        <!-- Readonly updated at -->
        <Input
            v-if="clientModel.updated_at"
            v-model="clientModel.updated_at"
            :label="$t('Updated at')"
            :placeholder="$t('Updated at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />

        <!-- Readonly created at -->
        <Input
            v-if="clientModel.created_at"
            v-model="clientModel.created_at"
            :label="$t('Created at')"
            :placeholder="$t('Created at')"
            :readonly="true"
            :errors="errors.taxpayer_identification_number" />
    </div>

    <!-- Update options -->
    <div
        v-if="clientModel?.id"
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
