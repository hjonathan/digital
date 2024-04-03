<script setup>
/**
 * TODO: Allows split into 1 if 1 is written in the form
 */

import { ref, onMounted, inject, watch } from 'vue'
import { Title, Button, DivideYWithText } from 'layout'
import { Input, ShowValue, TextArea, SelectCustomDate } from 'form'
import { showUuid, formatDate } from 'shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const itemToSplit = ref({
    quantities: [],
    total: 0,
    note: '',
    updated_at: null
})

// Inject necessary services
const api = inject('api')
const router = inject('router')
const useGlobalStore = inject('useGlobalStore')

// Store references
const tabsStore = useGlobalStore('tabs')
const inventoryStore = useGlobalStore('inventory')

const itemId = router.currentRoute.value.params.id
const type = router.currentRoute.value.query?.type
const parts = ref(2)
const errors = ref({})
const totalError = ref()
const element = ref()
const isLoading = ref(false)

const rapidStore = useGlobalStore('rapidStore')

onMounted(async () => {
    // Fetch details of the inventory item
    const response = await inventoryStore.getInventoryItem(itemId)

    // Set element value if the request is successful
    response.success && (element.value = response.data)

    // Close the tab if the request fails
    !response.success && tabsStore.closeTab('inventory-split')
})

// Splitting logic for evenly distributed parts
const doSplitEvenly = () => {
    const splitInto = parts.value

    if (!splitInto) return

    const split = element.value.quantity / splitInto

    // Even split
    if (Number.isInteger(split)) {
        for (let i = 0; i < splitInto; i++) {
            itemToSplit.value.quantities[i] = split
        }
    }

    if (!Number.isInteger(split)) {
        const decimalPart = split % 1

        let accumulatedDecimalPart = 0

        for (let i = 0; i < splitInto; i++) {
            accumulatedDecimalPart = accumulatedDecimalPart + decimalPart

            // DecimalPart has NOT accumulated one whole unit
            if (accumulatedDecimalPart < 0.99999999999) {
                itemToSplit.value.quantities[i] = Math.floor(split)
            }

            // DecimalPart has accumulated at least one whole unit
            if (accumulatedDecimalPart >= 0.99999999999) {
                itemToSplit.value.quantities[i] = Math.floor(split) + 1

                accumulatedDecimalPart = 0
            }
        }

        itemToSplit.value.quantities.sort()
    }

    itemToSplit.value.waste = 0
}

// Splitting logic for creating one pound parts
const doOnePoundParts = () => {
    const pound = 454

    const partCount = element.value.quantity / pound

    // Even part count
    if (Number.isInteger(partCount)) {
        parts.value = partCount

        for (let i = 0; i < parts.value; i++) {
            itemToSplit.value.quantities[i] = pound
        }

        itemToSplit.value.waste = 0
    }

    // Uneven part count
    if (!Number.isInteger(partCount)) {
        parts.value = Math.floor(partCount) + 1

        for (let i = 0; i < parts.value - 1; i++) {
            itemToSplit.value.quantities[i] = pound
        }

        itemToSplit.value.quantities[parts.value - 1] = element.value.quantity - (pound * (parts.value - 1))

        itemToSplit.value.waste = 0
    }
}

// Validation logic to ensure the total matches the original quantity
const validate = () => {
    if (itemToSplit.value.total !== element.value.quantity) {
        totalError.value = [`${t('Total should be equal to')} ${element.value.quantity} ${element.value.measure.name}.`]

        return totalError.value
    }

    // Reset total error if validation passes
    totalError.value = null

    return totalError.value
}

// Update total units
watch(
    () => [itemToSplit.value.quantities, itemToSplit.value.waste],
    () => {
        // Calculate the total and run validation on each change
        itemToSplit.value.total = itemToSplit.value.quantities.reduce((a, b) => a + b, 0) + itemToSplit.value.waste

        validate()
    }, { deep: true, inmediate: true }
)

// Watcher for changes in the number of parts
watch(
    () => parts.value,
    () => {
        const newQuantities = []

        for (let i = 0; i < parts.value; i++) {
            if (itemToSplit.value.quantities[i]) { newQuantities[i] = itemToSplit.value.quantities[i] }
        }

        itemToSplit.value.quantities = newQuantities
    }, { deep: true, inmediate: true }
)

// Save function to post split data to the server
const save = async () => {
    const endPoint = type === 'child' ? '/stock/split_child' : '/stock/split'

    isLoading.value = true

    const response = await api.post(endPoint, {
        id: element.value.id,
        ...itemToSplit.value,
        updated_at: itemToSplit.value.updated_at ? formatDate(itemToSplit.value.updated_at, 'utcDateTime') : null
    })

    isLoading.value = false

    // Fetch the updated inventory and close the tab on success
    if (response.success) {
        inventoryStore.fetch()

        tabsStore.closeTab('inventory-split')
    }

    response.success && type === 'child' && rapidStore.$emitGlobalEvent('load-subitem-list')

    // Display errors if the request fails
    if (response.errors) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

        errors.value = response.errors
    }
}
</script>

<template>
    <!-- Main Section for Splitting Inventory Items -->
    <section v-if="element">
        <!-- Title and Information Section -->
        <Title :title="`${$t('Split:')} ${element.quantity} ${element.measure.name}`">
            <!-- Right-aligned Title Content with UUID -->
            <template #rightTitle>
                {{ showUuid(element.id) }}
            </template>
        </Title>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
            <!-- Left column -->
            <div class="col-span-5">
                <Title
                    title="split"
                    titleType="h2" />

                <Input
                    v-model="parts"
                    inputClass="text-right"
                    :type="'number'"
                    :min="'2'"
                    :errors="errors?.parts"
                    label="Split into"
                    inline-label-right="new IDs" />

                <ShowValue
                    label="Distribute"
                    valueClass="!px-0"
                    extra="As even as possible">
                    <Button
                        @click="doSplitEvenly"
                        class="w-full"
                        color="primary"
                        label="Distribute evenly" />
                </ShowValue>

                <!-- Dividing line -->
                <DivideYWithText
                    :text="$t('or')" />

                <Title
                    title="Auto split"
                    titleType="h2" />

                <ShowValue
                    label="1 Pound (454gr.)"
                    valueClass="!px-0"
                    extra="As close as possible">
                    <Button
                        @click="doOnePoundParts"
                        :disabled="element.measure.name === 'units'"
                        class="w-full"
                        color="primary"
                        label="Distribute in 1 pound parts" />
                </ShowValue>
            </div>

            <!-- Center column (arrow) -->
            <div class="col-span-4 md:col-span-2 md:mt-40 p-0 lg:p-4 xl:p-8 rotate-90 md:rotate-0">
                <img
                    src="../../assets/arrow-right.png"
                    class="opacity-10 m-auto" />
            </div>

            <!-- Right column -->
            <div class="col-span-5">
                <Title
                    title="Resulting new IDs"
                    titleType="h2" />

                <!-- Quantity input -->
                <Input
                    v-for="(part, index) in parts"
                    :key="index"
                    v-model="itemToSplit.quantities[index]"
                    inputClass="text-right"
                    :type="'number'"
                    :min="'0'"
                    :label="`${$t('Part')} ${part} ${$t('quantity')}`"
                    :inline-label-right="element.measure.name" />

                <hr class="air-sm" />

                <!-- Waste input -->
                <Input
                    v-model="itemToSplit.waste"
                    inputClass="text-right"
                    :type="'number'" :min="'0'"
                    :errors="errors?.waste"
                    label="Waste"
                    :inline-label-right="element.measure.name" />

                <hr class="air-sm" />

                <!-- Total -->
                <ShowValue
                    :errors="totalError"
                    v-model="itemToSplit.total"
                    justify-end=""
                    :label="`${$t('Total')} ${element.measure.name}`" />

                <!-- Note -->
                <TextArea
                    v-model="itemToSplit.note"
                    :errors="errors?.note"
                    label="Note" />

                <!-- Select custom date -->
                <SelectCustomDate
                    :errors="errors?.updated_at"
                    v-model="itemToSplit.updated_at" />

                <!-- Save button -->
                <Button
                    @click="save"
                    :disabled="totalError"
                    :loading="isLoading"
                    class="w-full mt-8"
                    color="primary"
                    label="Save" />
            </div>
        </div>
    </section>
</template>
