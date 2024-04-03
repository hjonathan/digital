<script setup>
import { ref, inject, onMounted } from 'vue'
import { Button, Slider } from 'layout'
import { InputLabel } from 'form'
import { defineModel } from 'shared'

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const props = defineProps({
    vendor: Object,
    mode: String,
    error: String
})

const vendorModel = defineModel('vendor')

const thread = ref({
    idThread: 'PurchaseOrderVendor',
    action: 'Purchases'
})

const vendor = ref({
    name: null,
    address: null,
    address_2: null,
    phone: null,
    zip_code: null,
    city: null,
    state: null
})

const showSellerInformation = ref(true)

const addVendor = (data) => {
    if (data.value) {
        vendor.value = data.value[0]

        vendorModel.value = vendor.value

        const timeToWaitFinishRendering = 200

        setTimeout(() => {
            showSellerInformation.value = true
        }, timeToWaitFinishRendering)
    }
}

rapidStore.$registerGlobalEvent(`selectedRows:${thread.value.idThread}`, addVendor)

const onClick = () => tabsStore.openTab({ name: 'PurchaseOrderVendor', query: { ...thread.value } })

onMounted(() => {
    addVendor({ value: props.vendor })
})
</script>

<template>
    <Button
        v-if="!vendor.name && mode === 'edit'"
        @click="onClick"
        color="primary"
        :label="$t('Select a vendor')" />

    <Transition>
        <p
            v-show="error && !vendor.name"
            class="text-xs text-error-500 font-semibold mt-1">
            {{ error }}
        </p>
    </Transition>

    <Slider :isOpen="showSellerInformation">
        <div
            v-if="vendor.name"
            class="space-y-1">
            <InputLabel
                v-model="vendor.name"
                :label="$t('Company')"
                mode="readonly"
                outline
                dense />

            <InputLabel
                v-model="vendor.address"
                :label="$t('Address')"
                mode="readonly"
                outline
                dense />

            <InputLabel
                v-model="vendor.address_2"
                :label="$t('Address 2')"
                mode="readonly"
                outline
                dense />

            <InputLabel
                v-model="vendor.phone"
                :label="$t('Phone')"
                mode="readonly"
                outline
                dense />

            <InputLabel
                v-model="vendor.zip_code"
                :label="$t('Zip')"
                mode="readonly"
                outline
                dense />

            <InputLabel
                v-model="vendor.city"
                :label="$t('City')"
                mode="readonly"
                outline
                dense />

            <InputLabel
                v-model="vendor.state"
                :label="$t('State')"
                mode="readonly"
                outline
                dense />

            <button
                v-if="vendor.name && mode === 'edit'"
                @click="onClick"
                class="link primary notPrintableArea mt-2">
                {{ $t('Change') }}
            </button>
        </div>
    </Slider>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
  opacity: 0 ;
}
</style>
