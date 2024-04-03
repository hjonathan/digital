<script setup>
/*
|--------------------------------------------------------------------------
| DivideYWithText
|--------------------------------------------------------------------------
|
| Draw a line with text in the middle.
|
*/

defineProps({
    // The text content for the component.
    text: String,

    // The color of the line. Defaults to 'border-gray-300'.
    lineColor: {
        type: String,
        default: 'border-gray-300'
    },

    // The background color of the component. Defaults to 'bg-gray-100' It should match the background color of the containing element.
    backgroundColor: {
        type: String,
        default: 'bg-gray-100'
    },

    // The text color of the component. Defaults to 'text-gray-500'.
    textColor: {
        type: String,
        default: 'text-gray-500'
    }
})
</script>

<template>
    <div class="air-both-xl">
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <div
                    :class="[lineColor]"
                    class="w-full border-t" />
            </div>

            <div class="relative flex justify-center text-sm">
                <span
                    :class="[backgroundColor, textColor]"
                    class="px-2 italic">
                    {{ text }}
                </span>
            </div>
        </div>
    </div>
</template>
