<script setup>
import { inject, computed, ref, onMounted } from 'vue'
import { Title, ActionButtons } from 'layout'
import { Table } from 'table'

import { configTable } from './configSuppliesTable/configTable'
import { configColumns } from './configSuppliesTable/configColumns'
import { configButtons } from './configSuppliesTable/configButtons'

const props = defineProps({
    useLabels: Object
})

const useGlobalStore = inject('useGlobalStore')
const suppliesStore = useGlobalStore('supplies')

const apiGrid = ref()

// Configuration for table, table columns and table buttons
const columns = configColumns({ useGlobalStore })
const buttons = configButtons({ useLabels: props.useLabels })
const configuration = configTable({ apiGrid, useLabels: props.useLabels })

const data = computed(() => {
    const supplies = suppliesStore.data.filter(supply => {
        return supply.quantity > 0
    })

    return supplies
})

onMounted(() => {
    props.useLabels.disableNextButton.value = true

    props.useLabels.disableBackButton.value = false
})
</script>

<template>
    <section>
        <Title
            title-type="h2"
            :hasBorderBottomLine="false"
            :title="$t('Select supplies')" />

        <p>{{ $t('Select the supplies to print.') }}</p>

        <!-- Main section with the table or loading overlay -->
        <div class="table-inside-stepper">
            <!-- Display the table if there is data available -->
            <Table
                :elements="data"
                :columns="columns"
                :config="configuration">
                <template v-slot:start-buttons>
                    <ActionButtons
                        :items="buttons" />
                </template>
            </Table>
        </div>
    </section>
</template>
