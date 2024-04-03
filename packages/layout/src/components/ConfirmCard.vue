<script setup>
const props = defineProps({
    icon: {
        type: Object,
        default: () => ({ icon: null, color: null })
    },
    title: {
        type: String,
        default: null
    },
    descriptions: {
        type: Array,
        default: () => []
    },
    confirmationButton: {
        type: Object,
        default: () => ({ label: '', color: '', action: () => ({}) })
    },
    cancelButton: {
        type: Object,
        default: () => ({ label: '', color: '', action: () => ({}) })
    }
})
</script>

<template>
    <section class="rounded-lg bg-white shadow-xl sm:max-w-lg">
        <div class="flex space-x-1">
            <div
                v-if="icon?.icon"
                :class="{
                    'flex rounded-full sm:h-10 sm:w-10': true,
                    'text-red-600 bg-red-100': icon.color === 'red',
                    'text-green-600 bg-green-100': icon.color === 'green',
                    'text-warning-600 bg-warning-100': icon.color === 'warning' }">
                <component class="p-1.5" :is="icon.icon"></component>
            </div>

            <div class="w-full">
                <h3 v-if="title" class="!mt-0">
                    {{ $t(title) }}
                </h3>

                <template v-if="descriptions.length > 0">
                    <span v-for="(description, index) of descriptions" :key="index">
                        {{ $t(description) }}
                    </span>
                </template>

                <div class="mt-8 flex justify-between items-center">
                    <a v-if="cancelButton.label"
                        class="link"
                        @click="cancelButton.action()">
                            {{ $t(cancelButton.label) }}
                    </a>

                    <button
                        v-if="confirmationButton.label"
                        type="button"
                        :class="{
                            'button': true,
                            'primary': confirmationButton.color === 'primary',
                            'danger': confirmationButton.color === 'red'
                        }"
                        @click="confirmationButton.action()">
                            {{ $t(confirmationButton.label) }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
