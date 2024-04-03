<script setup>
import { inject, computed, ref } from 'vue'
import { Table } from 'table'
import { ActionButtons, Overlay, ConfirmationModal } from 'layout'
import { configTable } from './configTable'
import { configColumns } from './configColumns'
import { configButtons } from './configButtons'

// Inject the global store for managing labels data
const useGlobalStore = inject('useGlobalStore')
const labelsStore = useGlobalStore('labels')

const apiGrid = ref()

const showModal = ref(false)

const labelToDeleteId = ref(null)

// Opens the deletion confirmation modal
const openDeleteConfirmationModal = (label) => {
    showModal.value = !showModal.value

    // Assigns the ID of the label to be deleted.
    labelToDeleteId.value = label.id
}

const deleteLabel = async () => {
    await labelsStore.remove(labelToDeleteId.value)
}

// Configuration for table, table columns and table buttons
const columns = configColumns({ useGlobalStore, openDeleteConfirmationModal })
const buttons = configButtons({ useGlobalStore })
const configuration = configTable({ apiGrid })

// Retrieves data from the inventory store
const data = computed(() => {
    return labelsStore.getData()
})
</script>

<template>
    <!-- Confirmation modal to delete invoice -->
    <ConfirmationModal
        :description="$t('Are you sure you want to delete this label?')"
        title="Delete confirmation"
        type="danger"
        v-model="showModal"
        @confirm="deleteLabel" />

    <!-- Main section with the table or loading overlay -->
    <section class="full pt-0">
        <!-- Display the table if there is data available -->
        <Table
            v-if="data.length"
            :has-columns-filters="false"
            :has-filters="false"
            :elements="data"
            :columns="columns"
            :config="configuration">
            <template v-slot:start-buttons>
                <ActionButtons :items="buttons" />
            </template>
        </Table>

        <!-- Display an overlay with a loading message if no data is available or while loading -->
        <Overlay
            v-if="data.length === 0"
            title="Loading" />
    </section>
</template>
