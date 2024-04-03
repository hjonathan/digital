<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue'
import { TextArea, ShowValue, Input, Treeselect, AutoComplete } from 'form'
import Waste from '../../components/Waste.vue'
import { round } from 'shared'
import { isNaN } from 'lodash'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    usePackaging: {
        type: Object,
        default: () => {}
    },
    item: Object
})

const emit = defineEmits(['disableSaveButton'])

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')
const finishedGoodTypes = useGlobalStore('finishedGoodTypes')

const { totalResidue, errors } = props.usePackaging

const element = ref({
    item_type: props.item ? finishedGoodTypes.getDataById(props.item.finished_god_type_id) : null,
    brand: props.item?.brand_id,
    location: props.item?.location_id,
    variance_reason: props.item?.second_reason_id,
    waste: props.item?.waste ? props.item.waste : 0,
    waste_reason: props.item?.reason_id,
    note: props.item?.note
})

const quantity = ref(props.item?.units_created || 0) // For units created
const quantityUsed = ref(props.item?.quantity_used || 0)
const totalResidueLocal = ref(totalResidue.value + quantityUsed.value + element.value.waste)
const itemTypeQuantity = ref(0)
const minVariancePerUnit = ref(null)
const maxVariancePerUnit = ref(null)
const minVariancePercent = ref(0)
const maxVariancePercent = ref(0)
const showWaste = ref(false)
const typeSelected = ref([])

const wasteMinValue = 0
const quantityRemainMinValue = 0

const quantityNeeded = computed(() => {
    return round(itemTypeQuantity.value * quantity.value)
})

const variance = computed(() => {
    return round(quantityUsed.value - quantityNeeded.value)
})

const perUnit = computed(() => {
    const value = round(variance.value / quantity.value)

    return isNaN(value) ? 0 : value
})

const ptcVar = computed(() => {
    const value = round((variance.value / quantityNeeded.value) * 100)

    return isNaN(value) ? 0 : value
})

// Returns only the children of warehouse
const getSelectLocations = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('locations', false)

    return allLocations.filter((param) => {
        return param.data.slug === 'vault' || param.data.slug === 'store'
    })
}

const getSelectVariance = () => {
    const allOptions = parametersStore.getTreeSelectDataBySlug('reasons', false)

    return allOptions.find((param) => {
        return param.data.slug === 'variance-reasons'
    }).children
}

const getData = () => {
    const data = {
        id: props.item?.id,
        finished_god_type_id: element.value.item_type.id,
        brand_id: element.value.brand,
        location_id: element.value.location,
        units_created: quantity.value, // Units created,
        quantity_needed: quantityNeeded.value,
        quantity_used: quantityUsed.value,
        waste: element.value.waste === 0 ? null : element.value.waste,
        variance: variance.value,
        second_reason_id: element.value.variance_reason,
        variance_per_unit: round(perUnit.value),
        variance_percent: ptcVar.value,
        note: element.value.note
    }

    element.value.waste && (data.reason_id = element.value.waste_reason)

    return data
}

const computedQuantityRemain = ref(totalResidue.value)

const assingTypeValue = () => {
    typeSelected.value = element.value.item_type

    itemTypeQuantity.value = typeSelected.value.quantity * (typeSelected.value.units_per_package || 1)

    minVariancePerUnit.value = typeSelected.value.min_variance_per_unit
    maxVariancePerUnit.value = typeSelected.value.max_variance_per_unit

    minVariancePercent.value = typeSelected.value.min_variance_percent
    maxVariancePercent.value = typeSelected.value.max_variance_percent
}

const isInRange = computed(() => {
    if (!minVariancePerUnit.value) {
        return false
    }

    if ((perUnit.value <= maxVariancePerUnit.value && perUnit.value >= minVariancePerUnit.value) &&
    (ptcVar.value <= maxVariancePercent.value && ptcVar.value >= minVariancePercent.value) &&
    computedQuantityRemain.value >= quantityRemainMinValue) {
        return true
    }

    return false
})

// To dynamically assing variances based on selected Category (FinishedGoodType)
watch(
    () => element.value.item_type,
    () => {
        assingTypeValue()
    },
    { deep: true }
)

watch(
    () => isInRange.value,
    () => {
        // Disabled button slideover
        emit('disableSaveButton', !isInRange.value)
    }
)

onMounted(() => {
    if (element.value.waste > wasteMinValue) {
        showWaste.value = !showWaste.value
    }

    if (props.item?.finished_god_type_id) {
        assingTypeValue()
    }
})

watch([() => quantityUsed.value, () => element.value.waste], () => {
    computedQuantityRemain.value = round(totalResidueLocal.value - quantityUsed.value - element.value.waste)
})

defineExpose({ getData })
emit('disableSaveButton', !isInRange.value)

</script>

<template>
    <div class="space-y-6">
        <!-- Categories -->
        <AutoComplete
            :errors="errors[`packaged_items.${0}.finished_god_type_id`]? ' ' : null"
            :label="t(`Item type`)"
            v-model="element.item_type"
            :options="finishedGoodTypes.getData()"
            placeholder="Select Item" />

        <!-- Brands -->
        <Treeselect
            :errors="errors[`packaged_items.${0}.brand_id`]? ' ' : null"
            :label="t(`Brand`)"
            :class="{'!bg-red-100': errors[`packaged_items.${0}.brand_id`] || null }"
            v-model="element.brand"
            :options="parametersStore.getTreeSelectDataBySlug('brands', true).filter(e=> ['swc','canvas'].includes(e.data.slug))"
            placeholder="Select Item" />

        <!-- Location -->
        <Treeselect
            :label="t(`Location`)"
            :errors="errors[`packaged_items.${0}.location_id`] ? ' ' : null"
            :class="{'!bg-red-100': errors[`packaged_items.${0}.location_id`] || null }"
            v-model="element.location"
            :options="getSelectLocations()"
            placeholder="Select Item" />

        <!-- Units created -->
        <Input
            :label="t(`Units created`)"
            v-model="quantity"
            inputClass="text-right"
            :type="'number'"
            :step="'1'"
            :min="'0'"
            :errors="errors[`packaged_items.${0}.items_created`]? ' ' : null"/>

        <!-- quantity Needed -->
        <ShowValue
            :label="t('Quantity Needed')"
            v-model="quantityNeeded" justify-end />

        <!-- quantity used -->
        <Input
            :label="t('Quantity used')"
            v-model="quantityUsed"
            inputClass="text-right"
            :type="'number'"
            :step="'1'"
            :min="'0'"
            :errors="errors[`packaged_items.${0}.quantity_used`]? ' ' : null"/>

        <!-- Add waste -->
        <Waste
            :force-show-input="(showWaste)"
            class="!mb-8"
            :measure="'units'"
            v-model:wasteValue="element.waste"
            v-model:reasonValue="element.waste_reason"
            :errors="{
                waste: errors[`packaged_items.${0}.waste`] ? ' ' : null,
                reason_id: errors[`packaged_items.${0}.reason_id`] ? ' ' : null
            }"
            :reasonsOptions="parametersStore.getTreeSelectDataBySlug('reasons')" />

        <!-- Variance -->
        <ShowValue
            :label="t('Variance')"
            v-model="variance"
            justify-end />

        <!-- Variance reason -->
        <Treeselect
            :label="t('Reason')"
            :errors="errors[`packaged_items.${0}.second_reason_id`] ? ' ' : null"
            v-model="element.variance_reason"
            :options="getSelectVariance()"
            placeholder="Select Item" />

        <!-- Per unit -->
        <ShowValue
            :label="t('Per/Unit (+/-)')"
            v-model="perUnit"
            :value-class="[
                'py-2 rounded-md',
                perUnit < maxVariancePerUnit && perUnit > minVariancePerUnit ? 'bg-success-200' : 'bg-error-200' ]"
            justify-end/>

        <!-- Pct Var -->
        <ShowValue
            :label="t('Pct% Var (+/-)')"
            class="!mb-8"
            v-model="ptcVar"
            :value-class="[
                'py-2 rounded-md',
                ptcVar < maxVariancePercent && ptcVar > minVariancePercent ? 'bg-success-200' : 'bg-error-200' ]"
            justify-end>
            <span>%</span>
        </ShowValue>

        <!-- Note -->
        <TextArea
            :errors="errors[`packaged_items.${0}.note`] ? ' ' : null"
            v-model="element.note"
            :placeholder="$t('Note')">
            <template #label>{{ $t('Note') }}</template>
        </TextArea>

        <!-- Quantity remain -->
        <ShowValue
            :label="t('Quantity Remain')"
            justify-end>
            {{ computedQuantityRemain }}
        </ShowValue>
    </div>
</template>
