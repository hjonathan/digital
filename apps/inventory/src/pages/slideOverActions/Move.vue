<script setup>
import { ref, inject } from 'vue'
import { TextArea, Treeselect, SelectCustomDate } from 'form'
import { formatDate } from 'shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')

const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)

const data = ref(selectedRows.value[0])

const api = inject('api')

const elementToMove = ref({
    note: '',
    location_id: data.value.location_id,
    updated_at: null
})

const parametersStore = useGlobalStore('parameters')

const errors = ref({})

const save = async () => {
    const response = await api.post('/stock/move', {
        id: data.value.id,
        location_id: elementToMove.value.location_id,
        updated_at: elementToMove.value.updated_at ? formatDate(elementToMove.value.updated_at, 'utcDateTime') : null
    })

    response.success && props.type === 'inventory subitem' && rapidStore.$emitGlobalEvent('load-subitem-list')

    response.errors && (errors.value = response.errors)

    return response
}

defineExpose({ save })
</script>

<template>
    <div class="space-y-6">
        <Treeselect
            :errors="errors?.location_id"
            :label="t(`Location`)"
            :class="{'!bg-red-100': errors.location_id }"
            v-model="elementToMove.location_id"
            :options="parametersStore.getTreeSelectDataBySlug('locations')"
            placeholder="Select Item"
            class="input"/>

        <TextArea
            :errors="errors?.note"
            :placeholder="$t('Note')"
            v-model="elementToMove.note">
            <template #label>{{ $t('Note')}}</template>
        </TextArea>

        <!-- Select custom date -->
        <SelectCustomDate
            :errors="errors?.updated_at"
            v-model="elementToMove.updated_at" />
    </div>
</template>
