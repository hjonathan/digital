<script setup>
import { ref } from 'vue'
import { Card, Badge, Title } from 'layout'

const props = defineProps({
    data: Object,

    itemLabJson: Object,

    open: {
        type: Boolean,
        default: true
    }
})

const isOpen = ref(props.open)
</script>

<template>
    <!-- Order info card -->
    <Card
        flat
        is-closable
        v-model:open="isOpen"
        :placeContentCenter="false"
        header="Order info">
        <Title
            titleType="h3"
            :has-border-bottom-line="false"
            :title="$t('Product')" />

        <div class="grid grid-cols-2">
            <div class="flex flex-col">
                <!-- Product name -->
                <Title
                    titleType="h4"
                    :has-border-bottom-line="false"
                    :title="data.name" />

                <ul>
                    <!-- Product lab internal id and classification name -->
                    <li>
                        {{ itemLabJson.lab_internal_id }}

                        <Badge
                            :type="data.classification.id === 2 ? 'danger' : 'success'"
                            :label="$t(data.classification.name)" />
                    </li>

                    <!-- Strain name -->
                    <li>
                        {{ data.strain_name }}
                    </li>

                    <!-- Method name -->
                    <li class="flex gap-2">
                        {{ data.method.name }}
                    </li>
                </ul>
            </div>

            <!-- Product cover -->
            <img
                class="rounded w-56 mx-auto"
                :src="itemLabJson.cover">
        </div>
    </Card>
</template>
