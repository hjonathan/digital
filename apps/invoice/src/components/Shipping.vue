<script setup>
import { computed, ref } from 'vue'
import { Alert, Button } from 'layout'
import { Input } from 'form'

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    showAlert: {
        type: Boolean,
        default: false
    }
})

const shippingModel = ref(props.data ? Object.assign({}, props.data) : {})

defineEmits(['clear'])

const save = () => {
    return existsShipping.value ? shippingModel.value : null
}

// Check if shipping data is valid
const existsShipping = computed(() => {
    return shippingModel.value.name ||
        shippingModel.value.address ||
        shippingModel.value.address_2 ||
        shippingModel.value.zip_code ||
        shippingModel.value.phone ||
        shippingModel.value.city ||
        shippingModel.value.state
})

// Clear shipping data
const clear = () => {
    shippingModel.value = {}
}

defineExpose({ save, clear })
</script>

<template>
     <!-- Name -->
    <Input
        v-model="shippingModel.name"
        :label="$t('Name')"
        :placeholder="$t('Name')" />

    <!-- Address -->
    <Input
        v-model="shippingModel.address"
        :label="$t('Address')"
        :placeholder="$t('Address')" />

    <!-- Address 2 -->
    <Input
        v-model="shippingModel.address_2"
        :label="$t('Address 2')"
        :placeholder="$t('Address 2')" />

    <!-- Zip code -->
    <Input
        v-model="shippingModel.zip_code"
        :label="$t('Zip code')"
        :placeholder="$t('Zip code')" />

    <!-- Phone -->
    <Input
        v-model="shippingModel.phone"
        :label="$t('Phone')"
        :placeholder="$t('Phone')" />

    <!-- City -->
    <Input
        v-model="shippingModel.city"
        :label="$t('City')"
        :placeholder="$t('City')" />

    <!-- State -->
    <Input
        v-model="shippingModel.state"
        :label="$t('State')"
        :placeholder="$t('state')" />

    <div
        v-if="showAlert"
        class="mt-20">
        <!-- Delete -->
        <h2>
           {{ $t(`Clear shipping form`) }}
       </h2>

       <Alert
           :icon="() => null"
           type="danger"
           :has-close-button="false">
           <div class="flex justify-between items-center">
               <span class="text-base">
                   {{ $t(`Do you want to clear form and shipping data?`) }}
               </span>

               <Button
                   color="danger"
                   :label="$t('Delete')"
                   @click="$emit('clear')" />
           </div>
       </Alert>
    </div>
</template>
