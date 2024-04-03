<script setup>
import { ActionCardSquare, TableUI, Title, Icon, Badge, Overlay, Button } from 'layout'
import { computed, inject, ref } from 'vue'
import { CheckIcon, BanknotesIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { formatDate } from 'shared'
import {
    mdiInboxArrowDown,
    mdiMinusCircle,
    mdiCheckCircle,
    mdiCloseCircle,
    mdiEyeOutline,
    mdiCheck,
    mdiCheckAll
} from '@mdi/js'

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

// Action buttons for material request
const purchaseRequestActions = computed(() => {
    const actions = [
        {
            title: t('Purchase requests'),
            icon: mdiInboxArrowDown,
            subtitle: t('Purchase request'),
            color: 'primary',
            quantityField: 'purchase-request',
            type: 'primary',
            action: () => {
                tab.value = 'purchase-request'
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
    ]

    return actions
})

const existColumn = (columnField) => {
    return getColumns.value.some(column => column.field === columnField)
}

const badgeColors = {
    approved: 'success',
    attended: 'success',
    rejected: 'danger',
    requested: 'warning'
}

const openRequest = (request) => {
    const dispatchStatus = ['attended', 'awaiting-delivery-confirmation', 'delivered']

    const requestTabs = {
        'purchase-request': 'ShowPurchaseRequest',
        'purchase-order': 'ShowPurchaseOrder',
        'quotation-request': 'ShowRequestForQuotation'
    }

    if (dispatchStatus.includes(request.supply_order_status.slug)) {
        tabsStore.openTab({ name: 'DispatchNotePr', params: { id: request.id } })

        return
    }

    tabsStore.openTab({ name: requestTabs[tab.value], params: { id: request.id } })
}

</script>

<template>
    <div class="flex flex-col relative space-y-5 !pl-10">
        <div class="flex items-center space-x-2 mb-5">
            <Icon
                :icon="BanknotesIcon" />

            <Title
                :title="$t('Purchase requests')"
                :has-border-bottom-line="false" />
        </div>

        <div class="flex flex-row w-full overflow-x-scroll">
            <Overlay
                v-if="purchaseRequestStore.fetching || purchaseOrderStore.fetching || quotationRequestStore.fetching"
                size="14"/>

            <div
                v-for="(item, index) of purchaseRequestActions"
                :key="index"
                class="flex-none w-48 2xl:w-4/12 h-full pr-2">
                <ActionCardSquare
                    :title="item.title"
                    :subtitle="item.subtitle"
                    :icon="item.icon"
                    :color="item.color"
                    :action="item.action"
                    :active="item.quantityField === tab" />
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

    </div>
</template>
