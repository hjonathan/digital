<script setup>
import { TrashIcon, PencilIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { mdiCannabis, mdiArrowDown, mdiArrowUp, mdiBomb } from '@mdi/js'
import { ref } from 'vue'
import { Slideover, Button, Alert, Title, TableUI } from 'layout'
import { random } from 'lodash'
import SvgIcon from '@jamescoyle/vue-icon'
import PackagingForm from './PackagingForm.vue'
import PackagingCost from './PackagingCost.vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'

const { t } = useI18n()

const props = defineProps({
    usePackaging: {
        type: Object,
        default: () => {}
    }
})

const productIconPath = mdiCannabis
const { packages, items, totalResidue, errors, measure, searchPackageById } = props.usePackaging

const slideItem = ref()
const itemRefs = ref([])
const refForm = ref()

const configSlideOver = ref({
    open: false,
    close: false,
    disableSaveButton: false
})

// When press delete button in table
const doRemovePackage = (index) => {
    itemRefs.value.splice(index, 1)

    packages.value.splice(index, 1)
}

// When press add button add Item
const newItem = () => {
    slideItem.value = null

    configSlideOver.value.open = !configSlideOver.value.open
}

// When press edit button in table
const editItem = (item, toogleExpansion, index) => {
    slideItem.value = item

    configSlideOver.value.open = !configSlideOver.value.open
}

const validateForm = async (e) => {
    const apiData = {
        ids: items.value.map((element) => element.id),
        packaged_items: [{ ...e }]
    }

    const response = await api.post('/stock/package_validation', apiData)

    response.errors && (errors.value = response.errors)

    return !verifyErrorsByPrefix(response.errors, 'packaged_items')
}

const verifyErrorsByPrefix = (errors, prefix) => {
    let flag = false

    for (const key in errors) {
        if (Object.hasOwnProperty.call(errors, key)) {
            flag = key.includes(prefix)

            if (flag) {
                break
            }
        }
    }

    return flag
}

const onSubmit = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    errors.value = {}

    const data = refForm.value.getData()

    const response = await validateForm(data)

    setButtonToLoading(false)

    if (!response) { return }

    data.id && updateItem(data)

    !data.id && addItem(data)

    errors.value = {}

    configSlideOver.value.close = !configSlideOver.value.close
}

// Update Item after close slide over
const updateItem = (data) => {
    let item = searchPackageById(data.id)

    item = Object.assign(item, data)
}

// Add new item after close slideOver
const addItem = (data) => {
    packages.value.push(Object.assign({}, data, { id: random(0, 1000000) }))
}

const columns = ref([
    { field: 'package', name: 'Package', align: '', customClass: '' },
    { field: 'units_created', name: 'Units created', align: 'center', customClass: '' },
    { field: 'quantity_needed', name: 'Quantity needed', align: 'center', customClass: '' },
    { field: 'quantity_used', name: 'Quantity used', align: 'center', customClass: '' },
    { field: 'variance', name: 'Variance', align: 'center', customClass: '' },
    { field: 'waste', name: 'Waste', align: 'center', customClass: '' },
    { field: 'actions', name: '', align: '', customClass: '' },
])

</script>

<template>
    <div class="flex flex-row justify-between">
        <Title title-type="h3">
            {{ $t('Packaging') }}, {{ totalResidue }} {{ measure }} {{ $t('remaining') }}
        </Title>

        <slot name="right-title"></slot>
    </div>

    <TableUI
            :columns="columns"
            v-model:data="packages"
            :multipleOpen="false">
            <template v-slot:row="{ row, index, toggleExpansion }">
                <tr>
                    <td>
                        <div class="flex justify-between items-center">
                                {{ $t('Package') }} {{ index + 1 }}
                        </div>
                    </td>
                    <td class="text-right">{{ row.units_created }}</td>
                    <td class="text-right">{{ row.quantity_needed }}</td>
                    <td class="text-right">{{ row.quantity_used }}</td>
                    <td class="text-right">{{ row.variance }}</td>
                    <td class="text-right">{{ row.waste }}</td>
                    <td class="text-right w-full">
                        <div class="flex justify-around py-3">
                            <TrashIcon
                                @click="doRemovePackage(index)"
                                class="text-gray-800 cursor-pointer hover:text-red-400 w-6" />

                            <PencilIcon
                                @click="editItem(row, toggleExpansion, index)"
                                class="w-6 text-gray-800 cursor-pointer hover:text-primary-400" />

                            <!-- <component
                                v-permission="{name:['inventory.packaging.manager','inventory.packaging.employee']}"
                                :is="!row.isOpen? ChevronDownIcon: ChevronUpIcon" @click="toggleExpansion(index)"
                                class="text-gray-800 cursor-pointer hover:text-primary-600 w-6" /> -->
                            <div class="font-medium link hover:text-primary-500"
                                @click="toggleExpansion(index)"
                                v-permission="{name:['inventory.packaging.manager','inventory.packaging.employee']}">
                                BoM
                            </div>
                        </div>
                    </td>
                </tr>
            </template>

            <template v-slot:row-expansible="{ row, index, toggleExpansion }">
                <div class="flex w-full justify-center">
                    <PackagingCost v-if="row.isOpen" :row="row" v-model:element="packages[index]" :key="index" :index="index"/>
                </div>
            </template>
    </TableUI>

    <Alert
        v-if="!packages.length"
        :title="t('Please add a finished good package.')"
        type="info"
        class="my-8"
        :has-close-button="false"
        :content="shortParagraph" />

    <!-- Add package button -->
    <div class="flex justify-end">
        <Button
            :label="t('Add finished good package')"
            @click="newItem"
            :disabled="totalResidue < 1"
            type="button"
            class="button success air">
        </Button>
    </div>

    <Slideover
        :open="configSlideOver.open"
        :title="$t('Add package')"
        :id="`${totalResidue} ${ 'units' } ${ $t('available') }`"
        has-cancel-button
        has-save-button
        @clickOnSave="onSubmit"
        :disableSaveButton="configSlideOver.disableSaveButton"
        :close="configSlideOver.close">
        <PackagingForm
            ref="refForm"
            :usePackaging="usePackaging"
            :item="slideItem"
            @disableSaveButton="val =>{configSlideOver.disableSaveButton = val}"
        />
    </Slideover>
</template>
