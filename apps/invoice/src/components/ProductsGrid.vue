<script setup>
import { inject } from 'vue'
import { Input } from 'form'
import { Button } from 'layout'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiCannabis, mdiTrashCanOutline } from '@mdi/js'
import { defineModel, round } from 'shared'

const emit = defineEmits(['autoSave'])

const props = defineProps({
    products: Array,

    // To use this component in the create or show view.
    inCreate: {
        type: Boolean,
        default: true
    },
    errors: {
        type: Object,
        default: null
    },
    actionThread: String
})

const useGlobalStore = inject('useGlobalStore')
const rapidStore = useGlobalStore('rapidStore')

const productsModel = defineModel('products')

const productIconPath = mdiCannabis

const saveInvoice = async () => emit('autoSave')

const removeProduct = (index) => {
    productsModel.value.splice(index, 1)

    rapidStore.$emitGlobalEvent(`selectedItems:${props.actionThread}`)

    rapidStore.$emitGlobalEvent('selectedRowsInventorySync')
}

const totalAmount = (product) => {
    return round(Number(product.quantity) *
        Number(product.price || 2) -
        (Number(product.discount || 0) / 100 * Number(product.quantity) * Number(product.price || 2)))
}
</script>

<template>
    <section class="full !py-0">
        <table class="w-full table">
            <thead>
                <tr>
                    <th class="w-1/12 text-start" />

                    <th class="font-semibold p-4 w-4/12">
                        {{ $t('Item') }}
                    </th>

                    <th class="w-1/12">
                        {{ $t('Price') }}
                    </th>

                    <th class="w-1/12">
                        {{ $t('Discount') }}
                    </th>

                    <th class="w-2/12">
                        {{ $t('Quantity') }}
                    </th>

                    <th class="w-2/12">
                        {{ $t('Amount') }}
                    </th>

                    <!-- Actions -->
                    <th
                        v-if="inCreate && productsModel.length"
                        class="w-1/12 notPrintableArea" />
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(product, index) in productsModel"
                    :key="product.id"
                    class="border-b border-gray-200 text-sm">

                    <!-- Plant icon -->
                    <td class="w-1/12 text-center">
                        <div class="w-full flex justify-center !h-min">
                            <svg-icon
                                type="mdi"
                                :path="productIconPath"
                                :class="{ 'w-10 h-min': true, 'text-red-500': !product.valid}"/>
                        </div>

                        <span
                            v-if="!product.valid"
                            class="text-red-500 text-sm">
                            {{ product.lockTypeName }}
                        </span>
                    </td>

                    <td class="px-4 py-6 w-3/12">
                        <div class="flex gap-4 sm:gap-8 items-center mt-2">
                            <div :class="{ 'font-medium text-gray-700 whitespace-nowrap': true, 'text-red-500': !product.valid }">
                                {{ product.product_id || product.id }}
                            </div>
                        </div>
                    </td>

                    <!-- Price -->
                    <td class="w-2/12 pr-4">
                        <span class="flex justify-end items-center h-full w-full">
                            <Input
                                v-if="inCreate"
                                v-model="product.price"
                                :readonly="!product.valid"
                                :inputClass="'text-right'"
                                :errors="errors && errors[`invoice_item.${index}.price`] ? [' '] : null"
                                inlineLabelLeft="$"
                                min="0"
                                type="number"
                                class="!mt-0 w-full notPrintableArea"
                                @update:modelValue="saveInvoice" />

                            <span
                                v-if="!inCreate"
                                class="mt-2">
                                ${{ product.price }}
                            </span>
                        </span>
                    </td>

                    <!-- Discount -->
                    <td class="w-2/12">
                        <div class="flex items-center justify-end gap-4 pr-4">
                            <Input
                                v-if="inCreate"
                                v-model="product.discount"
                                :readonly="!product.valid"
                                :inputClass="'text-right'"
                                :errors="errors && errors[`invoice_item.${index}.discount`] ? [' '] : null"
                                max="100"
                                min="0"
                                inlineLabelRight="%"
                                type="number"
                                class="!mt-2 w-full notPrintableArea"
                                @update:modelValue="saveInvoice" />

                            <span
                                v-if="inCreate"
                                class="justForPrintView">
                                {{ product.discount }}%
                            </span>

                            <span
                                v-if="!inCreate"
                                class="mt-2">
                                {{ product.discount }}%
                            </span>
                        </div>
                    </td>

                    <!-- Quantity -->
                    <td class="w-1/12 h-full">
                        <div class="flex items-center justify-end !h-full mt-2">
                            <p class="flex items-center !my-0 mx-2">
                                {{ product.quantity }} {{ product.measure?.name }}
                            </p>
                        </div>
                    </td>

                    <!-- Amount -->
                    <td class="w-2/12">
                        <div class="flex items-center justify-end font-medium mt-2 text-gray-900">
                            ${{ totalAmount(product) }}
                        </div>
                    </td>

                    <!-- TrashIcon -->
                    <td
                        v-if="inCreate"
                        class="w-1/12 notPrintableArea">
                        <Button
                            class="mt-2"
                            :icon="mdiTrashCanOutline"
                            size="lg"
                            flat
                            rounded
                            color="secondary"
                            iconClass="hover:text-red-500"
                            @click="removeProduct(index)" />
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>
