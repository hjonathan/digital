<script setup>
/**
 * Serves as an editor for creating, editing, or cloning label information.
 *
 * The component fetches existing label details when editing or cloning and allows users to add,
 * remove, and customize individual label elements.
 */

import { ref, reactive, shallowReactive, onMounted, inject } from 'vue'
import { Title, Button } from 'layout'
import { Input } from 'form'
import LabelItem from '../components/LabelItem.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Dynamically manage instances of LabelItem component
const Components = shallowReactive([])

const errors = ref({})
const label = reactive({})

// Stores references of LabelItem components
const itemRefs = ref([])

const router = inject('router')
const api = inject('api')

// Global store for state management
const useGlobalStore = inject('useGlobalStore')

// Specific store for labels and tabs
const labelsStore = useGlobalStore('labels')
const tabsStore = useGlobalStore('tabs')

// Current label ID from the route
const labelId = router.currentRoute.value.params.id

// Current mode (edit, clone, create)
const mode = router.currentRoute.value.query?.mode

// Fetch label information on component mount
onMounted(async () => {
    Object.assign(label, { label_elements: [] })

    clearElementsErrors()

    // If it's an existing label (edit or clone), fetch label details and elements
    if (labelId) {
        const labelItem = await labelsStore.getItemLabel(labelId)

        label.name = labelItem.name
        label.height = labelItem.height
        label.width = labelItem.width

        const elements = JSON.parse(labelItem.label_elements)

        for (const element of elements) {
            loadElements(element)
        }

        return
    }

    // If it's a new label (create), add an empty label element and its corresponding component
    label.label_elements.push({ })

    Components.push(LabelItem)
})

// Adds a new label element
const add = () => {
    label.label_elements.push({ })

    Components.push(LabelItem)

    clearElementsErrors()
}

// Loads existing label elements
const loadElements = (element) => {
    label.label_elements.push(element)

    Components.push(LabelItem)

    clearElementsErrors()
}

// Removes a label element
const remove = (index) => {
    itemRefs.value.splice(index, 1)

    label.label_elements.splice(index, 1)

    Components.splice(index, 1)

    clearElementsErrors()
}

const clearElementsErrors = () => {
    for (const key in errors.value) {
        if (key.startsWith('label_elements.')) delete errors.value[key]
    }
}

// Definition of label elements with examples
const elements = [
    {
        id: 'free_text',
        name: t('Free text'),
        type: 'text',
        example: t('Enter your own text')
    },
    {
        id: 'id',
        name: t('Product ID'),
        type: 'text',
        example: t('b4z3...bai7')
    },
    {
        id: 'full_id',
        name: t('Full product ID'),
        type: 'text',
        example: t('b4z3...bai7')
    },
    {
        id: 'strain.slug',
        name: t('Strain'),
        type: 'text',
        example: t('White strawberry skunk')
    },
    {
        id: 'brand.slug',
        name: t('Brand'),
        type: 'text',
        example: t('Diamond')
    },
    {
        id: 'quantity',
        name: t('Quantity'),
        type: 'text',
        example: t('183')
    },
    {
        id: 'type.slug',
        name: t('Type'),
        type: 'text',
        example: t('Extraction Material')
    },
    {
        id: 'location.slug',
        name: t('Location'),
        type: 'text',
        example: t('Post Harvest')
    },
    {
        id: 'stage.slug',
        name: t('Stage'),
        type: 'text',
        example: t('Consumer Product Area')
    },
    {
        id: 'batch_id',
        name: t('Original batch code'),
        type: 'text',
        example: t('a8r4...33b1')
    },
    {
        id: 'created_at',
        name: t('Created at'),
        type: 'text',
        example: t('Noveber 30th, 2020')
    },
    {
        id: 'qr_code',
        name: t('QR Code'),
        type: 'qr',
        example: t('QR Image')
    },
]

const isLoading = ref(false)

// Saves label information
const save = async (button) => {
    let response = null

    isLoading.value = true

    // 1 = Inventory label
    label.label_group_id = 1

    /**
     * Determine the API endpoint and mode based on labelId and mode
     */
    // Clone
    if (labelId && mode) {
        response = await api.post(
            '/labels',
            label
        )

        response.success && labelsStore.fetch() && tabsStore.closeTab('LabelsClone')
    }

    // Edit
    if (labelId && !mode) {
        response = await api.put(
            `/labels/${labelId}`,
            label
        )

        response.success && labelsStore.fetch() && tabsStore.closeTab('LabelsEdit')
    }

    // Create
    if (!labelId) {
        response = await api.post(
            '/labels',
            label
        )

        response.success && labelsStore.fetch() && tabsStore.closeTab('LabelsCreate')
    }

    isLoading.value = false

    // Update errors if any
    response.errors && (errors.value = response.errors)

    return response
}
</script>

<template>
    <!-- Section for Label Information -->
    <section>
        <Title>
            {{ labelId ? (mode ? $t(`Clone label`) : $t(`Edit label`))  : $t(`Create label`) }}
        </Title>

        <Title
            titleType="h2"
            :title="$t('Label information')"
            :has-border-bottom-line="false" />

        <!-- Name -->
        <Input
            v-model="label.name"
            :errors="errors?.name ? errors?.name : null"
            :inline-label-left="$t('Name')" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div> <!-- This DIV is necessary, otherwise the validation message will be misaligned -->
                <!-- Width -->
                <Input
                    v-model="label.width"
                    :type="'number'"
                    :step="'1'"
                    :min="'1'"
                    :errors="errors?.width ? errors?.width : null"
                    :inline-label-left="$t('Width')"
                    :inline-label-right="$t('cm')"
                    inputClass="text-right"
                    class="w-full !py-0" />
            </div>

            <div>
                <!-- Height -->
                <Input
                    v-model="label.height"
                    :type="'number'"
                    :step="'1'"
                    :min="'1'"
                    :errors="errors?.height ? errors?.height : null"
                    :inline-label-left="$t('Height')"
                    inline-label-right="cm"
                    inputClass="text-right"
                    class="w-full" />
            </div>
        </div>
    </section>

    <!-- Section for Label Elements -->
    <section>
        <Title
            titleType="h2"
            :title="$t('Label elements')"
            :has-border-bottom-line="false" />

        <!-- Dynamic rendering of label elements using LabelItem component -->
        <div>
            <component
                v-for="(Component, index) in Components"
                @remove="remove(index)"
                :key="index"
                :is="Component"
                :elements="elements"
                v-model="label.label_elements[index]"
                ref="itemRefs"
                :errors="{
                    element_id: errors ? errors[`label_elements.${index}.element_id`] : null,
                    x: errors
                        ? errors[`label_elements.${index}.x`]
                        : null,
                    y: errors
                        ? errors[`label_elements.${index}.y`]
                        : null,
                    size: errors
                        ? errors[`label_elements.${index}.size`]
                        : null,
                    font_size: errors
                        ? errors[`label_elements.${index}.font_size`]
                        : null,
                    text: errors
                        ? errors[`label_elements.${index}.text`]
                        : null,
                }" />
        </div>

        <!-- Buttons for adding a new element and saving label -->
        <div class="flex justify-between">
            <Button
                @click="add()"
                :label="$t('Add element')"
                color="success" />

            <Button
                @click="save"
                :loading="isLoading"
                :label="$t('Save')"
                color="primary" />
        </div>
    </section>
</template>
