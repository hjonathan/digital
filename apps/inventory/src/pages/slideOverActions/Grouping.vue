<script setup>
/**
 * TODO
 * Revision
 * Refactor
 * Clean code up
 * Action button not working properly
 */
import { ref, inject } from 'vue'
import { ShowValue, Treeselect } from 'form'
import { showUuid } from 'shared'

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})
const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')

const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)

const api = inject('api')

const products = ref(selectedRows.value)

const parametersStore = useGlobalStore('parameters')

const tabsStore = useGlobalStore('tabs')

const total = products.value.reduce((acc, product) => acc + product.quantity, 0)

const errors = ref({})

const location = ref(null)

const save = async () => {
    const response = await api.post('stock/subdivide_group', {
        ids: products.value.map((element) => element.id),
        location_id: location.value ? location.value : null
    })

    response.errors && (errors.value = response.errors)

    if (response.success) {
        rapidStore.$emitGlobalEvent('load-subitem-list')
    }

    return response
}

defineExpose({ save })
</script>

<template>
    <div class="space-y-6">
        <template v-for="(product, index) in products" :key="index">
            <ShowValue justify-end>
                <div class="flex justify-between">
                    <p>
                        {{ product.quantity }} {{ product.measure.name }}
                    </p>
                </div>

                <template #label>{{ $t('ID:') }} {{ showUuid(product.id) }}</template>
            </ShowValue>
        </template>

        <ShowValue justify-end>
            <template #label>{{ $t('New total') }}</template>

            <p class="text-right !mt-0">
                {{ total }} {{ products[0]?.measure.name }}
            </p>
        </ShowValue>

        <Treeselect
            :errors="errors?.location_id"
            v-model="location"
            :options="parametersStore.getTreeSelectDataBySlug('reasons')"
            placeholder="Select Item"
            label="Location"
            class="input" />
    </div>
</template>
