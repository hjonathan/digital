<script setup>
import { Button, Icon } from 'layout'
import { mdiCamera, mdiUpload } from '@mdi/js'
import { nextTick, onMounted, ref } from 'vue'
import { defineModel } from 'shared'
import { isFunction } from 'lodash'
import axios from 'axios'

const props = defineProps({
    fieldName: {
        type: String,
        default: 'file'
    },
    url: {
        type: String,
        default: ''
    },
    uploadFunction: {
        type: Function,
        default: null
    },
    modelValue: {
        type: File,
        default: null
    },
    previewUrl: {
        type: String,
        default: ''
    },
    autoUpload: {
        type: Boolean,
        default: true
    },
    multiple: {
        type: Boolean,
        default: false
    },
    accept: {
        type: String,
        default: '*'
    },
    buttonSelectFileLabel: {
        type: String,
        default: 'Select file'
    },
    buttonRemoveFileLabel: {
        type: String,
        default: 'Remove'
    },
    hasRemoveButton: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['uploaded', 'failed', 'start', 'finish'])

const modelValueLocal = defineModel('modelValue')
const previewUrlLocal = defineModel('previewUrl')

const inputFileRef = ref()

const urlPreview = ref()

const selectFile = () => {
    inputFileRef.value.click()
}

const uploadFile = async () => {
    const formData = new FormData()

    formData.append(props.fieldName, modelValueLocal.value)

    const initAxios = {
        url: props.url,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    }

    let response = {}

    isFunction(props.uploadFunction)
        ? (response = await props.uploadFunction(modelValueLocal.value))
        : ({ data: response } = axios(initAxios))

    if (response.sucess) {
        emit('uploaded', response)

        emit('finish', response)
    }

    if (response.errors) {
        emit('failed', response)
    }

    return response
}

const selectedFile = async () => {
    const [file] = inputFileRef.value?.files

    modelValueLocal.value = file

    urlPreview.value = URL.createObjectURL(file)

    previewUrlLocal.value = urlPreview.value

    if (props.autoUpload) {
        emit('start', modelValueLocal.value)

        nextTick(async () => {
            await uploadFile()
        })
    }
}

const removeFile = () => {
    previewUrlLocal.value = null

    urlPreview.value = null

    modelValueLocal.value = null
}

onMounted(() => {
    nextTick(() => {
        if (props.file) urlPreview.value = URL.createObjectURL(props.file)

        if (props.previewUrl) urlPreview.value = props.previewUrl
    })
})

</script>

<template>
    <div class="flex flex-col gap-5 h-full">
        <input
            ref="inputFileRef"
            id="uploader-file"
            type="file"
            class="hidden"
            :accept="accept"
            @change="selectedFile" />

        <img
            v-if="urlPreview"
            :src="urlPreview" />

        <button
            v-if="!urlPreview"
            type="button"
            class="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center
                hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                max-h-96"
            @click="selectFile">
            <Icon
                size="xl"
                :icon="mdiCamera"
                class="text-gray-300" />

         <span class="mt-2 block text-sm font-semibold text-gray-900">Select a new photo</span>
       </button>

       <div v-if="!autoUpload && modelValueLocal">
           <Button
                color="success"
               :icon="mdiUpload"
               rounded
               @click="uploadFile" />
       </div>

        <div
            v-if="hasRemoveButton"
            class="row cols-2">
            <Button
                v-if="modelValueLocal"
                outline=""
                color="error"
                :label="buttonRemoveFileLabel"
                class="w-full"
                @click="removeFile" />

            <Button
                v-if="modelValueLocal"
                color="primary"
                :label="buttonSelectFileLabel"
                class="w-full"
                @click="selectFile" />
        </div>

        <Button
            v-if="modelValueLocal && !hasRemoveButton"
            color="primary"
            :label="buttonSelectFileLabel"
            class="w-full"
            @click="selectFile" />
    </div>
</template>
