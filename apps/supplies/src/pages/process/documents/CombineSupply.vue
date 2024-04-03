<script setup>
import { ref, inject } from 'vue'
import CardDocument from '../CardDocument.vue'
import { useI18n } from 'vue-i18n'
import { formatDate, showUuid } from 'shared'

const { t } = useI18n()

const props = defineProps({
    document: Object
})

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')

const title = ref(t('Combination') + ` ${showUuid(props.document.supply_order_id)} `)

const data = ref([
    {
        label: t('User'),
        value: props.document.supply_order.request_user.name
    },
    {
        label: t('Vendor'),
        value: props.document.supply_order.vendor?.name
    },
    {
        label: t('Requested date'),
        value: formatDate(props.document.supply_order.requested_date)
    },
])

const onClick = () => {
    tabsStore.openTab({ name: 'ShowSuppliesCombination', params: { id: props.document.supply_order_id } })
}
</script>

<template>
    <div>
        <CardDocument
            :title="title"
            v-model:data="data"
            @click="onClick">
        </CardDocument>
    </div>
</template>
