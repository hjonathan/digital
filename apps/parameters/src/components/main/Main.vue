<script setup>
import { inject } from 'vue'

const useGlobalStore = inject('useGlobalStore')

const parametersStore = useGlobalStore('parameters')

</script>

<template>
    <div>
        <pre>{{ parametersStore.data }}</pre>
    </div>
</template>
