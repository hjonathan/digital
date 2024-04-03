<script setup>
import { Badge, Title } from 'layout'
import { inject, markRaw, onMounted, ref } from 'vue'
import GraphFlow from './Graph/GraphFlow.vue'
import StageNode from './Graph/StageNode.vue'
import { buildRequestSchema } from './configProcess.js'
import { formatDate, showUuid } from 'shared'

const useGlobalStore = inject('useGlobalStore')
const tabStore = useGlobalStore('tabs')

const processStore = useGlobalStore('process')

const nodeTypes = {
    StageNode: markRaw(StageNode)
}

const data = ref([])

onMounted(async () => {
    await processStore.fetch()

    data.value = processStore.getData()

    for (let index = 0; index < data.value.length; index++) {
        buildRequestSchema(data.value, index, tabStore)
    }
})

const processStatusBadgeColor = {
    'Pending for aproval': 'warning',
    'Pending for Dispatch': 'orange',
    'pending-department-manager-approval': 'warning'
}
</script>

<template>
    <section class="paper">
        <Title
            :title="`${$t('Most recent request')}`"
            :hasBorderBottomLine="false" />

            <template
                v-for="(request, index) of data"
                :key="index">
                <div
                    class="grid grid-cols-12 w-full space-y-5">
                    <div class="col-span-12">
                        <Title
                            :title="`${$t(request?.supply_process_type.name)} #${showUuid(request.id)}`"
                            titleType="h4"
                            :hasBorderBottomLine="false" />
                    </div>

                    <div class="col-span-10">
                        <GraphFlow
                            :style="`height: ${request.defaultHeight}px;`"
                            :flow="request.graph"
                            :nodeTypes="nodeTypes" />
                    </div>

                    <div class="col-span-2 flex flex-col space-y-2 items-center justify-center">
                        <Badge
                            :type="processStatusBadgeColor[request.supply_process_status?.slug]"
                            class="ml-2 !text-sm text-start">
                            {{ request.supply_process_status?.name }}
                        </Badge>

                        <span
                            class="text-xs">
                            {{ formatDate(request.updated_at, 'diffForHumans') }}
                        </span>
                    </div>
                </div>
            </template>
    </section>
</template>
