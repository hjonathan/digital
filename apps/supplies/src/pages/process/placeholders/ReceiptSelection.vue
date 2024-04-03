<script setup>
import { Input, AutoComplete } from 'form'
import { TableUI, Button, Title } from 'layout'
import { onMounted, ref, inject } from 'vue'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'
import { api } from '@/config'
import { cloneDeep } from 'lodash'
import { format } from 'echarts'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const parametersStore = useGlobalStore('parameters')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const props = defineProps({
    invoice: Object,
    receipts: Array,
    type: Object,
    useProcess: Object
})

const emit = defineEmits(['onSave'])

const { process, isLoading } = props.useProcess
// Example colums for TableUI
const columns = ref([
    { field: 'Receipt id', name: 'Receipt ID', align: 'left', customClass: '!w-40' },
    { field: 'id', name: 'ID', align: 'left', customClass: '!w-40' },
    { field: 'Name', name: 'Name', align: 'left', customClass: '!w-80' },
    { field: 'Quantity', name: 'Quantity', align: 'left', customClass: '!w-40' },
    { field: 'Combo', name: 'Match item', align: 'center', customClass: '!w80' },
])

const invoiceSupplies = ref([])

const model = ref(props.receipts.reduce((acc, value) => {
    value.supply.forEach(e => {
        e.receipt_id = value.id
    })
    acc = acc.concat(value.supply)

    return acc
}, []))

const onChangeItem = (nValue, row, index) => {
    if (nValue.value) {
        row.part_item = false
    }
}

const onChangePart = (nValue, row, index) => {

}

onMounted(() => {
    getInvoice()
})

const getInvoice = async () => {
    const response = await api.get(`/supplies/invoice_show/${props.invoice.supply_order_id}`)

    if (response.success) {
        invoiceSupplies.value = response.data.supply
    }

    if (response.errors || !response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
    }
}

const formatData = () => {
    const response = props.receipts.map(e => {
        return {
            supply_order_id: e.id,
            itemsList: model.value.filter(f => {
                return e.id == f.receipt_id
            }).map(f => {
                return {
                    supply_order_supply_id: f.supply_id,
                    parent_id: f.item?.id,
                    part_item: f.part_item
                }
            })
        }
    })

    return response
}

const onSave = async () => {
    const apiData = {
        processStageDocumentTypeId: props.type.id,
        processId: process.value.id,
        warehouse_receipt_list: formatData()
    }

    isLoading.value = true

    const response = await api.post('/supplies/process_warehouse_receipt_add', apiData)

    isLoading.value = false

    if (response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

        emit('onSave')

        rapidStore.$emitGlobalEvent('updateSupplyDashboard')
    }

    if (response.errors || !response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
    }
}

</script>

<template>
    <div
        class="paper">

        <Title
            :title="`${$t('Receipts selection')}`"
            :hasBorderBottomLine="false"
            class="text-2xl font-semibold" />

        <Title
            :title="$t('Items')"
            :hasBorderBottomLine="false"
            titleType="h2"
            class="font-semibold" />

        <TableUI
            :columns="columns"
            v-model:data="model"
            :multipleOpen="false">
            <template v-slot:row="{ row, index, toggleExpansion }">
                <tr>
                    <td class="!w-40">
                        {{ showUuid(row.receipt_id) }}
                    </td>
                    <td class="!w-40">
                        {{ showUuid(row.supply_id) }}
                    </td>
                    <td class="!w-80">{{ row.name }}</td>
                    <td class="!w-40 text-right">{{ `${row.quantity} ${parametersStore.getItemById(row.measure_id).name}` }} </td>
                    <td class="!w-80 text-end">
                        <AutoComplete
                                :inputId="`invoice-item-${index}`"
                                @change="(e)=>onChangeItem(e, row, index)"
                                :completeOnFocus="true"
                                class="!mt-0"
                                outline
                                v-model="row.item"
                                :placeholder="$t('Invoice item')"
                                :options="invoiceSupplies"
                                :forceSelection="false"/>
                    </td>
                </tr>
            </template>
        </TableUI>

        <div class="flex flex-row-reverse">
            <Button
                @click="onSave"
                size="sm"
                color="primary"
                :label="t('Save')"
            />
        </div>
    </div>
</template>
