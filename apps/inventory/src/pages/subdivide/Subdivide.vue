<script setup>
/*
|--------------------------------------------------------------------------
| TODO
|--------------------------------------------------------------------------
|  * Adjunst the variable names to containers instead of bins.
|  * Re asing index when delete container (error validation problem)
*/

import { ref, watch, computed, reactive, inject, onMounted } from 'vue'
import { Title, Button, DivideYWithText, Alert } from 'layout'
import { showUuid, formatDate } from 'shared'
import { isNaN, random } from 'lodash'
import { Input, ShowValue, Treeselect, SelectCustomDate } from 'form'

import { TrashIcon } from '@heroicons/vue/24/outline'

// Inject necessary services
const useGlobalStore = inject('useGlobalStore')
const router = inject('router')
const api = inject('api')

// Store references
const inventoryStore = useGlobalStore('inventory')
const parametersStore = useGlobalStore('parameters')
const tabsStore = useGlobalStore('tabs')

// Extracting query parameters and item ID from the route
const type = router.currentRoute.value.query?.child ? 'child' : 'parent'
const itemId = router.currentRoute.value.params.id

// Component state variables
const element = ref()
const binCount = ref(1)
const bins = reactive([])
const itemRefs = ref([])
const errors = ref({})
const customDate = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const showErrorMessage = ref(false)

const rapidStore = useGlobalStore('rapidStore')

// Fetch inventory item data on component mount
onMounted(async () => {
    // Fetch details of the inventory item
    const response = await inventoryStore.getInventoryItem(itemId)

    response.success && (element.value = response.data)

    // Close the tab if the request fails
    !response.success && tabsStore.closeTab('inventory-subdivide')

    doAddBin()
})

// Adds an empty bin
const doAddBin = () => {
    bins.push({ id: random(0, 100000000) })

    binCount.value = bins.length
}

// Adds multiple bins based on the total number of required bins
const doAddBins = (numberOfBins) => {
    for (let i = 0; i < numberOfBins; i++) {
        doAddBin()
    }
}

// Removes a specific bin by index
const doRemoveBin = (index) => {
    if (bins.length === 1) {
        return
    }

    itemRefs.value.splice(index, 1)

    bins.splice(index, 1)

    binCount.value = bins.length

    deleteBinErrors()
}

// Removes multiple last bins based on the total number of required bins
const doRemoveBins = (numberOfBins) => {
    for (let i = numberOfBins; i > 0; i--) {
        doRemoveLastBin()
    }

    deleteBinErrors()
}

// Removes last bin
const doRemoveLastBin = () => {
    bins.pop()

    deleteBinErrors()

    binCount.value = bins.length
}

// Remove bins errors
const deleteBinErrors = () => {
    for (const key in errors.value) {
        if (key.startsWith('bins.')) delete errors.value[key]
    }
}

// Retrieves locations based on the current inventory item's stage
const getLocations = () => {
    const allLocations = parametersStore.getTreeSelectDataBySlug('locations')

    const filteredLocations = allLocations.filter((location) => {
        return location.data.slug === `${element.value.stage.slug}-room`
    })

    return filteredLocations.length === 0 ? allLocations : filteredLocations[0].children
}

// Save function to post subdivide data to the server
const save = async (config) => {
    const endPoint = type === 'child' ? 'stock/subdivide_child' : 'stock/subdivide'

    isLoading.value = true

    const apiData = {
        id: element.value.id,
        items: bins.map(item => {
            return {
                quantity: item.quantity,
                location_id: item.location ? item.location : null
            }
        }),
        updated_at: customDate.value ? formatDate(customDate.value, 'utcDateTime') : null
    }

    const response = await api.post(endPoint, apiData)

    isLoading.value = false

    if (response.success) {
        inventoryStore.fetch()

        rapidStore.$emitGlobalEvent('load-subitem-list')

        tabsStore.closeTab('inventory-subdivide')
    }

    if (response.success === false) {
        errorMessage.value = response?.message

        showErrorMessage.value = !showErrorMessage.value
    }

    response.errors && (errors.value = response.errors)
}

// Computed property for calculating the total quantity of all bins
const total = computed(() => {
    let myTotal = 0

    bins.forEach((bin) => {
        myTotal += Number(bin.quantity)
    })

    if (isNaN(myTotal)) {
        return 0
    }

    return myTotal
})

// Watcher to dynamically adjust the number of bins based on user input
watch(
    () => binCount.value,
    (newValue) => {
        if (newValue > bins.length) {
            doAddBins(newValue - bins.length)
        }

        if (newValue < bins.length) {
            doRemoveBins(bins.length - newValue)
        }

        binCount.value = bins.length
    }
)
</script>

<template>
    <!-- Main Section for Subdivide Inventory Items -->
    <section v-if="element">
        <!-- Title and Information Section -->
        <Title :title="`${$t('Subdivide:')} ${element.quantity} ${element.measure.name}`">
            <!-- Right-aligned Title Content with UUID -->
            <template #rightTitle>
                {{ showUuid(element.id) }}
            </template>
        </Title>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
            <!-- Left column -->
            <div class="col-span-3">
                <Title
                    title="Split into"
                    titleType="h2" />

                <!-- 'Split into' input -->
                <Input
                    v-model="binCount"
                    inputClass="text-right"
                    :type="'number'"
                    :min="'1'"
                    :errors="errors?.binCount"
                    label="Split into"
                    inline-label-right="new IDs" />

                <!-- Dividing line -->
                <DivideYWithText
                    :text="$t('or')" />

                <!-- 'Add one' button -->
                <Button
                    @click="doAddBin"
                    class="w-full "
                    color="success"
                    label="Add one" />
            </div>

            <!-- Center column (arrow) -->
            <div class="col-span-4 md:col-span-2 md:mt-40 p-0 lg:p-4 xl:p-8 rotate-90 md:rotate-0">
                <img
                    src="../../assets/arrow-right.png"
                    class="opacity-10 m-auto" />
            </div>

            <!-- Right column -->
            <div class="col-span-7">
                <Title
                    title="Resulting new IDs"
                    titleType="h2" />

                <!-- Bins -->
                <div
                    v-for="(part, index) in bins"
                    :key="index">
                    <div class="flex items-start gap-4">
                        <!-- Quantity input -->
                        <Input
                            class="flex-1"
                            v-model="bins[index].quantity"
                            inputClass="text-right"
                            :type="'number'"
                            :min="'0'"
                            :label="`${$t('Part')} ${ index + 1 } ${$t('quantity')}`"
                            :errors="errors[`items.${index}.quantity`] ? ' ' : null"
                            :inline-label-right="element.measure.name" />

                        <!-- Location select -->
                        <div class="flex-1">
                            <Treeselect
                                v-model="bins[index].location"
                                :options="getLocations()"
                                :errors="errors[`items.${index}.location_id`]"
                                placeholder="Select Item"
                                extra="Location" />
                        </div>

                        <!-- Remove button -->
                        <button
                            @click="doRemoveBin(index)"
                            type="button"
                            class="button hover:delete hover:outline h-full mt-3 lg:mt-6 w-20 p-0">
                            <TrashIcon
                                class="w-6 h-6 m-auto"
                                aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <hr class="air" />

                <!-- Total value -->
                <ShowValue
                    justify-end
                    :label="`${$t('Total')} ${element.measure.name}`">
                    {{ isNaN(total) ? ' ' : total }}

                    {{ $t(element.measure.name) }}
                </ShowValue>

                <!-- Select custom date -->
                <SelectCustomDate
                    :errors="errors?.updated_at"
                    v-model="customDate" />

                <!-- Alert for error message -->
                <Alert
                    v-model="showErrorMessage"
                    type="danger"
                    :content="errorMessage" />

                <!-- Save button -->
                <Button
                    @click="save"
                    :loading="isLoading"
                    class="w-full mt-8"
                    color="primary"
                    label="Save" />
            </div>
        </div>
    </section>
</template>
