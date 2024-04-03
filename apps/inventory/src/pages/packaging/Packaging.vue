<script setup>
import { inject, ref, onMounted } from 'vue'
import { Stepper, Title } from 'layout'
import { usePackaging as packUse } from './usePackaging'
import { useI18n } from 'vue-i18n'
import StepPackagingList from './StepPackagingList.vue'
import Residue from './Residue.vue'
import Summary from './Summary.vue'
import { validationNext, get } from './validations'
import StepTitle from '../../components/StepTitle.vue'
import { isArray } from 'lodash'
import { showUuid } from 'shared'

const { t } = useI18n()
const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const inventoryStore = useGlobalStore('inventory')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const ids = ref([])
// Data sended from inventory that contains selected products

const step = ref(0)
const items = ref([])
const quantity = ref(0)

// Data for stepper
const steps = ref([
    {
        id: 'packaging-list',
        name: t('Packaging'),
        subtitle: t('Packaging'),
        status: 'current',
        isCurrent: false,
        next: async (goNext) => {
            const response = await validationNext.packaging({ packages, errors, items })

            if (!response) {
                return
            }

            goNext()
        }
    },
    {
        id: 'remaining',
        name: t('Remaining'),
        subtitle: t('Remaining'),
        status: 'upcoming',
        isCurrent: false,
        next: async (goNext) => {
            const response = await validationNext.residue({ residue, errors, items, packages, endpoint: '/stock/package_validation' })

            if (response) {
                goNext()
            }
        }
    },
    {
        id: 'summary',
        name: t('Summary'),
        subtitle: t('Summary'),
        status: 'upcoming',
        isCurrent: false,
        next: async (goNext) => {
            const response = await get.process({ residue, items, packages, endpoint: '/stock/package' })

            response.errors && (errors.value = response.errors)

            if (response.success) {
                inventoryStore.fetch()

                tabsStore.closeTab('Packaging')

                rapidStore.$emitGlobalEvent('load-subitem-list')

                return
            }

            errorMessage.value = response.message
        }
    },
])

const usePackaging = packUse(items, steps, step)
const { totalQuantity, disableNextButton, disablePreviousButton, errors, packages, residue, errorMessage } = usePackaging

// Data and validations for all steps on machine trim process

onMounted(async () => {
    // Receive one or multiple ids for this package
    let itemId = router.currentRoute.value.query.id

    ids.value = itemId

    !Array.isArray(itemId) && (ids.value = [itemId])

    if (!isArray(router.currentRoute.value.query.id)) {
        itemId = [router.currentRoute.value.query.id]
    }

    const response = await inventoryStore.getInventoryItems(itemId)

    response.success && (items.value = response.data)

    quantity.value = items.value.reduce((acc, val) => {
        acc += Number(val.quantity)

        return acc
    }, 0)

    totalQuantity.value = quantity.value
})

</script>

<template>
    <section class="!pt-0">
        <!-- Steps for machine trim -->
        <Stepper
            v-model="step"
            v-model:steps="steps"
            :disablePreviousButton="disablePreviousButton"
            :disableNextButton="disableNextButton"
            :disableDirectNavitagion="true"
            :has-navigation-buttons="true">
            <template v-slot:content-step-1>
                <StepPackagingList
                    v-model:step="steps[0]"
                    v-model:usePackaging="usePackaging"
                    :ids="ids">
                    <template v-slot:right-title>
                        <Title title-type="h3">
                            {{ ids.map(id => showUuid(id)).join(', ') }}
                        </Title>
                    </template>
                </StepPackagingList>
            </template>

            <template v-slot:content-step-2>
                <Residue
                    v-model:step="steps[1]"
                    v-model:usePackaging="usePackaging"
                    :ids="ids">
                    <template v-slot:right-title>
                        <Title title-type="h3">
                            {{ ids.map(id => showUuid(id)).join(', ') }}
                        </Title>
                    </template>
                </Residue>
            </template>

            <template v-slot:content-step-3>
                <Summary
                    v-model:step="steps[2]"
                    v-model:usePackaging="usePackaging"
                    :ids="ids">
                    <template v-slot:right-title>
                        <Title title-type="h3">
                            {{ ids.map(id => showUuid(id)).join(', ') }}
                        </Title>
                    </template>
                </Summary>
            </template>
        </Stepper>
    </section>
</template>
