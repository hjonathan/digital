<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { defineModel } from 'shared'
import { Button, Alert } from 'layout'
import { Input, AutoComplete, Treeselect } from 'form'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiCannabis, mdiPlus, mdiTrashCanOutline } from '@mdi/js'
import StepOption from './StepOption.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')

// Data sended from Stepper component
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

// Get all containers for machine trim grid
const containers = computed(() => parametersStore.getDataBySlug('containers'))

// Get all locations for machine trim grid
const locations = computed(() => {
    if (props.currentStep.locationSlug) {
        const locations = parametersStore.getTreeSelectDataBySlug('locations')
            .filter(location => location.data.slug === props.currentStep.locationSlug)

        return locations.length ? locations[0].children : []
    }

    return parametersStore.getTreeSelectDataBySlug('locations')
})

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
    stepModel.value.errors = []

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
    message: t('Please select an option to continue')
})

const customizeMessage = () => {
    customMessage.value = {
        type: 'info',
        message: t('Please select an option to continue')
    }

    if (stepModel.value.optional && !stepModel.value.enableAdd && stepModel.value.selectedOption) {
        customMessage.value = {
            type: 'warning',
            message: t('There is not enough quantity to add waste so you must press the next button')
        }
    }
}

onMounted(() => {
    stepModel.value.complete = true

    !stepModel.value.optional && !stepModel.value.items.length && addContainer()

    customizeMessage()
})
</script>

<template>
    <Alert
        v-if="stepModel.optional && !stepModel.items.length"
        class="md:w-3/4 xl:w-1/2 mx-auto my-5"
        :type="customMessage.type"
        :hasCloseButton="false">
        {{ $t(customMessage.message) }}
    </Alert>

    <table
        v-if="stepModel.items.length">
        <thead>
            <tr>
                <!-- Icon -->
                <th class="w-[6%] text-start" />

                <th class="w-[22%]">
                    {{ $t('Container name') }}
                </th>

                <th class="w-[22%]">
                    {{ $t('Container type') }}
                </th>

                <th class="w-[22%]">
                    {{ $t('Location') }}
                </th>

                <th class="w-[22%]">
                    {{ $t('Quantity') }}
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

                <!-- Container -->
                <td class="w-[22%]">
                    <Input
                        v-model="stepModel.items[index].name"
                        :placeholder="$t('Container')"
                        :type="'text'"
                        :errors="stepModel.errors[`${stepModel.id}.${index}.name`] ? ' ' : null"
                        class="!my-0 w-full" />
                </td>

                <!-- Container type -->
                <td class="w-[22%]">
                    <AutoComplete
                        v-model="stepModel.items[index].container_id"
                        :placeholder="$t('Select')"
                        :options="containers"
                        :errors="stepModel.errors[`${stepModel.id}.${index}.container_id`] ? ' ' : null"
                        containerClass="relative pt-0"
                        option-value="id"
                        emit-value
                        map-options
                        class="!my-0"/>
                </td>

                <!-- Location -->
                <td class="w-[22%]">
                    <Treeselect
                        v-model="stepModel.items[index].location_id"
                        :clearable="false"
                        :options="locations"
                        :placeholder="$t('Location')"
                        :errors="stepModel.errors[`${stepModel.id}.${index}.location_id`] ? ' ' : null" 
                        containerClass="relative pt-0" />
                </td>

                <!-- Quantity -->
                <td class="w-[22%]">
                    <Input
                        v-model="stepModel.items[index].quantity"
                        :placeholder="$t('Quantity')"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'"
                        :inlineLabelRight="measure"
                        :errors="stepModel.errors[`${stepModel.id}.${index}.quantity`] ? ' ' : null"
                        inputClass="text-right"
                        class="!my-0 w-full" />
                </td>

                <!-- Action button to remove container -->
                <td class="notPrintableArea w-[6%]">
                    <Button
                        :disabled="stepModel.items.length === 1 && !stepModel.optional"
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

    <!-- Add item button -->
    <div
        v-if="stepModel.items.length"
        class="flex justify-end my-6">
        <Button
            :icon="mdiPlus"
            size="md"
            rounded
            color="success"
            @click="addContainer()"
            class="mr-0 sm:mr-2 lg:mr-4 xl:mr-6" />
    </div>

     <StepOption
        v-if="stepModel.optional && !stepModel.items.length"
        :prefix="stepModel.prefix"
        :completed="stepModel.complete"
        :selectedOption="stepModel.selectedOption"
        :enableAdd="stepModel.enableAdd"
        @addContainer="addContainer"
        @skipProccess="skipProccess"/>

</template>
