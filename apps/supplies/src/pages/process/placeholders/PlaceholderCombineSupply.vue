<script setup>
import PlaceholderCreate from '../PlaceholderCreate.vue'
import { ref, inject } from 'vue'
import { mdiFileDocumentPlusOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { getDocumentType } from '../configProcess'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const props = defineProps({
    type: Object,
    useProcess: Object
})

const { process, isLoading } = props.useProcess

const onClick = () => {
    const documentType = getDocumentType(process.value, 'warehouse-receipt-unknown-supply')

    tabsStore.openTab({
        name: 'SuppliesCombination',
        query: {
            receptionId: documentType.process_stage_documents.map(e => e.supply_order_id),
            processId: process.value.id,
            stageId: props.type.process_stage_id,
            processStageDocumentTypeId: props.type.id,
            supplyOrderType: 'combine-supply',
            documentType: 'combine-supply'
        }
    })
}

const data = ref({
    label: t('Combine'),
    description: t('Combine the receives'),
    labelButton: t('Create combine')
})

</script>

<template>
    <PlaceholderCreate
        :onClick="onClick"
        :label="data.label"
        :description="data.description"
        :labelButton="data.labelButton"
        :icon="mdiFileDocumentPlusOutline" />
</template>
