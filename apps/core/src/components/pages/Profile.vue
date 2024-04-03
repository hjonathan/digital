<script setup>
import { Uploader, Title, ActionButtons, Button, Alert, ConfirmationModal } from 'layout'
import { Input, ToggleSwitch } from 'form'
import { computed, inject, onMounted, ref } from 'vue'
import { mdiContentSave, mdiEye, mdiEyeOff } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import { getJSON, setJSON } from 'shared'
const { t } = useI18n()

const useStore = inject('useStore')

const coreStore = useStore('core')

const user = ref({})
const showPassword = ref(false)
const errors = ref()
const configLoading = ref({
    updateLoading: false
})

const urlAvatar = ref('')
const changePassword = ref(false)

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const openModalPassword = () => {
    errors.value = {}
    
    configModal.value.title = 'Change password'
    configModal.value.confirmButtonLabel = 'Change password'

    user.value.password = ''
    user.value.password_confirmation = ''

    configModal.value.showAlert = true

    configModal.value.confirmation = async () => {
        const response = await api.post(``)

        if (response.status) {
            configModal.value.showAlert = false
        }

        if (response.errors) errors.value = response.errors
    }
}

const buttons = computed(() => {
    return [{
        icon: mdiContentSave,
        classType: 'teal',
        label: t('Update information'),
        disabled: configLoading.value.updateLoading || isValidPassword.value || changePassword.value,
        spinner: configLoading.value.updateLoading,
        action: async () => {
            const storageData = getJSON('credentials')

            configLoading.value.updateLoading = true

            const apiData = {
                name: user.value.name,
                email: user.value.email,
                avatar: user.value.avatar,
                password: 'password'
            }

            if (user.value.password && user.value.password_confirmation) {
                apiData.password = user.value.password
                apiData.password_confirmation = user.value.password_confirmation
            }

            const response = await api.post('/update_information', apiData)

            if (response.status) {
                storageData.user.name = user.value.name
                storageData.user.email = user.value.email
                storageData.user.avatar = user.value.avatar

                setJSON('credentials', storageData)

                coreStore.setCredentials(storageData)
            }

            if (response.errors) errors.value = response.errors

            configLoading.value.updateLoading = false
        }
    }]
})

const uploadFunction = async (file) => {
    const formData = new FormData()

    formData.append('avatar', file)

    const response = await api.postFormData('/upload_avatar', formData)

    user.value.avatar = response.data

    return response
}

const isValidPassword = computed(() => {
    return user.value.password && user.value.password_confirmation && user.value.password !== user.value.password_confirmation
})

onMounted(() => {
    ({ user: user.value } = JSON.parse(JSON.stringify(coreStore.credentials)))

    if (user.value.avatar) {
        user.value.image = user.value.avatar

        urlAvatar.value = `${coreStore.serverUrl}/${user.value.avatar}`
    }
})
</script>

<template>

    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        :show-errors="false"
        class="z-50"
        size="2xl">
        <template v-slot:content>
            <div class="section">
                <div class="row">
                    <Alert
                        v-if="isValidPassword"
                        type="danger"
                        :has-close-button="false">{{ $t('Your password and confirmation password do not match.') }}</Alert>
    
                    <Input
                        v-model="user.password"
                        :type="showPassword ? 'text' : 'password'"
                        :label="$t('New password')"
                        container-class="none"
                        :errors="errors.password" >
                        <template v-slot:inlineLabelRight>
                            <Button
                                :disabled="!user.password?.length"
                                color="primary"
                                flat
                                :icon="showPassword ? mdiEyeOff : mdiEye"
                                class="!p-0 pointer-events-auto"
                                @click="showPassword = !showPassword" />
                        </template>
                    </Input>
    
                    <Input
                        v-model="user.password_confirmation"
                        :type="showPassword ? 'text' : 'password'"
                        :label="$t('Confirm password')"
                        container-class="none"
                        :errors="errors.password_confirmation" >
                        <template v-slot:inlineLabelRight>
                            <Button
                                :disabled="!user.password_confirmation?.length"
                                color="primary"
                                flat
                                :icon="showPassword ? mdiEyeOff : mdiEye"
                                class="!p-0 pointer-events-auto"
                                @click="showPassword = !showPassword" />
                        </template>
                    </Input>
                </div>
            </div>
        </template>
    </ConfirmationModal>
    
    <div class="flex flex-col">
        <div class="flex sticky top-0 z-10 justify-center bg-slate-100">
            <div class="max-w-8xl w-full flex justify-end mx-4 2xl:mx-auto ">
                <ActionButtons
                    :items="buttons" />
            </div>
        </div>

        <section class="w-full pt-0">
            <div class="max-w-8xl mx-auto">
                <section class="paper">
                    <div class="row cols-3 col-gutter-xl">
                        <div class="h-full">
                            <Uploader
                                url="/upload_avatar"
                                v-model="user.image"
                                :previewUrl="urlAvatar"
                                accept="image/*"
                                :auto-upload="true"
                                :uploadFunction="uploadFunction"
                                class="!h-96 h-min-96 h-max-96" />
                        </div>

                        <div class="col-2/3">
                            <div class="bg-primary-600 text-white p-5">
                                <Title
                                    :title="user.name"
                                    :has-border-bottom-line="false" />

                                <Title
                                    :title="user.position"
                                    :has-border-bottom-line="false"
                                    title-type="h5" />
                            </div>

                            <Input
                                readonly
                                v-model="user.department"
                                :label="$t('Department')" />

                            <Input
                                readonly
                                v-model="user.position"
                                :label="$t('position')" />

                            <Input
                                v-model="user.name"
                                :label="$t('Name')"
                                :errors="errors && errors.name" />

                            <Input
                                v-model="user.email"
                                :label="$t('Email')"
                                :errors="errors && errors.email"  />

                            <Input
                                v-model="user.phone"
                                :label="$t('Phone')"
                                :errors="errors && errors.phone"  />

                            <div class="w-full text-end">
                                <Button
                                    color="primary"
                                    :label="$t('Change password')"
                                    @click="openModalPassword" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    </div>

</template>
