<script setup>
import { Timeline, UserStatusCardDoc, Slider, Card, Badge } from 'layout'
import { computed, onMounted, ref } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAccount } from '@mdi/js'
import { random } from 'lodash'

const props = defineProps({
    title: String,
    data: Array,
    footer: {
        type: Object,
        default: () => (null)
    },
    history: {
        type: Array,
        default: () => ([])
    }
})

const historyStack = ref(Array(10).fill(false))

const data = computed(() => {
    return props.data
})

const openHistory = () => {
    props.data.forEach((e, index) => {
        if (e?.type && e.type === 'history' && e.options?.open) {
            historyStack.value[index] = true
        }
    })
}

onMounted(() => {
    openHistory()
})
</script>

<template>
    <Card
        @click="data.onClick"
        headerClass="!my-0 !py-0 !mx-0 !px-0"
        footerClass="!my-0 !py-0 !mx-0 !px-0"
        bodyClass="place-content-stretch"
        :hasPadding="false"
        class="!h-auto hover:border-primary-400 cursor-pointer group">
        <template #header>
            <div
                class="flex items-center gap-x-4 border-b justify-between border-gray-900/5 bg-gray-100 px-4 py-5 rounded-t-md">
                <div
                    class="flex space-x-2 text-sm font-medium  text-gray-900">
                    <!-- Header title -->
                    <span>
                        {{ title }}
                    </span>
                </div>
            </div>
        </template>

        <div class="-my-3 divide-y divide-gray-100 p-4 text-sm leading-6 !w-full">
            <template
                v-for="(item, index) in data"
                :key="index">
                <div
                    v-if="item && !item.type"
                    class="flex justify-between gap-x-4 py-3">
                    <!-- Label -->
                    <dt
                        class="text-gray-500">
                        {{ item?.label }}
                    </dt>

                    <!-- Value -->
                    <dd class="text-gray-700">
                        <span :class="item.classValue">
                            {{ item?.value }}
                        </span>
                    </dd>
                </div>

                <!-- Badge -->
                <div
                    v-if="item && item.type === 'badge'"
                    class="flex justify-between gap-x-4 py-3">
                    <dt class="text-gray-500">
                        {{ item?.label }}
                    </dt>

                    <dd class="text-gray-700">
                        <Badge
                            :type="item.options?.color"
                            :label="item?.value" />
                    </dd>
                </div>

                <div
                    v-if="item && item.type === 'history'"
                    class="flex justify-between gap-x-4 py-3">
                    <dt
                        class="text-gray-500">
                        {{ item?.label }}
                    </dt>

                    <div class="flex space-x-4">
                        <div class="flex -space-x-2 group/images">
                            <dd
                                v-for="approver in item.value"
                                :key="approver.id">
                                <span
                                    v-if="!approver.data.url"
                                    @click.stop.prevent="historyStack[index] = !historyStack[index]"
                                    class="inline-flex h-8 w-8 items-center cursor-pointer rounded-full border-1 ring-1
                                    ring-primary-300 border-primary-500 justify-center bg-gray-200 text-gray-500" >
                                    <svg-icon
                                        type="mdi"
                                        :path="mdiAccount"
                                        size="18"
                                        :alt="approver.approval_name" />
                                </span>

                                <img
                                    v-if="approver.data.url"
                                    :alt="approver.data.name"
                                    @click.stop.prevent="historyStack[index] = !historyStack[index]"
                                    class="mix-blend-multiply h-[36px] w-[36px] rounded-full cursor-pointer ring-2
                                    ring-white backdrop-brightness-75 group-hover/images:backdrop-brightness-110
                                    group-hover/images:scale-110 transition duration-300"
                                    :src="approver.data.url" />
                          </dd>
                      </div>
                  </div>
              </div>

                <Slider
                    v-if="item && item.type === 'history' && item.value?.length"
                    :isOpen="historyStack[index]">
                    <div class="py-2">
                        <Timeline v-if="item.type === 'history'" >
                            <template
                                v-for="(itemHistory, idx) in data[index].value"
                                :key="idx">
                                <UserStatusCardDoc
                                    :data="itemHistory.data"
                                    :status="itemHistory.status"
                                    class="bg-white">
                                    <template #rightside v-if="itemHistory.type === 'area'">
                                        <div class="font-bold text-gray-900">
                                            {{ itemHistory.data.name }}
                                        </div>
                                        <div class="font-bold text-gray-900">
                                            {{ itemHistory.data.department }}
                                        </div>
                                        <div class="text-xs leading-4 text-gray-400">
                                            {{ itemHistory.data.note }}
                                        </div>
                                    </template>
                                </UserStatusCardDoc>
                            </template>
                        </Timeline>
                    </div>
                </Slider>
            </template>
        </div>

        <slot
            name='footer' />
    </Card>
</template>
