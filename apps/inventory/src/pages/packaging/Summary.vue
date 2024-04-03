<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { sumBy } from 'lodash'
import { Alert, Title } from 'layout'
import { ref, computed, inject } from 'vue'
import {
    mdiPackage,
    mdiContentSaveOutline,
    mdiArrowLeftBold
} from '@mdi/js'
import { get } from './validations'

const props = defineProps({
    usePackaging: {
        type: Object,
        default: () => {}
    },
    step: {
        type: Object,
        default: () => {}
    }
})
const units = ref('units')

const { packages, totalQuantity, residue, totalQuantityPackages, measure, totalWaste, errorMessage } = props.usePackaging

const useGlobalStore = inject('useGlobalStore')
const finishedGoodTypes = useGlobalStore('finishedGoodTypes')

const data = computed(() => {
    const packs = packages.value.map((e, index) => ({
        name: finishedGoodTypes.getDataById(e.finished_god_type_id).name,
        quantity: e.quantity_used,
        data: `Units created: ${e.units_created} ${units.value} , Quantity used: ${e.quantity_used} ${measure.value}`
    }))

    const residuePackages = residue.value.bins.map((e, index) => {
        return {
            name: e.name || ' ',
            quantity: e.quantity,
            data: `Container type: ${e.container?.name} , Quantity : ${e.quantity} ${measure?.value}`
        }
    })

    // Add Waste
    packs.push({
        name: 'Total waste',
        quantity: totalWaste.value,
        data: `${totalWaste.value} ${measure.value}`
    })

    const response = [{
        id: 1,
        show: true,
        name: 'Finish good packages',
        bins: packs
    },
    {
        id: 2,
        show: totalQuantityPackages.value + totalWaste.value < totalQuantity.value,
        name: 'Residue packages',
        bins: residuePackages
    }]

    return response
})

// Sum an array with property quantity
const sumTotalQuantity = (data) => {
    return sumBy(data, e => e.quantity)
}

</script>

<template>
    <Alert
        v-if="errorMessage"
        :icon="() => null"
        type="danger"
        :has-close-button="false">
        <div class="flex justify-between items-center">
            <span class="text-base">
                {{ $t(`${errorMessage}`) }}
            </span>
        </div>
    </Alert>

    <div class="flex flex-row justify-between">
        <Title class="air" title-type="h3">{{ $t('Summary')}}</Title>

        <slot name="right-title"></slot>
    </div>

    <ul role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8">
        <template v-for="item in data" :key="item.id">
            <li
                v-if="item.show"
                class="overflow-hidden rounded-xl border border-gray-200 ">
                <div class="flex gap-x-4  flex justify-between gap-x-4 py-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    <div class="flex gap-x-4">
                        <svg-icon
                        type="mdi"
                        :path="mdiPackage"
                        size="24" />

                        <div class=" leading-6 text-gray-900">
                            {{ $t(item.name) }}
                        </div>
                    </div>

                    <dl class="-my-3 divide-y-2 divide-gray-800  py-3 leading-6">

                    </dl>
                </div>

                <div class="divide-y-2 divide-gray-200">
                    <dl
                        v-for="(item, index) in item.bins"
                        :key="item.name" class="-my-3 divide-y-2 divide-gray-800 px-6 py-3 leading-6">
                        <div class="flex justify-between gap-x-4 py-4">

                            <dt class="text-gray-500">
                                {{ $t(item.name) }}
                            </dt>

                            <dd class="flex items-start gap-x-2">
                                <div class="text-gray-900">
                                    {{ item.data }}
                                </div>
                            </dd>
                        </div>
                    </dl>

                    <dl class="-my-3 divide-y-2 divide-gray-800 px-6 py-3 leading-6">
                        <div class="flex justify-between gap-x-4 py-4">
                            <div class="font-medium text-gray-900">
                                {{ $t('Total') }}
                            </div>

                            <dd class="flex items-start gap-x-2">
                                <div class="text-gray-900">
                                    {{`${sumTotalQuantity(item.bins)} ${measure}`}}
                                </div>
                            </dd>
                        </div>
                    </dl>
                </div>
            </li>
        </template>
    </ul>

</template>
