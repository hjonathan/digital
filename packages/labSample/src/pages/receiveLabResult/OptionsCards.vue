<script setup>
import { ref } from 'vue'
import { Card, Title } from 'layout'
import { isFunction } from 'lodash'

const props = defineProps({
    items: Array
})

const onClick = (item) => {
    props.items.forEach((e) => {
        e.active = false
    })

    item.active = true

    if (isFunction(item.onClick)) {
        item.onClick()
    }
}
</script>

<template>
    <div class="flex px-8 items-center justify-center space-x-8">
        <template
            v-for="(item, index) in props.items"
            :key="index">
            <Card
                @click="onClick(item)"
                :active="item.active"
                class="p-6 hover:!text-primary-500 hover:!scale-105
                    transition-all duration-300">
                <!-- Icon -->
                <component
                    :is="item.icon"
                    class="w-12 mx-auto mb-4"
                    aria-hidden="true" />

                <!-- Extra message -->
                <span class="text-xs font-light text-center">
                    {{ $t('Load') }}
                </span>

                <!-- Title -->
                <Title
                    :has-border-bottom-line="false"
                    title-type="h4"
                    in-slide-over
                    class="font-semibold">
                    {{ $t(item.title) }}
                </Title>
            </Card>
        </template>
    </div>
</template>
