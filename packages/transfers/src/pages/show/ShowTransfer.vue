<script setup>
import { inject } from 'vue'
import Show from './Show.vue'
import { useShow as useComposable } from './useShow'

const router = inject('router')

const transferId = router.currentRoute.value.params.id
const useShow = useComposable({})

</script>

<template>
    <Show
        :transferId="transferId"
        :use-show="useShow"
        mode="show" />
</template>
