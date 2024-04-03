<script setup>
import { inject } from 'vue'

const useGlobalStore = inject('useGlobalStore')

const basePackageStore = useGlobalStore('basePackage')

</script>

<template>
    <div>
        {{ $t( basePackageStore.data) }}
    </div>
</template>
