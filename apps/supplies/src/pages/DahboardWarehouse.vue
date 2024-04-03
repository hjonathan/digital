<script setup>
import { Icon, Title, Overlay, ActionCardSquare, TableUI } from 'layout'
import { computed, inject, ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import {
    mdiInboxArrowDown,
    mdiTextBoxMultiple,
    mdiMinusCircle,
    mdiCheckCircle,
    mdiCloseCircle,
    mdiEyeOutline
} from '@mdi/js'
import { formatDate } from 'shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')
const tabsStore = useGlobalStore('tabs')

const purchaseRequestStore = useGlobalStore('purchaseRequest')
const purchaseOrderStore = useGlobalStore('purchaseOrder')
const quotationRequestStore = useGlobalStore('quotationRequest')

purchaseRequestStore.fetch()
purchaseOrderStore.fetch()
quotationRequestStore.fetch()

const tab = ref('purchase-request')
const data = computed(() => {
    const lists = {
        'purchase-request': computed(() => (purchaseRequestStore.getData())),
        'purchase-order': computed(() => (purchaseOrderStore.getData())),
        'quotation-request': computed(() => (quotationRequestStore.getData()))
    }

    return lists[tab.value].value
})

const badgeColors = {
    approved: 'success',
    attended: 'success',
    rejected: 'danger',
    requested: 'warning'
}

// Action buttons for material request
const purchaseRequestActions = computed(() => {
    const actions = [
        {
            title: t('Purchase requests'),
            icon: mdiInboxArrowDown,
            subtitle: t('Purchase request'),
            color: 'warning',
            quantityField: 'purchase-request',
            type: 'warning',
            action: () => {
                tab.value = 'purchase-request'
            }
        },
        {
            title: t('Quotation requests'),
            icon: CheckIcon,
            subtitle: t('Quotation requests'),
            color: 'info',
            quantityField: 'quotation-request',
            type: 'secondary',
            action: () => {
                tab.value = 'quotation-request'
            }
        },
        {
            title: t('Purchase orders'),
            icon: CheckIcon,
            subtitle: t('Purchase orders'),
            color: 'success',
            quantityField: 'purchase-order',
            type: 'info',
            action: () => {
                tab.value = 'purchase-order'
            }
        },
        {
            title: t('Sales order'),
            icon: CheckIcon,
            subtitle: t('Purchase orders'),
            color: 'primary',
            quantityField: 'purchase-order',
            type: 'info',
            action: () => {
                tab.value = 'purchase-order'
            }
        },
        {
            title: t('Warehouse receipt'),
            icon: CheckIcon,
            subtitle: t('Purchase orders'),
            color: 'orange',
            quantityField: 'purchase-order',
            type: 'info',
            action: () => {
                tab.value = 'purchase-order'
            }
        },
        {
            title: t('Dispatch notes'),
            icon: CheckIcon,
            subtitle: t('Purchase orders'),
            color: 'success',
            quantityField: 'purchase-order',
            type: 'info',
            action: () => {
                tab.value = 'purchase-order'
            }
        },
    ]

    return actions
})


const existColumn = (columnField) => {
    return getColumns.value.some(column => column.field === columnField)
}

const getColumns = computed(() => {
    const columns = [
        { field: 'id', name: 'ID', align: 'left', customClass: '' },
        { field: 'request_user.name', name: 'Requester', align: 'left', customClass: '' },
        { field: 'approval_name', name: 'Manager approval', align: 'center', customClass: '' },
        { field: 'final_approval_name', name: 'Warehouse approval', align: 'center', customClass: '' },
        { field: 'supply_order_status.name', name: 'Status', align: 'left', customClass: '' },
        { field: 'requested_date', name: 'Send date', align: 'left', customClass: '' },
    ]

    return columns
})

</script>

<template>
    <section class="!h-full">
        <div class="flex items-center space-x-2">
            <Icon
                :icon="mdiTextBoxMultiple" />

            <Title
                :title="$t('Requests')"
                :has-border-bottom-line="false" />
        </div>

        <div class="grid grid-cols-1">
            <div class="flex flex-row w-full overflow-x-scroll">
                <Overlay
                    v-if="purchaseRequestStore.fetching || purchaseOrderStore.fetching || quotationRequestStore.fetching"
                    size="14"/>

                <div
                    v-for="(item, index) of purchaseRequestActions"
                    :key="index"
                    class="flex-none w-96 2xl:w-2/12 h-full pr-2">
                    <ActionCardSquare
                        :title="item.title"
                        :subtitle="item.subtitle"
                        :icon="item.icon"
                        :color="item.color"
                        :action="item.action"
                        :active="item.quantityField === tab" />
                </div>
            </div>
        </div>

        <TableUI
            :columns="getColumns"
            :data="data">
            <template v-slot:row="{ row }">
                <tr>
                        <td v-if="existColumn('id')">
                            <div class="!w-0">
                                {{ row?.id }}
                            </div>
                        </td>

                        <td v-if="existColumn('request_user.name')">
                            <div class="w-36 flex flex-col gap-1 justify-center">
                                <div>{{ row?.request_user?.name }}</div>
                                <div class="text-xs text-gray-400">{{ row?.request_user?.department }}</div>
                            </div>
                        </td>
                        <!-- <td><pre>{{ row }}</pre></td> -->

                        <td v-if="existColumn('supply_order_type.name')">
                            <Badge
                                :label="row?.supply_order_type?.name"/>
                        </td>

                        <td v-if="existColumn('approval_name')">
                            <div class="flex flex-col !w-24 text-center">
                                <Icon
                                    v-if="!row?.approval_name || !row.date_approval_or_reject"
                                    class="text-gray-300"
                                    :icon="mdiMinusCircle"/>

                                <Icon
                                    v-if="row?.approval_name  && row.date_approval_or_reject && row?.supply_order_status?.slug !== 'rejected'"
                                    class="text-teal-500"
                                    :icon="mdiCheckCircle"/>

                                <Icon
                                    v-if="row?.approval_name && row.date_approval_or_reject && row?.supply_order_status?.slug === 'rejected'"
                                    class="text-red-400"
                                    :icon="mdiCloseCircle"/>

                                <span class="text-xs">{{ row.date_approval_or_reject && formatDate(row.date_approval_or_reject, 'diffForHumans') }}</span>
                            </div>
                        </td>

                        <td v-if="existColumn('final_approval_name')">
                            <div v-if="row?.final_approval_name"
                                class="flex flex-col !w-24 text-center gap-1">
                                <Icon
                                    v-if="!row?.final_approval_name || !row.date_final_approval_or_reject"
                                    class="text-gray-300"
                                    :icon="mdiMinusCircle"/>

                                <Icon
                                    v-if="row?.final_approval_name && row.date_final_approval_or_reject && row?.supply_order_status?.slug !== 'rejected'"
                                    class="text-teal-500"
                                    :icon="mdiCheckCircle"/>

                                <Icon
                                    v-if="row?.final_approval_name && row.date_final_approval_or_reject && row?.supply_order_status?.slug === 'rejected'"
                                    class="text-red-400"
                                    :icon="mdiCloseCircle"/>

                                <span class="text-xs">{{ row.date_final_approval_or_reject && formatDate(row.date_final_approval_or_reject, 'diffForHumans') }}</span>
                            </div>
                        </td>

                        <td v-if="existColumn('supply_order_status.name')">
                            <div class="!w-0">
                                <Badge
                                    :label="row?.supply_order_status?.name"
                                    :type="badgeColors[row?.supply_order_status?.slug]"/>
                            </div>
                        </td>

                        <td v-if="existColumn('requested_date')">
                            <span class="text-sm">{{ row?.requested_date ? formatDate(row?.requested_date, 'diffForHumans') : '' }}</span>
                        </td>

                        <td>
                            <div class="w-full flex justify-center">
                                <Button
                                    class="mt-2"
                                    :icon="mdiEyeOutline"
                                    size="lg"
                                    flat
                                    rounded
                                    color="secondary"
                                    iconClass="hover:text-green-500"
                                    @click="openRequest(row)" />
                            </div>
                        </td>
                    </tr>
            </template>
        </TableUI>
    </section>
</template>
