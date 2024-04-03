<script setup>
import { computed } from 'vue'
import { InputLabel } from 'form'

const props = defineProps({
    modelValue: Object
})

const emit = defineEmits(['modelValue:update'])

const dataModel = computed({
    get: () => props.modelValue,
    set: () => newValue => emit('modelValue:update', newValue)
})
</script>

<template>
    <div class="space-y-1">
        <!-- Departament -->
        <InputLabel
            v-if="dataModel?.department"
            v-model="dataModel.department"
            :label="$t('Department')"
            mode="readonly"
            outline
            dense />

        <!-- Name -->
        <InputLabel
            v-if="dataModel?.name"
            v-model="dataModel.name"
            :label="$t('Name')"
            mode="readonly"
            outline
            dense />

        <!-- Position -->
        <InputLabel
            v-if="dataModel?.position"
            v-model="dataModel.position"
            :label="$t('Position')"
            mode="readonly"
            outline
            dense />

        <!-- Email -->
        <InputLabel
            v-if="dataModel?.email"
            v-model="dataModel.email"
            :label="$t('Email')"
            mode="readonly"
            outline
            dense />

        <!-- Phone -->
        <InputLabel
            v-if="dataModel?.phone"
            v-model="dataModel.phone"
            :label="$t('Phone')"
            mode="readonly"
            outline
            dense />

        <!-- Status -->
        <InputLabel
            v-if="dataModel?.status"
            v-model="dataModel.status"
            :label="$t('Status')"
            mode="readonly"
            outline
            dense />

        <!-- Approved on -->
        <InputLabel
            v-if="dataModel?.approvedOn"
            v-model="dataModel.approvedOn"
            :label="$t('Last updated')"
            mode="readonly"
            outline
            dense />

        <!-- Note -->
        <InputLabel
            v-if="dataModel?.note"
            v-model="dataModel.note"
            :label="$t('Note')"
            mode="readonly"
            outline
            dense />
    </div>
</template>
