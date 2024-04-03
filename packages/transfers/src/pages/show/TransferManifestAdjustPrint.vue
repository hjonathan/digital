<script setup>
import QRExample from './QRExample.vue'
import { formatDate, showUuid } from 'shared'

const props = defineProps({
    data: Object,
    routeToBeTraveled: String,
    isInPrintMode: {
        type: Boolean,
        default: false
    }
})

// Add an auto-incremented index to each item
props.data.item = props.data.item.map((item, index) => ({ ...item, index: index + 1 }))

const adjustmentDate = props.data.received_at ?? props.data.updated_at
</script>

<template>
    <div class="h-full">
        <!-- Header -->
        <table class="custom w-full mb-4">
            <tr>
                <!-- QR Code and ID -->
                <td
                    rowspan="2"
                    class="w-[20%]">
                    <span class="text-xs flex justify-center">
                        <QRExample />
                    </span>

                    <span class="text-xs text-center block">
                        {{ data?.id }}
                     </span>
                </td>

                <!-- Title -->
                <td
                    rowspan="2"
                    class="w-[45%] font-semibold text-center uppercase">
                    <span class="block text-2xl">
                        {{ $t('Adjustments manifest') }}
                    </span>

                    <span class="text-xl">
                        {{ 'MARIJUANA PROGRAM' }}
                    </span>
                </td>

                <!-- Date -->
                <td
                    class="w-[20%] font-semibold print-custom-leading text-base bg-gray-200 whitespace-nowrap h-9">
                    {{ $t('Adjustment date') }}
                </td>
            </tr>

            <!-- Adjustment date -->
            <tr>
                <td class="w-[20%] text-sm whitespace-nowrap h-9">
                    {{ adjustmentDate ? formatDate(adjustmentDate, 'utcDateTime') : '-' }}
                </td>
            </tr>
        </table>

        <div class="grid grid-cols-2 gap-x-7 gap-y-4">
            <!-- Sender information -->
            <table class="custom">
                <tbody class="text-base">
                    <!-- Title -->
                    <tr>
                        <td
                            colspan="44"
                            class="uppercase bg-gray-200 font-semibold text-center text-lg">
                            {{ $t('Sender information') }}
                        </td>
                    </tr>

                    <!-- Facility name and license # -->
                    <tr>
                        <!-- Facility name -->
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('Facility') }}
                        </td>

                        <td class="w-[35%]">
                            {{ data.origin_facility?.facility_name }}
                        </td>

                        <!-- Facility license # -->
                        <td class="w-[15%] whitespace-nowrap  bg-gray-200">
                            {{ $t('License #') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.origin_facility?.license_number }}
                        </td>
                    </tr>

                    <!-- Facility address -->
                    <tr>
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('Address') }}
                        </td>

                        <td
                            colspan="3"
                            class="w-[80%]">
                            {{ data.origin_facility.address }}
                        </td>
                    </tr>

                    <!-- Faciity Address 2 -->
                    <tr>
                        <td class="w-[23%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Address 2') }}
                        </td>

                        <td
                            colspan="3"
                            class="w-[80%]">
                            {{ data.origin_facility?.address_2 }}
                        </td>
                    </tr>

                    <!-- City, State and Zip Code -->
                    <tr>
                        <!-- City and State -->
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('City, State') }}
                        </td>

                        <td class="w-[35%]">
                            {{ data.origin_facility?.city }},
                            {{ data.origin_facility?.state }}
                        </td>

                        <!-- Zip code -->
                        <td class="w-[15%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Zip Code') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.origin_facility?.zip_code }}
                        </td>
                    </tr>

                    <!-- Phone -->
                    <tr>
                        <td class="w-[23%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Phone') }}
                        </td>

                        <td
                            colspan="3"
                            class="w-[80%]">
                            {{ data.origin_facility?.phone }}
                        </td>
                    </tr>

                    <!-- Contact name and contact phone -->
                    <tr>
                        <!-- Contact name -->
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('Contact name') }}
                        </td>

                        <td class="w-[35%]">
                            {{ data.origin_facility?.contact_name }}
                        </td>

                        <!-- Contact phone -->
                        <td class="w-[15%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Phone') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.origin_facility?.contact_phone }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Receiver information -->
            <table class="custom">
                <tbody class="text-base">
                    <!-- Title -->
                    <tr>
                        <td
                            colspan="44"
                            class="uppercase bg-gray-200 font-semibold text-center text-lg">
                            {{ $t('Receiver information') }}
                        </td>
                    </tr>

                    <!-- Receiver name and license # -->
                    <tr>
                        <!-- Receiver name -->
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('Facility') }}
                        </td>

                        <td class="w-[35%]">
                            {{ data.destination_facility?.facility_name }}
                        </td>

                        <!-- Receiver license # -->
                        <td class="w-[15%] whitespace-nowrap  bg-gray-200">
                            {{ $t('License #') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.destination_facility?.license_number }}
                        </td>
                    </tr>

                    <!-- Receiver address -->
                    <tr>
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('Address') }}
                        </td>

                        <td
                            colspan="3"
                            class="w-[80%]">
                            {{ data.destination_facility.address }}
                        </td>
                    </tr>

                    <!-- Receiver Address 2 -->
                    <tr>
                        <td class="w-[23%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Address 2') }}
                        </td>

                        <td
                            colspan="3"
                            class="w-[80%]">
                            {{ data.destination_facility?.address_2 }}
                        </td>
                    </tr>

                    <!-- City, State and Zip Code -->
                    <tr>
                        <!-- City and State -->
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('City, State') }}
                        </td>

                        <td class="w-[35%]">
                            {{ data.destination_facility?.city }},
                            {{ data.destination_facility?.state }}
                        </td>

                        <!-- Zip code -->
                        <td class="w-[15%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Zip Code') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.destination_facility?.zip_code }}
                        </td>
                    </tr>

                    <!-- Phone -->
                    <tr>
                        <td class="w-[23%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Phone') }}
                        </td>

                        <td
                            colspan="3"
                            class="w-[80%]">
                            {{ data.destination_facility?.phone }}
                        </td>
                    </tr>

                    <!-- Contact name and contact phone -->
                    <tr>
                        <!-- Contact name -->
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
                            {{ $t('Contact name') }}
                        </td>

                        <td class="w-[35%]">
                            {{ data.destination_facility?.contact_name }}
                        </td>

                        <!-- Contact phone -->
                        <td class="w-[15%] whitespace-nowrap  bg-gray-200">
                            {{ $t('Phone') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.destination_facility?.contact_phone }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Product / items shipped details -->
        <table class="custom mt-4 w-full !border-b-0 !border-l-0">
            <tbody class="text-sm">
                <!-- Titles -->
                <tr>
                    <td
                        colspan="10"
                        class="bg-gray-200 uppercase font-semibold text-lg text-center">
                        {{ $t('Adjusted product details') }}
                    </td>
                </tr>

                <!-- Header -->
                <tr class="text-base bg-gray-200">
                    <!-- Number -->
                    <td class="w-[5%] text-center">
                        #
                    </td>

                    <td class="w-[8%]">
                        {{ $t('ID') }}
                    </td>

                    <td class="w-[8%]">
                        {{ $t('Batch ID') }}
                    </td>

                    <td class="w-[20%]">
                        {{ $t('Item type') }}
                    </td>

                    <td
                        colspan="2"
                        class="w-[25%]">
                        {{ $t('Harvested date or Manufatured date') }}
                    </td>

                    <td>

                    </td>

                    <td class="w-[8%]">
                        {{ $t('Quantity') }}
                    </td>

                    <td class="w-[8%]">
                        {{ $t('Cost') }}
                    </td>

                    <td class="w-[8%]">
                        {{ $t('Total') }}
                    </td>
                </tr>

                <template
                    v-for="(item, index) of data.item"
                    :key="index">
                    <!-- First row -->
                    <tr>
                        <!-- Index -->
                        <td
                            rowspan="3"
                            class="text-center print-custom-leading">
                            {{ item.index }}
                        </td>

                        <!-- ID -->
                        <td
                            rowspan="3"
                            class="print-custom-leading">
                            {{ showUuid(item.id) }}
                        </td>

                        <!-- Batch -->
                        <td
                            rowspan="3"
                            class="print-custom-leading">
                            {{ showUuid(item.batch?.id) }}
                        </td>

                        <!-- Item type -->
                        <td
                            rowspan="3"
                            class="print-custom-leading">
                            <span v-if="item.finished_good_type_id">
                                    {{ item.finished_good_type?.name }}
                            </span>

                            <span v-if="!item.finished_good_type_id">
                                {{ item.item_type?.name }}
                            </span>
                        </td>

                        <!-- Harvested date -->
                        <td
                            rowspan="3"
                            colspan="2"
                            class="print-custom-leading">
                            {{ item.item_operation_summaries && (item.finished_good_type_id || item.stage?.slug === 'harvested') ? formatDate(item.item_operation_summaries[0]?.start_date) : '-' }}
                        </td>

                        <!-- Title -->
                        <td class="bg-gray-200 print-custom-leading">
                            {{ $t('Original') }}
                        </td>

                        <!-- Quantity -->
                        <td
                            :class="{ 'line-through' : data.item_transfers[index].item_transfer_type_id === 2 }"
                            class="print-custom-leading text-right print-custom-leading">
                            {{ data.item_transfers[index].original_quantity  }}
                        </td>

                        <!-- Cost -->
                        <td
                            rowspan="3"
                            class="print-custom-leading text-right print-custom-leading">
                            ${{ item.item_type.price }}
                        </td>

                        <!-- Previus total -->
                        <td class="print-custom-leading print-custom-leading text-right">
                            ${{ item.item_type.price * data.item_transfers[index].original_quantity }}
                        </td>
                    </tr>

                    <!-- Second row -->
                    <tr>
                        <!-- Title -->
                        <td class="bg-gray-200 print-custom-leading">
                            {{ $t('Adjusted') }}
                        </td>

                        <!-- Adjusted quantity and action -->
                        <td class="text-right" style="line-height: .7;">
                            <div v-if="data.item_transfers[index].item_transfer_type_id === 1">
                                <span class="block mt-[5px]" style="line-height: .7;">
                                    {{
                                        data.item_transfers[index].original_quantity > data.item_transfers[index].quantity
                                            ? '-'
                                            : '+'
                                    }}

                                    {{
                                        data.item_transfers[index].original_quantity > data.item_transfers[index].quantity
                                            ? (data.item_transfers[index].original_quantity - data.item_transfers[index].quantity)
                                            : (data.item_transfers[index].quantity - data.item_transfers[index].original_quantity)
                                    }}
                                </span>

                                <span class="text-xs block" style="line-height: .7;">
                                    {{
                                        data.item_transfers[index].original_quantity > data.item_transfers[index].quantity
                                            ? '(Decrease)'
                                            : '(Increase)'
                                    }}
                                </span>
                            </div>

                            <div
                                v-if="data.item_transfers[index].item_transfer_type_id !== 1"
                                class="print-custom-leading">
                                <span
                                    v-if="data.item_transfers[index].item_transfer_type_id === 2">
                                    {{ $t('Deleted') }}
                                </span>

                                <span v-if="data.item_transfers[index].item_transfer_type_id !== 1 && data.item_transfers[index].item_transfer_type_id !== 2">
                                    -
                                </span>
                            </div>
                        </td>

                        <!-- Total -->
                        <td class="text-right print-custom-leading">
                            <div v-if="data.item_transfers[index].item_transfer_type_id === 1">
                                <span class="block mt-[5px]" style="line-height: .7;">
                                    {{
                                        (item.item_type.price * data.item_transfers[index].original_quantity) > (item.item_type.price * item.quantity)
                                            ? '-'
                                            : '+'
                                    }}

                                    {{
                                        (item.item_type.price * data.item_transfers[index].original_quantity) > (item.item_type.price * item.quantity)
                                            ? `$${(item.item_type.price * data.item_transfers[index].original_quantity) - (item.item_type.price * item.quantity)}`
                                            : `$${(item.item_type.price * item.quantity) - (item.item_type.price * data.item_transfers[index].original_quantity)}`
                                    }}
                                </span>

                                <span class="text-xs block" style="line-height: .7;">
                                    {{
                                        data.item_transfers[index].original_quantity > data.item_transfers[index].quantity
                                            ? '(Decrease)'
                                            : '(Increase)'
                                    }}
                                </span>
                            </div>

                            <div
                                v-if="data.item_transfers[index].item_transfer_type_id !== 1"
                                class="print-custom-leading">
                                    -
                            </div>
                        </td>
                    </tr>

                    <!-- Third row -->
                    <tr>
                        <!-- Title -->
                        <td class="bg-gray-200 print-custom-leading font-bold">
                            {{ $t('Total') }}
                        </td>

                        <!-- New total quantity -->
                        <td
                            :class="{ 'line-through' : data.item_transfers[index].item_transfer_type_id === 2 }"
                            class="text-right print-custom-leading font-bold">
                            {{ data.item_transfers[index].quantity  }}
                        </td>

                        <!-- New total -->
                        <td
                            :class="{ 'line-through' : data.item_transfers[index].item_transfer_type_id === 2 }"
                            class="text-right print-custom-leading font-bold">
                            ${{ item.item_type.price * item.quantity }}
                        </td>
                    </tr>

                    <!-- Divide row -->
                    <tr v-if="index !== data.item.length - 1">
                        <td
                            colspan="10"
                            class="h-5 bg-gray-200" />
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
table {
    border: 1px solid black;
    border-collapse: collapse;
}

td {
    border: 2px solid black;
    padding-inline: 10px;
}
</style>
