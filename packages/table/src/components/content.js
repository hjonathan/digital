import Action from './content/Action.vue'
import ActionIcon from './content/ActionIcon.vue'
import Badge from './content/Badge.vue'
import Numeric from './content/Numeric.vue'
import Text from './content/Text.vue'
import { h } from 'vue'

/**
 * File to register new custom content
 */
let CONTENT_TEMPLATE = {
    action: Action,
    numeric: Numeric,
    text: Text,
    actionIcon: ActionIcon,
    badge: Badge,
    inheritCheckbox: {
        render ({ params }) {
            const className = `ag-checkbox-action ${params.class || ''}`

            return h('span', { class: className })
        }
    }
}

const registerContent = (value) => {
    CONTENT_TEMPLATE = { CONTENT_TEMPLATE, ...value }
}

export {
    registerContent,
    CONTENT_TEMPLATE
}
