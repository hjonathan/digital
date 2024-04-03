<script setup>
import QRExample from './QRExample.vue'
import { formatDate, showUuid } from 'shared'

const props = defineProps({
    data: Object,
    routeToBeTraveled: String,
    isInPrintMode: {
        type: Boolean,
        default: false
    },
    dispatchData: Object
})

// Add an auto-incremented index to each item
props.data.item = props.data.item.map((item, index) => ({ ...item, index: index + 1 }))

const getTotalQuantity = () => {
    const initialValue = 0

    return props.data.item.reduce((accumulator, item) => {
        return (accumulator + item.quantity)
    }, initialValue)
}

const getTotalPrice = () => {
    const initialValue = 0

    return props.data.item.reduce((accumulator, item) => {
        return accumulator + (item.item_type.price * item.quantity)
    }, initialValue)
}
</script>

<template>
    <div class="h-full">
        <!-- Header -->
        <table class="custom w-full mb-4">
            <tr>
                <!-- QR Code and ID -->
                <td
                    rowspan="3"
                    class="w-[28%]">
                    <span class="text-xs flex justify-center">
                        <QRExample />
                    </span>

                    <span class="text-xs text-center block">
                        {{ data?.id }}
                     </span>
                </td>

                <!-- Title -->
                <td
                    rowspan="3"
                    class="w-[45%] font-semibold text-center uppercase">
                    <span class="block text-2xl">
                        {{ $t('Intra company transfer manifest') }}
                    </span>

                    <span class="text-xl">
                        {{ 'MARIJUANA PROGRAM' }}
                    </span>
                </td>
            </tr>

            <!-- Departure date -->
            <tr>
                <td class="w-[15%] font-semibold print-custom-leading text-base bg-gray-200 whitespace-nowrap">
                    {{ $t('Departure') }}
                </td>

                <td class="text-sm whitespace-nowrap">
                    {{ data.dispatch_transfer_details[0]?.dispatch_transfer?.dispatch_on ? formatDate(data.dispatch_transfer_details[0].dispatch_transfer.dispatch_on, 'utcDateTime') : '-' }}
                </td>
            </tr>

            <!-- Arrival date -->
            <tr>
                <td class="w-[15%] font-semibold print-custom-leading text-base bg-gray-200 whitespace-nowrap">
                    {{ $t('Estimated arrival') }}
                </td>

                <td class="text-sm  whitespace-nowrap">
                    {{ data?.dispatch_transfer_details[0]?.dispatch_transfer?.arrived_on ? formatDate(data.dispatch_transfer_details[0].dispatch_transfer.arrived_on, 'utcDateTime') : '-' }}
                </td>
            </tr>

            <!-- Note -->
            <tr>
                <td
                    colspan="4"
                    class="w-[100%] text-xs bg-gray-200">
                    <p class="block text-center font-medium !mt-0">
                        {{ $t('The receiving entity may reject product delivered, but amount delivered must be limited to amount agreed upon in prior sales transaction') }}
                    </p>
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

        <!-- Transportation information -->
        <table class="custom w-full mt-4 text-base">
            <tr>
                <td
                    class="w-full bg-gray-200 uppercase font-semibold text-lg text-center"
                    colspan="6">
                    {{ $t('Driver information') }}
                </td>
            </tr>

            <!-- Driver 1 -->
            <template v-if="data.dispatch_transfer_details[0]?.dispatch_transfer">
                <tr
                    v-for="(driver, index) of data.dispatch_transfer_details[0].dispatch_transfer?.driver"
                    :key="index">
                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Driver') }} {{ index === 0 ? '' : index + 1 }}
                    </td>

                    <td class="w-[41%]">
                        {{ driver.name }}
                    </td>

                    <td class="w-[11%] bg-gray-200">
                        {{ $t('Phone') }}
                    </td>

                    <td class="w-[16.5%]">
                        {{ driver.phone }}
                    </td>

                    <td class="w-[8%] bg-gray-200">
                        {{ $t('License #') }}
                    </td>

                    <td>
                        {{ driver.phone }}
                    </td>
                </tr>
            </template>
        </table>

        <!-- Vehicle and route information -->
        <table class="custom w-full mt-4 text-base">
            <!-- Title -->
            <tr>
                <td
                    colspan="6"
                    class="w-full font-semibold text-lg bg-gray-200 uppercase text-center">
                    {{ $t('Vehicle & route information') }}
                </td>
            </tr>

            <!-- Vehicle information -->
            <tr>
                <td class="w-[11%] bg-gray-200">
                    {{ $t('Vehicle') }}
                </td>

                <td
                    colspan="3"
                    class="w-[68.5%]">
                    <span>
                        {{ data.dispatch_transfer_details[0]?.dispatch_transfer?.vehicle?.year }}
                        {{ data.dispatch_transfer_details[0]?.dispatch_transfer?.vehicle?.make }}
                        {{ data.dispatch_transfer_details[0]?.dispatch_transfer?.vehicle?.model }}
                        {{ data.dispatch_transfer_details[0]?.dispatch_transfer?.vehicle?.license_plate }}
                        {{ data.dispatch_transfer_details[0]?.dispatch_transfer?.vehicle?.certificate }}
                    </span>
                </td>

                <td class="w-[8%] bg-gray-200">
                    {{ $t('Stops') }}
                </td>

                <td class="text-center">
                    {{ dispatchData?.dispatch_transfer_details.length }}
                </td>
            </tr>

            <!-- Route to be traveled -->
            <tr>
                <td
                    class="w-[11%] bg-gray-200">
                    {{ $t('Route') }}
                </td>

                <td
                    colspan="5"
                    class="w-[68.5%]">
                    {{ routeToBeTraveled }}
                </td>
            </tr>

            <!-- Notes -->
            <tr>
                <td class="w-[11%] bg-gray-200">
                    {{ $t('Notes') }}
                </td>

                <td
                    colspan="5">
                    <!-- Empty cell -->
                </td>
            </tr>
        </table>

        <!-- Product / items shipped details -->
        <table class="custom mt-4 w-full !border-b-0 !border-l-0">
            <tbody class="text-sm">
                <!-- Titles -->
                <tr>
                    <td
                        colspan="9"
                        class="bg-gray-200 uppercase font-semibold text-lg text-center">
                        {{ $t('Product shipped details') }}
                    </td>
                </tr>

                <!-- Header -->
                <tr class="text-base bg-gray-200">
                    <!-- Number -->
                    <td class="w-[5%] text-center">
                        #
                    </td>

                    <td class="w-[13%]">
                        {{ $t('ID') }}
                    </td>

                    <td class="w-[13%]">
                        {{ $t('Batch ID') }}
                    </td>

                    <td>
                        {{ $t('Item type') }}
                    </td>

                    <td
                        colspan="2"
                        class="w-[25%]">
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

                <!-- Products -->
                <tr
                    v-for="(item, index) of data.item"
                    :key="index">
                    <!-- Index -->
                    <td class="text-center print-custom-leading">
                        {{ item.index }}
                    </td>

                    <!-- ID -->
                    <td class="print-custom-leading">
                        {{ showUuid(item.id) }}
                    </td>

                    <!-- Batch -->
                    <td class="print-custom-leading">
                        {{ showUuid(item.batch?.id) }}
                    </td>

                    <!-- Item type -->
                    <td class="print-custom-leading">
                        <span v-if="item.finished_good_type_id">
                                {{ item.finished_good_type?.name }}
                        </span>

                        <span v-if="!item.finished_good_type_id">
                            {{ item.item_type?.name }}
                        </span>
                    </td>

                    <!-- Harvested date -->
                    <td
                        colspan="2"
                        class="print-custom-leading">
                        {{ item.item_operation_summaries && (item.finished_good_type_id || item.stage?.slug === 'harvested') ? formatDate(item.item_operation_summaries[0]?.start_date) : '-' }}
                    </td>

                    <!-- Quantity -->
                    <td class="print-custom-leading text-right">
                        {{ item.quantity }}
                    </td>

                    <!-- Cost -->
                    <td
                        class="print-custom-leading text-right">
                        ${{ item.item_type.price }}
                    </td>

                    <!-- Total -->
                    <td class="print-custom-leading  text-right">
                        ${{ item.item_type.price * item.quantity }}
                    </td>
                </tr>

                <!-- Total -->
                <tr>
                    <td
                        colspan="4"
                        class="!border-b-0 !border-l-0 !border-r-0" />

                    <td class="!border-0">

                    </td>

                    <td class="w-[8%] bg-gray-200 print-custom-leading">
                        {{ $t('Total') }}
                    </td>

                    <td class="text-right print-custom-leading">
                        {{ getTotalQuantity() }}
                    </td>

                    <td class="bg-gray-200 print-custom-leading">
                        {{ $t('Total') }}
                    </td>

                    <td class="text-right print-custom-leading">
                        ${{ getTotalPrice() }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Actual departure -->
        <table class="custom mt-4 w-full">
            <tr class="bg-gray-200 text-lg font-semibold uppercase text-center">
                <td colspan="10">
                    {{ $t('Actual departure') }}
                </td>
            </tr>

            <tr class="text-base">
                <td class="bg-gray-200 w-[7%] h-8">
                    {{ $t('Name') }}
                </td>

                <td class="w-[24%] text-sm">
                    <!-- Empty cell -->
                </td>

                <td class="bg-gray-200 w-[7%]">
                    {{ $t('Signature') }}
                </td>

                <td class="w-[15%]">
                    <!-- Empty cell -->
                </td>

                <td class="bg-gray-200 w-[5%]">
                    {{ $t('License') }}
                </td>

                <td class="w-[10%] text-sm text-right">
                    <!-- Empty cell -->
                </td>

                <td class="bg-gray-200 w-[5.6%]">
                    {{ $t('Date') }}
                </td>

                <td class="text-end text-sm w-[8%]">
                    <!-- Empty cell -->
                </td>

                <td class="w-[8%] text-base bg-gray-200">
                    {{ $t('Time') }}
                </td>

                <td class="w-[8%]">
                    <!-- Empty cell -->
                </td>
            </tr>
        </table>

        <!-- Receiving information -->
        <table class="custom mt-4 w-full">
            <tr class="bg-gray-200 text-lg font-semibold uppercase text-center">
                <td colspan="10">
                    {{ $t('Receiving information') }}
                </td>
            </tr>

            <tr class="text-base">
                <td class="bg-gray-200 w-[7%] h-8">
                    {{ $t('Name') }}
                </td>

                <td class="w-[24%] text-sm">
                    <!-- Empty cell -->
                </td>

                <td class="bg-gray-200 w-[7%]">
                    {{ $t('Signature') }}
                </td>

                <td class="w-[15%]">
                    <!-- Empty cell -->
                </td>

                <td class="bg-gray-200 w-[5%]">
                    {{ $t('License') }}
                </td>

                <td class="w-[10%] text-sm text-right">
                    <!-- Empty cell -->
                </td>

                <td class="bg-gray-200 w-[5.6%]">
                    {{ $t('Date') }}
                </td>

                <td class="text-end text-sm w-[8%]">
                    <!-- Empty cell -->
                </td>

                <td class="w-[8%] text-base bg-gray-200">
                    {{ $t('Time') }}
                </td>

                <td class="w-[8%]">
                    <!-- Empty cell -->
                </td>
            </tr>
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
