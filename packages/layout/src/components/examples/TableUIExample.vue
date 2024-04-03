<script setup>
import { Input } from 'form'
import { TableUI, Button, Title } from 'layout'
import { onMounted, ref } from 'vue'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'

// Example colums for TableUI
const columns = ref([
    { field: 'id', name: 'Domain & plan name', align: 'left', customClass: 'bg-primary-500 text-white' },
    { field: 'vendor.name', name: 'Storage', align: 'left', customClass: '' },
    { field: 'invoice.number', name: 'Montly visitor', align: 'right', customClass: '' },
    { field: 'invoice.number', name: 'Domain', align: 'right', customClass: '' },
    { field: 'invoice.number', name: 'Status', align: 'right', customClass: '' },
    { field: 'invoice.number', name: 'Status', align: 'right', customClass: '' },
    { field: 'invoice.number', name: 'Status', align: 'right', customClass: '' },
    { field: 'invoice.number', name: 'Status', align: 'right', customClass: '' },
    { field: 'invoice.number', name: 'Status', align: 'right', customClass: '' },
])

// Example initial data for TableUI
const dataTable = ref([
    {
        id: '40EJ09R4',
        vendor: {
            name: 'Vendor 1',
            addres: 'Mesa 123kjqkjw dqwe',
            phone: '+591796215325'
        },
        invoice: {
            number: '209392'
        },
        itemsReceived: [
            { id: 'WE23', name: 'Item 1' },
            { id: 'WE2453', name: 'Item 2' },
        ],
        totalPrice: '1500',
        updatedAt: '2023-12-10'
    },
])

onMounted(() => {
    // Example many rows for TableUI data
    for (let index = 0; index < 30; index++) {
        dataTable.value.push({
            id: '40EJ09R4',
            vendor: {
                name: 'Vendor 1',
                addres: 'Mesa 123kjqkjw dqwe',
                phone: '+591796215325'
            },
            invoice: {
                number: '209392'
            },
            itemsReceived: [
                { id: 'WE23', name: 'Item 1' },
                { id: 'WE2453', name: 'Item 2' },
            ],
            totalPrice: '1500',
            receptionDate: '2023-10-10',
            updatedAt: '2023-12-10'
        })
    }
})
</script>

<template>
    <section>
        <!-- Title -->
        <Title
            :title="$t('Table UI example')" />

        <!-- TableUI -->
        <TableUI
            :columns="columns"
            v-model:data="dataTable"
            :multipleOpen="false">
            <template v-slot:row="{ row, index, toggleExpansion }">
                <tr>
                    <td>
                        <div class="!w-24">{{ row.id }} {{ index }}</div>
                    </td>
                    <td>
                        <Input
                            placeholder="Some"
                            container-class="none !w-48"
                            outline
                            size="sm" />
                    </td>
                    <td class="text-right">{{ row.invoice.number }}</td>
                    <td class="text-right">{{ row.invoice.number }}</td>
                    <td class="text-right">{{ row.invoice.number }}</td>
                    <td class="text-right">{{ row.invoice.number }}</td>
                    <td class="text-right">{{ row.invoice.number }}</td>
                    <td class="text-right">
                        <div class="text-green-600" >${{ row.invoice.number }}</div>
                    </td>
                    <td>
                        <Button
                            rounded
                            color="secondary"
                            :icon="row.isOpen ? mdiArrowUp : mdiArrowDown"
                            @click="toggleExpansion(index)" />
                    </td>
                </tr>
            </template>

            <template v-slot:row-expansible="{ row, index, toggleExpansion }">
                <div class="p-5">
                    <table class="!w-full">
                        <tbody>
                            <tr>
                                <td>{{ row?.id }}</td>
                                <td>{{ index }}</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>
                            <tr>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>
                            <tr>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>
                            <tr>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>
                            <tr>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>
                        </tbody>
                    </table>

                    <Button
                        color="primary"
                        :label="$t('Close row')"
                        @click="toggleExpansion(index)"/>
                </div>
            </template>
        </TableUI>
    </section>
</template>
