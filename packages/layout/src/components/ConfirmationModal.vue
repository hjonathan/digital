<script setup>
import { computed, ref, useSlots } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import Title from './Title.vue'
import Button from './Button.vue'
import { TextArea } from 'form'
import Alert from './Alert.vue'

const props = defineProps({
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    confirmationButtonLabel: {
        type: String,
        default: 'Delete'
    },
    cancelButtonLabel: {
        type: String,
        default: 'Cancel'
    },
    confirmation: {
        type: Function,
        default: null
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: null
    },
    note: {
        type: Boolean,
        default: false
    },
    hasCancel: {
        type: Boolean,
        default: true
    },
    outlineCancelButton: {
        type: Boolean,
        default: true
    },
    linkCancelButton: {
        type: Boolean,
        default: false
    },

    // Defines the color of the Icon and confirm button.
    type: {
        type: String,
        default: 'primary'
    },

    // At the moment it only supports HeroIcons
    icon: {
        type: Function,
        default: InformationCircleIcon
    },

    showErrors: {
        type: Boolean,
        default: true
    },
    size: {
        type: String,
        default: 'xl'
    }
})

const modalSizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
} 

// Use the `useSlots` function to access slots
const slots = useSlots()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const disabled = ref(false)
const noteModel = ref('')

const alert = ref({
    show: false,
    content: ''
})

const value = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const color = computed(() => {
    return props.type
})

const cancel = () => {
    value.value = false

    noteModel.value = null

    alert.value = {
        show: false,
        content: ''
    }

    emit('cancel')
}

const confirm = async () => {
    if (props.confirmation) {
        disabled.value = true

        const response = await props.confirmation({
            note: noteModel
        })

        if (response?.errors) {
            alert.value.show = true

            alert.value.content = response.errors.message

            disabled.value = false

            return
        }

        value.value = false

        noteModel.value = null

        const timeToWaitForClosingAnimation = 200

        setTimeout(() => {
            disabled.value = false
        }, timeToWaitForClosingAnimation)

        return
    }

    value.value = false

    noteModel.value = null

    emit('confirm')
}
</script>

<template>
    <TransitionRoot
        as="template"
        :show="value">
        <Dialog
            @close="cancel"
            as="div"
            class="relative z-10">
            <!-- Backdroop -->
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in duration-200"
                leave-from="opacity-100"
                leave-to="opacity-0">
                <div
                    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <!-- Modal -->
            <div class="fixed inset-0 !z-50 overflow-y-auto">
                <div class="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-0">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            :class="`relative rounded-lg bg-white p-5 shadow-xl ${modalSizes[size]} !w-[1200px]`">
                            <div class="grid grid-cols-12">
                                <!-- Left circle -->
                                <div
                                    class="mx-auto flex h-10 w-10 items-center justify-center rounded-full"
                                    :class="{
                                        'bg-red-100' : type == 'danger',
                                        'bg-primary-50' : type == 'primary',
                                        'bg-success-50' : type == 'success',
                                        'bg-warning-50' : type == 'warning',
                                        'bg-secondary-50' : type == 'secondary' }">
                                    <slot
                                        name="icon" />

                                    <!-- Danger icon (Only shown in danger status) -->
                                    <XCircleIcon
                                        v-if="type === 'danger' && !slots.icon"
                                        class="h-7 w-7 text-red-600"
                                        aria-hidden="true" />

                                    <!-- Information icon -->
                                    <Component
                                        :is="icon"
                                        v-if="type !== 'danger' && !slots.icon"
                                        class="h-7 w-7"
                                        :class="{
                                            'text-primary-600': type == 'primary',
                                            'text-warning-600': type == 'warning',
                                            'text-success-600': type == 'success',
                                            'text-blue-600': type == 'info',
                                            'text-secondary-600': type == 'secondary' }"
                                        aria-hidden="true" />
                                </div>

                                <!-- Right side (Title, content and footer) -->
                                <div class="col-span-11 ml-5">
                                    <div class="flex flex-col gap-2">
                                        <Title
                                            v-if="title && !slots.title"
                                            :title="$t(title)"
                                            title-type="h3"
                                            :has-border-bottom-line="false"
                                            :has-padding="false" />

                                        <slot
                                            name="title" />

                                        <!-- Alert to show validation errors -->
                                        <Alert
                                            v-if="showErrors"
                                            v-model="alert.show"
                                            :borderRounded="true"
                                            :has-close-button="true"
                                            :type="'danger'"
                                            :content="alert.content" />

                                        <!-- Description (Body content) -->
                                        <div v-if="description">
                                            <p class="text-sm text-gray-500">
                                                {{ $t(description) }}
                                            </p>
                                        </div>

                                        <slot
                                            name="content" />

                                        <!-- Textarea to add notes -->
                                        <div
                                            v-if="note">
                                            <TextArea
                                                outline
                                                v-model="noteModel"
                                                :placeholder="$t('Note')"
                                                class="!pr-6" />
                                        </div>

                                        <!-- Footer (buttons) -->
                                        <div class="flex justify-end space-x-8 items-end mt-5">
                                            <slot
                                                name="footer" />

                                            <Button
                                                v-if="hasCancel && !slots.footer"
                                                tabindex="-1"
                                                :outline="!linkCancelButton"
                                                :link="linkCancelButton"
                                                :flat="linkCancelButton"
                                                :label="$t(cancelButtonLabel)"
                                                color="secondary"
                                                @click="cancel"
                                                ref="cancelButtonRef" />

                                            <!-- Confirm -->
                                            <Button
                                                v-if="!slots.footer"
                                                :color="color"
                                                :loading="disabled"
                                                :disabled="disabled"
                                                :label="$t(confirmationButtonLabel)"
                                                @click="confirm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
