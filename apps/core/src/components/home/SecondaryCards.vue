<script setup>
import { ref, inject } from 'vue'
import { Card, Title } from 'layout'

import {
    UserGroupIcon,
    ShoppingBagIcon,
    TruckIcon,
    BeakerIcon
} from '@heroicons/vue/24/outline'

const useStore = inject('useStore')

const tabsStore = useStore('tabs')

const cardItems = ref([
    {
        title: 'Transfers',
        icon: TruckIcon,
        path: '/transfers'
    },
    {
        title: 'Clients',
        icon: UserGroupIcon,
        path: '/clients'
    },
    {
        title: 'Vendors',
        icon: ShoppingBagIcon,
        path: '/vendors'
    },
    {
        title: 'Lab Sample',
        icon: BeakerIcon,
        path: '/lab-sample'
    },
])
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card
            v-for="(item, index) in cardItems"
            :key="index"
            @click="tabsStore.openTab({ path: item.path })"
            :placeContentCenter="false"
            isLink
            class="hover:bg-primary-500 hover:text-white transition-all duration-500">
            <div class="flex items-center justify-between relative w-full">
                <!-- Icon container -->
                <span class="bg-primary-500 group-hover:bg-white p-2 rounded-lg transition-all duration-500">
                    <component
                        :is="item.icon"
                        class="w-8 h-8 text-gray-300 group-hover:text-primary-500 transition-all duration-500" />
                </span>

                <!-- Title and subtitle -->
                <div>
                    <Title
                        :hasBorderBottomLine="false"
                        titleType="h4"
                        inSlideOver>
                        {{ $t(item.title) }}
                    </Title>

                    <span class="text-xs font-light text-right">
                        {{ $t('Manage') }}
                    </span>
                </div>
            </div>
        </Card>
    </div>
</template>
