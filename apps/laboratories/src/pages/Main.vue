<script setup>
import { inject } from 'vue'
import LaboratoriesTable from '../components/LaboratoriesTable.vue'

const router = inject('router')

const idThread = router.currentRoute.value?.query?.idThread

</script>

<template>
    <LaboratoriesTable
        :idThread="idThread"/>
</template>
