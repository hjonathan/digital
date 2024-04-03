# BASE PACKAGE INSTALLATION
To create a new package, copy the base package and modify the name property in package.json file
```
"name": "MyPackage",
```

Modify the src/nav.js file and change the name & path properties
```
return {
    name: 'my-base-package',
    path: '/my-base-package',
    icon: RectangleStackIcon
}
```

Modify the src/routes.js file and change the name & path properties
```
    return [
        {
            path: '/my-base-package',
            name: 'ny-base-package',
            meta: {
                home: true,
                title: 'My Base Package'
            },
            entry: {
                id: 'Main',
                component: App
            }
        },
    ]
```

Add dependency in core package.json
```
"MybasePackage": "*"
```

Open core/src/register.js and import the package
```
import * as basePackage from 'basePackage'

export {
    ... 
    basePackage 
}
```

## PACKAGES BUILD
Make the new package available by running
```
npx lerna bootstrap --hoist
```


## API OBJECT
To use the API object, inject the object inside vue component
```
<script setup>
    import {inject} from 'vue'

    const api = inject('api')

    api.post('action', {})
</script>

<template>

</template>
```

## USE STORE
To use the Stores, inject the object inside vue component
```
<script setup>
    import {inject} from 'vue'

    const useGlobalStore = inject('useGlobalStore')

    const parameters = useGlobalStore('parameters')
</script>
```

## USE ROUTER
To use the router, inject the object inside vue component
```
<script setup>
    import {inject} from 'vue'

    const router = inject('router')
</script>
```

## ADD TRANSLATIONS
To add new translations, go to a langueage file (e.g. src/locale/en.js) and edit
```
export default {
    'MY_LABEL': 'my custom label'
}
```

In src/components/main/Main.vue
```
<template>
    <div>
        {{ $t( 'MY_LABEL' ) }}
    </div>
</template>
```
> Default language selection is defined in the core package (core/src/locale/index.js)
