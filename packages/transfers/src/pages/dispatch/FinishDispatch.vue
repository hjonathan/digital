<script setup>
import { DatePicker } from 'form'
import { Alert, Title } from 'layout'
import { formatDate } from 'shared'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

const { t } = useI18n()

const props = defineProps({
    useDispatch: {
        type: Object,
        default: () => ({})
    }
})

const { dispatchDate } = props.useDispatch

const message = computed(() => {
    const currentDate = formatDate(new Date(), 'americanFormat')

    const dispatchDateSchedule = formatDate(dispatchDate.value, 'americanFormat')

    if (currentDate === dispatchDateSchedule) {
        return {
            type: 'info',
            content: t('Send right now.'),
            today: true
        }
    }

    return {
        type: 'warning',
        content: `${t('Schedule for:')} ${dispatchDateSchedule}`,
        today: false
    }
})

onMounted(() => {
    // Assign saved dispatch data
    !dispatchDate.value && (dispatchDate.value = new Date())

    dispatchDate.value && (dispatchDate.value = moment(dispatchDate.value, 'YYYY-MM-DD').toDate())
})

defineExpose({ message })
</script>

<template>
    <!-- Main content -->
    <section class="full">
        <!-- Title -->
        <Title
            titleType="h5"
            :title="$t(!dispatchDate?'Dispatch date': 'Schedule date')"
            :hasBorderBottomLine="false" />

        <!-- Calendar -->
        <DatePicker
            v-model="dispatchDate"
            :inlineCalendar="true"
            container-class="none"
            input-class="!pl-0"
            class="border-2" />

        <!-- Alert -->
        <Alert
            v-if="message"
            :type="message.type"
            :content="message.content"
            :hasCloseButton="false"/>
    </section>
</template>
