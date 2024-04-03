<script setup>
import Alert from '../Alert.vue'
import Title from '../Title.vue'
import { ref, onMounted } from 'vue'

import {
    ExclamationTriangleIcon
} from '@heroicons/vue/20/solid'

const paragraph = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.'

const shortParagraph = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'

const show = ref(false)

onMounted(() => {
    setTimeout(() => {
        show.value = true
    }, 1500)
})

const show1 = ref(true)
const show2 = ref(true)
const show3 = ref(true)
const show4 = ref(true)
const show5 = ref(true)
const show6 = ref(true)
const show7 = ref(true)
const show8 = ref(true)
const show9 = ref(true)
const show10 = ref(true)
const show11 = ref(true)
const show12 = ref(true)
const show13 = ref(true)
const show14 = ref(true)
const show15 = ref(true)
const show16 = ref(true)
const show17 = ref(true)
const show18 = ref(true)
const show19 = ref(true)
const show20 = ref(true)
</script>

<template>
    <Title>
        {{ $t('Alert examples') }}
    </Title>

    <section class="paper">
        <!-- Default alerts -->
        <Title type="h2">
            {{ $t('Defaults') }}
        </Title>

        <Alert
            v-model="show"
            :content="paragraph"
            title="Default alert (success)" />

        <Alert
            v-model="show1"
            type="warning"
            :content="paragraph"
            title="Alert type warning" />

        <Alert
            v-model="show2"
            type="info"
            :content="paragraph"
            title="Alert type info" />

        <Alert
            v-model="show3"
            type="danger"
            :content="paragraph"
            title="Alert type danger" />

        <!-- Customs -->
        <Title type="h2">
            {{ $t('Without title') }}
        </Title>

        <!-- Without title -->
        <Alert
            v-model="show4"
            :content="paragraph" />

        <Alert
            v-model="show5"
            type="warning"
            :content="paragraph" />

        <Alert
            v-model="show6"
            type="info"
            :content="paragraph" />

        <Alert
            v-model="show7"
            type="danger"
            :content="paragraph" />

        <!-- One line alerts -->
        <Title type="h2">
            {{ $t('One line alerts') }}
        </Title>

        <Alert
            v-model="show8"
            :content="shortParagraph" />

        <Alert
            v-model="show9"
            type="warning"
            :content="shortParagraph" />

        <Alert
            v-model="show10"
            type="info"
            :content="shortParagraph" />

        <Alert
            v-model="show11"
            type="danger"
            :content="shortParagraph" />

        <!-- One line alerts (without close button) -->
        <Title type="h2">
            {{ $t('One line alerts (without close button)') }}
        </Title>

        <Alert
            v-model="show12"
            :has-close-button="false"
            :content="shortParagraph" />

        <Alert
            v-model="show13"
            :has-close-button="false"
            type="warning"
            :content="shortParagraph" />

        <Alert
            v-model="show14"
            :has-close-button="false"
            type="info"
            :content="shortParagraph" />

        <Alert
            v-model="show15"
            :has-close-button="false"
            type="danger"
            :content="shortParagraph" />

        <Title type="h2">
            {{ $t('Custom alerts') }}
        </Title>

        <Alert
            v-model="show16"
            title="Default success alert with custom content (by slot)">
            <Title
                title-type="h4"
                :has-padding="false"
                :has-border-bottom-line="false"
                :has-margin="false"
                title="List example" />

            <ul class="list-disc pl-4">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ul>

            <button class="button success">
                hola
            </button>
        </Alert>

        <Alert
            title="Default success alert with title and custom border color"
            v-model="show17"
            :has-close-button="false"
            border-color="border-pink-500"
            :content="shortParagraph" />

        <Alert
            v-model="show18"
            :icon="ExclamationTriangleIcon"
            title="Default success alert with custom icon and border color"
            :content="shortParagraph"
            border-color="border-teal-500" />

        <Alert
            v-model="show19"
            title="Default success alert with custom border and title color"
            :content="shortParagraph"
            title-color="text-red-500"
            border-color="border-teal-500" />

        <Alert
            v-model="show20"
            :icon="ExclamationTriangleIcon"
            icon-color="text-indigo-500"
            title="Custom alert"
            background-color="bg-indigo-100"
            title-color="text-indigo-800"
            content-text-color="text-indigo-700"
            header-separator-color="border-indigo-500"
            border-color="border-indigo-500"
            :has-close-button="false">

            <p>
                {{ $t("Custom alert with 'border, icon, title, line separator, background and content text' custom color.") }}
            </p>
        </Alert>
    </section>
</template>
