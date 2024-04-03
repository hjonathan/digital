<script setup>
import { ref, onMounted, computed } from 'vue'
import { Button, TableUI } from 'layout'
import { defineModel } from 'shared'
import { AutoComplete } from 'form'

import { api } from '@/config'

import { mdiTrashCanOutline, mdiPlus } from '@mdi/js'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    data: Array,
    mode: {
        type: String,
        default: 'readonly'
    }, // view, edit
    errors: {
        type: Object,
        default: () => { return {} }
    }
})

const dataTable = defineModel('data')

const columns = ref([
    {
        field: 'vendor.name',
        name: t('Name'),
        align: 'left',
        customClass: '!w-3/12'
    },
    {
        field: 'invoice.number',
        name: t('Email'),
        align: 'left',
        customClass: '!w-3/12'
    },
    {
        field: 'invoice.number',
        name: t('Phone'),
        customClass: '!w-2/12'
    },
    {
        field: 'invoice.number',
        name: t('Address'),
        customClass: '!w-3/12'
    },
    {
        field: 'invoice.number',
        name: t(''),
        align: 'right',
        customClass: `!w-1/12 notPrintableArea ${props.mode === 'edit' ? ' visible' : 'hidden'}`
    },
])

const errorsId = 'vendors'

onMounted(() => {
    getVendors()
})

const vendors = ref([])

const getVendors = async () => {
    const response = await api.get('vendors')

    response.success && (vendors.value = response.data)
}

const selectableVendors = computed(() => {
    const selectedVendors = dataTable.value.map(vendor => vendor.vendor?.id).filter(x => x)

    return vendors.value.filter(vendor => !selectedVendors.includes(vendor.id))
})

const onRemove = (item, index) => {
    dataTable.value.splice(index, 1)
}

const onAdd = () => {
    dataTable.value.push({})
}
</script>

<template>
    <TableUI
        class="mb-8"
        :columns="columns"
        v-model:data="dataTable"
        :multipleOpen="false">
        <template v-slot:row="{ row, index }">
            <tr>
                <!-- Autocomplete -->
                <td>
                    <div class="w-full">
                        <!-- For show view -->
                        <span
                            v-if="mode === 'readonly'"
                            class="mt-2">
                            {{ row?.vendor?.name }}
                        </span>

                        <!-- For edit view -->
                        <AutoComplete
                            v-if="mode === 'edit'"
                            v-model="row.vendor"
                            :options="selectableVendors"
                            :errors="errors[`requisition_vendors.${index}`] ? [] : null"
                            :placeholder="$t('Select a vendor')"
                            class="w-full !mt-0" />
                    </div>
                </td>

                <!-- Email -->
                <td>
                    {{ row?.vendor?.email }}
                </td>

                <!-- Phone -->
                <td>
                    {{ row?.vendor?.phone }}
                </td>

                <!-- Address -->
                <td>
                    {{ row?.vendor?.address }}
                </td>

                <!-- Actions -->
                <td
                    v-if="mode == 'edit'"
                    class="notPrintableArea">
                    <div class="w-full flex justify-center">
                        <Button
                            :disabled="dataTable.length === 1"
                            class="mt-2"
                            :icon="mdiTrashCanOutline"
                            size="lg"
                            flat
                            rounded
                            color="secondary"
                            iconClass="hover:text-red-500"
                            @click="onRemove(item, index)" />
                    </div>
                </td>
            </tr>
        </template>
    </TableUI>

    <!-- Error message -->
    <span
        v-if="errors.requisition_vendors"
        class="text-red-500 fong-semibold">
        {{ errors.requisition_vendors[0] }}
    </span>

    <!-- Add button -->
    <div
        v-if="mode==='edit'"
        class="flex justify-end pr-6">
        <Button
            :disabled="!selectableVendors.length || vendors.length === dataTable.length"
            rounded
            color="success"
            :icon="mdiPlus"
            @click="onAdd" />
    </div>
</template>
