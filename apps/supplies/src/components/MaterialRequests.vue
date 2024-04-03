<script setup>
import { ActionCardSquare, TableUI, Title, Icon, Badge, Overlay, Button } from 'layout'
import {
    mdiInboxArrowDown, mdiFileDocumentEdit, mdiRefresh,
    mdiMinusCircle,
    mdiCheckCircle,
    mdiCloseCircle,
    mdiEyeOutline,
    mdiCheck,
    mdiCheckAll
} from '@mdi/js'
import { computed, inject, ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { formatDate } from '../../../../libs/shared'
import GraphFlow from './graph/GraphFlow.vue'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')
const tabStore = useGlobalStore('tabs')

const materialRequestStore = useGlobalStore('materialRequest')

const tableType = ref('pending-approval')

materialRequestStore.fetch()

const limitRows = 60

const data = computed(() => {
    return materialRequestStore.getData().slice(0, limitRows)
})

const getColumns = computed(() => {
    const columns = [
        { field: 'id', name: 'ID', align: 'left', customClass: '' },
        { field: 'request_user.name', name: 'Requester', align: 'left', customClass: '' },
        { field: 'approval_name', name: 'Manager approval', align: 'left', customClass: '' },
        { field: 'final_approval_name', name: 'Warehouse approval', align: 'left', customClass: '' },
        { field: 'supply_order_status.name', name: 'Status', align: 'left', customClass: '' },
        { field: 'requested_date', name: 'Requested', align: 'left', customClass: '' },
    ]

    return columns
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

// Action buttons for material request
const materialRequestActions = computed(() => {
    const actions = [
        {
            title: t('Pending approval'),
            icon: mdiInboxArrowDown,
            subtitle: t('Pending requests'),
            color: 'warning',
            quantityField: 'pending-approval',
            type: 'secondary',
            action: () => {
                tableType.value = 'pending-approval'
            }
        },
        {
            title: t('My requests'),
            icon: mdiInboxArrowDown,
            subtitle: t('Pending requests'),
            color: 'primary',
            quantityField: 'my-requests',
            type: 'secondary',
            action: () => {
                tableType.value = 'my-requests'
            }
        },
        {
            title: t('Pending receptions'),
            icon: CheckIcon,
            subtitle: t('View recent'),
            color: 'success',
            quantityField: 'pending-receptions',
            type: 'secondary',
            action: () => {
                tableType.value = 'pending-receptions'
            }
        },
    ]

    return actions
})

const openMaterialRequest = (materialRequest) => {
    const dispatchStatus = ['attended', 'awaiting-delivery-confirmation']

    if (dispatchStatus.includes(materialRequest.supply_order_status.slug)) {
        tabStore.openTab({ name: 'DispatchNote', params: { id: materialRequest.id } })

        return
    }

    tabStore.openTab({ name: 'ShowMaterialRequest', params: { id: materialRequest.id } })
}

</script>

<template>
    <div class="flex flex-col relative space-y-5 !pr-10">
        <div class="flex items-center justify-between space-x-2 mb-5">
            <div class="flex items-bottom">
                <Icon
                    size="sm"
                    :icon="mdiFileDocumentEdit"
                    class="mt-1 mr-2"/>

                <Title
                    :title="$t('Material requests')"
                    title-type="h2"
                    :has-border-bottom-line="false" />

                <Button
                    :icon="mdiRefresh"
                    :loading="materialRequestStore.fetching"
                    rounded
                    flat
                    color="info"
                    class="mt-2 ml-5 !py-0 !px-0"
                    @click="materialRequestStore.fetch()"
                    :class="`${materialRequestStore.fetching ? 'animate-spin' : ''}`"  />
            </div>

            <!-- <a class="link mt-3 !ml-5 !text-primary-500">{{ $t('View all material requests') }}</a> -->
        </div>

        <div>
            <GraphFlow />

            <Overlay
                v-if="materialRequestStore.fetching"
                size="14"/>

            <TableUI
                :columns="getColumns"
                :data="data"
                :multipleOpen="false" >
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
                                    v-if="['requester', 'super-admin', null].includes(coreStore.credentials?.user?.rol)"
                                    class="mt-2"
                                    :icon="mdiEyeOutline"
                                    size="lg"
                                    flat
                                    rounded
                                    color="secondary"
                                    iconClass="hover:text-green-500"
                                    @click="openMaterialRequest(row)" />

                                <Button
                                    v-if="['approval', 'super-admin', null].includes(coreStore.credentials?.user?.rol)"
                                    class="mt-2"
                                    :icon="mdiCheck"
                                    size="lg"
                                    flat
                                    rounded
                                    color="secondary"
                                    iconClass="hover:text-green-500"
                                    @click="openMaterialRequest(row)" />

                                <Button
                                    v-if="['approval-warehouse', 'super-admin', null].includes(coreStore.credentials?.user?.rol)"
                                    class="mt-2"
                                    :icon="mdiCheckAll"
                                    size="lg"
                                    flat
                                    rounded
                                    color="secondary"
                                    iconClass="hover:text-green-500"
                                    @click="openMaterialRequest(row)" />
                            </div>
                        </td>
                    </tr>
                </template>
            </TableUI>
        </div>
    </div>
</template>
