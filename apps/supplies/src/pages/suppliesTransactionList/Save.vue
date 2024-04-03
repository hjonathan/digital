<script setup>
import { Input, Treeselect } from 'form'
import { Alert, Button } from 'layout'
import { inject, ref } from 'vue'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'

const errors = ref({})

const props = defineProps({
    useSlideOver: Object
})

const { data, configSlideOver } = props.useSlideOver

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')
const suppliesStore = useGlobalStore('supplies')

const getLocations = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('locations')

    return allLocations
}

const getMeasures = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('measures')

    return allLocations
}

const getCategories = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('categories')

    return allLocations
}

const formatApiData = (dataForm) => {
    const apiData = {
        category_id: dataForm.category_id,
        location_id: dataForm.location_id,
        measure_id: dataForm.measure_id,
        name: dataForm.name,
        reference_price: dataForm.reference_price,
        locked: false,
        custom_product: false
    }

    if (dataForm.id) apiData.id = dataForm.id

    return apiData
}

const save = async () => {
    let response = {}

    if (data.value.id) {
        response = await api.put(`/supplies/${data.value.id}`, formatApiData(data.value))
    }

    if (!data.value.id) {
        response = await api.post('/supplies', formatApiData(data.value))
    }

    suppliesStore.fetch()

    if (response.errors) errors.value = response.errors

    return !response.errors && response
}

const cloneRecord = () => {
    delete data.value.id
}

const deleteRecord = async () => {
    const response = await api.delete(`/supplies/${data.value.id}`)

    if (!response.errors) {
        configSlideOver.value.close = !configSlideOver.value.close
    }

    suppliesStore.fetch()

    return response
}

defineExpose({ save })
</script>

<template>
    <div class="space-y-4">
        <!-- Name -->
        <Input
            v-model="data.name"
            :label="$t('Name')"
            :placeholder="$t('Name')"
            :errors="errors.name"/>

        <!-- Reference price -->
        <Input
            v-model="data.reference_price"
            :label="$t('Reference price')"
            type="number"
            inline-label-left="$"
            input-class="text-right"
            :errors="errors.reference_price" />

        <!-- Location -->
        <Treeselect
            v-model="data.category_id"
            emitValue
            mapOptions
            :label="t(`Category`)"
            :errors="errors?.category_id"
            :class="{'!bg-red-100': errors?.category_id }"
            :options="getCategories()"
            placeholder="Select"
            class="input" />

        <!-- Location -->
        <Treeselect
            v-model="data.location_id"
            emitValue
            mapOptions
            :label="t(`Location`)"
            :errors="errors?.location_id"
            :class="{'!bg-red-100': errors?.location_id }"
            :options="getLocations()"
            placeholder="Select"
            class="input" />

        <!-- Location -->
        <Treeselect
            v-model="data.measure_id"
            emitValue
            mapOptions
            :label="t(`Unit of measure`)"
            :errors="errors?.measure_id"
            :class="{'!bg-red-100': errors?.measure_id }"
            :options="getMeasures()"
            placeholder="Select" />

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
                        @click="deleteRecord" />
                </div>
            </Alert>
        </div>
    </div>
</template>
