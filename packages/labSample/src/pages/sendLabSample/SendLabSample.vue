<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { downloadBase64PDF, showUuid } from 'shared'
import { ShowValue } from 'form'
import { mdiDomain, mdiPrinter, mdiSend } from '@mdi/js'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'

import {
    Card,
    Overlay,
    ActionButtons,
    EntityInformation,
    Title,
    CardHeader
} from 'layout'

const { t } = useI18n()

defineProps({
    invoice: {
        type: Object,
        default: null
    },
    mode: {
        type: String,
        default: 'edit'
    }
})

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const labResultsStore = useGlobalStore('labResults')
const inventoryStore = useGlobalStore('inventory')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const idThread = router.currentRoute.value.query?.id ? 'edit-invoice' : 'create-invoice'
const type = router.currentRoute.value.query?.type || 'send'

const labSampleLaboratories = ref(type === 'send' ? [null] : [null, null])
const labNumber = ref(0)

const data = ref({})
const labSampleLaboratory = ref()

// Config for button list
const loadings = ref({
    printButton: false,
    sendButton: false
})

const itemData = ref()

const syncLabSampleLaboratory = (newLabSampleLaboratory) => {
    labSampleLaboratories.value[labNumber.value] = newLabSampleLaboratory
}

// Register events to sync data from other tab
rapidStore.$registerGlobalEvent('selectedLabSampleLaboratorySync', syncLabSampleLaboratory)

const addLaboratory = (index) => {
    labNumber.value = index

    tabsStore.openTab({ name: 'LabSampleLaboratories', query: { idThread } })
}

const print = async () => {
    loadings.value.printButton = true

    const printableArea = document.getElementById('printableArea')

    const data = { data: printableArea.innerHTML }

    const response = await api.post('pdf/create', data)

    !response.success && (loadings.value.printButton = false)

    response.success && downloadBase64PDF(response.data.content, 'SendLabSample.pdf')

    loadings.value.printButton = false
}

const send = async () => {
    loadings.value.saveButton = true

    let ids = router.currentRoute.value.query?.id

    Array.isArray(ids) && (ids = ids[0])

    let apiData = {}

    type === 'send' && (apiData = {
        item_id: ids,
        laboratory_id: labSampleLaboratories.value[0].id
    })

    type !== 'send' && (apiData = {
        item_id: ids,
        laboratory_ids: labSampleLaboratories.value.map(e => e.id)
    })

    const response = await api.post(type === 'send' ? 'lab_results/send' : 'lab_results/resend', apiData)

    if (response.success) {
        labResultsStore.fetch()

        tabsStore.closeTab('SendLabSample')
    }

    loadings.value.saveButton = false
}

const leftButtons = computed(() => {
    return [
        {
            icon: mdiPrinter,
            classType: 'primary',
            label: t('Print'),
            disabled: !(labSampleLaboratories.value.filter(e => e && e.id).length === labSampleLaboratories.value.length),
            action: () => {
                print()
            }
        },
    ]
})

const rightButtons = computed(() => [
    {
        icon: mdiSend,
        classType: 'teal',
        label: t('Send'),
        disabled: !(labSampleLaboratories.value.filter(e => e && e.id).length === labSampleLaboratories.value.length),
        action: async () => {
            await send()
        }
    },
])

const getDates = () => {
    itemData.value.expiration_date = '-'
    itemData.value.extraction_date = '-'
    itemData.value.harvest_date = '-'
    itemData.value.package_date = '-'
    itemData.value.sample_date = '-'
    itemData.value.tested_date = '-'
}

// Load data from api
onMounted(async () => {
    let ids = router.currentRoute.value.query.id

    !Array.isArray(ids) && (ids = [ids])

    const response = await inventoryStore.getInventoryItems(ids)

    response.success && (itemData.value = response.data[0])

    getDates()
})
</script>

<template>
    <!-- Overlay for load data and sync -->
    <Overlay
        v-if="loadings.syncItems || loadings.printButton" />

    <div class="max-w-8xl mx-auto">
        <div class="flex justify-between">
            <ActionButtons
                :items="leftButtons" />

            <ActionButtons
                :items="rightButtons" />
        </div>

        <Card
            class="px-10 py-5"
            hasMargins
            :placeContentCenter="false"
            id="printableArea">
            <!-- Title and Company name -->
            <CardHeader
                v-if="itemData"
                :title="$t(`Lab sample`)"
                :date="itemData.updated_at"
                :print-view-id="showUuid(itemData.id)"
                :print-view-extra-id="itemData.id"
                :print-view-title="$t('Lab sample')" />

            <hr class="my-4 border-[1px] border-gray-500">

            <!-- Main content -->
            <div class="mx-auto w-full">
                <!-- Actions (Bill to and Ship To) -->
                <div class="gap-8 flex w-full">
                    <!-- Bill to -->
                    <div class="w-full">
                        <h2 class="flex flex-row font-medium !mt-0 mr-4 whitespace-nowrap items-center">
                            {{ $t('Send to:') }}
                        </h2>
                        <div  class="flex space-x-8">
                            <template v-for="(labSampleLaboratory,index) in labSampleLaboratories"
                                :key="index">
                                <EntityInformation
                                    :hasCard="!labSampleLaboratory"
                                    :action="()=> labSampleLaboratory || addLaboratory(index)"
                                    :icon="mdiDomain"
                                    :name="labSampleLaboratory?.laboratory_name"
                                    :data="{
                                        address:labSampleLaboratory?.address,
                                        state:labSampleLaboratory?.state,
                                        zipCode:labSampleLaboratory?.zip_code,
                                        email:labSampleLaboratory?.email,
                                        phone:labSampleLaboratory?.phone,
                                    }">
                                    <div v-if="!labSampleLaboratory">
                                        <div class="font-semibold">
                                            {{ $t('Select laboratory') }}
                                        </div>

                                        {{ $t('Choose an existing laboratory.') }}
                                    </div>

                                    <button
                                        v-if="labSampleLaboratory && mode === 'edit'"
                                        @click="()=> addLaboratory(index)"
                                        class="link primary notPrintableArea mt-2">
                                        {{ $t('Change') }}
                                    </button>
                                </EntityInformation>
                            </template>
                        </div>
                    </div>

                    <div class="w-full">
                        <!-- Empty space for layout -->
                    </div>

                    <div class="w-full">
                        <!-- Empty space for layout -->
                    </div>
                </div>

                <!-- Orders -->
                <div class="mt-5">
                    <!-- Products -->
                    <h2 class="text-xl font-medium !py-0 !my-0">
                        {{ $t('Item detail') }}
                    </h2>

                    <div
                        v-if="itemData"
                        class="grid grid-cols-12 gap-4">
                        <Card
                            :placeContentCenter="false"
                            class="col-span-8 print-border-rounded">
                            <Title
                                class="text-lg font-medium mb-1 !mt-0 !pt-0"
                                :title="$t('Item data')"
                                title-type="h3" />

                            <ShowValue
                                v-if="itemData.id"
                                v-model="itemData.id"
                                :justifyEnd="true"
                                :label="$t('SKU:')" />

                            <ShowValue
                                v-if="itemData.category"
                                v-model="itemData.category.name"
                                :justifyEnd="true"
                                :label="$t('Category:')" />

                            <ShowValue
                                v-if="itemData.batch_id"
                                v-model="itemData.batch_id"
                                :justifyEnd="true"
                                :label="$t('Package ID:')" />

                            <ShowValue
                                v-if="itemData.batch_id"
                                v-model="itemData.batch_id"
                                :justifyEnd="true"
                                :label="$t('Batch ID:')" />

                            <ShowValue
                                v-if="itemData.status"
                                v-model="itemData.status.name"
                                :justifyEnd="true"
                                :label="$t('Status:')" />

                            <ShowValue
                                v-if="itemData.location"
                                v-model="itemData.location.name"
                                :justifyEnd="true"
                                :label="$t('Location:')" />

                            <ShowValue
                                v-if="itemData.vendor"
                                v-model="itemData.vendor.name"
                                :justifyEnd="true"
                                :label="$t('Vendor:')" />

                            <ShowValue
                                v-model="itemData.item_type.name"
                                :justifyEnd="true"
                                :label="$t('Item type:')" />

                            <ShowValue
                                v-if="itemData.stage"
                                v-model="itemData.stage.name"
                                :justifyEnd="true"
                                :label="$t('Stage:')" />

                            <ShowValue
                                v-if="itemData.strain"
                                v-model="itemData.strain.name"
                                :justifyEnd="true"
                                :label="$t('Strain:')" />

                            <ShowValue
                                v-if="itemData.days_in_stage"
                                v-model="itemData.days_in_stage"
                                :justifyEnd="true"
                                :label="$t('Days in stage:')" />
                        </Card>

                        <Card
                            :placeContentCenter="false"
                            class="col-span-4 print-border-rounded">
                            <Title
                                class="text-lg font-medium mb-1"
                                :title="$t('Item dates')"
                                title-type="h3" />

                            <ShowValue
                                v-model="itemData.expiration_date"
                                :justifyEnd="true"
                                :label="$t('Expiration date:')" />

                            <ShowValue
                                v-model="itemData.extraction_date"
                                :justifyEnd="true"
                                :label="$t('Extraction date:')" />

                            <ShowValue
                                v-model="itemData.harvest_date"
                                :justifyEnd="true"
                                :label="$t('Harvest date:')" />

                            <ShowValue
                                v-model="itemData.package_date"
                                :justifyEnd="true"
                                :label="$t('Package date:')" />

                            <ShowValue
                                v-model="itemData.sample_date"
                                :justifyEnd="true"
                                :label="$t('Sample date:')" />

                            <ShowValue
                                v-model="itemData.tested_date"
                                :justifyEnd="true"
                                :label="$t('tested date:')" />
                        </Card>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<style>
.justForPrintView {
    display: none;
}
</style>
