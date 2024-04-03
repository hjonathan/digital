<script setup>
import { inject, ref } from 'vue'
import { Input, ToggleSwitch } from 'form'
import { Button } from 'layout'
import { defineModel, showUuid } from 'shared'
import { mdiTrashCanOutline, mdiArrowULeftTop } from '@mdi/js'
import NoItemsFound from './NoItemsFound.vue'

const props = defineProps({
    items: Array,
    enableAddItems: Boolean,
    errors: {
        type: Object,
        default: null
    },
    actionThread: String,
    mode: {
        type: String,
        default: 'dispatcher'
    },
    modelValue: Array
})

const emit = defineEmits(['onRemove'])

const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')

const itemsModel = defineModel('items')

const itemStates = {
    normal: null,
    deleted: 2,
    edit: 1
}

const config = ref({
    show: {
        switch: false,
        checkboxAddItems: false,
        deleteButton: false
    },
    adjustment: {
        switch: false,
        checkboxAddItems: false,
        deleteButton: false
    },
    dispatcher: {
        switch: false,
        checkboxAddItems: false,
        deleteButton: true
    },
    destination: {
        switch: true,
        checkboxAddItems: true,
        deleteButton: true
    },
    assignment: {
        switch: true,
        checkboxAddItems: false,
        deleteButton: false
    }
})

const removeitem = (index, item) => {
    itemsModel.value.splice(index, 1)

    emit('onRemove', itemsModel.value)

    rapidStore.$emitGlobalEvent('selectedRowsInventorySync')
}

const removeItemDestination = (index, item) => {
    if (item.item_transfer_type_id === itemStates.deleted) {
        item.item_transfer_type_id = itemStates.edit

        return
    }

    undoInitialData(item)

    item.item_transfer_type_id = itemStates.deleted
}

const allowToEditItem = (item) => {
    if (item.is_editable) {
        item.item_transfer_type_id = null

        undoInitialData(item)

        return
    }

    item.item_transfer_type_id = 1
}

const undoInitialData = (item) => {
    item.quantity = item.original_quantity
}

const showDeleteButton = (item) => {
    if (props.mode === 'adjustment' && [undefined, 3].includes(item.item_transfer_type_id)) { return true }

    if (props.mode === 'destination' && item.is_editable) { return true }

    if (props.mode === 'destination' && !item.is_editable) { return false }

    return config.value[props.mode].deleteButton
}

const showFields = (item) => {
    if (props.mode === 'destination') {
        return item.is_editable && !isItemDeleted(item)
    }

    if (props.mode === 'assignment') {
        return item.is_editable && !isItemDeleted(item)
    }

    return false
}

const isItemDeleted = (item) => item.item_transfer_type_id === 2
const isItemEdited = (item) => item.item_transfer_type_id === 1 && (['destination', 'adjustment'].includes(props.mode))
const isItemEditable = (item) => item.is_editable

const adjustmentQty = (item) => {
    const response = item.quantity - item.original_quantity

    if (response > 0) return `(+${response})`

    if (response < 0) return `(${response})`

    if (response === 0) return ''
}

</script>

<template>
    <section class="full !py-0">
        <table class="w-full table">
            <thead>
                <tr>
                    <th
                        v-if="config[mode].switch"
                        class="w-1/12 pl-8">
                        {{ $t('Edit') }}
                    </th>

                     <!-- ID -->
                    <th :class="['w-2/12 !px-6']">
                        {{ $t('ID') }}
                    </th>

                    <!-- Batch ID -->
                    <th class="w-2/12">
                        {{ $t('Batch ID') }}
                    </th>

                     <!-- Item type -->
                    <th class="w-2/12">
                        {{ $t('Type') }}
                    </th>

                    <!-- Quantity -->
                    <th class="w-2/12">
                        {{ $t('Qty') }}
                    </th>

                    <!-- Cost -->
                    <th class="w-2/12">
                        {{ $t('Cost') }}
                    </th>

                    <!-- Actions -->
                    <th class="w-1/12 notPrintableArea" />
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(item, index) in itemsModel"
                    :key="item.id"
                    :class="{
                        'bg-gray-200' : isItemDeleted(item),

                        }"
                    class="border-b border-gray-200 text-sm">
                    <!-- Toogle Switch -->
                    <td
                        v-if="config[mode].switch"
                        class="bg-primary-50 hover:bg-primary-1000 !px-0 w-1/12">
                        <div
                            class="flex justify-center !py-4 ">
                            <ToggleSwitch
                                has-border
                                v-model="item.is_editable"
                                @clickInToggle="allowToEditItem(item)"
                                :errors="errors?.lock_batch"
                                name="edit_toogle"
                                class="!mt-0 mx-auto" />
                        </div>
                    </td>

                    <!-- ID -->
                    <td :class="['w-2/12 px-2']">
                        <div
                            :class="['px-2',{
                                'line-through !text-gray-400' : isItemDeleted(item),

                                'font-medium text-gray-700 whitespace-nowrap': true
                            }]">
                            {{ showUuid(item.id) }}
                        </div>
                    </td>

                    <!-- Batch ID -->
                    <td
                        :class="{
                            'line-through !text-gray-400' : isItemDeleted(item),
                        }"
                        class="w-2/12">
                        {{ showUuid(item.batch_id) }}
                    </td>

                    <!-- Item_type -->
                    <td
                        :class="{ 'line-through !text-gray-400' : isItemDeleted(item)}"
                        class="w-2/12">
                        {{ item.item_type?.name }}
                    </td>

                    <!-- Quantity -->
                    <td class="w-2/12 h-full pr-12">
                        <div :class="{
                            'flex justify-end mt-2': mode !=='adjustment',
                            'grid grid-cols-2 auto-cols-max justify-items-end': mode ==='adjustment',
                        }">
                            <Input
                                v-if="showFields(item)"
                                v-model="itemsModel[index].quantity"
                                :inputClass="'text-right'"
                                :errors="errors && errors.quantity ? [' '] : null"
                                min="0"
                                :inlineLabelRight="item.measure?.name"
                                type="number"
                                class="!mt-0 w-full notPrintableArea" />

                            <p v-if="(!isItemEditable(item) || isItemDeleted(item)) || mode == 'show'"
                                :class="{ 'line-through !text-gray-400' : isItemDeleted(item)
                                }"
                                class="flex items-center !my-0 mx-2" >
                                {{ item.quantity }} {{ item.measure?.name }}
                            </p>

                            <div v-if="mode==='adjustment'" class="justify-items-start w-full">
                                <span
                                    :class="{
                                        '!text-green-400': item.original_quantity < item.quantity,
                                        '!text-red-400': item.original_quantity > item.quantity
                                    }">
                                    {{ adjustmentQty(item) }}
                                </span>
                            </div>
                        </div>
                    </td>

                    <!-- Cost -->
                    <td class="w-1/12 pr-12">
                        <div
                            :class="{ 'line-through' : isItemDeleted(item) }"
                            class="flex items-center justify-end font-medium mt-2 text-gray-900">
                            ${{ item.item_type?.price }}
                        </div>
                    </td>

                    <!-- TrashIcon -->
                    <td
                        :class="{ 'bg-gray-200' : isItemDeleted(item),
                        }"
                        class="w-1/12 notPrintableArea !px-0">
                        <div class="w-full flex justify-center">
                            <Button
                                v-if="showDeleteButton(item)"
                                class="mt-2"
                                :icon="!isItemDeleted(item) ? mdiTrashCanOutline : mdiArrowULeftTop"
                                size="lg"
                                flat
                                rounded
                                color="secondary"
                                iconClass="hover:text-red-500"
                                @click="mode !== 'destination' ? removeitem(index, item) : removeItemDestination(index, item)" />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>
