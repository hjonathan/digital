<script setup>
import { inject } from 'vue'
import FacilitiesTable from '../components/FacilitiesTable.vue'

const router = inject('router')

const idThread = router.currentRoute.value?.query?.idThread

</script>

<template>
    <FacilitiesTable
        :idThread="idThread"/>
</template>
