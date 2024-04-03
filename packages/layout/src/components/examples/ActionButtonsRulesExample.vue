<script setup>
import { computed, ref } from 'vue'
import ActionButtons from '../ActionButtons.vue'
import { Title } from 'layout'
import { jsonLogic } from 'jsonRules'
import { data } from './data'
import {
    mdiInboxArrowDown
} from '@mdi/js'

const rules = ref({
    and: [
        {
            and: [
                { in: [{ var: 'category.slug' }, ['dry-wt', 'bud-wt', 'trim-wt', 'clone']] },
                { in: [{ var: 'stage.slug' }, ['vegetation', 'harvested', 'final']] },
                {
                    and: [
                        { in: [{ var: 'category.slug' }, ['dry-wt', 'bud-wt', 'trim-wt', 'clone']] },
                        { in: [{ var: 'stage.slug' }, ['vegetation', 'harvested', 'final']] },
                        {
                            or: [
                                { all: [{ var: 'products' }, { '===': [{ var: 'prop' }, 'id2'] }] },
                                { all: [[1, 1, 1], { '===': [{ var: '' }, 1] }] },
                            ]
                        },
                    ]
                },
            ]
        },

        { '===': [{ var: 'locked' }, 0] },
        { in: [{ var: 'strain.slug' }, ['afghani', 'grams', 'units']] },
        { notIn: [{ var: 'strain.slug' }, ['afghani1', 'grams', 'units']] },
        { every: [['lock', 'lock', 'lock'], 'lock'] },
        { everyCollection: [{ var: 'products' }, e => e.name === 'prod1'] },

        { '===': [{ var: 'products.0.value' }, 'test'] },
        {
            in: [
                { var: 'strain.slug' },
                { merge: [['afghani', 'grams', 'units'], ['dry-wt', 'bud-wt', 'trim-wt']] },
            ]
        },
    ]
})

const items = computed(() => {
    const { response, logger } = jsonLogic.exec(rules.value, data)

    console.log('LOGGER JSON LOGIC :::', logger)

    return [{
        icon: mdiInboxArrowDown,
        label: 'Button 1',
        type: 'button',
        disabled: jsonLogic.apply(rules.value, data),
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Button 2',
        type: 'button',
        action: (data) => {}
    }]
})

</script>

<template>
    <Title>
        {{ $t('Action buttons with rules Example') }}
    </Title>

    <div class="mt-8">
        <ActionButtons :items="items"/>
    </div>

    <div class="flex ">
        <div class="flex-1 px-8 text-xs">
            <Title title-type="h4">
                {{ $t('Rule example to disable button 1') }}
            </Title>

            <pre>
                {{ rules }}
            </pre>
        </div>
        <div class="flex-1 px-8 text-xs">
            <Title title-type="h4">
                {{ $t('Data example') }}
            </Title>

            <pre>
                {{ data }}
            </pre>
        </div>
    </div>
</template>
