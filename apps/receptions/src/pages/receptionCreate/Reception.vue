<script setup>
import { Card, ActionButtons, Button, Title } from 'layout'
import { Input, DatePicker } from 'form'
import { ref, inject, onMounted } from 'vue'
import { mdiCannabis, mdiChevronDown, mdiChevronUp, mdiPlus, mdiTrashCanOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { round, formatDate } from 'shared'
import ItemForm from './ItemForm.vue'
import Vendor from './Vendor.vue'
import IndirectCost from './IndirectCost.vue'
import { isNaN } from 'lodash'
import { configButtons } from './configButtons'
import { gsap } from 'gsap'

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')

const indCost = ref({})

const data = ref({
    reception_document_number: null,
    reception_document_date: null,
    vendor: null,
    items: []
})

const errors = ref()

const buttons = configButtons({ indCost, data, errors, useGlobalStore })

const totalAmount = (product) => {
    const cost = product.quantity * product.price

    const result = round((cost || 0) - ((cost || 0) * product.discount / 100))

    return isNaN(result) ? 0 : result
}

const allTotalAmount = () => {
    let allTotalAmount = 0

    for (const demoItem of data.value.items) {
        allTotalAmount += Number(totalAmount(demoItem))
    }

    const indCostSum = Object.values(indCost.value).reduce((a, b) => a + (b || 0), 0)

    return round(allTotalAmount) + indCostSum
}

const openRowExpansion = (product, index) => {
    if (!product.isOpen) {
        data.value.items.forEach((e, indexItem) => {
            indexItem !== index && (e.isOpen = false)
        })

        product.isOpen = !product.isOpen

        gsap.fromTo(`#item-form-${index}`,
            {
                height: 0,
                opacity: 0
            },
            {
                height: 'auto',
                opacity: 1,
                duration: 0.3
            })

        return
    }

    gsap.fromTo(`#item-form-${index}`,
        {
            height: 300,
            opacity: 1
        },
        {
            height: 0,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                data.value.items.forEach((e, indexItem) => {
                    indexItem !== index && (e.isOpen = false)
                })

                product.isOpen = !product.isOpen
            }
        })
}

const saveNewItem = () => {
    let location_id = null

    data.value.items.forEach((e, indexItem) => {
        e.isOpen = false
    })

    if (data.value.items.length) {
        location_id = data.value.items.at(-1).location_id
    }

    data.value.items.push({
        location_id,
        item_cod: null,
        isOpen: false
    })

    setTimeout(() => {
        gsap.fromTo(`#item-form-${data.value.items.length - 1}`,
            {
                height: 0,
                opacity: 0
            },
            {
                height: 'auto',
                opacity: 1,
                duration: 0.3,
                onComplete: () => {
                    openRowExpansion(data.value.items[data.value.items.length - 1], data.value.items.length - 1)
                }
            }
        )
    }, 10)
}

const cancel = (item) => {
    item.isOpen = false
}

const onRemove = (index) => {
    errors.value = {}

    data.value.items.splice(index, 1)
}

const propExist = (obj, regex) => {
    return Object.keys(obj).some((prop) => {
        return prop.includes(regex)
    })
}
// Check if table rows contain errors to mark them in red color
const hasRowErrors = (id) => {
    for (const key in errors.value) {
        if (key.includes(`.${id}.`)) {
            return true
        }
    }

    return false
}

onMounted(() => {
    saveNewItem()
})
</script>

<template>
    <div class="flex sticky top-0 z-10 overflow-y-hidden bg-slate-100">
        <div class="flex max-w-8xl mx-auto w-full justify-end">
            <ActionButtons
                :items="buttons" />
        </div>
    </div>

    <div class="max-w-8xl mx-auto">
        <Card
            class="px-10"
            hasMargins
            :placeContentCenter="false"
            :id="isInEdit ? 'printableArea' : 'newInvoincePrinableArea'">
            <div class="flex flex-col space-y-10">
                <div class="flex justify-between air">
                    <div class="self-end">
                        <!-- Displayed only in the nagevator view -->
                        <div class="notPrintableArea flex flex-row items-end mb-1">
                            <Title
                                :title="'New reception'"
                                :has-border-bottom-line="false"
                                class="!py-0" />
                        </div>

                        <!-- Only shown in print-->
                        <div class="justForPrintView">
                            <span>
                                {{ printViewExtraId }}
                            </span>
                        </div>

                        <div class="leading-none">
                            {{ formatDate(new Date(), 'americanFormat') }}
                        </div>
                    </div>
                </div>

                <hr class="block !mt-5 !mb-0 border-[1px] border-gray-300">

                <div class="grid grid-cols-3 gap-5">
                    <div>
                        <Input
                            v-model="data.reception_document_number"
                            :placeholder="$t('Invoice number')"
                            :errors="errors?.reception_document_number?' ': null ">
                            <template #label>{{ $t('Invoice number') }}</template>
                        </Input>

                        <DatePicker
                            v-model="data.reception_document_date"
                            :label="$t('Reception document date')"
                            :minDate="null"
                            :placeholder="$t(`Select date`)"
                            inputClass="bg-white"
                            dateFormat="yy-mm-dd"
                            hourFormat="24"
                            :errors="errors?.reception_document_date ? ' ': null" />
                    </div>

                    <Vendor
                        v-model:vendor="data.vendor"
                        class="!h-full" />
                </div>

                <div class="overflow-auto">
                    <table class="w-full table ">
                        <thead>
                            <tr>
                                <th class="w-1/12 text-start p-4"/>

                                <th class="w-3/12">
                                    {{ $t('Item') }}
                                </th>

                                <th class="w-2/12">
                                    {{ $t('Type') }}
                                </th>

                                <th class="w-1/12">
                                    {{ $t('Discount') }}
                                </th>

                                <th class="w-1/12">
                                    {{ $t('Price') }}
                                </th>

                                <th class="w-2/12">
                                    {{ $t('Quantity') }}
                                </th>

                                <th class="w-2/12">
                                    {{ $t('Amount') }}
                                </th>

                                <!-- Actions -->
                                <th class="w-1/12 notPrintableArea" />
                            </tr>
                        </thead>

                        <tbody
                            v-for="(product, index) in data.items"
                            :key="product.id">
                            <tr
                                :class="[`border-b border-blue-200  text-sm transition duration-300 ${product.isOpen ? 'bg-gray-200' : 'bg-white'} ${ hasRowErrors(index) ? '!bg-red-100' : '' }` ,{
                                    'bg-red-100': errors && propExist(errors,`reception_items.${index}`)
                                }]">
                                <td class="pl-5 !py-3">
                                    <svg-icon
                                        type="mdi"
                                        :path="mdiCannabis"
                                        class="w-10 h-min"/>
                                </td>

                                <!-- Plant icon -->
                                <td class="w-1/12 !py-3">
                                    <div class="w-full flex !h-min space-x-5">
                                        <div class="font-medium text-gray-700 justify-start">
                                            <div><span class="font-bold">{{ $t('Code') }}: </span> {{ product.item_cod }}</div>

                                            <div><span class="font-bold">{{ $t('Location') }}: </span> {{ parametersStore.getItemById(product.location_id)?.name }}</div>
                                        </div>
                                    </div>
                                </td>

                                <!-- Type -->
                                <td class="w-2/12 !py-3">
                                    <div class="flex flex-col">
                                        <div>{{ product.item_type?.name }}</div>
                                        <div class="text-gray-400">{{ parametersStore.getItemById(product.strain_id)?.name }}</div>
                                        <div class="text-gray-400">{{ parametersStore.getItemById(product.brand_id)?.name }}</div>
                                    </div>
                                </td>

                                <!-- Discount -->
                                <td class="w-2/12 text-right !py-3 !pr-12">
                                    {{ product.discount }}%
                                </td>

                                <!-- Price -->
                                <td class="w-2/12 pr-4 text-right !py-3 !pr-12">
                                    ${{ product.price }}
                                </td>

                                <!-- Quantity -->
                                <td class="w-2/12 !py-3 !pr-12">
                                    <div class="flex flex-col text-right">
                                        <div class="font-bold">{{ product.quantity }} {{ parametersStore.getItemById(product.measure_id)?.name }}</div>
                                    </div>
                                </td>

                                <!-- Amount -->
                                <td class="w-2/12 !py-3">
                                    <div class="flex items-center justify-end font-medium text-gray-900">
                                        ${{ totalAmount(product) }}
                                    </div>
                                </td>

                                <td class="w-1/12">
                                    <div class="w-1/12 flex items-center h-full !py-3">
                                        <Button
                                        :icon="product.isOpen ? mdiChevronUp : mdiChevronDown"
                                        color="secondary"
                                        class="!px-2"
                                        flat
                                        size="lg"
                                        rounded
                                        iconClass="hover:text-primary-500"
                                        @click="openRowExpansion(product, index)" />

                                        <Button
                                            :icon="mdiTrashCanOutline"
                                            size="lg"
                                            flat
                                            rounded
                                            color="secondary"
                                            iconClass="hover:text-red-500"
                                            @click="onRemove(index)" />
                                    </div>
                                </td>
                            </tr>

                            <tr v-show="product.isOpen" class="overflow-hidden">
                                {{ errors && errors[`reception_items.${index}`] }}

                                <td
                                    colspan="12"
                                    class="!px-0 !mx-0 !pb-5 !pt-0 !my-0 border-t-2">
                                    <div
                                        :id="`item-form-${index}`"
                                        class="overflow-hidden">
                                        <ItemForm
                                            :item="data.items[index]"
                                            mode="edit"
                                            @delete="onRemove(index)"
                                            @cancel="cancel(data.items[index])"
                                            v-model:errors="errors"
                                            :index="index"
                                            :key="index"
                                            class="border-2 border-primary-300 rounded-md !shadow-lg" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <div class="flex justify-end pr-6 !my-3">
                    <Button
                        rounded
                        color="success"
                        :icon="mdiPlus"
                        @click="saveNewItem" />
                </div>

                <div class="flex justify-between divide-y">
                    <div class="flex-1 md:block" />

                    <div class="flex-1 pr-6">
                        <IndirectCost
                            v-model:data="indCost"/>
                    </div>
                </div>

                <div class="flex justify-end pr-6 space-x-4 font-bold">
                    <span>{{ $t('Total') }}</span>

                    <span>${{ allTotalAmount()}}</span>
                </div>
            </div>
        </Card>
    </div>
</template>
