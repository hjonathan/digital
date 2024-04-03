<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { Card, Overlay, ActionButtons, Button, Title } from 'layout'
import { mdiPrinter, mdiContentSave } from '@mdi/js'
import { downloadBase64PDF } from 'shared'
import { Input, Label, AutoComplete } from 'form'
import { api } from '@/config'
import Contaminants from '../../components/receiveLabResult/Contaminants.vue'
import CustomEntries from '../../components/receiveLabResult/CustomEntries.vue'
import OptionsCards from './OptionsCards.vue'

import {
    GlobeAltIcon,
    UserIcon,
    BackspaceIcon
} from '@heroicons/vue/24/outline'

import { loadData, errors as labResultError } from './ReceiveLabs'
import { useI18n } from 'vue-i18n'

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
const tabsStore = useGlobalStore('tabs')
const labResultsStore = useGlobalStore('labResults')

const router = inject('router')

const urlForData = ref('https://share.confidentcannabis.com/samples/public/share/560e1cb7-e257-4f2f-b6dd-2249f6abe518')

const id = router.currentRoute.value.query?.id
const labNumber = router.currentRoute.value.query?.lab_number || 1

const data = ref()

const errors = ref({})
const measures = ref([])
const customEntries = ref([])

const contaminants = ref({})

// Config for button list
const loaders = ref({
    getUrlDataButton: false,
    printButton: true,
    spinnerPrintButton: true,
    saveButton: true,
    showData: false
})

// Time for autosave when changing item list
const saveTime = 750

// Autosave when changing item list
const timeOutAutoSave = ref()

const autoSave = () => {
    timeOutAutoSave.value && clearTimeout(timeOutAutoSave.value)

    timeOutAutoSave.value = setTimeout(async () => {
        await saveLabResult()
    }, saveTime)
}

const formatApiData = () => {
    const apiData = {
        item_id: id,
        contaminants: contaminants.value,
        customEntries: customEntries.value,
        laboratory_test: [],
        laboratory_result: [],
        lab_result_number: labNumber
    }

    for (const group of data.value) {
        for (const item of group.items) {
            apiData[item.key].push(item)
        }
    }

    return apiData
}

const saveLabResult = async () => {
    loaders.value.saveButton = true

    const apiData = formatApiData()

    // Call to api
    const response = await api.post('lab_results/save_results', apiData)

    if (response.success) {
        labResultsStore.fetch()

        tabsStore.closeTab('ReceiveLabResult')

        tabsStore.activateTab({ name: 'lab-sample' })
    }

    loaders.value.saveButton = false
}

const print = async () => {
    loaders.value.printButton = true
    loaders.value.spinnerPrintButton = false

    const printableArea = document.getElementById('printableArea')

    const data = { data: printableArea.innerHTML }

    const response = await api.post('pdf/create', data)

    response.success && downloadBase64PDF(response.data.content, 'Lab_result.pdf')

    loaders.value.printButton = false
    loaders.value.spinnerPrintButton = true
}

const leftButtons = computed(() => [
    {
        icon: mdiPrinter,
        classType: 'primary',
        label: t('Print'),
        spinner: !loaders.value.spinnerPrintButton,
        disabled: loaders.value.printButton,
        action: () => {
            print()
        }
    },
])

const rightButtons = computed(() => [
    {
        icon: mdiContentSave,
        classType: 'teal',
        label: t('Save'),
        // spinner: !jsonLogic.apply(actionRules.save, data.value),
        disabled: loaders.value.saveButton,
        action: () => {
            saveLabResult()
        }
    },
])

// Load data from api
onMounted(async () => {
    loaders.value.showData = true

    const response = await api.get('measure-tests')

    response.success && (measures.value = response.data
        .filter(measure => measure.slug !== 'text')
        .map(measure => ({ name: measure.symbol, value: measure.symbol })))

    loaders.value.showData = false
})

// New variables
const configView = ref({
    inputURL: false,
    openURL: false,
    openManually: false,
    backButton: false
})

const cardItems = ref([
    {
        title: 'From URL',
        icon: GlobeAltIcon,
        active: false,
        onClick: async () => {
            configView.value.openURL = true
            configView.value.inputURL = true
            configView.value.backButton = true
        }
    },
    {
        title: 'Manually',
        icon: UserIcon,
        active: false,
        onClick: async () => {
            configView.value.openManually = true
            configView.value.backButton = true

            loaders.value.showData = true

            const response = await loadData(id, labNumber)

            loaders.value.showData = false

            if (response) {
                data.value = response
            }
        }
    },
])

const onClickLoadFromURL = async () => {
    if (!urlForData.value) {
        return
    }

    loaders.value.showData = true

    const response = await loadData(id, labNumber, urlForData.value)

    loaders.value.showData = false

    if (response) {
        labResultsStore.fetch()

        configView.value.inputURL = false

        loaders.value.printButton = false
        loaders.value.saveButton = false

        data.value = response
    }
}

const clickBackButton = () => {
    configView.value.openManually = false
    configView.value.openURL = false
    configView.value.backButton = false
    configView.value.inputURL = false

    data.value = null
}
</script>

<template>
    <!-- Overlay for load data and sync -->
    <Overlay
        v-if="loaders.showData"/>

    <div class="max-w-8xl mx-auto">
        <div class="flex justify-between sticky top-0 z-10">
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

            <Title
                title-type="h1"
                :title="$t('Lab results')"
                titleClasses="text-primary-600"
                class="col-span-12"/>

            <div class="space-x-2 flex cursor-pointer hover:text-primary-500" v-if="configView.backButton" @click="clickBackButton">
                <BackspaceIcon
                    class="w-4 mt-px block"
                    aria-hidden="true" />

                <span>{{ $t('Back') }}</span>
            </div>

            <OptionsCards
                v-if="!(configView.openManually || configView.openURL)"
                :items="cardItems"
                class="air" />

            <!-- OPEN URL  -->
            <div v-if="configView.inputURL" class="air flex items-start gap-4">
                <Input
                    v-model="urlForData"
                    :label="$t('Enter url for load data')"
                    :placeholder="'https://share.confidentcannabis.com/samples/public/share/560e1cb7-e257-4f2f-b6dd-2249f6abe518'"
                    class="flex-1 notPrintableArea !mt-0"
                    :errors="labResultError?.lab_result_url" />

                <Button
                    color="primary"
                    :label="$t('Send')"
                    :loading="loaders.getUrlDataButton"
                    @click="onClickLoadFromURL"
                    class="h-min notPrintableArea" />
            </div>

            <div
                v-for="(group, index) of data"
                :key="index"
                class="grid grid-cols-12 gap-x-20 gap-y-5 mb-10">

                <div class="col-span-12">
                    <Title
                        :title="group.group"
                        title-type="h2" />
                </div>

                <div
                    v-for="(item, iItem) of group.items"
                    :key="iItem"
                    class="col-span-3">
                    <Label>
                        {{ item.label }}
                    </Label>

                    <div class="grid grid-cols-100">
                        <!-- :label="item.label" -->
                        <!-- @update:model-value="autoSave" -->
                        <Input
                            v-model="group.items[iItem].value"
                            container-class="none"
                            :type="item.type"
                            :placeholder="item.placeholer"
                            :disabled="item.disabled"
                            :readonly="item.disabled"
                            :errors="errors.item"
                            class="notPrintableArea col-span-90 pointer-events-auto"
                            inlineLabelRightClass="!mr-0 !top-0"
                            :inputClass="item.type === 'number' ? 'text-end' : ''">
                            <template v-slot:inlineLabelRight >
                                <AutoComplete
                                    v-if="item.type === 'number'"
                                    v-model="item.measure"
                                    :options="measures"
                                    :disabled="item.disabled"
                                    option-label="name"
                                    option-value="value"
                                    emit-value
                                    map-options
                                    container-class="none"
                                    input-class="!shadow-none"
                                    class="max-w-[80px] pointer-events-auto border-l-2"/>
                            </template>
                        </Input>
                    </div>

                    <div class="justForPrintView">
                        {{ group.items[iItem].value }} {{ item.measure }}
                    </div>
                </div>
            </div>

            <Contaminants
                v-if="data"
                v-model="contaminants" />

            <CustomEntries
                v-if="data"
                v-model="customEntries"
                :measures="measures" />
        </Card>
    </div>
</template>

<style>
.justForPrintView {
    display: none;
}
</style>
