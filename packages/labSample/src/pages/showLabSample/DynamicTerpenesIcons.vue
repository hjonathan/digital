<script setup>
defineProps({
    data: Object
})
</script>

<template>
    <div class="rounded-t-2xl bg-gray-50 sm:p-8">
        <div class="mx-auto flex justify-between">
            <div
                v-for="incentive in data"
                :key="incentive.name"
                class="text-center">
                <div class="sm:flex-shrink-0">
                    <img
                        class="mx-auto h-16"
                        :src="`https://orders.confidentcannabis.com/assets/img/terpenes/${incentive.image}.png`" />
                </div>

                <div class="mt-3 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                    <h3 class="text-sm font-medium text-gray-900">
                        {{ incentive.name }}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>
