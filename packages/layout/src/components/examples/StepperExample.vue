<script setup>
import Stepper from '../stepper/Stepper.vue'
import { ref, markRaw } from 'vue'

import Step1 from './steps/Step1.vue'
import Step2 from './steps/Step2.vue'
import Step3 from './steps/Step3.vue'
import Step4 from './steps/Step4.vue'
import Step5 from './steps/Step5.vue'
import Step6 from './steps/Step6.vue'
import Step7 from './steps/Step7.vue'

const step = ref()
// Example: Stepper implementation and configuration.
const steps = ref([
    {
        id: 'step1',
        name: 'Step 1',
        status: 'current',
        isCurrent: true, // Property specifying which step has its view active
        component: markRaw(Step1),
        next: (next) => {
            console.log('Custom next')
            next()
        }
    },
    {
        id: 'step12',
        name: 'Step 2',
        status: 'disabled',
        component: markRaw(Step2)
    },
    {
        id: 'step3',
        name: 'Step 3',
        status: 'error',
        component: markRaw(Step3),
        next: (next) => {
            steps.value[0].status = 'error'

            next()
        }
    },
    {
        id: 'step4',
        name: 'Step 4',
        status: 'upcoming',
        component: markRaw(Step4),
        next: () => {
            step.value = 'step6'
        }
    },
])

setTimeout(() => {
    steps.value.push({
        id: 'step5',
        name: 'Dynamic step (ignore from step 4)',
        status: 'upcoming',
        component: markRaw(Step5)
    })

    steps.value.push({
        id: 'step6',
        name: 'Dynamic step 1',
        status: 'upcoming',
        component: markRaw(Step6)
    })

    steps.value.push({
        id: 'step7',
        name: 'Dynamic step 2',
        status: 'upcoming',
        component: markRaw(Step7)
    })
}, 1000)
</script>

<template>
    <section class="mt-8">
        <Stepper
            v-model="step"
            :has-navigation-buttons="true"
            :disable-direct-navitagion="false"
            :steps="steps"/>
    </section>
</template>
