<script setup>
import { ref } from 'vue'

const data = ref({
    quantity: 0,
    price: 0
})
</script>

<template>
      <div class="mx-auto bg-white rounded-md w-full flex flex-col items-center justify-center p-8 shadow">
        <h1>Step 6</h1>

        <!-- Units created -->
        <input
            v-model="data.quantity"
            inputClass="text-right"
            class="input"
            :type="'number'"
            :step="'1'"
            :min="'0'" />

        <!-- Price -->
        <input
            v-model="data.price"
            inputClass="text-right"
            class="input air-sm"
            :type="'number'"
            :step="'1'"
            :min="'0'" />
    </div>
</template>
