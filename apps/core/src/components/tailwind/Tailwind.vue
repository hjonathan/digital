<script setup>
import { api } from '@/config'
import { ref, h } from 'vue'
import { EnvelopeIcon, PhoneIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/20/solid'
import Comp from './Comp.vue'

const changeColor = ref(false)

const people = [
    {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        role: 'Admin',
        email: 'janecooper@example.com',
        telephone: '+1-202-555-0170',
        imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
    },
]

const response = ref('')

/**
 * Render using h object vue render
 */
const render = () => {
    const vnode = h(
        'div', // type
        { id: 'foo', class: 'text-sm font-medium text-red-900' }, // props
        'HELLO WORLD!!!!!!!!!!!!!!!!!!!'
    )

    return vnode
}

/**
 * Load class from conditional method
 */
const cssClass = () => {
    if (changeColor.value) { return 'rounded-md bg-blue-50 p-4' }

    return 'rounded-md bg-green-50 p-4'
}

/**
 * Set Interval for tailwind example
 */
setInterval(async () => {
    changeColor.value = !changeColor.value

    response.value = await api.get('https://api.thecatapi.com/v1/images/search')
}, 2000)

</script>

<template>
    <div>
        <h1> AXIOS </h1>

        <pre>
            {{ response }}
        </pre>

        <h2> COMPONENT </h2>
        <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="person in people" :key="person.email" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                <div class="flex w-full items-center justify-between space-x-6 p-6">
                    <div class="flex-1 truncate">
                        <div class="flex items-center space-x-3">
                            <h3 class="truncate text-sm font-medium text-gray-900">{{ person.name }}</h3>

                            <span class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ person.role }}</span>
                        </div>

                        <p class="mt-1 truncate text-sm text-gray-500">{{ person.title }}</p>
                    </div>

                    <img class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" :src="person.imageUrl" alt="" />
                </div>

                <div>
                    <div class="-mt-px flex divide-x divide-gray-200">

                        <div class="flex w-0 flex-1">
                            <a :href="`mailto:${person.email}`" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                                <EnvelopeIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />

                                Email
                            </a>
                        </div>

                        <div class="-ml-px flex w-0 flex-1">
                            <a :href="`tel:${person.telephone}`" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                                <PhoneIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />

                                Call
                            </a>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <br>

        <h2> DINAMIC COMPONENT WITH VFC </h2>

        <component :is="Comp"> </component>

        <br>

        <h2> DINAMIC COMPONENT WITH RENDER FUNCTION </h2>

        <component :is="render()"> </component>

        <br>

        <h2> TAILWIND CONDITIONAL CSS </h2>

        <div :class="{
            'rounded-md':true ,
            'bg-yellow-50':changeColor,
            'bg-red-50':!changeColor,
            'p-4':true}">
            <div class="flex">
                <div class="flex-shrink-0">
                    <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>

                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">Attention needed</h3>
                    <div class="mt-2 text-sm text-yellow-700">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.</p>
                    </div>
                </div>
            </div>
        </div>

        <h2> TAILWIND CSS FROM JS FUNCTION </h2>
        <div :class="cssClass()">
            <div class="flex">
                <div class="flex-shrink-0">
                    <InformationCircleIcon class="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>

                <div class="ml-3 flex-1 md:flex md:justify-between">
                    <p class="text-sm text-blue-700">A new software update is available. See what’s new in version 2.0.4.</p>

                    <p class="mt-3 text-sm md:ml-6 md:mt-0">

                    <a href="#" class="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                        Details
                        <span aria-hidden="true"> &rarr;</span>
                    </a>

                    </p>
                </div>

            </div>
        </div>
    </div>
</template>
