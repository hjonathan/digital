<script setup>
import { InformationCircleIcon } from '@heroicons/vue/20/solid'
import { Slideover, Badge } from 'layout'
import { ref } from 'vue'
import SafetySubview from './SafetySubview.vue'
import { makeTitle } from 'shared'

const props = defineProps(
    { data: Object }
)

const formData = ref()

const configSlideOver = ref({
    open: false,
    close: false
})

const safetyData = ref(props.data)

const openSlideOver = (data) => {
    formData.value = data

    configSlideOver.value.open = !configSlideOver.value.open
}
</script>

<template>
    <table>
        <thead>
            <tr>
                <th class="!text-base px-5">
                    {{ $t('Test')}}
                </th>

                <th class="!text-base px-5 text-right">
                    {{ $t('Status')}}
                </th>
            </tr>
        </thead>

        <tbody>
            <template
                v-for="element in safetyData"
                :key="element.key">
                <tr>
                    <td class="!text-base px-5">
                        {{ makeTitle(element?.name) }}
                    </td>

                    <td class="!text-base text-right">
                        <div
                            v-if="element.status === 1"
                            class="inline-flex">
                            <Badge
                                :label="$t(element.text_value || '')"
                                type="success" />

                            <InformationCircleIcon
                                v-if="element.children.length"
                                @click="openSlideOver(element)"
                                :class="`hidden h-6 w-6 flex-none text-gray-400 sm:block cursor-pointer`" />
                        </div>

                        <Badge
                            v-if="element.status === 0"
                            :label="$t(element.text_value || '')"
                            type="danger" />

                        <span
                            v-if="element.status === -1"
                            class="text-sm">
                            {{ $t(element.text_value || '') }}
                        </span>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>

    <Slideover
        :open="configSlideOver.open"
        :firstPanelCancelButtonTitle="$t('Close')"
        :close="configSlideOver.close"
        :title="$t('Details')"
        has-cancel-button>
        <SafetySubview
            :data="formData"
            class="air" />
    </Slideover>
</template>
