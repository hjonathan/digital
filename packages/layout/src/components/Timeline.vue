<script setup>
import { computed } from 'vue'
import Connector from './Connector.vue'
import { uuid } from 'shared'

const slots = defineSlots()
const timelineId = uuid()
const conectors = null

const render = (index) => {
    return buildSlots.value[index]
}

const buildSlots = computed(() => {
    let slotsResult = slots.default()

    if (slotsResult && slotsResult.length === 1 && typeof slotsResult[0].type === 'symbol') {
        slotsResult = slotsResult[0].children || []
    }

    return slotsResult
})

const data = computed(() => {
    return buildSlots.value.map(e => ({ ...getComponent(e) }))
})

const getComponent = (slotsResult) => {
    if (slotsResult && typeof slotsResult.type === 'symbol') {
        return getComponent(slotsResult.children[0])
    }

    return slotsResult.props
}

</script>

<template>
    <ol
        v-if="data.length"
        class="h-max bg-white max-w-xl overflow-hidden sticky2 top-0">
        <template
            v-for="(item, itemIdx) in data"
            :key="itemIdx">
            <li :class="[itemIdx !== item.length - 1 ? 'pb-4' : '', 'relative']">
                <!-- Line -->
                <div
                    v-if="itemIdx !== data.length - 1"
                    class="absolute left-3 top-1/2 -ml-px mt-0.5 h-full border border-dashed border-gray-300" />

                <div class="group relative flex items-center space-x-4">
                    <!-- Circle -->
                    <span :id="`${timelineId}-${itemIdx}`" class="flex h-9 items-center">
                        <span
                            class="relative z-5 grid place-content-center h-6 w-6 items-center justify-center rounded-full
                            bg-white border-2 border-gray-300 border-dashed">
                            <!-- Inner circle -->
                            <div
                                :class="['rounded-full overflow-hidden  w-3 h-3',{
                                    'bg-gray-200': item.status == 'empty',
                                    'bg-gray-400': item.status == 'gray',
                                    'bg-red-400':item.status == 'danger',
                                    'bg-green-500':item.status == 'success',
                                    'bg-yellow-400':item.status == 'warning',
                                    'bg-blue-400':item.status == 'info'
                                }]" />
                        </span>
                    </span>

                    <component
                        :is="render(itemIdx)" />
                </div>
            </li>
        </template>
    </ol>
</template>
