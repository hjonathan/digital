<script setup>
import { ref, markRaw, inject, onMounted } from 'vue'
import { Stepper } from 'layout'
import { useI18n } from 'vue-i18n'

import SectionProducts from '../components/SectionProducts.vue'
import SectionQuantity from '../components/SectionQuantity.vue'
import SectionTemplate from '../components/SectionTemplate.vue'

import { useLabels as useLab } from './useLabels'

const { t } = useI18n()

// Inject the global store
const useGlobalStore = inject('useGlobalStore')

// Access the labels store from the global store
const labelsStore = useGlobalStore('labels')

// Initialize the useLabels composition function
const useLabels = useLab({ useGlobalStore })

// On component mount, set the selected label from the labels store
onMounted(async () => {
    useLabels.labelSelected.value = labelsStore.label
})

// Define the steps for the Stepper component
const steps = ref([
    {
        id: 'section_products',
        name: t('Products'),
        status: 'current',
        component: markRaw(SectionProducts)
    },
    {
        id: 'section_template',
        name: t('Templates'),
        status: 'upcoming',
        component: markRaw(SectionTemplate),
        next: (goNext) => {
            // Enable the quantity tab in the useLabels composition function
            useLabels.enableQuantityStep()

            // Move to the next step in the Stepper
            goNext()
        }
    },
    {
        id: 'section_quantity',
        name: t('Quantity'),
        status: 'upcoming',
        component: markRaw(SectionQuantity)
    },
])
</script>

<template>
    <!-- Main section containing the Stepper component -->
    <Stepper
        v-model="useLabels.step.value"
        v-model:steps="steps"
        :disablePreviousButton="useLabels.disableBackButton.value"
        :disableNextButton="useLabels.disableNextButton.value"
        :has-navigation-buttons="true"
        disable-direct-navitagion>
        <!-- Content for Step 1: SectionProducts -->
        <template v-slot:content-step-1>
            <SectionProducts
                :useLabels="useLabels" />
        </template>

        <!-- Content for Step 2: SectionTemplate -->
        <template v-slot:content-step-2>
            <SectionTemplate
                :useLabels="useLabels" />
        </template>

        <!-- Content for Step 3: SectionQuantity -->
        <template v-slot:content-step-3>
            <SectionQuantity
                :useLabels="useLabels" />
        </template>
    </Stepper>
</template>
