<script setup>
import { onMounted, ref } from 'vue'
import ItemCost from './ItemCost.vue'
import { api } from '@/config'
import { Input } from 'form'
import { defineModel } from 'shared'

const data = defineModel('data')

const props = defineProps({
    mode: String // show, edit
})

const types = ref()

const typesModel = ref({})

const onChange = () => {
    data.value = typesModel.value
}

onMounted(async () => {
    const response = await api.get('/reception-ind-costs')

    if (response.success) {
        types.value = response.data
    }
})

</script>
<template>
    <ItemCost
        v-for="(item, index) in types"
        :key="index"
        :title="$t(item.name)"
        class="text-sm">
        <template #value>
            <div class="flex items-center justify-between">
                <Input
                    :inputClass="'text-right'"
                    v-model="typesModel[item.id]"
                    type="number"
                    min="0"
                    max="100"
                    class="!mt-0 !w-32 notPrintableArea"
                    inline-label-right="$"
                    @update:model-value="onChange"
                    :errors="errors && errors[item.id] ? ' ' : ''" />
            </div>
        </template>
    </ItemCost>
</template>
