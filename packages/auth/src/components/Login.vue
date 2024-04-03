<script setup>
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ref, inject, nextTick, onMounted } from 'vue'
import { Input, Label } from 'form'
import { initGlobalStores } from '@/store/stores'

const useGlobalStore = inject('useGlobalStore')

const coreStore = useGlobalStore('core')
const tabsStore = useGlobalStore('tabs')
const router = inject('router')

const api = inject('api')

const error = ref()

const data = ref({
    email: '',
    password: 'password',
    remember_me: false
})

onMounted(() => {
    // Avoid accessing the Login when logged in
    if (coreStore.credentials) {
        nextTick(() => {
            tabsStore.openTab({ path: '/' })
        })
    }
})

const submit = async () => {
    const rawResponse = await api.postRaw('login', data.value)

    const response = rawResponse.data

    if (response && response.status) {
        // Sets credentials and permissions in Core Store
        coreStore.setCredentials(response.data)

        // Assigns credentials to be used by de API.
        api.setCredentials(response.data)

        if ([1].includes(response.data.user.id)) {
            response.data?.permissions.push('inventory.packaging.manager')
        }

        if ([4].includes(response.data.user.id)) {
            response.data?.permissions.push('inventory.packaging.employee')
        }

        coreStore.setPermissions(response.data?.permissions)

        nextTick(() => {
            initGlobalStores({ useStore: useGlobalStore })

            if (router.currentRoute.value.redirectedFrom) {
                router.push(router.currentRoute.value.redirectedFrom)

                return
            }

            tabsStore.openTab({ path: '/', name: 'Home' })
        })
    }

    !rawResponse.status && (error.value = rawResponse.message)
}
</script>

<template>
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img
                class="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" />

            <h2 class="mt-6 text-center text-3xl tracking-tight text-gray-600">
                {{ $t('Sign in') }}
            </h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <TransitionRoot as="template" :show="!!error">
                <TransitionChild as="template"
                    enter="ease-in-out duration-1000"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="ease-in-out duration-1000"
                    leave-from="opacity-100"
                    leave-to="opacity-0">
                    <div class="rounded-md bg-error-100 p-4 text-center">
                        <div class="ml-3">
                            <p class="text-sm font-medium text-red-800">
                                {{ error }}
                            </p>
                        </div>
                    </div>
                </TransitionChild>
            </TransitionRoot>

            <div class="bg-white py-8 px-4 shadow sm:rounded-lg mt-4 sm:px-10">
                <form class="space-y-6" method="POST">
                    <!-- Email -->
                    <div>
                        <p class="m-0 p-0"><strong>General Manager</strong></p>
                        <p class="m-0 p-0">tenant@tenant.com</p>
                        <br>
                        <p class="m-0 p-0"><strong>Warehouse Manager</strong></p>
                        <p class="m-0 p-0">benjamin.reynolds@company-name.com</p>
                        <br>
                        <p class="m-0 p-0"><strong>Sales Manager</strong></p>
                        <p class="m-0 p-0">samantha.anderson@company-name.com</p>
                        <br>
                        <p class="m-0 p-0"><strong>Sales Representative</strong></p>
                        <p class="m-0 p-0">emily.johnson@company-name.com</p>
                        <hr class="air-both">

                        <Label forId="email">
                            {{ $t('Email') }}
                        </Label>

                        <Input
                            inputId="email"
                            class="!mt-2"
                            required
                            type="email"
                            v-model="data.email" />
                    </div>

                    <!-- Password -->
                    <div>
                        <Label forId="password">
                            {{ $t('Password') }}
                        </Label>

                        <!-- Password -->
                        <Input
                            inputId="password"
                            class="!mt-2"
                            required
                            type="password"
                            v-model="data.password" />
                    </div>

                    <!-- Remember me and forgot your password -->
                    <div class="flex items-center justify-between">
                        <!-- Remember me -->
                        <div class="flex items-center">
                            <input
                                v-model="data.remember_me"
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />

                            <label
                                for="remember-me"
                                class="ml-2 block text-sm text-gray-600">
                                {{ $t('Remember me') }}
                            </label>
                        </div>

                        <!-- Forgot your password -->
<!--                         <div class="text-sm">
                            <a class="font-medium text-indigo-600 hover:text-indigo-500">
                                {{ $t('Forgot your password?') }}
                            </a>
                        </div> -->
                    </div>

                    <!-- Submit button -->
                    <button
                        @click.prevent="submit"
                        type="submit"
                        class="flex w-full justify-center button primary">
                        {{ $t('Sign in') }}
                    </button>
                </form>

                <!-- Extra message -->
                <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300" />
                        </div>

                        <div class="relative flex justify-center text-sm">
                            <span class="bg-white px-2 text-gray-500">
                                {{ $t('Ask an admin to create an account for you') }}.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
