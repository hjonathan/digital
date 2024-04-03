<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps(
    { data: Object }
)

const formatTerpenesData = (obj) => {
    return {
        columns: [
            {
                name: t('Component'),
                key: 'name',
                class: ''
            },
            {
                name: t('%'),
                key: 'percentage',
                class: 'text-right'
            },
            {
                name: t('mg/g'),
                key: 'text_value',
                class: 'text-right'
            },
        ],
        data: obj
    }
}

const { columns, data } = formatTerpenesData(props.data)

</script>

<template>
    <table class="!text-base">
        <thead>
            <tr>
                <template
                    v-for="(item, index) in columns"
                    :key="item.key">
                    <th
                        scope="col"
                        :class="[item.class,'px-5 font-semibold !text-base']">
                         {{ item.name }}
                    </th>
                </template>
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="(item, indexData) in data"
                :key="indexData">
                <template
                    v-for="(col, indexCol) in columns"
                    :key="indexCol">
                    <td :class="[ col.class,'px-5 !text-base']">
                        {{ item[col.key] }}
                    </td>
                </template>
            </tr>
        </tbody>
    </table>
</template>
