<script setup>
import { inject, computed } from 'vue'
import { Alert } from 'layout'

const useStore = inject('useStore')

const layoutManagerStore = useStore('layoutManager')

const destiny = computed(() => {
    if (!layoutManagerStore.globalAlert.show) return ''

    const id = document.getElementById('slideOverTeleport')

    return id ? 'slideOverTeleport' : 'globalTeleport'
})
</script>

<template>
    <Teleport
        v-if="layoutManagerStore.globalAlert.show"
        :to="`#${destiny}`">
        <div :class="{
                'fixed top-2 right-2 md:top-4 md:right-4 m-4' : destiny === 'globalTeleport'
            }"
            style="z-index: 100 !important;">
            <transition>
                <Alert
                    :class="{
                        'w-96' : destiny === 'globalTeleport'
                    }"
                    v-model="layoutManagerStore.globalAlert.show"
                    :borderRounded="destiny !== 'globalTeleport'"
                    :has-close-button="layoutManagerStore.globalAlert.closeButton"
                    :type="layoutManagerStore.globalAlert.type"
                    :content="layoutManagerStore.globalAlert.content"
                    is-fixed />
            </transition>
        </div>
    </Teleport>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
  opacity: 0 ;
}
</style>
