<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiOpenInNew } from '@mdi/js'

const props = defineProps({
    title: {
        type: String,
        default: () => ('')
    },
    icon: {
        type: Object,
        default: () => (null)
    },
    onClick: {
        type: Function,
        default: () => () => {}
    }
})

</script>
<template>
    <div @click="onClick"
        class="group flex items-center gap-x-4 border-b justify-between bg-gray-100 p-4 hover:border-primary-400 hover:border-2 border-2 border-gray-300 rounded-xl cursor-pointer">
          <div class="flex space-x-2 text-sm font-medium  text-gray-900">
            <span> {{ title}}</span>
          </div>
          <div class="ml-auto space-x-2" v-if="icon">
            <span @click="onClick"
                class="inline-flex h-8 w-8 items-center cursor-pointer rounded-full border-1 justify-center bg-primary-500 text-white" >
                <svg-icon type="mdi" :path="icon" size="18" />
            </span>
        </div>
    </div>
</template>
