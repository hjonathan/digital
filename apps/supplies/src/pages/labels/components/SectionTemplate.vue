<script setup>
import { inject, computed, ref, onMounted } from 'vue'
import { Title, ActionButtons, Overlay, ConfirmationModal } from 'layout'
import { Table } from 'table'

import { configTable } from '../components/configTemplatestable/configTable'
import { configColumns } from '../components/configTemplatestable/configColumns'
import { configButtons } from '../components/configTemplatestable/configButtons'

const props = defineProps({
    useLabels: Object
})

const useGlobalStore = inject('useGlobalStore')
const labelsStore = useGlobalStore('suppliesLabels')
const rapidStore = useGlobalStore('rapidStore')

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

    props.useLabels.disableNextButton.value = true

    props.useLabels.labelSelected.value = []
}

rapidStore.$registerGlobalEvent('resetLabelsSelected', payload => {
    props.useLabels.labelSelected.value = []
})

// Configuration for table, table columns and table buttons
const columns = configColumns({ useGlobalStore, openDeleteConfirmationModal })
const buttons = configButtons({ useLabels: props.useLabels, useGlobalStore })
const configuration = configTable({ useLabels: props.useLabels })

const data = computed(() => {
    return labelsStore.getData()
})

onMounted(() => {
    props.useLabels.disableBackButton.value = true
})
</script>

<template>
    <!-- Confirmation modal to delete invoice -->
    <ConfirmationModal
        :description="$t('Are you sure you want to delete this label?')"
        title="Delete confirmation"
        v-model="showModal"
        @confirm="deleteLabel"
        type="danger"
        class="!z-50" />

    <section>
        <Title
            title-type="h2"
            :hasBorderBottomLine="false"
            :title="$t('Select template')" />

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
                    <ActionButtons
                        :items="buttons" />
                </template>
            </Table>

            <!-- Display an overlay with a loading message if no data is available or while loading -->
            <Overlay
                v-if="!data.length"
                class="mt-28" />
        </div>
    </section>
</template>
