<script setup>
import { EntityInformation, Title } from 'layout'
import { inject } from 'vue'
import TransferStepTitle from './TransferStepTitle.vue'

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const props = defineProps({
    step: {
        type: Object,
        default: () => ({})
    },
    useTransfer: Object
})

const { vehicle, addVehicle, saveMessage, allErrors, thread } = props.useTransfer

rapidStore.$registerGlobalEvent(`selectedVehicle:${thread.value.idThread}`, addVehicle)

const onClick = () => tabsStore.openTab({ name: 'transferVehicles', query: { idThread: thread.value.idThread } })

</script>

<template>
    <section class="paper">
        <TransferStepTitle
            :title="$t('Transport vehicle')"
            :saveMessage="saveMessage"
            :errors="allErrors" />

        <div class="flex justify-center">
            <EntityInformation
                :hasCard="!vehicle.data"
                :action="!vehicle.data ? onClick : null"
                :icon="vehicle.icon"
                :title="vehicle.title"
                :name="vehicle.name"
                :data="vehicle.data"
                class="!w-96">
                <div v-if="!vehicle.data" class="">
                    {{ $t('Please select a vehicle') }}
                </div>

                <button
                    v-if="vehicle.data"
                    @click="onClick"
                    class="link primary notPrintableArea mt-2">
                    {{ $t('Change') }}
                </button>
            </EntityInformation>
        </div>
    </section>
</template>
