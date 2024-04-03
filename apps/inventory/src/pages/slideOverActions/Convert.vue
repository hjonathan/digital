<script setup>
import { ref, inject } from 'vue'
import { TextArea, Input, Treeselect, SelectCustomDate, AutoComplete } from 'form'
import { formatDate } from 'shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const api = inject('api')

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

const parametersStore = useGlobalStore('parameters')
const itemTypesStore = useGlobalStore('itemTypes')

const rapidStore = useGlobalStore('rapidStore')

const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)

const data = ref(selectedRows.value[0])

const elementToConvert = ref({
    quantity: data.value ? data.value.quantity : 0,
    status: data.value.status_id,
    strain: data.value.strain_id,
    brand: data.value.brand_id,
    item_type: data.value.item_type,
    location: data.value.location_id,
    stage: data.value.stage_id,
    type: data.value.type_id,
    measure: data.value.measure_id,
    note: data.value?.note,
    updated_at: null
})

const errors = ref({})

const save = async () => {
    const apiData = {
        id: data.value.id,
        item_type_id: elementToConvert.value.item_type.id,
        location_id: elementToConvert.value.location,
        type_id: elementToConvert.value.type,
        measure_id: elementToConvert.value.measure,
        brand_id: elementToConvert.value.brand,
        stage_id: elementToConvert.value.stage,
        status_id: elementToConvert.value.status,
        strain_id: elementToConvert.value.strain,
        quantity: elementToConvert.value.quantity,
        updated_at: elementToConvert.value.updated_at ? formatDate(elementToConvert.value.updated_at, 'utcDateTime') : null
    }

    const response = await api.post('/stock/convert', apiData)

    response.success && props.type === 'inventory subitem' && rapidStore.$emitGlobalEvent('load-subitem-list')

    response.errors && (errors.value = response.errors)

    return response
}

defineExpose({ save })
</script>

<template>
    <div class="space-y-6">
        <!-- Status -->
        <Treeselect
            :errors="errors?.status_id"
            :label="t('Status')"
            :class="{'!bg-red-100': errors?.status_id }"
            v-model="elementToConvert.status"
            :options="parametersStore.getTreeSelectDataBySlug('statuses', true)"
            placeholder="Select Item"
            class="input" />

        <!-- Strains -->
        <Treeselect
            :label="t('Strain')"
            :errors="errors?.strain_id"
            :class="{'!bg-red-100': errors?.strain_id }"
            v-model="elementToConvert.strain"
            :options="
            parametersStore.getTreeSelectDataBySlug('strains', true)"
            placeholder="Select Item"
            class="input" />

        <!-- Brands -->
        <Treeselect
            :label="t('Brand')"
            :errors="errors?.brand_id"
            :class="{'!bg-red-100': errors?.brand_id }"
            v-model="elementToConvert.brand"
            :options="parametersStore.getTreeSelectDataBySlug('brands', true)"
            placeholder="Select Item"
            class="input" />

        <AutoComplete
            v-model="elementToConvert.item_type"
            :options="itemTypesStore.getData()"
            :errors="errors.item_type_id"
            placeholder="Select item">
            <template #label>{{ $t('Item type') }}</template>
        </AutoComplete>

        <!-- Location -->
        <Treeselect
            :label="t('Location')"
            :errors="errors?.location_id"
            :class="{'!bg-red-100': errors?.location_id }"
            v-model="elementToConvert.location"
            :options="parametersStore.getTreeSelectDataBySlug('locations', false)"
            placeholder="Select Item"
            class="input" />

        <!-- Stages -->
        <Treeselect
            :label="t('Stage')"
            :errors="errors?.stage_id"
            :class="{'!bg-red-100': errors?.stage_id }"
            v-model="elementToConvert.stage"
            :options="parametersStore.getTreeSelectDataBySlug('stages', true)"
            placeholder="Select Item"
            class="input" />

        <!-- Types -->
        <Treeselect
            :label="t('Type')"
            :errors="errors?.type_id"
            :class="{'!bg-red-100': errors?.type_id }"
            v-model="elementToConvert.type"
            :options="parametersStore.getTreeSelectDataBySlug('types', true)"
            placeholder="Select Item"
            class="input" />

        <!-- Measures -->
        <Treeselect
            :label="t('Unit of measure')"
            :errors="errors?.measure_id"
            :class="{'!bg-red-100': errors?.measure_id }"
            v-model="elementToConvert.measure"
            :options="parametersStore.getTreeSelectDataBySlug('measures', true)"
            placeholder="Select Item"
            class="input" />

        <!-- Quantity -->
        <Input
            v-model="elementToConvert.quantity"
            inputClass="text-right"
            :type="'number'" :step="'1'"
            :min="'0'"
            :errors="errors?.quantity">
            <template #label>{{ $t('Quantity') }}</template>

            <template #inlineLabelRight>{{ data?.measure.name }}</template>
        </Input>

        <!-- Note -->
        <TextArea
            v-model="elementToConvert.note"
            :placeholder="$t('Note')"
            :errors="errors?.note">
            <template #label>{{ $t('Note') }}</template>
        </TextArea>

        <!-- Select custom date -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="elementToConvert.updated_at" />
    </div>
</template>
