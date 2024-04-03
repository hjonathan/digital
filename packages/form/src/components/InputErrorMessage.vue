<script setup>
/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
|
| Shows one error.
|
*/

import Label from './Label.vue'

defineProps({
    /*
    | Label
    */
    forId: String,

    /*
    | Label
    */
    error: Object
})
</script>

<template>
    <Label :forId="forId" labelClass="font-bold text-right text-sm" onError>
        <slot></slot>
    </Label>
</template>
