<script setup>
import { TableUI, Button } from 'layout'
import { ref } from 'vue'
import { AutoComplete, Input } from 'form'
import { mdiDeleteOutline } from '@mdi/js'

const columns = ref([])

const addDepartment = () => {
    columns.value.push({})
}

</script>

<template>
    <div class="row">
        <div>
            <Button
                color="primary"
                :label="$t('Add Department')"
                @click="addDepartment" />
        </div>



        <div class="w-full overflow-x-auto">
            <table class="table">
                <thead>
                    <tr>
                        <th class="p-5 sticky left-0 h-fit bg-white text-black z-50" rowspan="2">Item</th>
                        <th colspan="100%" class="!text-center sticky right-0 h-fit bg-white text-black z-50">Department</th>
                    </tr>
    
                    <tr>
                        <th v-for="(department, index) of columns"
                            :key="index"
                            class="p-5 min-w-[200px]">
                            
                            <Button
                                :icon="mdiDeleteOutline"
                                rounded
                                color="danger" />

                            <AutoComplete />
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td class="p-5 sticky left-0 h-fit bg-white text-black z-50 min-w-[200px]">DEMO ITEM FOR DISTRIBUTION</td>

                        <td class="p-5" v-for="(department, index) of columns"
                            :key="index">
                            <Input />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>