<script setup>
import { inject, computed, ref } from 'vue'
import { Title, ActionButtons, Overlay } from 'layout'
import { Table } from 'table'

import { configTable } from './configProductsTable/configTable'
import { configColumns } from './configProductsTable/configColumns'
import { configButtons } from './configProductsTable/configButtons'

const props = defineProps({
    useLabels: Object
})

// Inject the global store for managing inventory data
const useGlobalStore = inject('useGlobalStore')
const inventoryStore = useGlobalStore('inventory')

const apiGrid = ref()

// Configuration for table, table columns and table buttons
const columns = configColumns({ useGlobalStore })
const buttons = configButtons({ useLabels: props.useLabels })
const configuration = configTable({ apiGrid, useLabels: props.useLabels })

// Retrieves data from the inventory store
const data = computed(() => {
    return inventoryStore.getData()
})
</script>

<template>
    <!-- Header section -->
    <section>
        <Title
            title-type="h2"
            :hasBorderBottomLine="false"
            :title="$t('Select products')" />

        <p>{{ $t('Select the items to print.') }}</p>

        <!-- Main section with the table or loading overlay -->
        <div class="table-inside-stepper">
            <!-- Display the table if there is data available -->
            <Table
                v-if="data.length"
                :elements="data"
                :columns="columns"
                :config="configuration">
                <template v-slot:start-buttons>
                    <ActionButtons :items="buttons" />
                </template>
            </Table>

            <!-- Display an overlay with a loading message if no data is available or while loading -->
            <Overlay
                v-if="!data.length"
                class="mt-28" />
        </div>
    </section>
</template>
