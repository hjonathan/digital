<script setup>
import { Input, AutoComplete } from 'form'
import { Title, Button } from 'layout'
import { defineModel } from 'shared'
import { mdiTrashCanOutline, mdiPlus } from '@mdi/js'

const props = defineProps({
    modelValue: Object,
    measures: {
        type: Array,
        default: () => ([])
    },
    errors: {
        type: Object,
        default: () => ({})
    }
})

const model = defineModel('modelValue')

const addCustomEntry = () => {
    model.value.push({
        name: '',
        value: '',
        measure: ''
    })
}

const removeCustomEntry = (index) => {
    model.value.splice(index, 1)
}

</script>

<template>
    <Title
        :title="$t('Custom entries')"
        title-type="h2" />

    <table>
        <thead>
            <tr>
                <th class="font-semibold p-4 w-2/12">
                </th>

                <th class="w-5/12">
                    {{ $t('Name') }}
                </th>

                <th class="w-4/12">
                    {{ $t('Value') }}
                </th>

                <!-- Actions -->
                <th class="w-1/12 notPrintableArea" />
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="(entry, index) of model"
                :key="index">
                <td>
                    {{ $t('Custom result') }}
                </td>

                <td>
                    <Input
                        v-model="model[index].name"
                        placeholder="Name"
                        container-class="none"/>
                </td>

                <td>
                    <Input
                        v-model="model[index].value"
                        container-class="none"
                        type="number"
                        placeholder="Value"
                        :errors="errors.item"
                        class="notPrintableArea col-span-90 pointer-events-auto"
                        inlineLabelRightClass="!mr-0 !top-0"
                        inputClass="text-end">
                        <template v-slot:inlineLabelRight >
                            <AutoComplete
                                v-model="model[index].measure"
                                :options="measures"
                                option-label="name"
                                option-value="value"
                                emit-value
                                map-options
                                container-class="none"
                                input-class="!shadow-none"
                                class="max-w-[100px] pointer-events-auto border-l-2 z-50"/>
                        </template>
                    </Input>
                </td>

                <td class="text-end">
                    <Button
                        :icon="mdiTrashCanOutline"
                        size="lg"
                        flat
                        rounded
                        color="secondary"
                        iconClass="hover:text-red-500"
                        @click="removeCustomEntry(index)"
                        class="notPrintableArea"/>
                </td>
            </tr>
        </tbody>
    </table>

    <div  class="flex justify-end my-6">
        <Button
            :icon="mdiPlus"
            rounded
            color="success"
            @click="addCustomEntry()"
            class="mr-4 notPrintableArea" />
    </div>
</template>
