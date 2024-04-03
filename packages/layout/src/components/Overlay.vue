<script setup>
const props = defineProps({
    title: String,
    size: {
        type: String,
        default: '20'
    }
})

const sizes = {
    32: 'h-32 w-32',
    24: 'h-24 w-24',
    20: 'h-20 w-20',
    16: 'h-16 w-16',
    14: 'h-14 w-14'
}

</script>

<template>
    <div class="absolute bg-white bg-opacity-60 z-10 w-full h-full flex items-center justify-center">
        <div class="flex items-center">
            <span class="mr-4">{{ props.title }}</span>

            <svg
                :class="`animate-spin ${sizes[size]} text-800 text-primary-600`"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />

                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>
    </div>
</template>
