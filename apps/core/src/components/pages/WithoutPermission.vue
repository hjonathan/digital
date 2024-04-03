<script setup>
import { Button } from 'layout'
import { useI18n } from 'vue-i18n'
import { inject } from 'vue'

const { t } = useI18n()

const useStore = inject('useStore')
const tabsStore = useStore('tabs')

const onClick = () => {
    tabsStore.closeTab('WithoutPermission')

    tabsStore.openTab({ name: 'Home' })
}
</script>

<template>
    <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
            <p class="text-base font-semibold text-indigo-600">{{t('System')}}</p>

            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{{ t("You don't have permission")}}</h1>

            <p class="mt-6 text-base leading-7 text-gray-600">{{ t('Sorry, you do not have access to the requested page.') }}'</p>

            <div class="mt-10 flex items-center justify-center gap-x-6">
                <Button
                    @click="onClick"
                    :label="t('Go back home')"
                    color="primary"/>
            </div>
        </div>
    </main>
</template>
