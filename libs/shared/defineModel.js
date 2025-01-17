import { getCurrentInstance, computed } from 'vue'

export const defineModel = (propName) => {
    const instance = getCurrentInstance()

    const vm = instance.proxy

    return computed({
        get () {
            return instance.props[propName]
        },
        set (value) {
            vm.$emit(`update:${propName}`, value)
        }
    })
}

export const applyProp = (prop, args) => {
    return prop && prop.apply ? prop.apply(null, args) : prop
}
