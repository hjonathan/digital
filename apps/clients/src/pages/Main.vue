<script setup>
import { inject } from 'vue'
import ClientsTable from '../components/ClientsTable.vue'

const router = inject('router')

const idThread = router.currentRoute.value?.query?.idThread

</script>

<template>
    <ClientsTable
        :idThread="idThread"/>
</template>
