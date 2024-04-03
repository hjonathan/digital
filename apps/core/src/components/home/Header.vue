<script setup>
import { inject, computed } from 'vue'
import { Title } from 'layout'
import { getSessionJSON } from 'shared'

const useStore = inject('useStore')

const coreStore = useStore('core')
const facilityStore = useStore('facilities')

const user = computed(() => {
    return coreStore.credentials?.user
})

// Gets facility information
const facility = computed(() => {
    const facilityId = getSessionJSON('facility_id')

    const facilities = facilityStore.getDataByUser()

    if (facilities) return facilities.find(f => f.id === facilityId)

    return null
})
</script>

<template>
    <!-- Header -->
    <header class="p-8 pb-28 sm:pb-40 group relative">
        <!-- Title -->
        <Title
            :has-border-bottom-line="false"
            :has-padding="false"
            class="!mt-0">
            <template v-slot:leftTitle>
                {{ $t('Welcome back') }}, {{ user.name }}
            </template>

            <template
                v-if="facility"
                v-slot:rightTitle>
                {{ $t('You are logged in') }}: {{ facility.facility_name }}
            </template>
        </Title>

        <!-- Subtitle -->
        <Title
            :has-border-bottom-line="false"
            :has-padding="false"
            title-type="h3"
            class="!mt-0">
            {{ $t('What do you wish to do?') }}
        </Title>
    </header>
</template>
