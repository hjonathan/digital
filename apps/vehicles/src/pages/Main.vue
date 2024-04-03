<script setup>
import { inject } from 'vue'
import VehiclesTable from '../components/VehiclesTable.vue'

const router = inject('router')

const idThread = router.currentRoute.value?.query?.idThread
const action = router.currentRoute.value?.query?.action

</script>

<template>
    <VehiclesTable
        :idThread="idThread"
        :action="action"/>
</template>
