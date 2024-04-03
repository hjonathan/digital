<script setup>
import { Card, EntityInformation, Title, ActionButtons, Button, TwoSectionsCard, ConfirmationModal, Slideover } from 'layout'
import { computed, inject, onMounted, ref, watch } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { useI18n } from 'vue-i18n'
import { useDispatch as useComposable } from './useDispatch'
import { api } from '@/config'
import FinishDispatch from './FinishDispatch.vue'
import { dispatchButtons } from './configRules'
import { BaseFormContainer } from 'form'

import {
    mdiTruck,
    mdiAccount,
    mdiPlus,
    mdiPrinter,
    mdiDeleteEmpty,
    mdiContentSave,
    mdiCheckAll,
    mdiClose,
    mdiMapMarkerRadius,
    mdiPackageVariantClosed,
    mdiTrashCanOutline
} from '@mdi/js'

import { jsonLogic } from 'jsonRules'
import { showUuid } from 'shared'

import { getRouteAndInitMap } from './map'

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

const editInformation = ref(false)
const slugPendingDispatch = 'pending-dispatch'

const useDispatch = useComposable({ mode: props.mode, dispatch: props.dispatch })

const confirmConfig = ref({})

const {
    thread,
    transfers,
    vehicle,
    drivers,
    dispatchDate,
    driversSelected,
    validateData,
    loadings,
    dispatchId,
    saveMessage,
    errorsValidation,
    addTransfers,
    addVehicle,
    addDrivers,
    save,
    deleteDispatch,
    formatApiData,
    syncStores,
    validateDataDispatch,
    vehicleValidation
} = useDispatch

rapidStore.$registerGlobalEvent(`selectedVehicle:${thread.value.idThread}`, addVehicle)

rapidStore.$registerGlobalEvent(`selectedDrivers:${thread.value.idThread}`, addDrivers)

rapidStore.$registerGlobalEvent(`addTransfers:${thread.value.idThread}`, addTransfers)

const removeDriver = (index) => {
    drivers.value.rawData.splice(index, 1)

    driversSelected.value = drivers.value.rawData

    rapidStore.$emitGlobalEvent(`selectedDriversSync:${thread.value.action}`)

    save()
}

const createTransfer = () => {
    tabsStore.openTab({ name: 'CreateTransfer', query: thread.value })
}

const currentTransfer = ref()

const removeTransfer = (transfer) => {
    confirmConfig.value = {
        description: t('Are you sure you want to delete this transfer.'),
        action: confirmRemoveTransfer
    }

    currentTransfer.value = transfer

    notification.value = true
}

const removeDispatch = (transfer) => {
    confirmConfig.value = {
        description: t('Are you sure you want to delete this dispatch.'),
        action: deleteDispatch
    }

    currentTransfer.value = transfer

    notification.value = true
}

const confirmRemoveTransfer = async () => {
    const response = await api.delete(`transfers/${currentTransfer.value.id}`)

    if (response.success && !response.errors) {
        const transferTabs = tabsStore.getTabs('transfers')

        const editTransferTab = transferTabs.find(tab => tab.name === 'EditTransfer' && tab.params.id === currentTransfer.value.id)

        const transferPosition = transfers.value.rawData.findIndex(t => t.id === currentTransfer.value.id)

        transfers.value.rawData.splice(transferPosition, 1)

        editTransferTab && tabsStore.closeTab('EditTransfer')

        save()
    }
}

const send = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    loadings.value.finishButton = true

    const response = await api.post('transfers/program_dispatch_transfer', formatApiData())

    if (response.success && !response.errors) {
        const tabName = props.dispatch ? 'EditDispatch' : 'CreateDispatch'

        syncStores()

        tabsStore.closeTab(tabName)
    }

    configSlideOver.value.close = !configSlideOver.value.close

    loadings.value.finishButton = false

    setButtonToLoading(false)
}

const rightButtons = computed(() => {
    return [
        {
            icon: mdiDeleteEmpty,
            classType: 'red',
            label: t('Delete'),
            spinner: validateData.value.deleteButton,
            disabled: !jsonLogic.apply(dispatchButtons.delete, validateData.value),
            action: async () => {
                await removeDispatch()
            }
        },
        {
            icon: mdiContentSave,
            classType: 'primary',
            label: t('Save progress'),
            spinner: validateData.value.saveButton,
            disabled: !jsonLogic.apply(dispatchButtons.saveProgress, validateData.value) || !editInformation.value,
            action: async () => {
                await save()
            }
        },
        {
            icon: mdiCheckAll,
            classType: 'primary',
            label: t('Schedule trip plan'),
            spinner: validateData.value.finishButton,
            disabled: !dispatchId.value || validateData.value.saveButton || vehicleValidation.value?.drivers || !editInformation.value,
            action: async () => {
                const response = await validateDataDispatch()

                !response && (configSlideOver.value.open = !configSlideOver.value.open)
            }
        },
    ]
})

const notification = ref(false)

const openEditTransfer = (transfer, stepTransfer) => {
    tabsStore.openTab({ name: 'EditTransfer', params: { id: transfer.id }, query: { ...thread.value, stepTransfer } })
}

const selectVehicle = () => {
    tabsStore.openTab({ name: 'DispatchVehicles', query: thread.value })
}

const selectDrivers = () => {
    tabsStore.openTab({ name: 'DispatchDrivers', query: thread.value })

    rapidStore.$emitGlobalEvent(`selectedDriversSync:${thread.value.action}`)
}

onMounted(() => {
    editInformation.value = props.dispatch?.dispatch_transfer_status?.slug !== slugPendingDispatch

    if (props.dispatch) {
        addVehicle(props.dispatch.vehicle, editInformation.value)

        for (const transfer of props.dispatch.dispatch_transfer_details) {
            transfer.transfer && addTransfers(transfer.transfer, false)
        }

        addDrivers(props.dispatch.driver, editInformation.value)

        dispatchDate.value = props.dispatch.dispatch_on
    }
})

// Contains the data of the routes processed by the getRouteAndInitMap() method.
const routeData = ref({})

// Whenever there is a change in the transfers object, consult and render the map routes again.
watch(
    () => transfers.value,
    () => {
        getRouteAndInitMap(transfers, routeData)
    },
    { deep: true }
)
</script>

<template>
    <div class="flex justify-end sticky top-0 z-10 overflow-y-hidden pr-5  bg-slate-100">
        <ActionButtons :items="rightButtons" class="bg-white"/>
    </div>

     <!-- Confirmation modal to update facility selection -->
     <ConfirmationModal
        :description="confirmConfig.description"
        :title="$t('Confirmation')"
        v-model="notification"
        @confirm="confirmConfig.action"
        :confirmation-button-label="$t('Accept')"
        class="z-50" />

    <section class="full !pt-0">
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
                            :has-border-bottom-line="false"/>

                            <span class="text-gray-400">
                                {{ transfers.rawData?.length }} {{ transfers.rawData?.length === 1 ? $t('Transfer') : $t('Transfers') }} {{ $t('in this trip plan') }}
                            </span>
                    </template>

                    <div class="space-y-5">
                        <transition-group
                            name="list"
                            tag="div"
                            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 flex-wrap gap-10">
                            <div
                                v-for="(transfer, index) of transfers.rawData"
                                :key="index"
                                class="relative group/item !h-full">
                                <div class="list-item w-full !h-full">
                                    <!-- Card transfers and items -->
                                    <TwoSectionsCard
                                        :topSectionTitle="$t('Destination')"
                                        :topSectionContent="transfer.destination_facility?.facility_name"
                                        :bottomSectionTitle="$t('Items')"
                                        :bottomSectionContent="transfer.item?.length"
                                        :top-section-icon="mdiMapMarkerRadius"
                                        :bottom-section-icon="mdiPackageVariantClosed"
                                        @clickInTopSection="editInformation ? openEditTransfer(transfer, 'destination') : void 0"
                                        @clickInBottomSection="editInformation ?  openEditTransfer(transfer, 'items') : void 0"
                                        class="!h-full !w-full">
                                        <!-- Top section -->
                                        <template v-slot:topSection>
                                            <div class="grid grid-cols-12 space-x-4 items-center px-5 !h-full group/top pb-5">
                                                <div class="col-span-4">
                                                    <SvgIcon
                                                        type="mdi"
                                                        :path="mdiMapMarkerRadius"
                                                        class="h-14 w-14 mx-auto" />
                                                </div>

                                                <div class="col-span-8">
                                                    <Title
                                                        :title="$t('Destination')"
                                                        title-type="h3"
                                                        :has-border-bottom-line="false"
                                                        title-classes="text-gray-500 group-hover/top:!text-white"/>

                                                    <Title
                                                        :title="transfer.destination_facility?.facility_name"
                                                        title-type="h1"
                                                        :has-border-bottom-line="false"/>

                                                    <Title
                                                        :title="showUuid(transfer.id)"
                                                        title-type="h5"
                                                        :has-border-bottom-line="false"
                                                        title-classes="text-gray-400 group-hover/top:!text-white"/>
                                                </div>
                                            </div>
                                        </template>

                                        <template v-slot:bottomSection>
                                            <div class="grid grid-cols-12 space-x-4 items-center px-5 group/bottom py-4 h-full">
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
                                                        title-classes="text-gray-500 group-hover/bottom:!text-white" />

                                                    <Title
                                                        :title="transfer.item?.length"
                                                        title-type="h2"
                                                        :has-border-bottom-line="false" />
                                                </div>
                                            </div>
                                        </template>
                                    </TwoSectionsCard>

                                    <div
                                        v-if="editInformation"
                                        class="absolute -top-3.5 -right-3.5 invisible group-hover/item:visible">
                                        <Button
                                            size="xs"
                                            color="danger"
                                            rounded
                                            outline
                                            :icon="mdiClose"
                                            class="hover:!bg-red-500 hover:!text-white "
                                            @click="removeTransfer(transfer)" />
                                    </div>
                                </div>
                            </div>

                            <!-- Add transfer -->
                            <BaseFormContainer
                                v-if="editInformation"
                                container-class="none !p-0 !m-0"
                                :errors="errorsValidation?.transfers"
                                key="addTransfer">
                                <Card
                                    :class="{
                                        '!h-min-96 !h-full text-primary-300 cursor-pointer border-2 !border-primary-300 border-dashed': true,
                                        'hover:text-primary-500 hover:!border-primary-500': true,
                                        '!bg-red-100': errorsValidation?.transfers }"
                                    @click="createTransfer">
                                    <!-- Icon -->
                                    <SvgIcon
                                        type="mdi"
                                        :path="mdiPlus"
                                        class="h-16 w-16 mx-auto" />

                                    <Title
                                        :title="$t('Add transfer')"
                                        :hasBorderBottomLine="false"
                                        titleType="h3" />
                                </Card>
                            </BaseFormContainer>
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

                        <!-- Autosave message -->
                        <span :class="{
                                'text-gray-400' : saveMessage?.type === 'default' || !saveMessage,
                                'text-success-600' : saveMessage?.type === 'success',
                                'text-red-600' : saveMessage?.type === 'danger',
                            }"
                            class="font-semibold">
                            {{ saveMessage ? saveMessage.label : $t('Pending save') }}
                        </span>
                    </template>

                    <div class="flex flex-col gap-5">
                        <BaseFormContainer
                            :errors="errorsValidation?.vehicle_id">
                            <!-- Vehicle -->
                            <EntityInformation
                                :title="vehicle.title"
                                :icon="mdiTruck"
                                :hasCard="!vehicle.data"
                                :action="!vehicle.data ? selectVehicle : null"
                                :name="vehicle.name"
                                :data="vehicle.data"
                                :custom-card-classes="{ '!bg-red-100': !!errorsValidation?.vehicle_id }">
                                    <div v-if="!vehicle.data">
                                        {{ $t('Please select a vehicle') }}
                                    </div>

                                <!-- Change vehicle -->
                                <button
                                    v-if="vehicle.data && editInformation"
                                    @click="selectVehicle"
                                    class="link primary notPrintableArea mt-2">
                                    {{ $t('Change') }}
                                </button>
                            </EntityInformation>
                        </BaseFormContainer>

                        <BaseFormContainer
                            :errors="errorsValidation?.drivers || vehicleValidation?.drivers">
                            <!-- Drivers -->
                            <EntityInformation
                                v-if="!drivers.rawData?.length"
                                :hasCard="true"
                                :title="$t('Drivers')"
                                :action="selectDrivers"
                                :icon="mdiAccount"
                                :custom-card-classes="{ '!bg-red-100': !!errorsValidation?.drivers || !!vehicleValidation?.drivers }">
                                <div>
                                    {{ $t('Please select drivers') }}
                                </div>
                            </EntityInformation>

                            <div
                                v-if="drivers.rawData?.length"
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
                                                    title-type="h3"/>

                                                <!-- Change drivers -->
                                                <button
                                                    v-if="drivers.rawData?.length > 0 && editInformation"
                                                    @click="selectDrivers"
                                                    class="link primary notPrintableArea">
                                                    {{ $t('Add drivers') }}
                                                </button>
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
                                                <div class="weig">{{ driver.name }}</div>

                                                <div class="text-xs text-gray-400">{{ driver.driver_license }}</div>
                                            </div>

                                            <!-- Driver actions -->
                                            <div
                                                v-if="editInformation"
                                                class="col-span-1">
                                                <Button
                                                    :icon="mdiTrashCanOutline"
                                                    size="lg"
                                                    flat
                                                    rounded
                                                    color="secondary"
                                                    iconClass="hover:text-red-500"
                                                    @click="removeDriver(index)" />
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
                    id="map"
                    style="height: 500px;" />
            </div>
        </div>

        <!-- Slideover for finish/program dispatch -->
        <Slideover
            :title="$t('Schedule trip plan')"
            :open="configSlideOver.open"
            :close="configSlideOver.close"
            has-cancel-button
            has-save-button
            :first-panel-save-button-title="finishDispatchRef?.message?.today ? $t('Dispatch trip plan now') : $t('Schedule trip plan')"
            @clickOnSave="send">
            <!-- Finish dispatch form -->
            <FinishDispatch
                ref="finishDispatchRef"
                :useDispatch="useDispatch" />
        </Slideover>
    </section>
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
