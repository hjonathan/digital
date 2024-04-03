<script setup>
import { ref } from 'vue'
import { DatePicker, InputLabel, Label } from 'form'
import { formatDate } from 'shared'

const props = defineProps({
    schema: Object,
    data: Object,
    permissions: Object
})

const dataModel = ref(props.data)
</script>

<template>
    <div><!-- This 'div' tag is required for the outer 'space-y' class -->
        <div class="row cols-2">
            <div class="gutter-xs">
                <!-- Name -->
                <InputLabel
                    v-model="dataModel.requester.approval_name"
                    :label="$t('Name')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Position -->
                <InputLabel
                    v-model="dataModel.requester.approval_position"
                    :label="$t('Position')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Email -->
                <InputLabel
                    v-model="dataModel.requester.approval_email"
                    :label="$t('Email')"
                    mode="readonly"
                    outline
                    dense />

                <!-- Phone -->
                <InputLabel
                    v-model="dataModel.requester.approval_phone"
                    :label="$t('Phone')"
                    mode="readonly"
                    outline
                    dense />
            </div>
            <div class="gutter-xs">
                <!-- Department -->
                <InputLabel
                    v-model="dataModel.requester.approval_department"
                    :label="$t('Department')"
                    mode="readonly"
                    outline
                    dense />

                <slot name="requested-date">
                    <!-- Date -->
                    <InputLabel
                        v-model="dataModel.requester.requested_date"
                        :label="$t('Requested date')"
                        :mode="permissions.includes('supplies.global.custom_date') ? 'edit' : 'readonly'"
                        outline
                        dense>
                        <template v-slot:form-field>
                            <DatePicker
                                v-if="permissions.includes('supplies.global.custom_date') && !data.id"
                                v-model="dataModel.requester.requested_date"
                                :placeholder="$t('Requested date')"
                                size="sm"
                                outline
                                container-class="none"
                                :minDate="null"/>
                            <Label
                                v-if="!permissions.includes('supplies.global.custom_date') || data.id">
                                {{ formatDate(dataModel.requester.requested_date) }}
                            </Label>
                        </template>
                    </InputLabel>
                </slot>
            </div>
        </div>
    </div>
</template>
