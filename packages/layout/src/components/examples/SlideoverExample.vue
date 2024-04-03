<script setup>
import { Slideover } from 'layout'
import { ref } from 'vue'

import { ToggleSwitch } from 'form'

const close = ref(false)
const openSecond = ref(false)
const closeSecond = ref(false)
const disableButton = ref(false)
const disableSecondPanelButton = ref(false)

const clickOnSaveFirstPanel = ({ setButtonToLoading }) => {
    console.log('Click in first panel save button')
    /* Sets the button of the first panel to 'loading = true'. */
    setButtonToLoading(true)

    /* Sets the button of the first panel to 'loading = false' */
    setTimeout(() => {
        setButtonToLoading(false)

        close.value = !close.value
    }, 2000)
}

const clickOnSaveSecondPanel = ({ setSecondPanelButtonToLoading }) => {
    console.log('Click in second panel save button')
    /* Sets the button of the second panel to 'loading = true' */
    setSecondPanelButtonToLoading(true)

    /* Sets the button of the second panel to 'loading = false' */
    setTimeout(() => {
        setSecondPanelButtonToLoading(false)

        closeSecond.value = !closeSecond.value
    }, 2000)
}

const paragraph = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio iste soluta quasi officiis illum officia voluptate, illo fuga quibusdam. A ducimus provident enim, praesentium neque rerum minus quisquam laboriosam libero!'
</script>

<template>
    <div class="p-8">
        <Slideover
            title="Test"
            :id="'01cc-4158'"
            :second-panel-id="'01cc-4158'"
            secondPanelTitle="Título segundo panel"
            has-cancel-button
            has-save-button
            :close="close"
            :close-second-panel="closeSecond"
            :disableSaveButton="disableButton"
            :disableSeconPanelSaveButton="disableSecondPanelButton"
            has-second-panel-save-button
            :hasSecondPanelCancelButton="true"
            :openSecondPanel="openSecond"
            @click-on-save="clickOnSaveFirstPanel"
            @click-on-second-panel-save="clickOnSaveSecondPanel"
            @closed="(() => { console.log('closed')})">
            <!-- Template for injecting the element that opens the Slideover.
            The Slideover can be opened programmatically as well, through the prop 'open'. -->
            <template #openSlideTrigger>
                <button class="button primary">
                    {{ $t('Clic me') }}
                </button>
            </template>

            <!-- Main content of the first panel -->
            <h1>This is the content</h1>

            <ToggleSwitch
                v-model="disableButton"
                label="Disable button?" />

            <p v-for="(items, index) in 15" :key="index">
                {{ paragraph }}
            </p>

            <!-- Button executing the action to open the second panel -->
            <button
                class="button primary my-8"
                @click="openSecond = !openSecond">
                Open second panel
            </button>

            <!-- Second panel Main Content -->
            <template #mainSecondPanel>
                <ToggleSwitch
                    v-model="disableSecondPanelButton"
                    label="Disable button?" />

                <p v-for="(items, index) in 20" :key="index">
                    {{ paragraph }}
                </p>
            </template>
        </Slideover>
    </div>
</template>
