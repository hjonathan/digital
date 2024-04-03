<script setup>
import { Title, Badge, Button, Overlay } from 'layout'
import { computed, inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate, getSessionJSON, round, showUuid } from 'shared'
import { dashboardRules } from './configRules'
import { jsonLogic } from 'jsonRules'
import NoItemsFound from '../../components/NoItemsFound.vue'
import SvgIcon from '@jamescoyle/vue-icon'
import ActionCardSquare from './ActionCardSquare.vue'
import ActionCard from './ActionCard.vue'
import {
    TruckIcon,
    AdjustmentsVerticalIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    PaperAirplaneIcon,
    ClockIcon
} from '@heroicons/vue/24/outline'
import {
    mdiEyeOutline,
    mdiPencil,
    mdiFormatListCheckbox,
    mdiTruck,
    mdiTruckFastOutline,
    mdiFileDocumentEditOutline,
    mdiRefresh,
    mdiInboxArrowDown,
    mdiFormatListBulleted,
    mdiArchiveSearch
} from '@mdi/js'
import { getBadgeColor } from '../configColors'

const { t } = useI18n()
const useGlobalStore = inject('useGlobalStore')

const tabsStore = useGlobalStore('tabs')
const transfersStore = useGlobalStore('transfers')
const dispatchesStore = useGlobalStore('dispatches')
const facilitiesStore = useGlobalStore('facilities')

transfersStore.fetch()
dispatchesStore.fetch()

const transferTable = ref({
    visible: true,
    color: 'info',
    type: 'incoming',
    rowsTable: 10
})

const dispatchTable = ref({
    visible: true,
    color: 'info',
    type: 'drafts',
    rowsTable: 10
})

const backgroundHeaderTable = {
    primary: '!bg-primary-500/25',
    info: '!bg-sky-500/25',
    success: '!bg-teal-500/25',
    warning: '!bg-yellow-500/25',
    danger: '!bg-red-500/25',
    // extra colors
    orange: '!bg-orange-500/25'

}

const factorySlug = 'factory'

const facilityId = getSessionJSON('facility_id')

// Action buttons for transfers
const transferActions = computed(() => {
    const facilities = facilitiesStore.getData()

    const actions = [
        {
            title: t('View all'),
            icon: mdiFormatListBulleted,
            subtitle: t('View all transfers'),
            color: 'primary',
            type: 'main',
            action: () => {
                tabsStore.openTab({ name: 'TransfersAll' })
            }
        },
        // Second actions
        {
            title: t('Arriving'),
            icon: mdiInboxArrowDown,
            subtitle: t('View recent'),
            color: 'info',
            quantityField: 'incoming',
            type: 'secondary',
            action: () => {
                transferTable.value.type !== 'incoming' && animateTransferTable()

                transferTable.value.type = 'incoming'

                transferTable.value.color = 'info'
            }
        },
        {
            title: t('Pending content verification'),
            icon: CheckIcon,
            subtitle: t('View recent'),
            color: 'warning',
            quantityField: 'received',
            type: 'secondary',
            action: () => {
                transferTable.value.type !== 'received' && animateTransferTable()

                transferTable.value.type = 'received'

                transferTable.value.color = 'warning'
            }
        },
        {
            title: t('Pending adjustment'),
            icon: AdjustmentsVerticalIcon,
            subtitle: t('View recent'),
            color: 'orange',
            quantityField: 'adjustment',
            type: 'secondary',
            action: () => {
                transferTable.value.type !== 'adjustment' && animateTransferTable()

                transferTable.value.type = 'adjustment'

                transferTable.value.color = 'orange'
            }
        },
        {
            title: t('Sent'),
            icon: PaperAirplaneIcon,
            subtitle: t('View recent'),
            color: 'success',
            quantityField: 'sended',
            type: 'secondary',
            action: () => {
                transferTable.value.type !== 'sended' && animateTransferTable()

                transferTable.value.type = 'sended'

                transferTable.value.color = 'success'
            }
        },
        {
            title: t('Items found'),
            icon: MagnifyingGlassIcon,
            subtitle: t('View recent'),
            color: 'primary',
            quantityField: 'itemsFound',
            type: 'secondary',
            action: () => {
                transferTable.value.type !== 'itemsFound' && animateTransferTable()

                transferTable.value.type = 'itemsFound'

                transferTable.value.color = 'primary'
            }
        },
    ]

    if (facilityId && facilities.length) {
        const currentFacility = facilities.find(facility => facility.id === facilityId)

        if (currentFacility?.facility_type?.slug === factorySlug) {
            actions.unshift({
                title: t('Lost & found'),
                icon: mdiArchiveSearch,
                subtitle: t('Did you find something?'),
                color: 'primary',
                type: 'main',
                action: () => {
                    tabsStore.openTab({ name: 'CreateAssignment' })
                }
            })
        }
    }

    return actions
})

// Action buttons for dispatch
const dispatchActions = ref([
    {
        title: t('Create trip plan'),
        icon: TruckIcon,
        subtitle: t('New trip plan'),
        color: 'primary',
        type: 'main',
        customClasses: '',
        action: () => {
            tabsStore.openTab({ name: 'CreateDispatch' })
        }
    },
    {
        title: t('View all'),
        icon: TruckIcon,
        subtitle: t('View all trip plans'),
        color: 'primary',
        type: 'main',
        action: () => {
            tabsStore.openTab({ name: 'Dispatches', alias: 'Trip plans' })
        }
    },
    // Second actions
    {
        title: t('Drafts'),
        icon: mdiFileDocumentEditOutline,
        subtitle: t('View recent'),
        color: 'info',
        quantityField: 'drafts',
        type: 'secondary',
        action: () => {
            dispatchTable.value.type !== 'drafts' && animateDispatchTable()

            dispatchTable.value.type = 'drafts'

            dispatchTable.value.color = 'info'
        }
    },
    {
        title: t('In transit'),
        icon: mdiTruckFastOutline,
        subtitle: t('View recent'),
        color: 'success',
        quantityField: 'in-transit',
        type: 'secondary',
        action: () => {
            dispatchTable.value.type !== 'in-transit' && animateDispatchTable()

            dispatchTable.value.type = 'in-transit'

            dispatchTable.value.color = 'success'
        }
    },
    {
        title: t('Scheduled'),
        icon: ClockIcon,
        subtitle: t('View recent'),
        color: 'warning',
        quantityField: 'pending-dispatch',
        type: 'secondary',
        action: () => {
            dispatchTable.value.type !== 'pending-dispatch' && animateDispatchTable()

            dispatchTable.value.type = 'pending-dispatch'

            dispatchTable.value.color = 'warning'
        }
    },
])

// Animations for dispatch table
const animateDispatchTable = () => {
    dispatchTable.value.visible = false

    dispatchTable.value.rowsTable = 10

    setTimeout(() => (dispatchTable.value.visible = true), 100)
}

// Animations for transfers table
const animateTransferTable = () => {
    transferTable.value.visible = false

    transferTable.value.rowsTable = 10

    setTimeout(() => (transferTable.value.visible = true), 100)
}

// List and count transfers
const transfers = computed(() => {
    const transfersData = transfersStore.getData() || []

    const allData = {
        items: transfersData.filter(transfer => jsonLogic.apply(dashboardRules[transferTable.value.type], transfer)).slice(0, transferTable.value?.rowsTable),
        quantities: {}
    }

    for (const transferAction of transferActions.value) {
        if (transferAction.quantityField) {
            const transfersFiltered = transfersData.filter(transfer => jsonLogic.apply(dashboardRules[transferAction.quantityField], transfer)).length

            allData.quantities[transferAction.quantityField] = transfersFiltered
        }
    }

    return allData
})

// List and count dispatches
const dispatches = computed(() => {
    const dispatchesData = dispatchesStore.getData() || []

    let ruleTable = dashboardRules.draftDispatches

    dispatchTable.value.type === 'drafts' && (ruleTable = dashboardRules.draftDispatches)

    dispatchTable.value.type === 'in-transit' && (ruleTable = dashboardRules.intransitDispatches)

    dispatchTable.value.type === 'pending-dispatch' && (ruleTable = dashboardRules.pendingDispatches)

    return {
        items: dispatchesData.filter(dispatch => jsonLogic.apply(ruleTable, dispatch)).slice(0, dispatchTable.value.rowsTable),
        quantities: {
            drafts: dispatchesData.filter(dispatch => jsonLogic.apply(dashboardRules.draftDispatches, dispatch)).length,
            'in-transit': dispatchesData.filter(dispatch => jsonLogic.apply(dashboardRules.intransitDispatches, dispatch)).length,
            'pending-dispatch': dispatchesData.filter(dispatch => jsonLogic.apply(dashboardRules.pendingDispatches, dispatch)).length
        }

    }
})

const openDispatch = (dispatch) => {
    tabsStore.openTab({ name: 'EditDispatch', params: { id: dispatch.id } })
}

const showDispatch = (dispatch) => {
    tabsStore.openTab({ name: 'ShowDispatch', params: { id: dispatch.id } })
}

const openReceive = (transfer) => {
    if (['returned', 'completed', 'adjustment-approved', 'pending-dispatch'].includes(transfer.transfer_status?.slug)) {
        tabsStore.openTab({ name: 'ShowTransfers', params: { id: transfer.id } })

        return
    }

    if (['in-transit', 'received', 'in-transit-rejected'].includes(transfer.transfer_status?.slug)) {
        tabsStore.openTab({ name: 'Receive', params: { id: transfer.id } })

        return
    }

    if (['pending-adjustment-approval-origin', 'adjustment-rejected', 'items-found-pending-approval'].includes(transfer.transfer_status?.slug)) {
        tabsStore.openTab({ name: 'Adjustments', params: { id: transfer.id } })

        return
    }

    tabsStore.openTab({ name: 'Receive', params: { id: transfer.id } })
}

const getTransfersCount = (transfers) => {
    const transfersCount = transfers.filter(transfer => transfer.transfer)

    return transfersCount.length
}

const getItemsCount = (transfers) => {
    const transfersCount = transfers.filter(transfer => transfer.transfer)

    let itemsCount = 0

    for (const transfer of transfersCount) {
        if (transfer.transfer) itemsCount += transfer.transfer?.item?.length || 0
    }

    return itemsCount
}

const getTotalCost = (itemsTransfer) => {
    let cotalCost = 0

    for (const item of itemsTransfer) {
        cotalCost += (item.cost * item.quantity) || 0
    }

    return round(cotalCost)
}

const getTotalItems = (itemsTransfer) => {
    return itemsTransfer.length
}
</script>

<template>
    <section>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x-4 divide-gray-300">
            <!-- Dispatches  -->
            <div class="sm:col-span-1 lg:col-span-2 flex flex-col gap-5 sm:pr-10">
                <!-- Title -->
                <div class="flex items-center space-x-4">
                    <svg-icon
                        type="mdi"
                        :path="mdiTruck"
                        class="h-10 w-10 mt-1" />

                    <Title
                        :has-border-bottom-line="false"
                        :title="$t('Trip plans')"
                        class="col-span-1 sm:col-span-2 lg:col-span-4"/>
                </div>

                <div class="grid grid-cols-1 2xl:grid-cols-2 w-full gap-5 mb-10">
                    <ActionCard
                        v-for="(item, index) of dispatchActions.filter(x => x.type === 'main')"
                        :key="index"
                        :title="item.title"
                        :subtitle="item.subtitle"
                        :icon="item.icon"
                        :action="item.action"
                        :class="item.customClasses" />
                </div>

                <div class="flex flex-row space-x-5">
                    <!-- Title -->
                    <Title
                        :title="$t('Most recent trip plans')"
                        title-type="h2"
                        :has-border-bottom-line="false"
                        :has-padding="false" />

                    <Button
                        :icon="mdiRefresh"
                        :loading="dispatchesStore.fetching"
                        rounded
                        flat
                        color="info"
                        class="!py-0 !px-0"
                        @click="dispatchesStore.fetch()"
                        :class="`${dispatchesStore.fetching ? 'animate-spin' : ''}`"  />
                </div>

                <div class="flex flex-col relative space-y-5">
                    <!-- Action cards for disptaches -->
                    <div class="flex flex-row w-full overflow-x-scroll">
                        <Overlay
                            v-if="dispatchesStore.fetching"
                            size="14"/>

                        <div
                            v-for="(item, index) of dispatchActions.filter(x => x.type === 'secondary')"
                            :key="index"
                            class="flex-none w-48 2xl:w-4/12 h-full pr-2">
                            <ActionCardSquare
                                :title="item.title"
                                :subtitle="item.subtitle"
                                :icon="item.icon"
                                :color="item.color"
                                :action="item.action"
                                :active="item.quantityField === dispatchTable.type"
                                :quantity="dispatches.quantities[item.quantityField]" />
                        </div>
                    </div>

                    <!-- Dispatches table -->
                    <transition
                        name="disptach">
                        <div
                            v-if="dispatchTable.visible"
                            class="border-t border-gray-100 space-y-2 overflow-x-auto relative">
                            <table class="!min-w-[700px]">
                                <thead :class="backgroundHeaderTable[dispatchTable.color]">
                                    <th class="w-2/12 text-start p-4">{{ $t('Dispatch ID') }}</th>
                                    <th class="w-2/12 text-start">{{ $t('Vehicle') }}</th>
                                    <th class="w-2/12 text-start">{{ $t('Transfers') }}</th>
                                    <th class="w-2/12 text-start">{{ $t('Destination') }}</th>
                                    <th class="w-2/12 text-start">
                                        <span v-if="dispatchTable.type === 'drafts'">{{ $t('Last modified') }}</span>
                                        <span v-if="dispatchTable.type === 'in-transit'">{{ $t('Dispatched on') }}</span>
                                        <span v-if="dispatchTable.type === 'pending-dispatch'">{{ $t('Schedule date') }}</span>
                                    </th>
                                    <th class="w-1/12 text-start">{{ $t('Status') }}</th>
                                    <th class="w-1/12 text-start"></th>
                                </thead>

                                <tbody v-if="dispatches.items.length">
                                    <tr
                                        v-for="(dispatch, index) of dispatches.items"
                                        :key="index">
                                        <td class="px-4 py-6">
                                            {{ showUuid(dispatch.id) }}
                                        </td>

                                        <td>
                                            <div class="flex flex-col">
                                                <span class="font-bold">{{ dispatch.vehicle?.model }}</span>
                                                <span>{{ dispatch.vehicle?.make }}</span>
                                                <span>{{ dispatch.vehicle?.license_plate }}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div class="flex flex-col">
                                                <div>
                                                    <span class="font-bold">
                                                        {{ $t('Total transfers') }}:
                                                    </span>

                                                    {{ getTransfersCount(dispatch.dispatch_transfer_details) }}
                                                </div>

                                                <div>
                                                    <span class="font-bold">
                                                        {{ $t('Total items') }}:
                                                    </span>

                                                    {{ getItemsCount(dispatch.dispatch_transfer_details) }}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="flex flex-col">
                                                <div
                                                    v-for="(transfer, index) of dispatch?.dispatch_transfer_details"
                                                    :key="index">
                                                    <span v-if="transfer.transfer" >{{ transfer.transfer?.destination_facility?.facility_name }}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span v-if="dispatchTable.type === 'drafts'">{{ formatDate(dispatch.updated_at, 'diffForHumans')  }}</span>
                                            <span v-if="dispatchTable.type !== 'drafts'">{{ formatDate(dispatch.dispatch_on_format, 'diffForHumans')  }}</span>
                                        </td>
                                        <td>
                                            <Badge :type="getBadgeColor(dispatch)">
                                                {{ dispatch.dispatch_transfer_status?.name }}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                v-if="['in-transit', 'pending-dispatch'].includes(dispatch.dispatch_transfer_status?.slug)"
                                                :icon="mdiEyeOutline"
                                                size="lg"
                                                flat
                                                rounded
                                                :color="getBadgeColor(dispatch)"
                                                iconClass="hover:text-primary-500"
                                                @click="showDispatch(dispatch)" />

                                            <Button
                                                v-if="!['in-transit', 'pending-dispatch'].includes(dispatch.dispatch_transfer_status?.slug)"
                                                :icon="mdiPencil"
                                                size="lg"
                                                flat
                                                rounded
                                                :color="getBadgeColor(dispatch)"
                                                iconClass="hover:text-primary-500"
                                                @click="openDispatch(dispatch)" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- No items found -->
                            <NoItemsFound
                                class="!w-12/12"
                                v-if="!dispatches.items.length"
                                :description="$t('No dispatches found')"/>

                            <!-- Show all -->
                            <div class="flex justify-end">
                                <Button
                                    v-if="dispatchTable.rowsTable === 10 && dispatches.quantities[dispatchTable.type] > 10"
                                    flat
                                    primary
                                    color="secondary"
                                    :label="$t('Show all')"
                                    @click="dispatchTable.rowsTable = 100" />
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

            <!-- Receptions  -->
            <div class="sm:col-span-1 lg:col-span-2 flex flex-col gap-5 sm:pl-10">
                <!-- Title -->
                <div class="flex items-center space-x-4">
                    <svg-icon
                        type="mdi"
                        :path="mdiFormatListCheckbox"
                        class="h-10 w-10 mt-1" />

                    <Title
                        :has-border-bottom-line="false"
                        :title="$t('Transfers')"
                        class="col-span-1 sm:col-span-2 lg:col-span-4"/>
                </div>

                <div class="grid grid-cols-1 2xl:grid-cols-2 w-full gap-5 mb-10">
                    <ActionCard
                        v-for="(item, index) of transferActions.filter(x => x.type === 'main')"
                        :key="index"
                        :title="item.title"
                        :subtitle="item.subtitle"
                        :icon="item.icon"
                        :action="item.action" />
                </div>

                <div class="flex flex-row space-x-5">
                    <!-- Title -->
                    <Title
                        :title="$t('Most recent transfers')"
                        title-type="h2"
                        :has-border-bottom-line="false"
                        :has-padding="false" />

                    <Button
                        :icon="mdiRefresh"
                        :loading="transfersStore.fetching"
                        rounded
                        flat
                        color="info"
                        class="!py-0 !px-0"
                        @click="transfersStore.fetch()"
                        :class="`${transfersStore.fetching ? 'animate-spin' : ''}`" />
                </div>

                <div class="flex flex-col relative space-y-5">
                    <!-- Action cards for transfers -->
                    <div class="flex flex-row w-full overflow-x-scroll">
                        <!-- Overlay loading -->
                        <Overlay
                            v-if="transfersStore.fetching"
                            size="14"/>

                        <div
                            v-for="(item, index) of transferActions.filter(x => x.type === 'secondary')"
                            :key="index"
                            class="flex-none w-48 2xl:w-3/12 h-full px-2">
                            <ActionCardSquare
                                :title="item.title"
                                :subtitle="item.subtitle"
                                :icon="item.icon"
                                :color="item.color"
                                :action="item.action"
                                :active="item.quantityField === transferTable.type"
                                :quantity="transfers.quantities[item.quantityField]"
                                class="!w-min-96" />
                        </div>
                    </div>

                    <!-- Transfer receive table -->
                    <transition
                        name="transfer-animation">
                        <div
                            v-if="transferTable.visible"
                            class="border-t border-gray-100 space-y-2 overflow-x-auto relative">
                            <table class="!min-w-[700px]">
                                <thead :class="backgroundHeaderTable[transferTable.color]">
                                    <th class="w-2/12 text-start p-4">{{ $t('Transfer ID') }}</th>
                                    <th class="w-2/12 text-start">{{ $t('Origin') }}</th>
                                    <th class="w-2/12 text-start">{{ $t('Destination') }}</th>
                                    <th
                                        v-if="!['itemsFound'].includes(transferTable.type)"
                                        class="w-2/12 text-start">{{ $t('Trip plan') }}</th>
                                    <th class="w-2/12 text-start">{{ $t('Items') }}</th>
                                    <th class="w-2/12 text-start">{{ $t('Status') }}</th>
                                    <th class="w-1/12 text-start"></th>
                                </thead>

                                <tbody v-if="transfers.items.length">
                                    <tr
                                        v-for="(transfer, index) of transfers.items"
                                        :key="index"
                                        class="border-b border-gray-200 text-sm">
                                        <td class="px-4 py-6">{{ showUuid(transfer.id) }}</td>
                                        <td>{{ transfer.origin_facility?.facility_name }}</td>
                                        <td>{{ transfer.destination_facility?.facility_name }}</td>
                                        <td v-if="!['itemsFound'].includes(transferTable.type)">
                                            <div
                                                v-if="transfer.dispatch_transfer_details?.length"
                                                class="flex flex-col">
                                                <div>
                                                    <span class="font-bold">
                                                        {{ $t('Trip plan') }}:
                                                    </span>

                                                    <button
                                                        :class="`${transfer.origin_facility?.id === facilityId ? 'link !text-primary-500' : '!cursor-auto'}`"
                                                        @click="transfer.origin_facility?.id === facilityId && showDispatch(transfer.dispatch_transfer_details[0]?.dispatch_transfer)">
                                                        {{ showUuid(transfer.dispatch_transfer_details[0]?.dispatch_transfer?.id) }}
                                                    </button>
                                                </div>

                                                <div>
                                                    <span class="font-bold">
                                                        {{ $t('Dispatched on') }}:
                                                    </span>
                                                    {{ formatDate(transfer.dispatch_transfer_details[0]?.dispatch_transfer?.dispatch_on_format, 'diffForHumans')  }}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="flex flex-col">
                                                <div>
                                                    <span class="font-bold">
                                                        {{ $t('Total cost') }}:
                                                    </span>

                                                    ${{ getTotalCost(transfer.item_transfers) }}
                                                </div>

                                                <div>
                                                    <span class="font-bold">
                                                        {{ $t('Total items') }}:
                                                    </span>

                                                    {{ getTotalItems(transfer.item_transfers) }}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge :type="getBadgeColor(transfer)">
                                                {{ transfer.transfer_status?.name }}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                :icon="mdiEyeOutline"
                                                size="lg"
                                                flat
                                                rounded
                                                :color="getBadgeColor(transfer)"
                                                iconClass="hover:text-primary-500"
                                                @click="openReceive(transfer)" />
                                        </td>
                                    </tr>
                                </tbody>

                            </table>

                            <!-- No items found -->
                            <NoItemsFound
                                v-if="!transfers.items.length"
                                :description="$t('No transfers found')" />

                            <!-- Show all -->
                            <div class="flex justify-end">
                                <Button
                                    v-if="transferTable.rowsTable === 10 && transfers.quantities[transferTable.type] > 10"
                                    flat
                                    color="primary"
                                    :label="$t('Show all')"
                                    @click="transferTable.rowsTable = 100" />
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.disptach-enter-from {
    transition: 0.2s linear;
    transform: translate(-100%, 0);
}

.disptach-enter-active,
.disptach-leave-active {
    transition: 0.2s linear;
}

.transfer-animation-enter-from {
    transition: 0.2s linear;
    transform: translate(+100%, 0);
}

.transfer-animation-enter-active,
.transfer-animation-leave-active {
    transition: 0.2s linear;
}

</style>
