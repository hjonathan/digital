<script setup>
import { ref } from 'vue'
import { Card, Title } from 'layout'

import { PhoneIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    labData: Object,

    clientData: Object,

    open: {
        type: Boolean,
        default: true
    },

    urlLabelCoverId: {
        type: String,
        default: 'OPT'
    }
})

const isOpen = ref(props.open)
</script>

<template>
    <!-- Info card -->
    <Card
        v-if="labData"
        flat
        is-closable
        v-model:open="isOpen"
        :place-content-center="false"
        header="Info">
        <Title
            titleType="h3"
            :has-border-bottom-line="false"
            :title="$t('Client')" />

        <!-- Client name -->
        <Title
            titleType="h4"
            :has-border-bottom-line="false"
            :title="$t(clientData.name)" />

        <hr class="my-8 border-gray-300">

        <Title
            titleType="h3"
            :has-border-bottom-line="false"
            :title="$t('Laboratory')" />

        <div class="flex justify-between">
            <div class="flex flex-col">
                <!-- Laboratory name -->
                <Title
                    titleType="h4"
                    :has-border-bottom-line="false"
                    :title="$t(labData?.laboratory_name)" />

                <ul>
                    <!-- Address -->
                    <li>
                        {{ labData.address_line_1 }}
                    </li>

                    <!-- City, state and zipcode -->
                    <li>
                        {{ labData.city }}, {{ labData.state }} {{ labData.zipcode }}
                    </li>

                    <!-- Phone -->
                    <li class="flex gap-2">
                        <PhoneIcon
                            class="w-4 fill-gray-500" />

                        {{ labData.phone }}
                    </li>

                    <!-- Email -->
                    <li>
                        {{ labData.email }}
                    </li>
                </ul>
            </div>

            <!-- Lab cover -->
            <img
                :src="`https://files.confidentcannabis.com/labs/${urlLabelCoverId}/logos/color.png`"
                class="mt-0 w-56">
        </div>
    </Card>
</template>
