<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { defineModel } from 'shared'
import { Button, Alert } from 'layout'
import { Input, Treeselect } from 'form'
import { mdiCannabis, mdiTrashCanOutline } from '@mdi/js'
import StepOption from './StepOption.vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')

// Data sended from Stepper component
defineProps({
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
    },
    prefixError: {
        type: String,
        default: ''
    },
    errorList: {
        type: Object,
        default: () => ({})
    },
    measure: {
        type: String,
        default: 'grams'
    }
})

// Get all reasons for machine trim grid
const reasons = computed(() => parametersStore.getTreeSelectDataBySlug('reasons'))

// Data model linked to props params that bidirectional comunication
const stepModel = defineModel('currentStep')

//  Add container to element list
const addContainer = () => {
    stepModel.value.selectedOption = true

    stepModel.value.items.push({
        name: null,
        quantity: null,
        location_id: null,
        container_id: null
    })
}

//  Remove container to element list
const removeContainer = (index) => {
    if (!stepModel.value.optional && stepModel.value.items.length === 1) return

    stepModel.value.items.splice(index, 1)

    if (!stepModel.value.items.length) {
        stepModel.value.enableAdd = true

        stepModel.value.optional = true

        stepModel.value.selectedOption = false
    }

    customizeMessage()
}

//  If step is optional, require selection option to continue process.
const skipProccess = () => {
    stepModel.value.selectedOption = true
}

const customMessage = ref({
    type: 'info',
    message: t('Please select an option to continue.')
})

const customizeMessage = () => {
    customMessage.value = {
        type: 'info',
        message: t('Please select an option to continue.')
    }

    if (stepModel.value.optional && !stepModel.value.enableAdd && stepModel.value.selectedOption) {
        customMessage.value = {
            type: 'warning',
            message: t('There is not enough quantity to add waste. Please click the next button.')
        }
    }
}

onMounted(() => {
    stepModel.value.complete = true

    !stepModel.value.optional && !stepModel.value.items.length && addContainer()

    if (stepModel.value.items.length) {
        stepModel.value.selectedOption = true
    }

    customizeMessage()
})
</script>

<template>
    <Alert
        v-if="!stepModel.items.length && stepModel.optional"
        class="md:w-3/4 xl:w-1/2 mx-auto"
        :type="customMessage.type"
        :hasCloseButton="false">
        {{ $t(customMessage.message) }}
    </Alert>

    <table
        v-if="stepModel.items.length"
        class="sm:min-w-[75%] sm:w-[75%] md:min-w-[55%] md:w-[55%] mx-auto">
        <thead >
            <tr>
                <!-- Icon -->
                <th class="w-[6%]" />

                <!-- Waste header -->
                <th class="w-[22%]">
                    {{ $t('Waste') }}
                </th>

                <!-- Reason header -->
                <th class="w-[22%]">
                    {{ $t('Reason') }}
                </th>

                <!-- Actions -->
                <th class="w-[5%] notPrintableArea" />
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="(item, index) in stepModel.items"
                :key="item.id">
                <td class="w-[6%]">
                    <div class="w-full flex justify-center !h-min">
                        <svg-icon
                            :path="mdiCannabis"
                            type="mdi"
                            class="w-10 h-min" />
                    </div>
                </td>

                <!-- Waste -->
                <td class="w-[22%]">
                    <Input
                        v-model="stepModel.items[index].waste"
                        :placeholder="$t('Waste')"
                        :type="'number'"
                        :min="'0'"
                        :step="'1'"
                        :inlineLabelRight="measure"
                        :errors="stepModel.errors[`${stepModel.id}.${index}.waste`] ? ' ' : null"
                        inputClass="text-right"
                        class="!my-0 w-full"/>
                </td>

                <!-- Reason -->
                <td class="w-[22%]">
                    <Treeselect
                        v-model="stepModel.items[index].reason_id"
                        :clearable="false"
                        :placeholder="$t('Reason')"
                        :options="reasons"
                        :errors="stepModel.errors[`${stepModel.id}.${index}.reason_id`] ? ' ' : null"
                        containerClass="relative pt-0" />
                </td>

                <!-- Action button to remove container -->
                <td class="notPrintableArea w-[6%]">
                    <Button
                        :icon="mdiTrashCanOutline"
                        size="lg"
                        flat
                        rounded
                        color="secondary"
                        iconClass="group-hover:text-red-500"
                        @click="removeContainer(index)" />
                </td>
            </tr>
        </tbody>
    </table>

     <StepOption
        v-if="!stepModel.items.length && stepModel.optional"
        :prefix="stepModel.prefix"
        :completed="stepModel.complete"
        :selectedOption="stepModel.selectedOption"
        :enableAdd="stepModel.enableAdd"
        @addContainer="addContainer"
        @skipProccess="skipProccess"/>
</template>
