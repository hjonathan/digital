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

// Returns items that have undergone any adjustments.
const adjustedItems = props.data.item_transfers.filter(objeto => {
    return objeto.item_transfer_type_id !== null
})

// Returns items that have not undergone any adjustments.
const itemsWithoutAdjustment = props.data.item_transfers.filter(objeto => {
    return objeto.item_transfer_type_id === null
})

// Allows fetching data for an item based on its ID.
const getItemByID = (id) => {
    return props.data.item.filter(item => {
        return item.id === id
    })[0]
}

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

        <!-- Sender and receiver Information -->
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
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
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
                        <td class="w-[15%] whitespace-nowrap bg-gray-200">
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
                        <td class="w-[15%] whitespace-nowrap bg-gray-200">
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
                        <td class="w-[15%] whitespace-nowrap bg-gray-200">
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
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
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
                        <td class="w-[15%] whitespace-nowrap bg-gray-200">
                            {{ $t('Zip Code') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.destination_facility?.zip_code }}
                        </td>
                    </tr>

                    <!-- Phone -->
                    <tr>
                        <td class="w-[23%] whitespace-nowrap bg-gray-200">
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
                        <td class="w-[15%] whitespace-nowrap bg-gray-200">
                            {{ $t('Phone') }}
                        </td>

                        <td class="w-[28%]">
                            {{ data.destination_facility?.contact_phone }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Product shipped details (title) -->
        <table class="custom w-full mt-4 text-base">
            <tr>
                <td
                    class="w-full bg-gray-200 uppercase font-semibold text-lg text-center"
                    colspan="6">
                    {{ $t('Product shipped details') }}
                </td>
            </tr>
        </table>

        <!-- Product / items shipped details -->
        <table
            v-if="itemsWithoutAdjustment.length"
            class="custom mt-4 w-full !border-b-0 !border-l-0">
            <tbody class="text-sm">
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
                        class="w-[35%]">
                        {{ $t('Harvested date or Manufatured date') }}
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

                <tr
                    v-for="(item, index) of itemsWithoutAdjustment"
                    :key="index">
                    <!-- Index -->
                    <td class="text-center print-custom-leading">
                        {{ index + 1 }}
                    </td>

                    <!-- ID -->
                    <td class="print-custom-leading">
                        {{ showUuid(getItemByID(item.item_id).id) }}
                    </td>

                    <!-- Batch -->
                    <td class="print-custom-leading">
                        {{ showUuid(getItemByID(item.item_id).batch?.id) }}
                    </td>

                    <!-- Item type -->
                    <td class="print-custom-leading">
                        <span v-if="getItemByID(item.item_id).finished_good_type_id">
                            {{ getItemByID(item.item_id).finished_good_type?.name }}
                        </span>

                        <span v-if="!getItemByID(item.item_id).finished_good_type_id">
                            {{ getItemByID(item.item_id).item_type?.name }}
                        </span>
                    </td>

                    <!-- Harvested date -->
                    <td
                        colspan="2"
                        class="print-custom-leading">
                        {{ getItemByID(item.item_id).item_operation_summaries && (getItemByID(item.item_id).finished_good_type_id || getItemByID(item.item_id).stage?.slug === 'harvested') ? formatDate(getItemByID(item.item_id).item_operation_summaries[0]?.start_date) : '-' }}
                    </td>

                    <!-- Quantity -->
                    <td class="print-custom-leading text-right">
                        {{ item.quantity }}
                    </td>

                    <!-- Cost -->
                    <td
                        class="print-custom-leading text-right">
                        ${{ getItemByID(item.item_id).item_type.price }}
                    </td>

                    <!-- Total -->
                    <td class="print-custom-leading  text-right">
                        ${{ getItemByID(item.item_id).item_type.price * item.quantity }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Adjustment table -->
        <table
            v-if="adjustedItems.length"
            class="custom mt-4 w-full !border-b-0 !border-l-0">
            <tbody class="text-sm">
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

                    <td class="!p-0">
                        <!-- Empty cell -->
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
                    v-for="(item, index) of adjustedItems"
                    :key="index">
                    <!-- First row -->
                    <tr>
                        <!-- Index -->
                        <td
                            rowspan="3"
                            class="text-center print-custom-leading">
                            {{ index + itemsWithoutAdjustment.length + 1 }}
                        </td>

                        <!-- ID -->
                        <td
                            rowspan="3"
                            class="print-custom-leading">
                            {{ showUuid(getItemByID(item.item_id).id) }}
                        </td>

                        <!-- Batch -->
                        <td
                            rowspan="3"
                            class="print-custom-leading">
                            {{ showUuid(getItemByID(item.item_id).batch?.id) }}
                        </td>

                        <!-- Item type -->
                        <td
                            rowspan="3"
                            class="print-custom-leading">
                            <span v-if="getItemByID(item.item_id).finished_good_type_id">
                                {{ getItemByID(item.item_id).finished_good_type?.name }}
                            </span>

                            <span v-if="!getItemByID(item.item_id).finished_good_type_id">
                                {{ getItemByID(item.item_id).item_type?.name }}
                            </span>
                        </td>

                        <!-- Harvested date -->
                        <td
                            rowspan="3"
                            colspan="2"
                            class="print-custom-leading">
                            {{ getItemByID(item.item_id).item_operation_summaries && (getItemByID(item.item_id).finished_good_type_id || getItemByID(item.item_id).stage?.slug === 'harvested') ? formatDate(getItemByID(item.item_id).item_operation_summaries[0]?.start_date) : '-' }}
                        </td>

                        <!-- Title -->
                        <td class="bg-gray-200 print-custom-leading">
                            {{ $t('Original') }}
                        </td>

                        <!-- Quantity -->
                        <td class="print-custom-leading text-right print-custom-leading">
                            {{ item.original_quantity  }}
                        </td>

                        <!-- Cost -->
                        <td
                            rowspan="3"
                            class="print-custom-leading text-right print-custom-leading">
                            ${{ getItemByID(item.item_id).item_type.price }}
                        </td>

                        <!-- Previus total -->
                        <td class="print-custom-leading print-custom-leading text-right">
                            ${{ getItemByID(item.item_id).item_type.price * item.original_quantity }}
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
                            <span class="block mt-[5px]" style="line-height: .7;">
                                {{
                                    item.original_quantity > item.quantity
                                        ? '-'
                                        : '+'
                                }}

                                {{
                                    item.original_quantity > item.quantity
                                        ? (item.original_quantity - item.quantity)
                                        : (item.quantity - item.original_quantity)
                                }}
                            </span>

                            <span class="text-xs block" style="line-height: .7;">
                                {{
                                    item.original_quantity > item.quantity
                                        ? '(Decrease)'
                                        : '(Increase)'
                                }}
                            </span>
                        </td>

                        <!-- Total -->
                        <td class="text-right print-custom-leading">
                            <div v-if="item.item_transfer_type_id === 1">
                                <span class="block mt-[5px]" style="line-height: .7;">
                                    {{
                                        (getItemByID(item.item_id).item_type.price * item.original_quantity) > (getItemByID(item.item_id).item_type.price * item.quantity)
                                            ? '-'
                                            : '+'
                                    }}

                                    {{
                                        (getItemByID(item.item_id).item_type.price * item.original_quantity) > (getItemByID(item.item_id).item_type.price * item.quantity)
                                            ? `$${(getItemByID(item.item_id).item_type.price * item.original_quantity) - (getItemByID(item.item_id).item_type.price * item.quantity)}`
                                            : `$${(getItemByID(item.item_id).item_type.price * item.quantity) - (getItemByID(item.item_id).item_type.price * item.original_quantity)}`
                                    }}
                                </span>

                                <span class="text-xs block" style="line-height: .7;">
                                    {{
                                        item.original_quantity > item.quantity
                                            ? '(Decrease)'
                                            : '(Increase)'
                                    }}
                                </span>
                            </div>

                            <div
                                v-if="item.item_transfer_type_id !== 1"
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
                            class="text-right print-custom-leading font-bold">
                            {{ item.quantity  }}
                        </td>

                        <!-- New total -->
                        <td
                            class="text-right print-custom-leading font-bold">
                            ${{ getItemByID(item.item_id).item_type.price * item.quantity }}
                        </td>
                    </tr>

                    <!-- Divide row -->
                    <tr v-if="index !== adjustedItems.length - 1">
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
