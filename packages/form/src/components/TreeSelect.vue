<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import BaseFormContainer from './BaseFormContainer.vue'
import InputText from 'primevue/inputtext'
import { mdiChevronDown } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import Menu from 'primevue/menu'
import Tree from 'primevue/tree'
import { cloneDeep } from 'lodash'

const props = defineProps({
    /*
    | Main
    */
    modelValue: [Number, String],
    options: {
        type: Array,
        default: () => ([])
    },
    /*
    | Container
    */
    containerId: String,
    containerClass: String,

    /*
    | Label
    */
    labelId: String,
    labelClass: String,

    /*
    | Input
    */
    inputId: String,
    inputClass: String,
    label: String,
    tag: String,
    extra: String,

    readonly: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ''
    },
    selectionMode: {
        type: String,
        default: 'single'
    },
    class: {
        type: String,
        default: ''
    },
    clearable: {
        type: Boolean,
        default: true
    },

    /*
    | Error
    */
    errors: {
        type: [Object, String],
        default: ''
    },
    errorIcon: Boolean,

    outline: Boolean,
    size: {
        type: String,
        default: 'standard'
    }
})

const emit = defineEmits(['update:modelValue'])

const localOptions = ref([])

const id = props.inputId || Math.random() * 100

const modelFilter = ref('')
const menu = ref()
const expandedKeys = ref({})
const selectedKeys = ref({})
const localModel = ref('')
const nodeNoSelected = {
    id: 'clear-selection',
    key: 'clear-selection',
    label: 'Clear selection'
}

const sizes = ref({
    sm: 'input-sm',
    md: 'input-md',
    standard: 'input',
    xl: 'input-xl'
})

/**
 * Performs the transformation of both input and output values, to be able to receive and return only the
 * id of an option from the list.
 */
const modelValue = computed({
    get: () => {
        const newValue = {}

        if (props.selectionMode === 'multiple') {
            props.modelValue.forEach((value) => {
                newValue[value] = true
            })
        }

        if (props.selectionMode === 'single') {
            newValue[props.modelValue] = true
        }

        return newValue
    },
    set: (nValue) => {
        const selected = Object.keys(nValue || {})

        if (props.selectionMode === 'multiple') {
            emit('update:modelValue', selected)
        }

        if (props.selectionMode === 'single') {
            emit('update:modelValue', selected[0])
        }
    }
})

/**
 * Return a copy of received optios for local filter including clear value option
 */
const getLocalOptions = () => {
    const copyOptions = cloneDeep(props.options)

    const existNoSelect = copyOptions.find(node => node.key === nodeNoSelected.key)

    !existNoSelect && props.clearable && copyOptions.unshift(nodeNoSelected)

    return copyOptions
}

/**
 * Listen to the changes in the received options.
 */
watch(() => props.options, (nValue) => {
    localOptions.value = getLocalOptions()

    assignValue()
}, { deep: true })

/**
 * Listen to the changes in received modelValue.
 */
watch(() => props.modelValue, (nValue) => {
    assignValue()
}, { deep: true })

onMounted(() => {
    assignValue()
})

/**
 * Filter the options to find the nodes that should be opened for selection of your childrens
 * @param {*} node Node to be searched in the options
 * @param {*} nValue Name for node to compare with node name
 */
const filterFunction = (node, nValue) => {
    setPosition()

    if (node.label.toLowerCase().includes(nValue.toLowerCase()) || node.key === nodeNoSelected.key) return true

    if (node.children) {
        return (node.children = node.children.filter((child) => filterFunction(child, nValue))).length
    }
}

/**
 * Resize the size and position of the menu depending on where it opens.
 */
const setPosition = () => {
    const inputElement = document.getElementById(id)

    const rect = inputElement.getBoundingClientRect()

    const winRect = document.documentElement.getClientRects()[0]

    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    setTimeout(() => {
        const menuElement = document.getElementById(`menu-${id}`)

        let menuSize = vh - (rect.top + rect.height + 50)

        const stylesMenu = [
            'position: absolute;',
            'transform-origin: center top;',
            'z-index: 1002;',
            'overflow-y: auto;',
            `left: ${rect.left}px;`,
            'min-width: 200px !important;',
            `max-width: ${rect.width}px !important;`,
        ]

        const treeHeight = document.getElementById(`tree-${id}`)

        if (menuSize < 200) {
            menuSize = (rect.top)

            treeHeight.style.maxHeight = `${menuSize}px`

            stylesMenu.push(`top: ${menuSize - treeHeight.offsetHeight - winRect.top}px;`)
            stylesMenu.push(`max-height: ${menuSize}px !important; overflow-y: auto;`)
        }

        if (menuSize >= 200) {
            stylesMenu.push(`top: ${rect.top + rect.height - winRect.top}px;`)
            stylesMenu.push(`max-height: ${menuSize}px;`)
        }

        menuElement && (menuElement.style = stylesMenu.join(''))

        document.getElementById(id).focus()
    }, 10)
}

/**
 * Filters options based on what is written in the input
 * @param {*} nValue Value found in the input at the time of writing
 */
const filterLocalOptions = (nValue) => {
    const copyOptions = getLocalOptions()

    expandedKeys.value = {}

    localOptions.value = copyOptions.filter((node) => filterFunction(node, nValue))

    if (nValue) {
        for (const parent of localOptions.value) {
            if (parent.key !== nodeNoSelected.key) {
                expandedKeys.value[parent.key] = true
            }
        }
    }

    if (!nValue) {
        localOptions.value = copyOptions

        if (modelValue.value) {
            const { currentPath } = findNodeByKey(Object.keys(modelValue.value)[0], getLocalOptions())
            expandedKeys.value = currentPath
        }
    }
}

/**
 * Recursive function that search a node by key in all options.
 * @param {*} key key from node to find that node
 * @param {*} options All elements are received from props, but these can be reused as it is a recursive function.
 */
const findNode = (key, options) => {
    return options.reduce((node, item) => {
        if (node) return node

        if (item.key.toString() === key.toString()) return item

        if (item.children) return findNode(key, item.children)

        return null
    }, null)
}

/**
 * Search nodes by key and determinate path to node.
 * @param {*} options All elements are received from props, but these can be reused as it is a recursive function.
 * @param {*} path Inital path to node
 * @param {*} allPaths All path for node
 */
const getPaths = (options, path = '', allPaths = []) => {
    options.forEach((node) => {
        const currentPath = path + '.' + node.key

        allPaths.push(currentPath)

        if (node.children) {
            getPaths(node.children, currentPath, allPaths)
        }
    })
}

/**
 * Search nodes by key and options.
 * @param {*} key Search for nodes by key within the options array or object received by props.
 * @param {*} options All elements are received from props, but these can be reused as it is a recursive function.
 */
const findNodeByKey = (key, options) => {
    const node = findNode(key, options)

    if (!node) {
        return {}
    }

    const allPaths = []

    getPaths(options, '', allPaths)

    const path = allPaths.find(path => path.endsWith(`.${node.key}`))

    const arrayPath = path.split('.').filter(x => x)

    const currentPath = {}

    for (const path of arrayPath) {
        currentPath[path] = true
    }

    return { node, currentPath }
}

/**
 * Open the menu and calculate its position and height
 * @param {*} event Menu opening event.
 */
const openMenu = (event) => {
    if (props.disabled || props.readonly) {
        return
    }

    document.getElementById(id).select()

    modelFilter.value = ''

    localOptions.value = getLocalOptions()

    menu.value.show(event)

    setPosition()
}

const nodeIsExpanded = (key) => {
    return Object.keys(expandedKeys.value).includes(key.toString())
}

/**
 * Performs the selection depending on the selectionMode, if it is simple or if it is multiple or if it is clearselection
 * @param {*} nodeSelected Data from node selected
 */
const nodeTreeSelected = (nodeSelected) => {
    if (nodeSelected.key === nodeNoSelected.key) {
        clearAllValues()

        menu.value.hide()

        return
    }

    if (nodeSelected.children) {
        nodeIsExpanded(nodeSelected.key)
            ? delete expandedKeys.value[nodeSelected.key]
            : expandedKeys.value[nodeSelected.key] = true

        if (nodeSelected.isSelectable) {
            if (props.selectionMode === 'single') {
                localModel.value = nodeSelected.label

                modelValue.value = { [nodeSelected.key]: true }

                selectedKeys.value = { [nodeSelected.key]: true }

                expandedKeys.value = { [nodeSelected.key]: true }
            }

            if (props.selectionMode === 'multiple') {
                modelValue.value = Object.assign(modelValue.value || {}, { [nodeSelected.key]: true })

                selectedKeys.value = Object.assign(selectedKeys.value || {}, { [nodeSelected.key]: true })

                const localLabels = []

                localModel.value = ''

                for (const nodeKey in selectedKeys.value) {
                    const { node: nodeExists } = findNodeByKey(nodeKey, getLocalOptions())

                    nodeExists && localLabels.push(nodeExists.label)
                }

                localModel.value = localLabels.join(', ')
            }
        }
    }

    if (!nodeSelected.children && props.selectionMode === 'single') {
        localModel.value = nodeSelected.label

        modelValue.value = { [nodeSelected.key]: true }

        selectedKeys.value = { [nodeSelected.key]: true }

        menu.value.hide()
    }

    if (!nodeSelected.children && props.selectionMode === 'multiple') {
        modelValue.value = Object.assign(modelValue.value || {}, { [nodeSelected.key]: true })

        selectedKeys.value = Object.assign(selectedKeys.value || {}, { [nodeSelected.key]: true })

        const localLabels = []

        localModel.value = ''

        for (const nodeKey in selectedKeys.value) {
            const { node: nodeExists } = findNodeByKey(nodeKey, getLocalOptions())
            if (nodeExists) {
                localLabels.push(nodeExists.label)
            }
        }

        localModel.value = localLabels.join(', ')
    }
}

/**
 * If a node is deselected and the component is in multiple selectionMode, remove the value from the main modelValue
 * @param {*} nodeUnselected Data from node unselected
 */
const nodeTreeUnselected = (nodeUnselected) => {
    if (props.selectionMode === 'multiple') {
        if (nodeUnselected.key in selectedKeys.value) {
            delete selectedKeys.value[nodeUnselected.key]
        }

        const localLabels = []

        localModel.value = ''

        for (const nodeKey in selectedKeys.value) {
            const { node: nodeExists, currentPath } = findNodeByKey(nodeKey, getLocalOptions())

            if (nodeExists) {
                localLabels.push(nodeExists.label)
            }
        }

        localModel.value = localLabels.join(', ')
    }
}

// Reset all values for node selection
const clearAllValues = () => {
    setTimeout(() => {
        localModel.value = ''
        modelValue.value = null
        expandedKeys.value = {}
        selectedKeys.value = {}
    }, 10)
}

/**
 * Assign the corresponding value by searching the options considering whether it is a single or multiple selection
 */
const assignValue = () => {
    if (modelValue.value) {
        if (props.selectionMode === 'single') {
            const nodeKey = Object.keys(modelValue.value)[0]

            // Find node by key to assignment to modelValue
            const { node: nodeExists } = findNodeByKey(nodeKey, getLocalOptions())

            !nodeExists && clearAllValues()

            if (nodeExists) {
                localModel.value = nodeExists.label

                selectedKeys.value = { [nodeExists.key]: true }
            }
        }

        if (props.selectionMode === 'multiple') {
            const localLabels = []

            localModel.value = ''

            // Find all nodes by key to assignment to modelValue
            for (const nodeKey in modelValue.value) {
                const { node: nodeExists, currentPath } = findNodeByKey(nodeKey, getLocalOptions())

                if (nodeExists) {
                    localLabels.push(nodeExists.label)

                    selectedKeys.value = Object.keys(selectedKeys.value || {}, { [nodeExists.key]: true })

                    expandedKeys.value = Object.keys(selectedKeys.value || {}, currentPath)
                }
            }

            localModel.value = localLabels.join(', ')
        }
    }

    !modelValue.value && (localModel.value = '')
}
/**
 * When the cursor leaves the component, the value is assigned if it exists.
 */
const onBlur = () => {
    assignValue()
}
</script>

<template>
    <BaseFormContainer
        :containerId="containerId"
        :containerClass="containerClass"
        :labelId="labelId"
        :labelClass="labelClass"
        :inputId="inputId"
        :inputClass="inputClass"
        :readonly="readonly"
        :disabled="disabled"
        :errors="errors"
        :errorIcon="errorIcon">
        <span
            class="p-input-icon-right !w-full !p-0 !py-0 !m-0 custom-tree-container"
            @click="openMenu">
            <svg-icon
                type="mdi"
                class="w-6 h-6 text-grey-400 cursor-pointer"
                :path="mdiChevronDown" />

            <InputText
                :id="id"
                :disabled="disabled || readonly"
                v-model="localModel"
                @update:modelValue="filterLocalOptions"
                :placeholder="props.placeholder"
                :class="[{
                    [sizes[size]]: true,
                    '!bg-red-100': !!errors,
                    '!shadow-none border-2': outline,
                    'border-none': !outline,
                    '!bg-gray-400/80 !cursor-not-allowed' : readonly,
                }]"
                autofocus
                :aria-haspopup="true"
                :aria-controls="`menu-${id}`"
                @blur="onBlur" />

            <Menu
                ref="menu"
                :id="`menu-${id}`"
                :target="id"
                :popup="true"
                class="w-full custom-tree-menu">
                <template v-slot:end>
                    <Tree
                        v-if="localOptions.length"
                        :metaKeySelection="props.selectionMode === 'single'"
                        v-model:selectionKeys="selectedKeys"
                        v-model:expandedKeys="expandedKeys"
                        :value="localOptions"
                        class="w-full !m-0 !px-0 !py-0 custom-tree"
                        :id="`tree-${id}`"
                        selectionMode="multiple"
                        @nodeSelect="nodeTreeSelected"
                        @nodeUnselect="nodeTreeUnselected" />

                    <div
                        v-if="localOptions.length === 0"
                        class="w-full p-3">
                        {{ $t('No data available') }}
                    </div>
                </template>
            </Menu>
        </span>

        <template #label v-if="$slots.label || label">
            <slot name="label" >
                {{ label }}
            </slot>
        </template>

        <template #tag v-if="$slots.tag || tag">
            <slot name="tag">
                {{ tag }}
            </slot>
        </template>

        <template #extra v-if="$slots.extra || extra">
            <slot name="extra">
                {{ extra }}
            </slot>
        </template>
    </BaseFormContainer>
</template>

<style>
.custom-input-tree > .p-component {
    font-size: 0.875rem !important;
}

.custom-tree > div > ul > li > div > button.p-tree-toggler {
    pointer-events: none !important;
    padding: 0px !important;
    margin: 0px !important;
}

.p-tree {
    border: 0px !important;
}

.custom-tree-menu {
    max-height: 0px;
}

.custom-tree > div > ul > li.p-treenode.p-treenode-leaf > div > button {
    width: 3px !important;
}

.custom-tree > div > ul > li.p-treenode > ul > li.p-treenode.p-treenode-leaf > div > button {
    width: 12px !important;
}

/* li[aria-posinset=1] {
    background-color: red;
} */
</style>
