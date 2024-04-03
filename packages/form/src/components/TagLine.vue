<script setup>
/*
|--------------------------------------------------------------------------
| Tag line
|--------------------------------------------------------------------------
|
| Uses a <span> tag to wrap the content.
| Complements other components including a simple tag line to them.
|
*/

defineProps({
    /*
    | Tag line
    */
    tagLineId: String,
    tagLineClass: String,

    /*
    | Error
    */
    onError: Boolean
})
</script>

<template>
    <span
        :id="tagLineId"
        :class="[`block text-sm font-medium`, tagLineClass, onError ? `text-red-900` : `text-gray-400`]">
        <slot></slot>
    </span>
</template>
