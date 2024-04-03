<script setup>
import { inject, ref } from 'vue'
import { Card, Title } from 'layout'

import {
    RectangleStackIcon,
    BanknotesIcon,
    TruckIcon,
    TagIcon
} from '@heroicons/vue/24/outline'

const useStore = inject('useStore')

const tabsStore = useStore('tabs')

const cardItems = ref([
    {
        title: 'Inventory',
        icon: RectangleStackIcon,
        path: '/inventory'
    },
    {
        title: 'Invoicing',
        icon: BanknotesIcon,
        path: '/invoicing'
    },
    {
        title: 'Supplies',
        icon: TruckIcon,
        path: '/supplies'
    },
    {
        title: 'Labels',
        icon: TagIcon,
        path: '/labels'
    },
])
</script>

<template>
    <!-- Main cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-8">
        <Card
            v-for="(item, index) in cardItems"
            :key="index"
            @click="tabsStore.openTab({ path: item.path })"
            is-link
            class="p-8">
            <!-- Icon -->
            <component
                :is="item.icon"
                class="w-12 mx-auto mb-4 text-gray-600 group-hover:text-primary-500 group-hover:scale-110
                transition-all duration-300"
                aria-hidden="true" />

            <!-- Extra message -->
            <span class="text-xs font-light text-center">
                {{ $t('View') }}
            </span>

            <!-- Title -->
            <Title
                :has-border-bottom-line="false"
                title-type="h4"
                in-slide-over
                class="font-semibold text-gray-600 group-hover:text-primary-500 group-hover:scale-110 text-center
                transition-all duration-300">
                {{ $t(item.title) }}
            </Title>
        </Card>
    </div>
</template>
