<script setup>
import { Badge } from 'layout'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps(
    { data: Object }
)

const measure = ref(props.data.measure_test)

const format = (dt) => {
    return {
        columns: [{
            name: t('Compound'),
            key: 'display_name',
            class: ''
        },
        {
            name: t('Status'),
            key: 'status',
            class: ''
        },
        {
            name: t(`Sample (${measure.value.symbol})`),
            key: 'sample',
            class: 'text-right'
        },
        {
            name: t(`Limit (${measure.value.symbol})`),
            key: 'limit',
            class: 'text-right'
        },
        {
            name: t(`LOQ (${measure.value.symbol})`),
            key: 'loq',
            class: 'text-right'
        }],
        data: dt
    }
}

const { columns, data } = format(props.data.children)
</script>

<template>
    <table class="!text-base">
        <thead>
            <tr>
                <template v-for="(item, index) in columns" :key="item.key">
                     <th scope="col"
                        :class="[ item.class,'px-5 font-semibold !text-base']">
                            {{ item.name }}
                    </th>
                </template>
            </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
            <tr v-for="(item, indexData) in data" :key="indexData">
                <template v-for="(col, indexCol) in columns" :key="indexCol">
                    <td :class="[col.class,'px-5 !text-base']">
                        <Badge v-if="item[col.key] === 1 && col.key === 'status'"
                            :label="$t('Pass')"
                            type="success" />

                        <span v-else>
                            {{ $t(item[col.key]) }}
                        </span>
                    </td>
                </template>
            </tr>
        </tbody>
    </table>
</template>
