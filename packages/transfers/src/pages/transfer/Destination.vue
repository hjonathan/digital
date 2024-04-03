<script setup>
import { EntityInformation, Alert } from 'layout'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import TransferStepTitle from './TransferStepTitle.vue'
import { showUuid } from 'shared'

const { t } = useI18n()

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

const { facility, addFacility, saveMessage, allErrors, thread, transferId } = props.useTransfer

rapidStore.$registerGlobalEvent(`selectedFacility:${thread.value.idThread}`, addFacility)

const onClick = () => tabsStore.openTab({ name: 'transferFacilities', query: { idThread: thread.value.idThread } })
</script>

<template>
    <section class="paper">
        <TransferStepTitle
            :title="$t('Destination')"
            :subtitle="transferId ? showUuid(transferId) : ''"
            :saveMessage="saveMessage"
            :errors="allErrors"/>

        <div class="flex justify-center">
            <EntityInformation
                class="!w-96"
                :hasCard="!facility.data"
                :action="!facility.data ? onClick : null"
                :icon="facility.icon"
                :title="facility.title"
                :name="facility.name"
                :data="facility.data">
                <div v-if="!facility.data" class="">
                    {{ $t('Please select a facility') }}
                </div>

                <button
                    v-if="facility.data"
                    @click="onClick"
                    class="link primary notPrintableArea mt-2">
                    {{ $t('Change') }}
                </button>
            </EntityInformation>
        </div>
    </section>
</template>
