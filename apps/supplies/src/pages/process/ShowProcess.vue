<script setup>
import { inject, onMounted, ref, computed } from 'vue'
import { InputLabel } from 'form'
import { Title, Overlay, Button, Badge, ConfirmationModal } from 'layout'
import { showUuid } from 'shared'
import { api } from '@/config'
import Lane from './Lane.vue'
import { useProcess as useComposable } from './useProcess'
import { mdiRefresh, mdiBookmark } from '@mdi/js'
import { getStatusColor } from './configColor'
import Summary from './Summary.vue'

const router = inject('router')
const useGlobalStore = inject('useGlobalStore')

const id = router.currentRoute.value.params.id

const rapidStore = useGlobalStore('rapidStore')
const supplyStore = useGlobalStore('supplies')
const coreStore = useGlobalStore('core')

const currentUserId = coreStore.getUserId()

const suppliesCostStore = useGlobalStore('suppliesCost')
const suppliesTransactionStore = useGlobalStore('suppliesTransaction')

const processStore = useGlobalStore('process')

const verifyCancelProcess = computed(() => {
    const result = process.value?.user_can_cancel_json.find(e => e.user_id === currentUserId)

    if (coreStore.permissions?.includes('supplies.process.cancel') && process.value?.user_can_cancel_json.length) {
        return true
    }

    return !!result
})

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const useProcess = useComposable({ configModal })

const { process, cancelProcess, isLoading } = useProcess

const parts = ref([])

const completeItems = ref([])

const updateData = async () => {
    isLoading.value = true

    const { data } = await api.get(`/supplies/supply_process_show/${id}`)
    
    const { data: items } = await api.get(`/supplies/process_warehouse_receipt_list_items/${id}`)

    parts.value = items.filter(item => item.part_item)
    completeItems.value = items.filter(item => !item.part_item && item.quantity)

    processStore.fetch()

    suppliesCostStore.fetch()

    supplyStore.fetch()

    suppliesTransactionStore.fetch()

    isLoading.value = false

    process.value = data

    process.value.process_stages = process.value.process_stages.sort()
}

rapidStore.$registerGlobalEvent('updateSupplyDashboard', updateData)

onMounted(async () => {
    updateData()
})
</script>

<template>
    <!-- Confirmation Modal -->
    <Component
        :is="configModal.component"
        :config="configModal" />

    <Overlay
        v-if="isLoading"
        class="z-50"/>

    <div class="flex justify-between sticky top-0 z-10 overflow-y-hidden bg-gray-200 !p-4 w-full items-center">
        <div class="flex items-center space-x-8">
            <Title
                :title="`${$t('Process')} #${showUuid(process?.id)}`"
                :hasBorderBottomLine="false">
            </Title>

            <!-- The refresh button is only displayed when the process is not yet finished (rejected, canceled or received) -->
            <Button
                v-if="process?.process_status?.slug !== 'rejected' && process?.process_status?.slug !== 'cancel' && process?.process_status?.slug !== 'received'"
                @click="updateData"
                class="mx-4 !mt-2 !hover:bg-primary-500"
                flat
                size="sm"
                icon-class="h-5 w-5 !mx-0"
                color="primary"
                :icon="mdiRefresh" />

            <Badge
                class="!text-sm !mt-2"
                :type="getStatusColor(process?.process_status.slug)"
                :label="process?.process_status?.name" />
        </div>

        <Button
            v-if="verifyCancelProcess"
            @click="cancelProcess"
            class="!px-2 opacity-90 hover:opacity-100"
            type="button"
            flat
            size="sm"
            :icon="mdiBookmark"
            icon-class="text-red-500 !h-6 !w-6"
            :label="$t('Cancel')" />
    </div>

    <div class="row cols-4 col-gutter-xs">
        <div class="col-3/4">
            <section v-if="process">
                <!-- Requester -->
                <InputLabel
                    class="w-96"
                    v-if="process?.request_user"
                    v-model="process.request_user.name"
                    :label="$t('Requester')"
                    mode="readonly"
                    outline
                    dense />
                <!-- Grid -->
                <div class="flex flex-row space-x-5 overflow-x-scroll overflow-y-hidden min-h-[700px]">
                    <div
                        v-for="(config, index) of process.process_stages"
                        :key="index"
                        class="flex-shrink-0 w-96 items-start justify-center space-y-5 pb-6">
                        <Lane
                            :useProcess="useProcess"
                            :useAlertModal="useAlertModal"
                            :config="config" />
                    </div>
                </div>
            </section>
        </div>

        <div class="col-2/63 border bg-white">
            <Summary
                mode="edit"
                v-model:parts="parts"
                v-model:completeItems="completeItems" />
        </div>
    </div>
</template>
