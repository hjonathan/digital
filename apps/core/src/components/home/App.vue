<script setup>
import MainCards from './MainCards.vue'
import SecondaryCards from './SecondaryCards.vue'
import HomeMain from './HomeMain.vue'
import Header from './Header.vue'
</script>

<template>
    <!-- Welcome header -->
    <Header />

    <!-- Cards -->
    <section class="w-full -mt-24 sm:-mt-36 relative">
        <MainCards />

        <SecondaryCards />
    </section>

    <!-- Rest of the contents  -->
    <HomeMain />
</template>
