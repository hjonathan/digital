<script setup>
import { Title, Card } from 'layout'
import {
    CurrencyDollarIcon,
    ChartBarIcon
} from '@heroicons/vue/24/outline'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const useStore = inject('useGlobalStore')

const tabsStore = useStore('tabs')

const cardItems = ref([
    {
        title: t('Supplies cost'),
        icon: CurrencyDollarIcon,
        name: 'SuppliesCost',
        permission: 'supplies.cost'
    },
    {
        title: t('Supplies transactions'),
        icon: ChartBarIcon,
        name: 'SuppliesTransactions',
        permission: 'supplies.transactions'
    },
])
</script>

<template>
    <section>
        <Title
            :title="$t('Reports')"/>

        <div class="flex flex-row space-x-20">
            <Card
                v-for="(item, index) in cardItems"
                :key="index"
                v-permission="{ name: item.permission }"
                @click="tabsStore.openTab({ name: item.name })"
                is-link
                class="p-8 w-3/12">
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
    </section>
</template>
