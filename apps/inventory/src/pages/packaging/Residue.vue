<script setup>
import { ref, computed, inject } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { Alert, Title } from 'layout'
import { Input, Treeselect, AutoComplete } from 'form'
import { random } from 'lodash'
import { mdiCannabis, mdiArrowLeftBold, mdiArrowRightBold } from '@mdi/js'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')

const { totalResidue, errors, residue, measure } = props.usePackaging

const getLocations = () => {
    const locations = ['freezing-room', 'drying-room', 'cure-room']

    const allLocations = parametersStore.getTreeSelectDataBySlug('locations')

    const filteredLocations = allLocations.filter((param) => {
        return locations.includes(param.data.slug)
    })

    return filteredLocations || allLocations
}

const productIconPath = mdiCannabis

const bins = ref(residue.value.bins)

const itemRefs = ref([])

const hasAddButton = computed(() => {
    return true
})

const containers = parametersStore.getDataBySlug('containers')

const doAddBin = () => {
    bins.value.push({ id: random(0, 100000000), quantity: 0 })

    deleteBinErrors()
}

const doRemoveBin = (index) => {
    itemRefs.value.splice(index, 1)

    bins.value.splice(index, 1)

    deleteBinErrors()
}

const deleteBinErrors = () => {
    errors.value = []
}
</script>

<template>
    <div class="flex flex-row justify-between">
        <Title title-type="h3">
            {{ $t('Residue') }}, {{ totalResidue }} {{ measure }} {{ $t('remaining') }}
        </Title>

        <slot name="right-title"></slot>
    </div>

    <table
        class="min-w-full w-full">
        <thead class="text-[#495057] text-sm bg-[#f8f9fa] border-b border-t border-b-gray-300
        border-t-gray-200">
            <tr>
                <th class="w-[6%] text-start" />

                <th class="font-semibold text-start">
                    {{ $t('Container') }}
                </th>

                <th class="font-semibold  text-start w-[22%]">
                    {{ $t('Container type') }}
                </th>

                <th class="font-semibold  text-start w-[22%]">
                    {{ $t('Location') }}
                </th>

                <th class="font-semibold  text-start w-[22%]">
                    {{ $t('Quantity') }}
                </th>

                <th class="w-[6%] notPrintableArea" />
            </tr>
        </thead>

        <tbody class="bg-white pb-2" >
            <tr
                v-for="(item, index) in bins"
                :key="item.id"
                ref="itemRefs"
                class="border-b border-gray-200 text-sm">
                <td class="w-[6%]">
                    <div class="w-full flex justify-center !h-min">
                        <svg-icon
                            type="mdi"
                            class="w-10 h-min"
                            :path="productIconPath" />
                    </div>
                </td>

                <td class="px-4 w-[22%]">
                    <div class="flex items-center">
                        <Input
                            v-model="item.name"
                            :placeholder="$t('Container')"
                            :type="'text'"
                            container-class="none"
                            :errors="errors[`repackage_items.${index}.name`] ? ' ' : null">
                        </Input>
                    </div>
                </td>

                <td class="pr-4 w-[22%]">
                    <AutoComplete
                        :placeholder="$t('Select')"
                        v-model="item.container"
                        :options="containers"
                        container-class="none"
                        :errors="errors[`repackage_items.${index}.container_id`] ? ' ' : null">
                    </AutoComplete>
                </td>

                <td class="pr-4 w-[22%]">
                    <Treeselect
                        v-model="item.location"
                        :options="getLocations()"
                        container-class="none"
                        :errors="errors[`repackage_items.${index}.location_id`] ? ' ' : null"
                        :placeholder="$t('Select location')" />
                </td>

                <td class="pr-4 w-[22%]">
                    <Input
                        v-model="item.quantity"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'"
                        inputClass="text-right"
                        container-class="none"
                        :errors="errors[`repackage_items.${index}.quantity`]  ? ' ' : null">
                        <template #inlineLabelRight>{{ $t('grams') }}</template>
                    </Input>
                </td>

                <td class="notPrintableArea w-[6%]">
                    <div class="flex justify-end items-center h-full notPrintableArea air-sm">
                        <TrashIcon
                            @click="doRemoveBin(index)"
                            class="text-gray-800 cursor-pointer hover:text-red-400 h-6 flex items-center "/>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <Alert
        :title="t('The quantity remaining must be zero.')"
        type="info"
        class="my-8"
        :has-close-button="false"
        :content="shortParagraph" />

    <!-- Add item button -->
    <div class="flex justify-end">
        <button
            v-if="hasAddButton"
            @click="doAddBin()"
            :disabled="totalResidue < 1"
            type="button"
            class="button success air">
            {{ $t('Add residue package') }}
        </button>
    </div>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.25s ease-in;
}

.v-enter-from,
.v-leave-from {
    opacity: 0 ;
}
</style>
