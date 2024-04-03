<script setup>
import { Label } from 'form'
import { computed, inject, ref, watch } from 'vue'
import { getSessionJSON, setSessionJSON } from 'shared'
import { ConfirmationModal, Overlay } from 'layout'

const useGlobalStore = inject('useStore')
const facilitiesStore = useGlobalStore('facilities')
const tabsStore = useGlobalStore('tabs')

const facilityDefault = getSessionJSON('facility_id')

const facilitySelected = ref()

const notification = ref(false)
const loading = ref(false)

const facilities = computed(() => {
    return facilitiesStore.getDataByUser().map(x => ({ ...x, name: x.facility_name }))
})

const confirmFacilitySelection = () => {
    loading.value = true

    setSessionJSON('facility_id', facilitySelected.value)

    const openTabs = tabsStore.getTabs()

    for (const tab of openTabs) {
        if (!tab.default) tabsStore.closeTab(tab.name)
    }

    setTimeout(() => {
        // TODO: Create function to reset all stores for not reload page
        window.location.reload()
    }, 500)
}

const cancelFacilitySelection = () => {
    facilitySelected.value = facilityDefault

    notification.value = false
}

watch(() => facilities.value, () => {
    if (facilities.value.length) {
        facilitySelected.value = facilityDefault || facilities.value[0].id

        setSessionJSON('facility_id', facilitySelected.value)
    }
})
</script>

<template>
    <!-- Overlay while facility selection update -->
    <Overlay
        v-if="loading"
        class="fixed top-0 left-0 w-screen !z-50"/>

    <!-- Confirmation modal to update facility selection -->
    <ConfirmationModal
        :description="$t('You are changing facility, the workspaces will be closed to update the data.')"
        :title="$t('Confirmation')"
        v-model="notification"
        @confirm="confirmFacilitySelection"
        @cancel="cancelFacilitySelection"
        :confirmation-button-label="$t('Accept')"
        class="z-50" />

    <!-- Facility selection -->
    <div
        v-if="facilities.length > 1"
        class="py-5 px-2">
        <Label class="text-gray-400">
            {{ $t('Choose facility: ') }}
        </Label>

        <select
            v-model="facilitySelected"
            :placeholder="$t('Choose Facility')"
            @update:model-value="notification = true"
            class="input">
            <option
                v-for="(option, index) of facilities"
                :key="index"
                :value="option.id">
                {{ option.facility_name }}
            </option>
        </select>
    </div>
</template>
