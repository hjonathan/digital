<script setup>
import { inject, ref } from 'vue'
import { MainCard, Title, Icon, TableUI } from 'layout'
import MaterialRequests from '../components/MaterialRequests.vue'
import PurchaseRequests from '../components/PurchaseRequests.vue'
import { gsap } from 'gsap'
import { mdiTextBoxMultiple } from '@mdi/js'
import {
    PlusIcon,
    DocumentPlusIcon,
    BanknotesIcon
} from '@heroicons/vue/24/outline'
import RequestsTable from '../components/RequestsTable.vue'

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')

const optionsCreate = ref({
    contentMain: true,
    optionsCreate: false
})

const animationDuration = 0.3

const openOptionsCreate = () => {
    const timeline = gsap.timeline()

    optionsCreate.value.optionsCreate = true

    timeline.to('#content-main', animationDuration, { scale: 0, opacity: 0, onComplete: () => (optionsCreate.value.contentMain = false) })
        .fromTo('#options-create', animationDuration, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 }, '<50%')
}

const closeOptionsCreate = () => {
    const timeline = gsap.timeline()

    optionsCreate.value.contentMain = true

    timeline.to('#options-create', animationDuration, { scale: 0, opacity: 0, onComplete: () => (optionsCreate.value.optionsCreate = false) })
        .fromTo('#content-main', animationDuration, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 }, '<50%')
}

const createMaterialRequest = () => {
    tabsStore.openTab({ name: 'MaterialRequest' })

    closeOptionsCreate()
}

const createPurchaseRequest = () => {
    tabsStore.openTab({ name: 'CreatePurchaseRequest' })

    closeOptionsCreate()
}

const createPurchaseOrder = () => {
    tabsStore.openTab({ name: 'CreatePurchaseOrder' })

    closeOptionsCreate()
}

const createRequestForQuotation = () => {
    tabsStore.openTab({ name: 'CreateRequestForQuotation' })

    closeOptionsCreate()
}
</script>

<template>
    <section class="!h-full">
        <!-- Title -->
        <div class="flex items-center space-x-2">
            <Icon
                :icon="mdiTextBoxMultiple" />

            <Title
                :title="$t('Requests')"
                :has-border-bottom-line="false" />
        </div>

        <!-- Main dashboard -->
        <div
            v-show="optionsCreate.contentMain"
            id="content-main"
            class="w-full">
            <div class="flex flex-col gap-20">
                <div
                    class="flex justify-center col-span-2">
                    <MainCard
                        :title="$t('Requests')"
                        :subtitle="$t('Create new Request')"
                        hasRing
                        :icon="PlusIcon"
                        @click="openOptionsCreate" />
                </div>

                <!-- <div
                    class="grid grid-cols-1 sm:grid-cols-2 sm:divide-x-4 divide-gray-300">
                    <MaterialRequests />

                    <PurchaseRequests />
                </div> -->
            </div>
        </div>

         <!-- Options create -->
         <div
            v-show="optionsCreate.optionsCreate"
            id="options-create"
            class="flex flex-col items-center mt-[5%] !h-full gap-20 w-full">
            <div class="flex gap-32 justify-center">
                <MainCard
                    :title="$t('Material request')"
                    :subtitle="$t('Create new material request')"
                    hasRing
                    :icon="DocumentPlusIcon"
                    @click="createMaterialRequest" />

                <MainCard
                    :title="$t('Purchase request')"
                    :subtitle="$t('Create new purchase request')"
                    hasRing
                    :icon="BanknotesIcon"
                    @click="createPurchaseRequest" />

                <MainCard
                    :title="$t('Purchase order')"
                    :subtitle="$t('Create new purchase order')"
                    hasRing
                    :icon="BanknotesIcon"
                    @click="createPurchaseOrder" />

                <MainCard
                    :title="$t('Request for quotation')"
                    :subtitle="$t('Create request for quotation')"
                    hasRing
                    :icon="BanknotesIcon"
                    @click="createRequestForQuotation" />
            </div>

            <a
                class="link danger"
                @click="closeOptionsCreate">
                {{ $t('Cancel') }}
            </a>
        </div>

        <RequestsTable />
    </section>
</template>
