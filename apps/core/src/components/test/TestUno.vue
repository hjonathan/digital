<script setup>
import { inject, ref } from 'vue'

const demoModel = ref()
const useStore = inject('useStore')
const tabsStore = useStore('tabs')

const openTabTestDos = async () => {
    await tabsStore.closeTab('TestTres')

    await tabsStore.openTab({
        path: 'test-3',
        name: 'TestTres',
        query: { data: 'DEMO DATA' }
    }, { openRelations: ['TestDos'] })
}
</script>

<template>
    TEST UNO
    <input type="text" v-model="demoModel">

    <button @click="openTabTestDos">Open Tab 2</button>
</template>
