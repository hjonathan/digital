<script setup>
import { EntityInformation } from 'layout'
import { inject, ref } from 'vue'
import { mdiOfficeBuilding } from '@mdi/js'
import { defineModel } from 'shared'

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const vendorModel = defineModel('vendor')

const vendor = ref({
    icon: mdiOfficeBuilding,
    title: 'Vendor',
    name: null,
    rawData: null,
    data: null
})

const thread = ref({
    idThread: 'ReceptionsVendors',
    action: 'Receptions'
})

const addVendor = (data) => {
    vendor.value = {
        ...vendor.value,
        title: data.value[0].name,
        name: data.value[0].company_name,
        rawData: data.value[0],
        data: {
            email: data.value[0].email,
            phone: data.value[0].phone,
            state: data.value[0].state,
            website: data.value[0].website
        }
    }

    vendorModel.value = vendor.value
}

rapidStore.$registerGlobalEvent(`selectedRows:${thread.value.idThread}`, addVendor)

const onClick = () => tabsStore.openTab({ name: 'ReceptionsVendors', query: { ...thread.value } })

</script>

<template>

        <div class="flex">
            <EntityInformation
                insideCardClasses="h-full items-center"
                :hasCard="!vendor.data"
                :action="!vendor.data ? onClick : null"
                :icon="vendor.icon"
                :title="vendor.title"
                :name="vendor.name"
                :data="vendor.data"
                class="!w-96 flex items-center">
                <div v-if="!vendor.data" class="">
                    {{ $t('Please select a vendor') }}
                </div>

                <button
                    v-if="vendor.data"
                    @click="onClick"
                    class="link primary notPrintableArea mt-2">
                    {{ $t('Change') }}
                </button>
            </EntityInformation>
        </div>
</template>
