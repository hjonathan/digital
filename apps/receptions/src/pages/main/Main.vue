<script setup>
import { inject, ref, onMounted, computed } from 'vue'
import { Title, MainCard, Button } from 'layout'
import SlideOverActions from '../../components/slideOverActions/SlideOverActions.vue'
import { useSlideOver as useSlideComposable } from '../../components/slideOverActions/useSlideOver'
import { gsap, Back, Power2 } from 'gsap'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import SvgIcon from '@jamescoyle/vue-icon'
import {
    mdiWindowClose,
    mdiGestureTapButton,
    mdiRefresh
} from '@mdi/js'
import {
    ArchiveBoxIcon,
    ArchiveBoxArrowDownIcon,
    PlusIcon
} from '@heroicons/vue/24/outline'
import { formatDate } from 'shared'
import { loadBackground } from '../../background.js'

loadBackground()

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const receptionsStore = useGlobalStore('receptions')

const tabsStore = useGlobalStore('tabs')

// Slideover
const useSlideOver = useSlideComposable()
const { configSlideOver, setConfig } = useSlideOver

const receptionActions = ref([
    {
        title: t('Receive'),
        icon: ArchiveBoxIcon,
        subtitle: t('Reception based on an invoice.'),
        color: 'primary',
        customClasses: '',
        action: () => {
            tabsStore.openTab({ name: 'ReceptionCreate' })
        }
    },
    // Second actions
    {
        title: t('Simplified reception'),
        icon: ArchiveBoxArrowDownIcon,
        subtitle: t('Receive without an invoice.'),
        color: 'info',
        quantityField: 'drafts',
        action: () => {
            setConfig({
                action: 'Receive',
                open: !configSlideOver.value.open
            })
        }
    },
])

const mainSection = ref(null)
const mainSectionHeight = ref(null)

const partialShow = ref(false)
const showTable = ref(false)

const animation = ref(null)
const fullAnimation = ref(null)

const invisibleSectionHeigth = 700

const gsapTimeline = gsap.timeline({ yoyo: true })
const animationRun = ref(false)

onMounted(() => {
    animation.value = gsap.to('#table', {
        duration: 0.4,
        y: -50,
        paused: true
    })

    mainSectionHeight.value = mainSection.value.clientHeight

    getData()
})

const receptionsData = computed(() => {
    return receptionsStore.getData().slice(0, 6)
})

const getData = async () => {
    receptionsStore.fetch()
}

const tableDistanceFromTop = 250

const showFullTable = () => {
    showTable.value = true

    fullAnimation.value = gsap.to('#table', {
        y: -(mainSectionHeight.value - tableDistanceFromTop),
        duration: 1,
        ease: 'power3.out'
    })

    showButtons.value = true
}

const showButtons = ref(false)

const hideTable = () => {
    gsap.to('#table', {
        y: 0,
        duration: 1.3,
        ease: 'power3.out',
        onComplete: () => {
            animation.value.restart()

            animation.value.pause()

            showTable.value = false

            partialShow.value = false
        }
    })

    showButtons.value = false
}

const handleMouseEnter = () => {
    if (showTable.value) return

    animation.value.play()

    partialShow.value = true
}

const handleMouseLeave = () => {
    if (showTable.value) return

    partialShow.value = false

    animation.value.reverse()
}

// Animation buttons
const animateButtons = () => {
    gsapTimeline
        .fromTo('#card-create-reception', {
            scale: 1,
            display: 'flex',
            clipPath: 'circle(100%)'
        },
        {
            duration: 0.3,
            scale: 0.2,
            clipPath: 'circle(0%)',
            ease: Power2.easeIn
        }, '<50%')
        .fromTo('#close-button', {
            scale: 0,
            y: -400,
            zIndex: 100
        },
        {
            display: 'flex',
            scale: 1.5,
            duration: 0.3,
            ease: Power2.easeIn
        }, '<50%')
        .fromTo('.options-card-1', {
            y: -200,
            x: 190,
            opacity: 0,
            clipPath: 'circle(0%)'
        },
        {
            display: 'grid',
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            clipPath: 'circle(100%)',
            ease: Back.easeInOut.config(3)
        }, '<1%')
        .fromTo('.options-card-2', {
            y: -200,
            x: -190,
            opacity: 0,
            clipPath: 'circle(0%)'
        },
        {
            display: 'grid',
            y: 0,
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 0.7,
            clipPath: 'circle(100%)',
            ease: Back.easeInOut.config(3)
        }, '<15%')
}

const openButtons = () => {
    if (!animationRun.value) {
        animationRun.value = true

        animateButtons()

        return
    }

    gsapTimeline.play()
}

const closeButtons = () => {
    gsapTimeline.reverse()
}

const totalPrice = (reception) => {
    return reception.item_receptions.reduce((accumulator, item) => {
        return accumulator + item.price
    }, 0)
}

const openReceptionAllTab = () => {
    tabsStore.openTab({ name: 'ReceptionsAll' })
}
</script>

<template>
    <div id="bg" class="absolute h-full w-full top-0 left-0 margin-0 overflow-hidden" style="opacity: .15;"></div>

    <section
        ref="mainSection"
        class="h-full !my-0 relative overflow-hidden">

        <Title
            :title="$t('Create reception')" />

        <!--  Cards for new receptions  -->
        <div class="flex items-center justify-center">
            <div
                :class="{ 'blur-[1px]' : partialShow, 'blur-sm pointer-events-none' : showTable }"
                class="grid grid-cols-1 lg:grid-cols-2 gap-24 w-3/4 xl:w-1/2 transition-all duration-300">
                <div
                    id="card-create-reception"
                    class="flex justify-center col-span-2">
                    <MainCard
                        :title="$t('Receive')"
                        :subtitle="$t('Receive inventory items')"
                        :icon="PlusIcon"
                        @click="openButtons" />
                </div>

                <div
                    v-for="(item, index) of receptionActions"
                    :key="index"
                    :class="`options-card-${index + 1} hidden`">
                    <MainCard
                        :action="item.action"
                        :icon="item.icon"
                        :title="item.title"
                        :subtitle="item.subtitle" />
                </div>
            </div>
        </div>

        <!-- Animated button -->
        <div
            id="close-button"
            class="flex justify-center"
            :class="{ 'blur-[1px]' : partialShow, 'blur-sm pointer-events-none' : showTable }"
            style="display: none;">
            <Button
                size="xl"
                outline
                color="primary"
                rounded
                :icon="mdiRefresh"
                @click="closeButtons()" />
        </div>

        <!-- Table section -->
        <div
            @mouseover="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            id="table"
            :style="`bottom: -${invisibleSectionHeigth}px`"
            class="absolute w-full bg-red-5000 h-[1000px]">
            <div
                class="pt-44">
                <div class="!w-[837px] mx-auto relative z-50">
                    <!-- Close icon -->
                    <transition name="fade">
                        <div
                            @click="hideTable"
                            v-show="showTable"
                            class="mb-2 rounded-full cursor-pointer absolute -top-4 -right-4 p-2 transition duration-300
                            bg-white border border-red-600/50 shadow-lg hover:bg-red-50">
                            <svg-icon
                                class="text-red-600"
                                size="14"
                                type="mdi"
                                :path="mdiWindowClose" />
                        </div>
                    </transition>

                    <!-- Show full icon -->
                    <div
                        @click="showFullTable"
                        class="w-full absolute top-36 flex justify-center">
                        <transition name="fade">
                            <div
                                v-show="partialShow && !showTable"
                                class="rounded-full cursor-pointer bg-white/50 hover:bg-gray-100 border shadow p-3 w-min
                                transition-all duration-300">
                                <svg-icon
                                    type="mdi"
                                    :path="mdiGestureTapButton" />
                            </div>
                        </transition>
                    </div>

                    <table
                        @click="showFullTable"
                        v-if="receptionsData?.length"
                        class="custom !rounded-2xl border overflow-hidden w-full">
                        <thead :class="`bg-primary-50  !border-t-4 !border-t-primary-500 uppercase text-gray-400 text-xs border-b border-b-gray-300 ${ showTable ? 'bg-primary-500 text-white' : '' }`">
                            <th class="w-3/12 text-start p-5 font-medium">
                                {{ $t('Vendor') }}
                            </th>

                            <th class="w-2/12 text-start">
                                {{ $t('Invoice number') }}
                            </th>

                            <th class="w-2/12 text-start">
                                {{ $t('Items received') }}
                            </th>

                            <th class="w-2/12 text-start">
                                {{ $t('Total price') }}
                            </th>

                            <th class="w-3/12 text-start">
                                {{ $t('Reception date') }}
                            </th>
                        </thead>

                        <tbody class="text-sm bg-white">
                            <tr
                                v-for="(reception, index) of receptionsData"
                                :key="index"
                                :class="{ 'bg-gray-100/30': index % 2 !== 0 }">
                                <td class="p-5 space-y-1">
                                    <div class="font-semibold">
                                        {{ reception.vendor?.name }}
                                    </div>

                                    <div class="text-xs text-gray-400 font-medium">
                                        {{ reception.vendor?.address }}
                                    </div>

                                    <div class="text-xs text-gray-400">
                                        {{ reception.vendor?.phone }}
                                    </div>
                                </td>

                                <td class="font-medium">
                                    {{ reception.reception_document_number }}
                                </td>

                                <td class="font-medium text-right py-5 pr-14">
                                    <div class="flex flex-col">
                                        <span>
                                            {{ reception.item_receptions?.length }}
                                        </span>

                                        <span class="text-xs text-gray-400">
                                            {{ $t('items') }}
                                        </span>
                                    </div>

                                </td>

                                <td class="font-medium text-right py-5 pr-20 text-green-500">
                                    ${{ totalPrice(reception) }}
                                </td>

                                <td class="font-medium text-right p-5">
                                    <div class="flex flex-col">
                                        <span>{{ formatDate(reception.received_at_format, 'americanFormat') }}</span>
                                        <span class="text-xs text-gray-400">{{ formatDate(reception.received_at_format, 'diffForHumans') }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div
                v-show="showButtons"
                class="absolute bottom-4 flex justify-center w-full">
                <button
                    @click="openReceptionAllTab()"
                    class="link">
                    {{ $t('View all receptions') }}
                </button>
            </div>
        </transition>
    </section>

    <SlideOverActions
        :use-slide-over="useSlideOver" />
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
