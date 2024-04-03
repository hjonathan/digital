<script setup>
import { Input, AutoComplete, TextArea } from 'form'
import { Title } from 'layout'
import { defineModel } from 'shared'
import { ref } from 'vue';

const props = defineProps({
    modelValue: Object
})

const options = ref([
    { name: 'Pass', value: 'Pass' },
    { name: 'No pass', value: 'No pass' },
    { name: 'No available', value: 'No available' },
])

const model = defineModel('modelValue')

</script>

<template>
    <Title
        :title="$t('Contaminants')"
        title-type="h2" />

    <Input
        :label="$t('Chemical residue:')"
        :placeholder="$t('Chemical residue')" />

    <AutoComplete
        v-model="model.heavy_metal"
        :label="$t('Heavy metal:')"
        :placeholder="$t('Heavy metal')"
        :options="options"
        option-label="name"
        option-value="value"
        map-options
        emit-value  />

    <AutoComplete
        v-model="model.microbiology"
        :label="$t('Microbiology:')"
        :placeholder="$t('Microbiology')"
        :options="options"
        option-label="name"
        option-value="value"
        map-options
        emit-value />

    <AutoComplete
        v-model="model.mycotoxin"
        :label="$t('Mycotoxin:')"
        :placeholder="$t('Mycotoxin')"
        :options="options"
        option-label="name"
        option-value="value"
        map-options
        emit-value />

    <AutoComplete
        v-model="model.pesticides"
        :label="$t('Pesticides:')"
        :placeholder="$t('Pesticides')"
        :options="options"
        option-label="name"
        option-value="value"
        map-options
        emit-value />

    <AutoComplete
        v-model="model.solvent_residue"
        :label="$t('Solvent residue:')"
        :placeholder="$t('Solvent residue')"
        :options="options"
        option-label="name"
        option-value="value"
        map-options
        emit-value />

    <TextArea
        v-model="model.pesticides_used_during_production"
        :label="$t('Pesticides used durign production:')"
        :placeholder="$t('Pesticides used durign production')" />
</template>
