<script setup>
import { Card, EntityInformation, Title, ActionButtons, Slideover, ConfirmationModal } from 'layout'
import { computed, inject, onMounted, ref, watch } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { useI18n } from 'vue-i18n'
import { useDispatch as useComposable } from './useDispatch'
import { api } from '@/config'
import FinishDispatch from './FinishDispatch.vue'
import { BaseFormContainer } from 'form'
import { dispatchButtons } from './configRules'

import { isString } from 'lodash'

import DriverTravelGuidePrint from './DriverTravelGuidePrint.vue'

import { getRouteAndInitMap } from './map'

import {
    mdiTruck,
    mdiAccount,
    mdiPrinter,
    mdiCheckAll,
    mdiMapMarkerRadius,
    mdiDeleteEmpty,
    mdiPackageVariantClosed
} from '@mdi/js'

import { jsonLogic } from 'jsonRules'

import { showUuid } from 'shared'

const { t } = useI18n()

const props = defineProps({
    mode: {
        type: String,
        default: ''
    },
    dispatch: {
        type: Object,
        default: null
    }
})

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')
const finishDispatchRef = ref('')

const configSlideOver = ref({
    showAlert: false,
    open: false,
    close: false
})

const useDispatch = useComposable({ mode: props.mode, dispatch: props.dispatch })

const confirmConfig = ref({})

const {
    thread,
    transfers,
    vehicle,
    drivers,
    dispatchDate,
    loadings,
    dispatchId,
    errors,
    addTransfers,
    addVehicle,
    deleteDispatch,
    addDrivers,
    formatApiData,
    syncStores,
    validateData
} = useDispatch

rapidStore.$registerGlobalEvent(`selectedVehicle:${thread.value.idThread}`, addVehicle)

rapidStore.$registerGlobalEvent(`selectedDrivers:${thread.value.idThread}`, addDrivers)

rapidStore.$registerGlobalEvent(`addTransfers:${thread.value.idThread}`, addTransfers)

const currentTransfer = ref()

const removeDispatch = (transfer) => {
    confirmConfig.value = {
        description: t('Are you sure you want to cancel this trip plan.'),
        action: () => deleteDispatch('ShowDispatch')
    }

    currentTransfer.value = transfer

    notification.value = true
}

const send = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    loadings.value.finishButton = true

    const response = await api.post('transfers/program_dispatch_transfer', formatApiData())

    if (response.success && !response.errors) {
        syncStores()

        tabsStore.closeTab('ShowDispatch')
    }

    configSlideOver.value.close = !configSlideOver.value.close

    loadings.value.finishButton = false

    setButtonToLoading(false)
}

const rightButtons = computed(() => {
    return [
        {
            icon: mdiPrinter,
            classType: 'primary',
            label: t('Print travel plan'),
            spinner: !isString(mapImg.value) || isLoading.value || !isReady.value,
            disabled: !isString(mapImg.value) || isLoading.value || !isReady.value,
            action: print
        },
        {
            icon: mdiDeleteEmpty,
            classType: 'red',
            label: t('Cancel trip plan'),
            spinner: validateData.value.deleteButton,
            disabled: !jsonLogic.apply(dispatchButtons.delete, validateData.value),
            show: props.dispatch.dispatch_transfer_status.slug === 'pending-dispatch',
            action: async () => {
                await removeDispatch()
            }
        },
        {
            icon: mdiCheckAll,
            classType: 'primary',
            label: t('Reschedule'),
            spinner: validateData.value.finishButton,
            disabled: !dispatchId.value || validateData.value.saveButton,
            show: props.dispatch.dispatch_transfer_status.slug === 'pending-dispatch',
            action: async () => {
                configSlideOver.value.open = !configSlideOver.value.open
            }
        },
    ]
})

const notification = ref(false)

const showTransfer = (transfer, stepTransfer) => {
    tabsStore.openTab({ name: 'ShowTransfers', params: { id: transfer.id }, query: { ...thread.value, stepTransfer } })
}

const selectVehicle = () => {
    tabsStore.openTab({ name: 'DispatchVehicles', query: thread.value })
}

onMounted(() => {
    if (props.dispatch) {
        addVehicle(props.dispatch.vehicle, false)

        for (const transfer of props.dispatch.dispatch_transfer_details) {
            transfer.transfer && addTransfers(transfer.transfer, false)
        }

        addDrivers(props.dispatch.driver, false)

        dispatchDate.value = props.dispatch.dispatch_on
    }
})

const timeToWaitContent = 100

/**
 * PRINT SECTION
 */
let printableArea = {}

const isLoading = ref(false)

setTimeout(() => {
    printableArea = document.getElementById('printableArea')
}, timeToWaitContent)

const print = async () => {
    isLoading.value = true

    printableArea = document.getElementById('printableArea')

    const data = { data: printableArea.innerHTML }

    const response = await api.post('/pdf/manifest/create', data)

    response.success && downloadPDF(response)
}

const downloadPDF = async (response) => {
    const linkSource = `data:application/pdf;base64,${response.data.content}`

    const downloadLink = document.createElement('a')

    const fileName = response.data.name

    downloadLink.href = linkSource

    downloadLink.download = fileName

    downloadLink.click()

    isLoading.value = false
}

// Contains the data of the routes processed by the getRouteAndInitMap() method.
const routeData = ref({})

const mapImg = ref(null)

// Whenever there is a change in the transfers object, consult and render the map routes again.
watch(
    () => transfers.value,
    () => {
        mapImg.value = getRouteAndInitMap(transfers, routeData, mapImg)
    },
    { deep: true }
)

const isReady = ref(false)

const mapHeight = '420px'

const printViewPortDimensions = {
    'min-width': '1024px',
    'max-width': '1152px'
}
</script>

<template>
    <section class="full !pt-0">
        <div class="flex justify-end sticky top-0 z-10 overflow-y-hidden pr-5 bg-gray-100">
            <ActionButtons
                :items="rightButtons"
                class="bg-white" />
        </div>

        <!-- Confirmation modal to update facility selection -->
        <ConfirmationModal
            :description="confirmConfig.description"
            :title="$t('Confirmation')"
            v-model="notification"
            @confirm="confirmConfig.action"
            :confirmation-button-label="$t('Accept')"
            class="z-50" />

        <div class="grid grid-cols-12 gap-5 px-5">
            <!-- Transfers section -->
            <div class="col-span-12 lg:col-span-8 xl:col-span-9">
                <Card
                    :placeContentCenter="false"
                    class="max-w-full">
                    <!-- Custom header -->
                    <template v-slot:header>
                        <Title
                            :title="$t('Transfer information')"
                            :has-border-bottom-line="false" />

                            <span class="text-gray-400">
                                {{ transfers.rawData.length }} {{  $t('Transfers selected') }}
                            </span>
                    </template>

                    <div class="space-y-5">
                        <transition-group
                            name="list"
                            tag="p"
                            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 flex-wrap gap-10">
                            <div
                                v-for="(transfer, index) of transfers.rawData"
                                :key="index" class="relative group/item !h-full">
                                <div class="list-item w-full !h-full">
                                    <!-- Card transfers and items -->
                                    <Card class="!h-full !w-full cursor-pointer hover:bg-gray-100"
                                        @click="showTransfer(transfer)">
                                        <div class="flex flex-col gap-5">
                                            <div class="grid grid-cols-12 space-x-4 items-center">
                                                <div class="col-span-4">
                                                    <SvgIcon
                                                        type="mdi"
                                                        :path="mdiMapMarkerRadius"
                                                        class="h-14 w-14 mx-auto" />
                                                </div>

                                                <div class="col-span-8">
                                                    <Title
                                                        :title="$t('Destination') "
                                                        title-type="h3"
                                                        :has-border-bottom-line="false"
                                                        title-classes="text-gray-500" />

                                                    <Title
                                                        :title="transfer.destination_facility?.facility_name"
                                                        title-type="h1"
                                                        :has-border-bottom-line="false" />

                                                    <Title
                                                        :title="showUuid(transfer.id)"
                                                        title-type="h5"
                                                        :has-border-bottom-line="false"
                                                        title-classes="text-gray-400" />
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-12 space-x-4 items-center">
                                                <div class="col-span-4">
                                                    <SvgIcon
                                                        type="mdi"
                                                        :path="mdiPackageVariantClosed"
                                                        class="h-14 w-14 mx-auto" />
                                                </div>

                                                <div class="col-span-8">
                                                    <Title
                                                        :title="$t('Items')"
                                                        title-type="h3"
                                                        :has-border-bottom-line="false"
                                                        title-classes="text-gray-500" />

                                                    <Title
                                                        :title="transfer.item.length"
                                                        title-type="h2"
                                                        :has-border-bottom-line="false" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </transition-group>
                    </div>
                </Card>
            </div>

            <!-- Dispatch section -->
            <div class="col-span-12 lg:col-span-4 xl:col-span-3">
                <Card
                    class="max-w-full h-full"
                    :placeContentCenter="false">
                    <template v-slot:header>
                        <Title
                            :title="`${$t('Trip plan information')}`"
                            title-type="h2"
                            :has-border-bottom-line="false">

                            <template v-slot:rightTitle>
                                {{ dispatchId ? showUuid(dispatchId) : '' }}
                            </template>
                        </Title>
                    </template>

                    <div class="flex flex-col gap-5">
                        <BaseFormContainer
                            :errors="errors?.vehicle_id">
                            <!-- Vehicle -->
                            <EntityInformation
                                :title="vehicle.title"
                                :icon="mdiTruck"
                                :hasCard="!vehicle.data"
                                :action="!vehicle.data ? selectVehicle : null"
                                :name="vehicle.name"
                                :data="vehicle.data"
                                :custom-card-classes="{ '!bg-red-100': !!errors?.vehicle_id }">
                            </EntityInformation>
                        </BaseFormContainer>

                        <BaseFormContainer
                            :errors="errors?.drivers">
                            <div
                                v-if="drivers.rawData.length > 0"
                                class="space-y-5">
                                <Card
                                    :place-content-center="false"
                                    :has-padding="false"
                                    class="border-none shadow-none w-full">
                                    <div class="grid grid-cols-12 space-x-8 items-center">
                                        <!-- Icon -->
                                        <span class="col-span-2">
                                            <SvgIcon
                                                type="mdi"
                                                :path="mdiAccount"
                                                class="h-14 w-14 min-w-fit notPrintableArea" />
                                        </span>

                                        <div class="col-span-10">
                                            <div class="flex justify-between">
                                                <!-- Title -->
                                                <Title
                                                    :title="$t('Drivers')"
                                                    :has-border-bottom-line="false"
                                                    :has-padding="false"
                                                    title-type="h3" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <!-- Drivers list -->
                                <ul>
                                    <li v-for="(driver, index) of drivers.rawData"
                                        :key="index"
                                        class="border-y py-2">
                                        <div class="grid grid-cols-12 items-center">
                                            <div class="col-span-11">
                                                <div>
                                                    {{ driver.name }}
                                                </div>

                                                <div class="text-xs text-gray-400">
                                                    {{ driver.driver_license }}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </BaseFormContainer>
                    </div>
                </Card>
            </div>

            <!-- Map section -->
            <div class="col-span-12">
                <div
                    :class="{ 'invisible' : !routeData?.routes, 'visible' : routeData?.routes }"
                    class="w-full aspect-video"
                    :style="`height: ${mapHeight};`"
                    id="map" />
            </div>
        </div>

        <!-- Slideover for finish/program dispatch -->
        <Slideover
            :title="$t( !dispatch ? 'Finish dispatch': 'Reschedule')"
            :open="configSlideOver.open"
            :close="configSlideOver.close"
            has-cancel-button
            has-save-button
            :first-panel-save-button-title="finishDispatchRef?.message?.today ? $t('Dispatch trip plan now') : $t('Reschedule trip plan')"
            @clickOnSave="send">
            <!-- Finish dispatch form -->
            <FinishDispatch
                ref="finishDispatchRef"
                :useDispatch="useDispatch" />
        </Slideover>
    </section>

    <!-- PDF section -->
    <div
        class="relative h-max"
        v-show="!isReady">
        <!-- Overlay -->
        <div class="absolute top-0 left-0 w-full h-full !bg-white z-10">
        </div>

        <Card
            id="printableArea"
            hasMargins
            :placeContentCenter="false"
            :style="`min-width: ${printViewPortDimensions['min-width']}; max-width: ${printViewPortDimensions['max-width']};`"
            class="px-10 py-5 mx-auto relative">
            <DriverTravelGuidePrint
                v-if="routeData?.routes?.length"
                @isReady="isReady = true"
                :routeData="routeData.routes"
                :data="dispatch"
                :map-img="mapImg" />
        </Card>
    </div>
</template>

<style>
.list-item {
  display: inline-block;
}

.list-enter-active {
  transition: all .5s;
  transition-delay: .3s;
}

.list-leave-active {
  transition: all .5s;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
