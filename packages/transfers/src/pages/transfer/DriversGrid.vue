<script setup>
import { inject } from 'vue'
import { Button } from 'layout'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAccountTie, mdiTrashCanOutline } from '@mdi/js'
import { defineModel } from 'shared'

const props = defineProps({
    items: Array,
    edit: {
        type: Boolean,
        default: true
    },
    errors: {
        type: Object,
        default: null
    },
    actionThread: String
})

const emit = defineEmits(['save'])

const useGlobalStore = inject('useGlobalStore')
const rapidStore = useGlobalStore('rapidStore')

const itemsModel = defineModel('items')

const itemIconPath = mdiAccountTie

const removeitem = (index) => {
    itemsModel.value.splice(index, 1)

    rapidStore.$emitGlobalEvent(`selectedDriversSync:${props.actionThread}`)

    emit('save')
}

</script>

<template>
    <section class="full !py-0">
        <table class="w-full table">
            <thead>
                <tr>
                    <th class="w-1/12 text-start" />

                     <!-- ID -->
                    <th class="w-1/12">
                        {{ $t('Name') }}
                    </th>

                    <!-- Batch ID -->
                    <th class="w-1/12">
                        {{ $t('License') }}
                    </th>

                     <!-- Item type -->
                    <th class="w-2/12">
                        {{ $t('Phone') }}
                    </th>

                    <!-- Description -->
                    <th class="w-4/12 p-4">
                        {{ $t('Email') }}
                    </th>

                    <!-- Quantity -->
                    <th class="w-2/12">
                        {{ $t('Certificate') }}
                    </th>

                    <!-- Actions -->
                    <th
                        v-if="edit && itemsModel.length"
                        class="w-1/12 notPrintableArea" />
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(item, index) in itemsModel"
                    :key="item.id"
                    class="border-b border-gray-200 text-sm">

                    <!-- Icon -->
                    <td class="w-1/12">
                        <div class="w-full flex justify-center">
                            <svg-icon
                                type="mdi"
                                :path="itemIconPath"
                                :class="{ 'w-10 h-min': true}"/>
                        </div>

                        <span
                            v-if="!item.valid"
                            class="text-red-500 text-sm">
                            {{ item.lockTypeName }}
                        </span>
                    </td>

                    <!-- ID -->
                    <td class="w-1/12">
                        <div :class="{ 'font-medium text-gray-700 whitespace-nowrap': true  }">
                            {{ item.name }}
                        </div>
                    </td>

                    <!-- Batch ID -->
                    <td class="w-2/12">
                        {{ item.driver_license }}
                    </td>

                    <!-- Item_type -->
                    <td class="w-2/12">
                        {{ item.phone }}
                    </td>

                    <!-- Description -->
                    <td class="w-2/12">
                        {{ item.email }}
                    </td>

                    <!-- cost -->
                    <td class="w-1/12">
                        {{ item.certificate }}
                    </td>

                    <!-- TrashIcon -->
                    <td
                        v-if="edit"
                        class="w-1/12 notPrintableArea">
                        <Button
                            class="mt-2"
                            :icon="mdiTrashCanOutline"
                            size="lg"
                            flat
                            rounded
                            color="secondary"
                            iconClass="hover:text-red-500"
                            @click="removeitem(index)" />
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>
