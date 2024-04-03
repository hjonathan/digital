<script setup>
import { onMounted, ref } from 'vue'
import { defineModel } from 'shared'

const props = defineProps({
    steps: {
        type: Object,
        default: () => ({})
    },
    currentStep: {
        type: Object,
        default: () => ({})
    },
    step: {
        type: [String, Number],
        default: ''
    }
})

const data = ref({
    quantity: 0,
    price: 0
})

const paramsModel = defineModel('currentStep')
const stepModel = defineModel('step')

onMounted(() => {
    setTimeout(() => {
        paramsModel.value.status = 'error'

        paramsModel.value.name = 'Change from step1 Component'
    }, 1000)

    setTimeout(() => {
        const lastStep = props.steps[props.steps.length - 1]

        lastStep && (stepModel.value = lastStep.id)
    }, 3000)
})
</script>

<template>
    <div class="mx-auto bg-white rounded-md w-full flex flex-col items-center justify-center p-8 shadow">
        <h1>Step 1</h1>

        <!-- Units created -->
        <input
            v-model="data.quantity"
            inputClass="text-right"
            class="input"
            :type="'number'"
            :step="'1'"
            :min="'0'" />

        <!-- Price -->
        <input
            class="input air-sm"
            v-model="data.price"
            inputClass="text-right"
            :type="'number'"
            :step="'1'"
            :min="'0'" />

            <p>page length test...</p>
            <p>page length test...</p>
            <p>page length test...</p>
            <p>page length test...</p>
            <p>page length test...</p>
            <p>page length test...</p>
            <p>page length test...</p>
            <p>page length test...</p>
    </div>
</template>
