<script setup>
import { Card, Overlay, Alert } from 'layout'
import { ref, onMounted, inject } from 'vue'
import Safety from './Safety.vue'
import PercentageTable from './PercentageTable.vue'
import { api } from '@/config'

import ProductCard from './ProductCard.vue'
import LabCard from './LabCard.vue'
import SummaryCards from './SummaryCards.vue'
import DynamicTerpenesIcons from './DynamicTerpenesIcons.vue'

const router = inject('router')

const id = router.currentRoute.value.params.id
const labNumber = router.currentRoute.value.query?.lab_number || 1

const safetyData = ref()
const cannabinoidsData = ref()
const terpenesData = ref()
const LaboratoryData = ref()
const itemLabJson = ref()
const itemLab = ref()

const error = ref('')

onMounted(async () => {
    const response = await api.post('lab_results/show_results', {
        item_id: id,
        lab_result_number: labNumber
    })

    if (response.success) {
        safetyData.value = response.data[0].laboratory_result_details.filter(e => e.category_test.slug === 'safetys')

        cannabinoidsData.value = response.data[0].laboratory_result_details.filter(e => e.category_test.slug === 'cannabinoids')

        terpenesData.value = response.data[0].laboratory_result_details.filter(e => e.category_test.slug === 'terpenes')

        LaboratoryData.value = response.data[0].laboratory

        itemLabJson.value = JSON.parse(response.data[0].lab_json)

        itemLab.value = JSON.parse(response.data[0].item_lab_json)
    }

    if (!response.success) {
        error.value = response.message
    }
})

const openSafetyCard = ref(true)
const openTerpenesCard = ref(true)
const openCannabinoidsCard = ref(true)
const isProductCardOpen = ref(true)
const isLabCardOpen = ref(true)

const incentives = [
    {
        name: 'Orange',
        image: 'orange'
    },
    {
        name: 'Turpentine',
        image: 'turpentine'
    },
    {
        name: 'Exchanges',
        image: 'earthy'
    },
]
</script>

<template>
    <div class="max-w-8xl mx-auto relative">
        <Overlay
            v-if="!safetyData && !error"
            :title="$t('Loading...')"
            class="top-10" />

        <!-- Main card -->
        <Card
            v-if="safetyData"
            hasMargins
            :placeContentCenter="false"
            class="px-10 py-5 air h-full">
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <!-- Product card -->
                <ProductCard
                    :data="itemLab"
                    :itemLabJson="itemLabJson"
                    :open="isProductCardOpen" />

                <!-- Lab card -->
                <LabCard
                    :open="isLabCardOpen"
                    :labData="LaboratoryData"
                    :clientData="itemLabJson.client" />
            </div>

            <SummaryCards
                :data="safetyData" />

            <div class="flex gap-8 mt-8 flex-wrap xl:flex-nowrap h-full">
                <div class="w-full xl:w-1/2 space-y-8 h-full">
                    <!-- Safety -->
                    <Card
                        is-closable
                        v-model:open="openSafetyCard"
                        :placeContentCenter="false"
                        header="Safety">
                        <Safety
                            :data="safetyData" />
                    </Card>

                    <!-- Cannabinoids -->
                    <Card
                        is-closable
                        v-model:open="openCannabinoidsCard"
                        :placeContentCenter="false"
                        :header="$t('Cannabinoids')">
                        <PercentageTable
                            :data="cannabinoidsData" />
                    </Card>
                </div>

                <div class="w-full xl:w-1/2 space-y-8">
                    <!-- Terpenes -->
                    <Card
                        is-closable
                        v-model:open="openTerpenesCard"
                        :placeContentCenter="false"
                        :header="$t('Terpenes')">
                        <DynamicTerpenesIcons
                            :data="incentives" />

                        <PercentageTable
                            :data="terpenesData" />
                    </Card>
                </div>
            </div>
        </Card>

        <div
            v-if="error"
            class="mt-8">
            <Alert
                type="danger"
                :hasCloseButton=false
                :title="$t('Error!')"
                :content="error" />
        </div>
    </div>
</template>
