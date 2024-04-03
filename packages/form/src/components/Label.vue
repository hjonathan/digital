<script setup>
/*
|--------------------------------------------------------------------------
| Label
|--------------------------------------------------------------------------
|
| Wrapper around HTML's <label> tag.
| Uses optional 'tag line'.
|
*/

defineProps({
    /*
    | Label
    */
    labelId: String,
    labelClass: String,
    forId: String,

    /*
    | Error
    */
    onError: Boolean
})
</script>

<template>
    <label
        :id="labelId"
        :for="forId"
        :class="[`font-medium`, labelClass, onError ? `!text-red-600` : ``]">
        <slot></slot>
    </label>
</template>
