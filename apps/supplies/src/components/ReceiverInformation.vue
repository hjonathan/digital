<script setup>
import { computed } from 'vue'
import { InputLabel, DatePicker, Label } from 'form'
import { formatDate } from 'shared'

const props = defineProps({
    schema: Object,
    modelValue: Object,
    permissions: Array
})

const emit = defineEmits(['update:modelValue'])

const receiver = computed({
    get: () => props.modelValue,
    set: newValue => emit('update:modelValue', newValue)
})
</script>

<template>
    <div class="row cols-2 mb-3">
        <div class="gutter-xs">
            <!-- Name -->
            <InputLabel
                v-model="receiver.name"
                :label="$t('Name')"
                mode="readonly"
                outline
                dense />

            <!-- Position -->
            <InputLabel
                v-model="receiver.position"
                :label="$t('Position')"
                mode="readonly"
                outline
                dense />

            <!-- Email -->
            <InputLabel
                v-model="receiver.email"
                :label="$t('Email')"
                mode="readonly"
                outline
                dense />

            <!-- Phone -->
            <InputLabel
                v-model="receiver.phone"
                :label="$t('Phone')"
                mode="readonly"
                outline
                dense />
        </div>

        <div class="gutter-xs">
            <!-- Email -->
            <InputLabel
                v-model="receiver.department"
                :label="$t('Department')"
                mode="readonly"
                outline
                dense />

            <!-- Phone -->
            <InputLabel
                v-model="receiver.reception_date"
                :label="$t('Reception date')"
                :mode="permissions.includes('supplies.global.custom_date') && schema.role ==='creator' ? 'edit' : 'readonly'"
                outline
                dense>
                <template v-slot:form-field>
                    <DatePicker
                        v-if="permissions.includes('supplies.global.custom_date') && schema.role ==='creator' "
                        v-model="receiver.reception_date"
                        size="sm"
                        outline
                        container-class="none"
                        :minDate="null" />

                    <Label
                        v-if="schema.role !=='creator'">
                        {{ formatDate(receiver.reception_date) }}
                    </Label>
                </template>
            </InputLabel>
        </div>
    </div>
</template>
