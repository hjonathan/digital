<script setup>
import { inject, ref, computed } from 'vue'
import { Input, Treeselect, AutoComplete, TextArea } from 'form'
import { TableUI, Title, Icon } from 'layout'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'

import { 
    mdiPuzzlePlus
} from '@mdi/js'

const props = defineProps({
    useSlideOver: Object
})

const errors = ref({})

const { data, configSlideOver } = props.useSlideOver

const { t } = useI18n()

// Selected supplies
data.value.supplies = data.value

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')
const suppliesStore = useGlobalStore('supplies')
const unknownSuppliesStore = useGlobalStore('unknownSupplies')
const rapidStore = useGlobalStore('rapidStore')

const CUSTOM_SUPPLY_ID = '4fe13238-cus1-16f3-b184-b772fabf2zzz'

/* Columns for TableUI */
const columns = ref([
    {
        field: '',
        name: '',
        align: 'left',
        customClass: ''
    },
    {
        field: 'transaction_id',
        name: 'ID',
        align: 'left',
        customClass: ''
    },
    {
        field: 'name',
        name: 'Name',
        customClass: ''
    },
    {
        field: 'quantity',
        name: 'Quantity',
        customClass: ''
    },
])

const supplies = computed(() => {
    return suppliesStore.getData()
})

const getWarehouseLocations = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('locations').filter(location => {
        return location.data.slug === 'warehouse-area'
    })[0]?.children

    return allLocations
}

const getMeasures = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('measures')

    return allLocations
}

const getSuppliesCategories = () => {
    const categories = parametersStore.getTreeSelectDataBySlug('categories')

    const supplieCategory = categories.find(category => category?.data?.slug === 'supplies')

    if (supplieCategory) return supplieCategory.children

    return []
}

const save = async () => {
    let response = {}

    response = await api.post('/supplies/supply_draft_combine', formatApiData(data.value))

    if (response.success) {
        suppliesStore.fetch()

        unknownSuppliesStore.fetch()

        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })
    }

    if (response.errors) errors.value = response.errors

    return !response.errors && response
}

const formatApiData = (dataForm) => {
    const apiData = {
        supply_id: dataForm?.supply?.id ? dataForm?.supply?.id : CUSTOM_SUPPLY_ID,
        category_id: dataForm?.category_id,
        measure_id: dataForm?.measure_id,
        location_id: dataForm?.location_id,
        name: dataForm?.supply?.id ? dataForm?.supply?.name : dataForm?.supply,
        quantity: dataForm?.quantity,
        price: dataForm?.price,
        custom_product: dataForm?.supply?.id ? false : true,
        sku: dataForm?.sku,
        description: dataForm?.description,
        supplies: dataForm?.supplies.map(supply => {
            return {
                'supply_draft_id': supply?.id
            }
        })
    }

    return apiData
}

defineExpose({ save })
</script>

<template>
    <section class="p-0 pb-8">
        <!-- Selected supplies grid and title -->
        <div>
            <Title
                :title="$t('Selected supplies')"
                :has-border-bottom-line="false"
                titleType="h2"
                class="mt-4" />

            <!-- Table for selected supplies -->
            <TableUI
                :columns="columns"
                :data="data.supplies">
                <template v-slot:row="{ row }">
                    <tr>
                        <!-- Icon -->
                        <td class="!w-1/12 px-5">
                            <Icon
                                :icon="mdiPuzzlePlus" />
                        </td>

                        <!-- ID -->
                        <td>
                            {{ showUuid(row.id) }}
                        </td>

                        <!-- Name -->
                        <td>
                            {{ row.name }}
                        </td>

                        <!-- Quantity -->
                        <td class="text-right">
                            {{ row.quantity }}
                        </td>
                    </tr>
                </template>
            </TableUI>
        </div>
        
        <!-- Resulting supply information section -->
        <Title 
            :title="$t('Resulting supply information')"
            :has-border-bottom-line="false"
            title-type="h2" />

        <!-- Supply name -->
        <AutoComplete
            :label="$t('Name')"
            v-model="data.supply"
            :force-selection="false"
            :options="supplies"
            :errors="errors.name"
            :placeholder="t('Select')" />

        <!-- Quantity -->
        <Input
            v-model="data.quantity"
            :label="$t('Quantity')"
            type="number"
            input-class="text-right"
            :errors="errors.quantity"
            :placeholder="$t('Quantity')" />

        <!-- Price -->
        <Input 
            v-model="data.price"
            :label="$t('Price')"
            :errors="errors.price"
            :placeholder="$t('Price')" 
            type="number"
            input-class="text-right"
            inline-label-left="$" />

        <!-- Sku -->
        <Input
            v-model="data.sku"
            type="string"
            :label="$t('SKU')"
            :errors="errors.sku"
            :placeholder="$t('SKU')" />

        <!-- Category -->
        <Treeselect
            v-model="data.category_id"
            emitValue
            mapOptions
            :label="t(`Category`)"
            :errors="errors?.category_id"
            :class="{'!bg-red-100': errors?.category_id }"
            :options="getSuppliesCategories()"
            :placeholder="$t('Select')"
            class="input" />

        <!-- Measure -->
        <Treeselect
            v-model="data.measure_id"
            emitValue
            mapOptions
            :label="t(`Unit of measure`)"
            :errors="errors?.measure_id"
            :class="{'!bg-red-100': errors?.measure_id }"
            :options="getMeasures()"
            :placeholder="$t('Select')" />

        <!-- Location -->
        <Treeselect
            v-model="data.location_id"
            emitValue
            mapOptions
            :label="t(`Location`)"
            :errors="errors?.location_id"
            :class="{'!bg-red-100': errors?.location_id }"
            :options="getWarehouseLocations()"
            :placeholder="$t('Select')"
            class="input" />

        <!-- Description -->
        <TextArea
            v-model="data.description"
            :label="$t('Description')"
            :placeholder="$t('Description')"
            :errors="errors?.description" />
    </section>
</template>
