<script setup>
import { inject, computed, onMounted } from 'vue'

import { configTable } from '../components/configLabelsTable/configTable'
import { configColumns } from '../components/configLabelsTable/configColumns'
import { configButtons } from '../components/configLabelsTable/configButtons'

import { Title, ActionButtons, Overlay } from 'layout'
import { Table } from 'table'

const props = defineProps({
    useLabels: Object
})

// Inject the global store for managing inventory data
const useGlobalStore = inject('useGlobalStore')
const labelsStore = useGlobalStore('labels')

// Configuration for table, table columns and table buttons
const columns = configColumns({ useGlobalStore })
const buttons = configButtons({ useLabels: props.useLabels })
const configuration = configTable({ useLabels: props.useLabels })

// Retrieves data from the inventory store
const data = computed(() => {
    return labelsStore.getData()
})

onMounted(() => {
    props.useLabels.disableNextButton.value = true
})
</script>

<template>
    <!-- Header section -->
    <section>
        <Title
            title-type="h2"
            :hasBorderBottomLine="false"
            :title="$t('Select Template')" />

        <p>{{ $t('Select the template that will be used to print the labels.') }}</p>

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
