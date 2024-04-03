<script setup>
/**
 * Manages locking, unlocking, recalling, confirming contamination, or disposing of selected items.
 * It allows users to select a reason, toggle 'batch lock' (if applicable), provide notes, and set a custom date.
 */

import { inject, ref, computed, onMounted } from 'vue'
import { formatDate, showUuid } from 'shared'
import { ShowValue, Treeselect, ToggleSwitch, TextArea, SelectCustomDate } from 'form'
import { Alert } from 'layout'

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

// Inject necessary services.
const useGlobalStore = inject('useGlobalStore')
const api = inject('api')

// Get a references to stores.
const rapidStore = useGlobalStore('rapidStore')
const parametersStore = useGlobalStore('parameters')

const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)
const slideAction = rapidStore.reactiveProperty(`slide-${props.type}`)
const products = ref(selectedRows.value)
const errors = ref({})

onMounted(() => {
    // Enable batch lock if all selected items share the same lock type for certain actions.
    if (action.value === 'Unlock' ||
        action.value === 'ConfirmContamination' ||
        action.value === 'Dispose' ||
        action.value === 'PossibleContamination') {
        enableLockBatch.value = products.value.every(element => {
            return element?.product_lock_type_id === products.value[0].product_lock_type_id
        })
    }
})

// Handles the save action
const save = async () => {
    /**
     * Determine the API endpoint and prepare data based on the selected action.
     */
    let endPoint = ''

    const objectData = {
        ids: products.value.map(product => product.id),
        reason_id: itemToLock.value.reason_id ? itemToLock.value.reason_id : null,
        lock_batch: itemToLock.value.lock_batch ? itemToLock.value.lock_batch : false,
        note: itemToLock.value.note,
        updated_at: itemToLock.value.updated_at ? formatDate(itemToLock.value.updated_at, 'utcDateTime') : null
    }

    if (action.value === 'Lock') {
        endPoint = '/stock/lock'

        objectData.lock = true
    }

    if (action.value === 'Unlock') {
        endPoint = '/stock/unlock'

        objectData.lock = true
    }

    if (action.value === 'Recall') {
        endPoint = '/stock/recall'
    }

    if (action.value === 'ConfirmContamination') {
        endPoint = '/stock/confirm_contamination'
    }

    if (action.value === 'PossibleContamination') {
        endPoint = '/stock/possible_contamination'
    }

    if (action.value === 'RemoveQuarantine') {
        endPoint = '/stock/out_of_quarantine'
    }

    if (action.value === 'Dispose') {
        endPoint = '/stock/dispose'

        objectData.all_in_batch = itemToLock.value.lock_batch || false
    }

    // Trigger API request to perform the selected action on the selected items.
    const response = await api.post(endPoint, objectData)

    response.errors && (errors.value = response.errors)

    return response
}

const enableLockBatch = ref(false)

// Component action ('Lock, Unlock, Recall, ConfirmContamination, Dispose').
const action = ref(slideAction.value.action)

// Component state
const itemToLock = ref({
    locked: null,
    updated_at: null,
    reason_id: null,
    lock_batch: false
})

// Gets the list of reasons for locking based on action.
const reasons = computed(() => {
    // All reasons
    const reasons = parametersStore.getTreeSelectDataBySlug('reasons')

    // Default. Applies in Lock action.
    let reasonTypeSlug = 'lock-reasons'

    if (action.value === 'Unlock') {
        reasonTypeSlug = 'unlock-reasons'
    }

    if (action.value === 'Dispose') {
        reasonTypeSlug = 'dispose-reasons'
    }

    if (action.value === 'Recall') {
        reasonTypeSlug = 'recall-reasons'
    }

    if (action.value === 'ConfirmContamination') {
        reasonTypeSlug = 'confirm-contamination-reasons'
    }

    const childReasons = reasons.filter(reason => reason.data?.slug === reasonTypeSlug)

    return childReasons[0].children
})

const lockBatchSlugs = ['lock-due-to-possible-contamination']

// Determines if the selected reason implies batch locking.
const lockedBatch = computed(() => {
    if (itemToLock.value?.reason_id) {
        const idReason = itemToLock.value?.reason_id || null

        const reason = parametersStore.getElementById(idReason, reasons.value)

        return lockBatchSlugs.includes(reason?.data?.slug)
    }

    return false
})

// Provides dynamic text for toggle switch based on the selected action.
const toggleTexts = computed(() => {
    // Default. Applies in Lock action
    const texts = {
        label: 'Lock entire batch',
        tag: 'Lock all items in the batch'
    }

    if (action.value === 'Unlock') {
        texts.label = 'Unlock entire batch'
        texts.tag = 'Unlock all items in the batch'
    }

    if (action.value === 'ConfirmContamination') {
        texts.label = 'Confirm contamination entire batch'
        texts.tag = 'Confirm contamination all items in the batch'
    }

    if (action.value === 'Dispose') {
        texts.label = 'Remove entire batch'
        texts.tag = 'Remove all contaminated items in the batch'
    }

    return texts
})

// Exposing save function to parent components.
defineExpose({ save })
</script>

<template>
    <section class="full space-y-6">
        <!-- Display product IDs if more than one product is selected. -->
        <div
            v-if="products.length > 1"
            class="space-y-4">
            <template
                v-for="(product, index) in products"
                :key="index">
                <ShowValue
                    :label="`${$t('Selected product')} #${ index + 1 }`"
                    justify-end>
                    <div class="w-28 justify-between">
                        <span class="font-semibold">
                            {{ $t('ID:') }}
                        </span>

                        {{ showUuid(product.id) }}
                    </div>
                </ShowValue>
            </template>
        </div>

        <!-- Display a warning alert for the 'Recall' action. -->
        <Alert
            v-if="slideAction.action === 'Recall'"
            :has-close-button="false"
            type="danger"
            title="Recall all items from the lot"
            content="This action will automatically put all items belonging to the same batch into recovery status" />

        <!-- Reason. -->
        <Treeselect
            v-if="slideAction.action !== 'PossibleContamination' && slideAction.action !== 'RemoveQuarantine' "
            v-model="itemToLock.reason_id"
            :errors="errors?.reason_id"
            :options="reasons"
            label="Reason"
            placeholder="Select Item"
            class="input" />

        <!-- Toggle switch for batch lock (if applicable). -->
        <Transition>
            <ToggleSwitch
                v-if="(lockedBatch || enableLockBatch) && slideAction.action !== 'Recall'"
                v-model="itemToLock.lock_batch"
                :errors="errors?.lock_batch"
                name="batch_toggle"
                :label="$t(toggleTexts.label)"
                :tag="$t(toggleTexts.tag)" />
        </Transition>

        <!-- Note. -->
        <TextArea
            v-model="itemToLock.note"
            :errors="errors?.note"
            :placeholder="$t('Note')"
            :label="$t('Note')" />

        <!-- Custom date. -->
        <SelectCustomDate
            v-model="itemToLock.updated_at"
            :errors="errors?.updated_at" />
    </section>
</template>

<style scoped>
.v-enter-active {
    transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
    opacity: 0;
}
</style>
