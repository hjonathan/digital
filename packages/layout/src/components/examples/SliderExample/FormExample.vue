<script setup>
import { ref } from 'vue'

import {
    Input,
    Treeselect,
    AutoComplete,
    DatePicker,
    ShowValue,
    TextArea,
    ToggleSwitch,
    Label
} from 'form'

const demoValue = ref('Demo val')
const demoValueTreeSelect = ref('child-1-1')

const optionsTreeselect = ref([
    {
        key: 'parent-1',
        id: 'parent-1',
        data: {
            data: 'parent-1'
        },
        children: [
            {
                key: 'child-1-1',
                id: 'child-1-1',
                data: {
                    data: 'DEMO'
                },
                label: 'child-1-1',
                isSelectable: true
            },
            {
                key: 'child-1-2',
                id: 'child-1-2',
                data: {
                    data: 'DEMO'
                },
                label: 'child-1-2',
                isSelectable: true
            },
        ],
        label: 'parent-1',
        isSelectable: false
    },
    {
        key: 'parent-2',
        id: 'parent-2',
        data: {
            data: 'parent-2'
        },
        children: [
            {
                key: 'child-2-1',
                id: 'child-2-1',
                data: {
                    data: 'DEMO'
                },
                label: 'demo child-2-1',
                isSelectable: true
            },
            {
                key: 'child-2-2',
                id: 'child-2-2',
                data: {
                    data: 'DEMO'
                },
                label: 'child-2-2',
                isSelectable: true
            },
        ],
        label: 'parent-2',
        isSelectable: false
    },
])

const demoModelAutocomplete = ref()

const optionsAutoComplete = [
    {
        id: 'item-1-id',
        name: 'item-1-name',
        value: 'item-1-value',
        others: 'item-1-others'
    },
    {
        id: 'item-2-id',
        name: 'item-2-name',
        value: 'item-2-value',
        others: 'item-2-others'
    },
]

const demoModelDatePicker = ref()

const demoModelShowValue = ref('Demo show value')

const demoModelTextArea = ref('Demo value textarea')

const demoModelToggleSwitch = ref(false)

const demoSwitchError = ref(false)

const demoErrorValidation = ref()

const switchErrors = (value) => {
    demoErrorValidation.value = value ? 'Demo validation error' : ''
}
</script>

<template>
    <div class="mx-6">
        <ToggleSwitch
            v-model="demoSwitchError"
            label="Show error on components"
            tag="Demo tag"
            extra="Demo extra"
            @update:model-value="switchErrors" />
    </div>

    <div class="grid grid-cols-2 grid-flow-row gap-4 px-4">
        <Input
            inlineLabelLeft="Left demo"
            inlineLabelRight="Right demo"
            v-model="demoValue"
            :errors="demoErrorValidation" />

        <Treeselect
            placeholder="DEMO"
            extra="Demo extra"
            v-model="demoValueTreeSelect"
            :options="optionsTreeselect"
            :errors="demoErrorValidation" />

        <AutoComplete
            placeholder="demo"
            label="demo"
            tag="demo"
            extra="Demo"
            v-model="demoModelAutocomplete"
            :options="optionsAutoComplete"
            option-value="others"
            emit-value
            map-options
            :errors="demoErrorValidation" />

        <DatePicker
            inlineLabelLeft="Date left"
            extra="date extra"
            placeholder="DEMO DATEPICKER FULL"
            v-model="demoModelDatePicker"
            :errors="demoErrorValidation" />

        <ShowValue
            label="DEMO SHOW VALUE"
            tag="Demo tag"
            extra="Demo extra"
            justify-end
            v-model="demoModelShowValue" />

        <TextArea
            placeholder="Demo textarea"
            v-model="demoModelTextArea"
            :errors="demoErrorValidation" />

        <ToggleSwitch
            v-model="demoModelToggleSwitch"
            label="Demo label"
            tag="Demo tag"
            extra="Demo extra"
            :errors="demoErrorValidation" />

        <Label>
            Demo label
        </Label>
    </div>
</template>
