import { app } from '@/createApp'
import { appPermission } from './permissions'

app.directive('permission', appPermission())

app.provide('directives', {
    permission: appPermission()
})
