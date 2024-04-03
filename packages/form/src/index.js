import routes from './routes'
import locales from './locale'
import * as stores from './store'
import { initStores } from './store/init'
import nav from './nav'

// Import components for export as form package
import Input from './components/Input.vue'
import Treeselect from './components/TreeSelect.vue'
import AutoComplete from './components/AutoComplete.vue'
import DatePicker from './components/DatePicker.vue'
import ShowValue from './components/ShowValue.vue'
import TextArea from './components/Textarea.vue'
import ToggleSwitch from './components/ToggleSwitch.vue'
import Label from './components/Label.vue'
import SelectCustomDate from './components/SelectCustomDate.vue'
import BaseFormContainer from './components/BaseFormContainer.vue'
import AnimatedTextArea from './components/AnimatedTextArea.vue'
import InputLabel from './components/InputLabel.vue'
import TextareaLabel from './components/TextareaLabel.vue'

import { useFormComponent } from './components/useFormComponent'

export {
    routes,
    locales,
    nav,
    stores,
    initStores,
    // Export form components
    Label,
    Input,
    Treeselect,
    AutoComplete,
    DatePicker,
    ShowValue,
    TextArea,
    ToggleSwitch,
    SelectCustomDate,
    BaseFormContainer,
    AnimatedTextArea,
    InputLabel,
    TextareaLabel,
    useFormComponent
}
