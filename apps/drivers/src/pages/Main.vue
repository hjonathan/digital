<script setup>
import { inject } from 'vue'
import DriversTable from '../components/DriversTable.vue'

const router = inject('router')

const idThread = router.currentRoute.value?.query?.idThread
const action = router.currentRoute.value?.query?.action
</script>

<template>
    <DriversTable
        :idThread="idThread"
        :action="action"/>
</template>
