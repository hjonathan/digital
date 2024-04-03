import { isArray } from 'lodash'
import { validatePermission, validatePermissionArray } from 'shared'

export const appPermission = () => {
    return {
        mounted (el, binding, vnode) {
            if (import.meta.env && import.meta.env.VITE_PERMISSIONS === 'false') {
                return null
            }

            const useStore = vnode.ctx.appContext.provides.useGlobalStore || vnode.ctx.appContext.provides.useStore

            const core = useStore('core')

            const permissions = JSON.parse(JSON.stringify(core.getPermissions() || {}))

            if (binding.value && typeof binding.value === 'object' && Object.keys(binding.value).length > 0) {
                if (binding.value.name && typeof binding.value.name === 'string' && !validatePermission(binding.value.name, permissions)) {
                    vnode.el.parentElement.removeChild(vnode.el)
                    // el.style.display = 'none'
                }

                if (binding.value.name && isArray(binding.value.name) && !validatePermissionArray(binding.value.name, permissions)) {
                    vnode.el.parentElement.removeChild(vnode.el)
                    // el.style.display = 'none'
                }
            }
        }
    }
}
