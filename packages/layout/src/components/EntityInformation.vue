<script setup>
import { computed } from 'vue'
import { Card } from 'layout'
import SvgIcon from '@jamescoyle/vue-icon'

/*
|--------------------------------------------------------------------------
| EntityInformation
|--------------------------------------------------------------------------
|
| Component to display company information..
|
| Receive props: Company Name (name), Company Address (street, state),
| contact phone (phone) and logo (logo)
|
*/

const props = defineProps({
    // Main title of the component. It will be an H2, xl size and semibold font.
    title: String,

    /**
     | Secondary title of the component. It will be an H3 with size and weight for default.
     | Used to pass a name that we don't want to be highlighted as much as the main title.
    */
    name: String,

    logo: String,
    data: Object,
    informationClasses: String,
    icon: String,
    hasCard: Boolean,
    action: Function,
    customCardClasses: [String, Object],
    insideCardClasses: [String, Object]
})

// Check if exist data to show
const hasData = () => {
    for (const prop in props) {
        if (props[prop] !== undefined) {
            return true
        }
    }

    return false
}

// Gets the classes of the card, according to the properties.
const cardClasses = computed(() => {
    let finalClasess = ['border-none shadow-none w-full']

    if (props.hasCard) {
        finalClasess = ['border-2 hover:border-2 p-2 !border-primary-200 w-full']
    }

    if (props.action) {
        finalClasess.push('cursor-pointer hover:text-primary-600 hover:!border-primary-600')
    }

    if (props.customCardClasses) {
        finalClasess.push(props.customCardClasses)
    }

    return finalClasess
})

// Call the action property
const callAction = () => {
    if (props.action) props.action()
}
</script>

<template>
    <div
        v-if="hasData()"
        class="flex justify-between align-top items-start !my-0">
        <!-- Card main content -->
        <Card
            :place-content-center="false"
            :has-padding="false"
            :class="cardClasses"
            @click="callAction()">
            <div :class="['flex space-x-8', insideCardClasses]">
                <!-- Logo -->
                <div
                    v-if="logo"
                    class="h-min">
                    <img
                        class="h-10 mr-3 !py-0 leading-none logo-class"
                        :src="logo">
                </div>

                <!-- Icon -->
                <SvgIcon
                    v-if="icon"
                    type="mdi"
                    class="h-16 w-16 notPrintableArea"
                    :path="icon" />

                <!-- Company information -->
                <div
                    :class="[informationClasses]"
                    class="leading-5 !mt-0">

                    <h2 v-if="title" class="text-xl font-medium !my-0 !py-0">
                        {{ title }}
                    </h2>

                    <h3 v-if="name" class="!mt-0 mb-1 font-medium">
                        {{ name }}
                    </h3>

                    <template v-for="(item , index) in data" :key="index">
                        <span class="block !my-0">
                            {{ item }}
                        </span>
                    </template>
                    <slot />
                </div>
            </div>
        </Card>
    </div>
</template>
