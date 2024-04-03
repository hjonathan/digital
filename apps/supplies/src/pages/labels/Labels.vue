<script setup>
import { ref, markRaw, onMounted, inject } from 'vue'
import { Stepper } from 'layout'

import SectionTemplate from './components/SectionTemplate.vue'
import SectionSupplies from './components/SectionSupplies.vue'
import SectionQuantity from './components/SectionQuantity.vue'

import { useI18n } from 'vue-i18n'

import { useLabels as useLab } from './useLabels'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const labelsStore = useGlobalStore('suppliesLabels')

const useLabels = useLab({ useGlobalStore })

// Define the steps for the Stepper component
const steps = ref([
    {
        id: 'section_templates',
        name: t('Templates'),
        status: 'current',
        component: markRaw(SectionTemplate)
    },
    {
        id: 'section_supplies',
        name: t('Supplies'),
        status: 'upcoming',
        component: markRaw(SectionSupplies),
        next: (goNext) => {
            // Enable the quantity tab in the useLabels composition function
            useLabels.enableQuantityStep()

            // Move to the next step in the Stepper
            goNext()
        }
    },
    {
        id: 'section_quantity',
        name: t('Quantities'),
        status: 'upcoming',
        component: markRaw(SectionQuantity)
    },
])

onMounted(() => {
    labelsStore.fetch()
})
</script>

<template>
    <!-- Main section containing the Stepper component -->
    <Stepper
        v-model="useLabels.step.value"
        v-model:steps="steps"
        :disablePreviousButton="useLabels.disableBackButton.value"
        :disableNextButton="useLabels.disableNextButton.value"
        :has-navigation-buttons="true"
        disable-direct-navitagion
        header-padding>
        <!-- Content for Step 1: SectionProducts -->
        <template v-slot:content-step-1>
            <SectionTemplate
                :use-labels="useLabels" />
        </template>

        <!-- Content for Step 2: SectionTemplate -->
        <template v-slot:content-step-2>
            <SectionSupplies
                :useLabels="useLabels" />
        </template>

        <!-- Content for step 3: SectionQuantity -->
        <template v-slot:content-step-3>
            <SectionQuantity
                :useLabels="useLabels" />
        </template>
    </Stepper>
</template>
