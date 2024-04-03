<script setup>
import { ref, onMounted } from 'vue'
import { showUuid, formatDate } from 'shared'

const props = defineProps({
    data: Object,
    isInPrintMode: {
        type: Boolean,
        default: false
    }
})

const totalPages = ref(0)
const itemsPerPage = 10
const pages = ref(0)

onMounted(() => {
    const timeToWaitElement = 10

    setTimeout(() => {
        adjustFontSize()
    }, timeToWaitElement)

    if (props.isInPrintMode) {
        // Total number of pages
        totalPages.value = Math.ceil(props.data.item.length / itemsPerPage)

        // Generates an array representing the pages of items
        pages.value = Array.from({ length: totalPages.value }, (_, index) => {
            const start = index * itemsPerPage

            const end = start + itemsPerPage

            return props.data.item.slice(start, end)
        })
    }

    if (!props.isInPrintMode) {
        // If not in print mode, set the number of pages to 1 (For show view)
        totalPages.value = 1

        // Return all items
        pages.value = Array.from({ length: totalPages.value }, (_, index) => {
            return props.data.item
        })
    }
})

// Add an auto-incremented index to each item
props.data.item = props.data.item.map((item, index) => ({ ...item, index: index + 1 }))

// Adjusts the size of texts with the .dynamicText class based on the maximum size of the container label (with the .dynamicTextContainer class)
const adjustFontSize = () => {
    const dynamicTextContainer = document.querySelectorAll('.dynamicTextContainer')

    dynamicTextContainer.forEach(function (container) {
        const text = container.querySelector('.dynamicText')

        text.style.fontSize = '1rem'

        while (text.scrollHeight > container.clientHeight && parseFloat(getComputedStyle(text).fontSize) > 0.2) {
            text.style.fontSize = (parseFloat(getComputedStyle(text).fontSize) - 0.1) + 'px'
        }
    })
}
</script>

<template>
    <div
        :class="{ 'h-screen' : isInPrintMode }"
        class="w-full !text-black !bg-white">
        <template v-for="(page, pageIndex) in pages" :key="pageIndex">
            <table class="custom w-full h-full">
                <thead class="hidden">
                    <th>
                        <tr>
                            <!-- Generate 100 <th> elements to align body cells <td> more precisely -->
                            <th
                                v-for="key in 100"
                                :key="key" />
                        </tr>
                    </th>
                </thead>

                <tbody>
                    <!-- Page Header -->
                    <tr>
                        <td
                            colspan="10"
                            class="w-[10%]">
                            <span class="font-medium text-xl block text-center">
                                {{ $t('Title of P.O.') }}
                            </span>
                        </td>

                        <td
                            colspan="60"
                            class="w-[60%]">
                            <span class="font-medium text-lg px-4">
                                {{ formatDate(data?.created_at) }}
                            </span>
                        </td>

                        <td
                            colspan="30"
                            class="w-[30%] font-bold text-xl p-3">
                            <span class="block text-center">
                                {{ $t('MARIJUANA PROGRAM') }}

                            </span>

                            <span class="text-center block">
                                {{ $t('MARIJUANA DELIVERY MANIFIEST') }}
                            </span>
                        </td>
                    </tr>

                    <!-- Note message -->
                    <tr>
                        <td
                            colspan="100"
                            class="w-[100%] text-xs bg-gray-200">
                            <p class="block text-center font-medium">
                                {{ $t('The receiving entity may reject product delivered, but amount delivered must be limited to amount agreed upon in prior sales transaction') }}
                            </p>

                            <span class="block text-center font-bold">
                                {{ $t('Please note: Any person transporting and receiving medical marijuana must have a registration certificate') }}
                            </span>
                        </td>
                    </tr>

                    <!-- Date completed and Invoice Number -->
                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[22%]">
                            {{ $t('Date Completed') }}
                        </td>

                        <td
                            colspan="24"
                            class="w-[24%]">
                            {{ formatDate(data?.completed_at) }}
                        </td>

                        <td
                            colspan="27"
                            class="w-[27%]">
                            {{ $t('Invoice Number') }}
                        </td>

                        <td
                            colspan="27"
                            class="w-[27%]">
                            625
                        </td>
                    </tr>

                    <!-- Originating entity -->
                    <!-- Name of the originating entity -->
                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[22%]">
                            {{ $t('Name of the Originating Entity') }}
                        </td>

                        <td
                            colspan="51"
                            class="w-[51%]">
                            {{ data.origin_facility.facility_name }}
                        </td>

                        <!-- Bar or QR code -->
                        <td
                            colspan="23"
                            rowspan="3"
                            class="w-[23%]">
                            <div class="grid place-content-center text-center">
                                <span class="font-semibold text-lg text-center">
                                    {{ $t('Bar or QR Code') }}
                                </span>

                                {{ data?.id }}
                            </div>
                        </td>
                    </tr>

                    <!-- License # of the Originating Entity -->
                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[22%]">
                            {{ $t('License # of the Originating Entity') }}
                        </td>

                        <td
                            colspan="51"
                            class="w-[51%]">
                            {{ data.origin_facility.license_number }}
                        </td>
                    </tr>

                    <!-- Addres of the originating entity -->
                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[22%] align-top">
                            <div class="h-full w-full block">
                                {{ $t('Address of the Originating Entity') }}
                            </div>
                        </td>

                        <td
                            colspan="24"
                            class="w-[24%] align-top">
                            <div>
                                {{ data.origin_facility.address }}
                            </div>

                            <div>
                                {{ data.origin_facility.address_2 }}
                            </div>

                            <br>
                        </td>

                        <td
                            colspan="27"
                            class="w-[27%]">
                            <!-- Empty cell -->
                        </td>
                    </tr>

                    <!-- Phone # of the originating entity -->
                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[21%]">
                            {{ $t('Phone # of the Originating Entity') }}
                        </td>

                        <td
                            colspan="24"
                            class="w-[24%]">
                            {{ data.origin_facility.phone }}
                        </td>

                        <td
                            colspan="27"
                            class="w-[27%] text-xs">
                            {{ $t('Phone Number State can call with questions') }}
                        </td>

                        <td
                            colspan="27"
                            class="w-[27%]">
                            <!-- Empty cell -->
                        </td>
                    </tr>

                    <!-- Name/ID/DO8 of Person(s) Transporting -->
                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[22%]">
                            {{ $t('Name/ID/DO8 of Person(s) Transporting') }}
                        </td>

                        <td
                            colspan="78"
                            class="w-[78%]">
                            {{ data.driver?.name }}
                        </td>
                    </tr>

                    <!-- Route to be traveled -->
                    <tr>
                        <td
                            colspan="100"
                            class="w-[100%] pb-2" >
                            <div class="grid grid-cols-12 h-[72px] dynamicTextContainer">
                                <div class="text-sm print-custom-leading mt-1">
                                    <div>
                                        {{ $t('Route To be') }}
                                    </div>

                                    <div>
                                        {{ $t('Traveled:') }}
                                    </div>
                                </div>

                                <div class="col-span-11 dynamicText">
                                    {{ data.traveled_route }}
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Vehicle information -->
                    <tr class="text-base">
                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ $t('Vehicle information') }}
                        </td>

                        <td
                            colspan="75"
                            class="w-[75%]">
                            <span>
                                {{ data.vehicle?.year }}
                                {{ data.vehicle?.make }}
                                {{ data.vehicle?.model }}
                                {{ data.vehicle?.license_plate }}
                                {{ data.vehicle?.certificate }}
                            </span>
                        </td>
                    </tr>

                    <!-- FAX message # -->
                    <tr class="text-base">
                        <td
                            colspan="100"
                            class="w-[100%]">
                            {{ $t('Fax # which approved State copy is to be sent (N/A if emailing)') }}
                        </td>
                    </tr>

                    <!-- Empty divider -->
                    <tr>
                        <td
                            colspan="100"
                            class="w-[100%] text-xs bg-gray-200 h-5">
                        <!-- Empty cell -->
                        </td>
                    </tr>

                    <!-- Note -->
                    <tr>
                        <td
                            colspan="100"
                            class="w-[100%] text-xs">
                            <span class="block text-center font-semibold">
                                {{ $t('Any items declined by the receiver need to be documented on the return manifest, along with reason for declining. Completed from must be returned to the production facility.') }}
                            </span>
                        </td>
                    </tr>

                    <!-- Items -->
                    <tr>
                        <!-- Left side -->
                        <td
                            colspan="44"
                            class="w-[44%] !p-0 !m-0 align-top">
                            <table
                                class="custom w-full !border-0"
                                style="min-height: 440px">
                                <tbody class="text-sm">
                                    <tr>
                                        <td class="!border-0 !border-r-[1px] !border-l-0">
                                            {{ $t('Name of the Destination Entity') }}
                                        </td>

                                        <td class="!border-0">
                                            {{ data.destination_facility.facility_name }}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="!border-0 !border-t-[1px] !border-r-[1px] !border-l-0">
                                            {{ $t('License # of the Destination Entity') }}
                                        </td>

                                        <td class="!border-0 !border-t-[1px]">
                                            {{ data.destination_facility.license_number }}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="!border-0 !border-t-[1px] !border-r-[1px] !border-l-0 align-top">
                                            {{ $t('Address of the Destination Entity') }}
                                        </td>

                                        <td
                                            class="!border-0 !border-t-[1px] print-custom-leading">
                                            <div>
                                                {{ data.destination_facility.address }}
                                            </div>

                                            <div>
                                                {{ data.destination_facility.address_2 }}
                                            </div>

                                            <br>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="!border-0 !border-t-[1px] !border-r-[1px] !border-l-0">
                                            {{ $t('Phone # of the Destination Entity') }}
                                        </td>

                                        <td class="!border-0 !border-t-[1px]">
                                            {{ data.destination_facility.phone }}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="!border-0 !border-t-[1px] !border-r-[1px] !border-l-0">
                                            {{ $t('Date/Approx Time of Departure') }}
                                        </td>

                                        <td class="!border-0 !border-t-[1px]">
                                            {{ data.departured_on }}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="!border-0 !border-t-[1px] !border-r-[1px] !border-l-0">
                                            {{ $t('Date/Approx Time of Arrival') }}
                                        </td>

                                        <td class="!border-0 !border-t-[1px]  ">
                                            {{ data.arrived_on }}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="!border-0 !border-t-[1px] !border-r-[1px] !border-l-0">
                                            {{ $t('Stop Number on Route') }}
                                        </td>

                                        <td class="!border-0 !border-t-[1px]">
                                            1 {{ $t('of') }} 1
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            colspan="2"
                                            class="!border-0 !border-t-[1px] !border-l-0 w-full align-top h-full">
                                            <div class="print-custom-leading">
                                                {{ $t('Notes, details of extenuating circumstances or deviations from original route (road closure, flat tire, etc):') }}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>

                        <!-- Right side -->
                        <td
                            colspan="56"
                            class="w-[56%] !p-0 !my-0 align-top">
                            <table
                                :class="{ 'h-full' : page.length === 10 }"
                                class="custom w-full !border-0">
                                <thead>
                                    <tr class="bg-gray-200 border-b-[1px] border-black text-xs">
                                        <th class="w-[2%] border-l-0 border-r-[1px] border-black py-1">
                                            #
                                        </th>

                                        <th class="w-[38%] border-r-[1px] border-black">
                                            {{ $t('Item Description') }}
                                        </th>

                                        <th class="w-[38%] border-r-[1px] border-black">
                                            <!-- Empty table heading -->
                                        </th>

                                        <th class="w-[6%] border-r-[1px] border-black">
                                            {{ $t('Qty') }}
                                        </th>

                                        <th class="w-[6%] border-r-[1px] border-black">
                                            {{ $t('Unit Price') }}
                                        </th>

                                        <th class="w-[10%] !border-r-0 border-black !pr-0">
                                            {{ $t('Price') }}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody class="text-sm">
                                    <tr
                                        v-for="(item, itemIndex) in page"
                                        :key="itemIndex">
                                        <!-- Index -->
                                        <td
                                            :class="{ '!border-b-0' : itemIndex === page.length-1 && page.length === 10 }"
                                            class="w-[2%] border-r-[1px] !border-l-0 border-black text-center align-top">
                                            {{ item.index }}
                                        </td>

                                        <!-- Item Description -->
                                        <td
                                            :class="{ '!border-b-0' : itemIndex === page.length-1 && page.length === 10 }"
                                            class="w-[38%] border-r-[1px] border-black align-top">
                                            <!-- Finished good type or item_type -->
                                            <div class="flex print-custom-leading">
                                                <span v-if="item.finished_good_type_id">
                                                    {{ item.finished_good_type?.name }}
                                                </span>

                                                <span v-if="!item.finished_good_type_id">
                                                    {{ item.item_type?.name }}
                                                </span>
                                            </div>

                                            <!-- Batch -->
                                            <div class="font-semibold flex print-custom-leading">
                                                {{ $t('Batch:') }} {{ showUuid(item.batch?.id) }}
                                            </div>
                                        </td>

                                        <!-- Item details -->
                                        <td
                                            :class="{ '!border-b-0' : itemIndex === page.length-1 && page.length === 10 }"
                                            class="w-[38%] border-r-[1px] border-black font-semibold align-top !py-0 !my-0">
                                            <div>
                                                <!-- Package -->
                                                <div class="flex print-custom-leading">
                                                    {{ $t('Package') }}: {{ showUuid(item.id) }}
                                                </div>

                                                <!-- 'Stage' On -->
                                                <div class="flex print-custom-leading">
                                                    {{ item.stage?.name }} {{ $t('On') }}: <span v-if="item.item_operation_summaries">{{ formatDate(item.item_operation_summaries[0]?.start_date) }}</span>
                                                </div>

                                                <!-- Stage -->
                                                <div class="flex print-custom-leading">
                                                    {{ item.stage?.name }}
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Quantity -->
                                        <td
                                            :class="{ '!border-b-0' : itemIndex === page.length-1 && page.length === 10 }"
                                            class="w-[6%] border-r-[1px] border-black">
                                           {{ item.quantity }}
                                        </td>

                                        <!-- Unit price -->
                                        <td
                                            :class="{ '!border-b-0' : itemIndex === page.length-1 && page.length === 10 }"
                                            class="w-[6%] border-r-[1px] border-black text-xs">
                                             $0.00
                                        </td>

                                        <!-- Price -->
                                        <td
                                            :class="{ '!border-b-0' : itemIndex === page.length-1 && page.length === 10 }"
                                            class="w-[10%] !border-r-0 border-black">
                                            $0
                                        </td>
                                    </tr>

                                    <!-- Total row -->
                                    <tr v-if="pageIndex === pages.length - 1">
                                        <td
                                            colspan="3"
                                            class="!border-l-0">
                                            <!-- Empty cell -->
                                        </td>

                                        <td
                                            colspan="3"
                                            class="font-semibold h-8 text-right text-base !border-r-0">
                                            {{ $t('Total') }} $0.00
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Delivery person verify -->
                    <tr class="text-sm">
                        <td
                            colspan="80"
                            class="w-[80%] bg-gray-200 text-center text-sm">
                            {{ $t('Delivery person verify the contents of this delivery as listed in this manifiest.') }}
                        </td>

                        <td
                            colspan="20"
                            class="w-[20%] text-sm">
                            {{ $t('Date') }}
                        </td>
                    </tr>

                    <!-- Delivery persons (Drivers) -->
                    <tr class="text-base">
                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ $t('Name, ID & DOB of Delivery Person') }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ data.driver?.name }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%] text-xs">
                            {{ $t('Name, ID & DOB of Delivery Person') }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ data.driver2?.name }}
                        </td>
                    </tr>

                    <tr class="text-base">
                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ $t('Signature of Delivery Person') }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            <!-- Empty cell -->
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%] text-xs">
                            {{ $t('Signature of Delivery Person') }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            <!-- Empty cell -->
                        </td>
                    </tr>

                    <tr class="text-base">
                        <td
                            colspan="25"
                            class="w-[25%]">
                            <span>
                                {{ $t('Name, ID & DOB of Delivery Person') }}
                            </span>
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ data.driver3?.name }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%] text-xs">
                            <span>
                                {{ $t('Name, ID & DOB of Delivery Person') }}
                            </span>
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ data.driver4?.name }}
                        </td>
                    </tr>

                    <tr class="text-base">
                        <td
                            colspan="25"
                            class="w-[25%]">
                            {{ $t('Signature of Delivery Person') }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            <!-- Empty cell -->
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%] text-xs">
                            {{ $t('Signature of Delivery Person') }}
                        </td>

                        <td
                            colspan="25"
                            class="w-[25%]">
                            <!-- Empty cell -->
                        </td>
                    </tr>

                    <tr class="text-base">
                        <td
                            colspan="100"
                            class="w-[100%] bg-gray-200 text-center">
                            {{ $t('I confirm that the contents of this shipment match weight and quantity records entered above, and I agree to take custody of this shipment as indicated.') }}
                        </td>
                    </tr>

                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[22%]">
                            {{ $t('Name of Receiver') }}
                        </td>

                        <td
                            colspan="22"
                            class="w-[22%]">
                            John Doe
                        </td>

                        <td
                            colspan="22"
                            class="w-[22%] text-xs">
                            {{ $t('Receiver ID #') }}
                        </td>

                        <td
                            colspan="22"
                            class="w-[22%]">
                            123456
                        </td>

                        <td
                            colspan="10"
                            class="w-[10%] text-center">
                            {{ $t('Page') }}
                        </td>
                    </tr>

                    <tr class="text-base">
                        <td
                            colspan="22"
                            class="w-[22%]">
                            {{ $t('Signature of Receiver') }}
                        </td>

                        <td
                            colspan="22"
                            class="w-[22%]">
                            <!-- Empty cell -->
                        </td>

                        <td
                            colspan="22"
                            class="w-[22%] text-xs">
                            {{ $t('Date') }}
                        </td>

                        <td
                            colspan="22"
                            class="w-[22%]">
                            09/11/2023
                        </td>

                        <td
                            colspan="10"
                            class="w-[10%]">
                            <span class="text-center block">
                                <!-- Page number -->
                                <span class="font-semibold">
                                    {{ pageIndex + 1 }}
                                </span>

                                {{ $t('of') }}

                                <span class="font-semibold">
                                    {{ pages.length }}
                                </span>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
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
