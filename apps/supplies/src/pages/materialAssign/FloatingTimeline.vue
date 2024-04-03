<script setup>
import { Timeline, UserStatusCard, StatusBadge, FloatingContainer } from 'layout'
import { computed } from 'vue'
import { uuid, formatAmericanSimplifiedDate } from 'shared'
import { random } from 'lodash'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    data: Object
})

const id = uuid()

const colors = [
    'border-l-green-400',
    'border-l-teal-400',
    'border-l-sky-400',
    'border-l-rose-400',
    'border-l-lime-400',
    'border-l-gray-400',
    'border-l-purple-400',
    'border-l-yellow-400',
    'border-l-amber-600',
]

const departmentColors = {}

const getDepColor = (obj) => {
    const color = !departmentColors[obj] ? departmentColors[obj] = colors[random(colors.length - 1)] : departmentColors[obj]

    return color
}

const timeline = computed(() => {
    if (!props.data.supply_order_approvals) return []

    return props.data.supply_order_approvals.map(e => {
        return {
            status: e.approval == 1 ? 'success' : 'empty',
            data: {
                name: e.approval_name,
                email: e.approval_email,
                phone: e.approval_phone,
                department: e.approval_department,
                role: e.approval_position,
                status: getStatus(e.approval),
                statusClass: getStatusClass(e.approval),
                containerClass: getDepColor(e.approval_department),
                date: e.date_approval_or_reject ? formatAmericanSimplifiedDate(e.date_approval_or_reject) : null,
                note: e.note_approval_or_reject
            }
        }
    })
})

const getStatus = (status) => {
    if (status === 1) return t('Approved')

    if (status === 0) return t('Rejected')

    return t('Pending')
}

const getStatusClass = (status) => {
    if (status === 1) return 'text-success-700 ring-success-600/20 bg-success-50'

    if (status === 0) return 'text-red-700 ring-red-600/20 bg-red-50'

    return ''
}

</script>
<template>
    <FloatingContainer :initialWidth="-100" :id="id">
        <Timeline class="!w-[400px] shadow-lg z-50 !bg-gray-50 border-2" >
            <template v-for="(item, index) in timeline" :key="index">
                <UserStatusCard v-if="item.data" :data="item.data" :status="item.status" class="bg-white" />

                <StatusBadge v-else
                    :status="item.status"
                    :type="item.type"
                    :label="item.label"
                    :description="item.description" />
            </template>
        </Timeline>
    </FloatingContainer>
</template>
