<script setup>
import Timeline from '../Timeline.vue'
import UserStatusCard from '../UserStatusCard.vue'
import DocumentStatusCard from '../DocumentStatusCard.vue'
import StatusBadge from '../StatusBadge.vue'
import { onMounted, ref } from 'vue'
import FloatingContainer from '../FloatingContainer.vue'

import { uuid } from 'shared'

const id = uuid()

const data = ref({
    name: 'Leslie Leslie Alexander Alexander',
    email: 'leslie.alexander.leslie.alexander@example.com',
    phone: '800-10-8098',
    department: 'Sales & Marketing Marketing',
    role: 'Sales Manager Sales Manager',
    status: 'Rejected',
    statusClass: 'text-success-700 ring-success-600/20 bg-success-50',
    containerClass: 'border-l-purple-400',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: 'November, 6th',
    onClick () {
        console.log('BREAK POINT ::: CLICK')
    },
    note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry'
})

const dataDocument = ref({
    name: '#10016',
    email: 'leslie.alexander.leslie.alexander@example.com',
    phone: '800-10-8098',
    department: 'Requester: ',
    role: 'Requester: Jhon doe',
    status: 'Rejected',
    statusClass: 'text-success-700 ring-success-600/20 bg-success-50',
    containerClass: 'border-l-purple-400',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: 'November, 6th',
    onClick () {
        console.log('BREAK POINT ::: CLICK')
    },
    note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry'
})

const timeline = ref([
    {
        status: 'success',
        data: data.value
    },
    {
        status: 'warning',
        data: data.value
    },
    {
        status: 'danger',
        type: 'danger',
        label: 'label',
        description: 'My description'
    },
])

const timelineDoc = ref([
    {
        status: 'success',
        data: dataDocument.value
    },
    {
        status: 'warning',
        data: dataDocument.value
    },
    {
        status: 'danger',
        type: 'danger',
        label: 'label',
        description: 'My description'
    },
])

const status = ref('empty')
const label = ref('Processing')
const color = ref('warning')
const show = ref(true)

onMounted(() => {
    setTimeout(() => {
        status.value = 'warning'

        data.value.name = 'My custom name'

        label.value = 'Processed'

        color.value = 'success'

        show.value = false
    }, 3000)
})

</script>
<template>
    <div class="sticky top-0 h-20 bg-blue-500 z-10">{{ ' ' }}</div>
    <!-- <Timeline>
        <UserStatusCard :status="status" :data="data" class="!w-3xl"/>

        <StatusBadge status="secondary" :type="color" :label="label" description="My description"/>

        <StatusBadge status="success" :type="color" :label="label" description="My description"/>

        <StatusBadge status="warning" :type="color" :label="label" description="My description"/>

        <span>EXAMPLE COMPONENT</span>
    </Timeline> -->

    <Timeline>
        <template v-for="(item, index) in timeline" :key="index">
            <UserStatusCard v-if="item.data" :data="item.data" />

            <StatusBadge v-else
                :status="item.status"
                :type="item.type"
                :label="item.label"
                :description="item.description"/>
        </template>
    </Timeline>

    <Timeline>
        <template v-for="(item, index) in timelineDoc" :key="index">
            <DocumentStatusCard v-if="item.data" :data="item.data" />

            <StatusBadge v-else
                :status="item.status"
                :type="item.type"
                :label="item.label"
                :description="item.description"/>
        </template>
    </Timeline>

    <FloatingContainer :initialWidth="-100" :id="id">
        <Timeline>
            <template v-for="(item, index) in timeline" :key="index">
                <UserStatusCard v-if="item.data" :data="item.data" status="warning"/>

                <StatusBadge v-else
                    :status="item.status"
                    :type="item.type"
                    :label="item.label"
                    :description="item.description" />
            </template>
        </Timeline>
    </FloatingContainer>
</template>
