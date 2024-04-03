<template>
      <!-- Sidebar component -->
      <div class="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden pt-5 pb-4">
            <slot name="ApplicationLogo">

            </slot>

            <slot name="NavigationMenu">

            </slot>
        </div>
        <!-- Profile dropdown desktop -->
        <slot name="SelectDropdown">

        </slot>
      </div>
</template>
