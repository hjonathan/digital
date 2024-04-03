<script setup>
/*
|--------------------------------------------------------------------------
| Label with a tag line
|--------------------------------------------------------------------------
|
| Used when clarification for a label is required.
|
| Uses Label component.
| Uses TagLine component.
|
*/

import Label from './Label.vue'
import TagLine from './TagLine.vue'

defineProps({
    /*
    | Label
    */
    labelId: String,
    labelClass: String,
    forId: String,

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
    <Label
        :id="labelId"
        :for="forId"
        :class="labelClass"
        :onError="onError">
        <slot></slot>
    </Label>

    <TagLine
        :tagLineId="tagLineId"
        :tagLineClass="tagLineClass">
        <slot name="tag"></slot>
    </TagLine>
</template>
