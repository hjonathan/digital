<script setup>
import { ref } from 'vue'
import {
    Card,
    Title,
    CardSelection,
    TwoSectionsCard
} from 'layout'

import {
    mdiPen,
    mdiAbacus,
    mdiHome,
    mdiClose,
    mdiMapMarkerRadius
} from '@mdi/js'

import {
    ArchiveBoxIcon
} from '@heroicons/vue/24/outline'

import SvgIcon from '@jamescoyle/vue-icon'

const openCard = ref(false)

setTimeout(() => {
    openCard.value = true
}, 2000)

const options = [
    {
        label: 'This process does not have resulting remaining This .',
        value: 'Option 1',
        icon: mdiAbacus
    },
    {
        label: 'Option 2',
        value: 'Option 2',
        icon: mdiPen
    },
    {
        label: 'Option 3',
        value: 'Option 3',
        icon: mdiHome,
        disabled: true
    },
    {
        label: 'Option 4',
        value: 'Option 4',
        icon: mdiClose
    },
]

const cardSelectionModel = ref(null)

const change = (nValue) => {
    console.log('FROM CHANGE VALUE', nValue)
}
</script>

<template>
    <section>
        <Title>
            {{ $t('Card examples') }}
        </Title>

        <!-- TwoSections Card -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- Card defined through props -->
            <TwoSectionsCard
                topSectionTitle="Destination"
                topSectionContent="Lorem ipsum dolor sit amet."
                bottomSectionTitle="Items"
                bottomSectionContent="12"
                :top-section-icon="mdiMapMarkerRadius"
                :bottom-section-icon="ArchiveBoxIcon"
                @clickInTopSection="() => console.log('clickInTopSection')"
                @clickInBottomSection="() => console.log('clickInBottomSection')" />

            <!-- Card defined through slots -->
            <TwoSectionsCard>
                <template #topSectionIcon>
                    <SvgIcon
                        type="mdi"
                        :path="mdiMapMarkerRadius"
                        :class="`h-16 w-16 mx-auto`" />
                </template>

                <template #topSectionContent>
                    <Title
                        title="Title from prop"
                        title-type="h2"
                        :has-border-bottom-line="false" />

                    <span>
                        {{ $t('Content from prop') }}
                    </span>
                </template>

                <template #bottomSectionIcon>
                    <ArchiveBoxIcon
                        :class="`h-16 w-16 mx-auto`" />
                </template>

                <template #bottomSectionContent>
                    <Title
                        title="Title from prop"
                        title-type="h2"
                        :has-border-bottom-line="false" />

                    <span>
                        {{ $t('Custom content from prop') }}
                    </span>
                </template>
            </TwoSectionsCard>
        </div>

        <!-- Card Selection -->
        <div class="grid grid-cols-12">
            <div class="col-span-6">
                <CardSelection
                    v-model="cardSelectionModel"
                    :options="options"
                    optionLabel="label"
                    optionValue="value"
                    @update:model-value="change"
                    containerClass=""
                    cardClass=""
                    iconClass=""
                    labelClass="" />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- First row -->
            <Card
                is-closable
                v-model:open="openCard"
                header="Test prop header">
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
                {{ $t('Content from the body') }} <br>
            </Card>

            <Card
                header="Test prop header (Without separator)"
                :has-header-separator="true">
                {{ $t('Content from the body') }}
            </Card>

            <!-- Second row -->
            <Card
                isLink>
                <template #header>
                    <div class="flex justify-between font-semibold">
                        <span>
                            {{ $t('Header') }}
                        </span>

                        <span>
                            {{ $t('from template') }}
                        </span>
                    </div>
                </template>

                {{ $t('Card as link') }}
            </Card>

            <Card
                :has-header-separator="false"
                isLink>
                <template #header>
                    <div class="flex justify-between font-semibold">
                        <span>
                            {{ $t('Header') }}
                        </span>

                        <span>
                            {{ $t('from template') }}
                        </span>
                    </div>
                </template>

                {{ $t('Card as link (Without header separator).') }}
            </Card>

            <!-- Third row -->
            <Card
                :place-content-center="false"
                class=" h-96  "
                isLink>
                <template #header>
                    <div class="flex justify-between font-semibold">
                        <span>
                            {{ $t('Header') }}
                        </span>

                        <span>
                            {{ $t('from template') }}
                        </span>
                    </div>
                </template>

                {{ $t('Card as link with header and footer') }}

                <template #footer>
                    <div class="flex justify-between font-semibold">
                        <span>
                            {{ $t('Footer') }}
                        </span>

                        <span>
                            {{ $t('from template') }}
                        </span>
                    </div>
                </template>
            </Card>

            <Card
                header="Prop header"
                :has-header-separator="false"
                :has-footer-separator="false"
                place-content-center
                isLink>
                {{ $t('Card as a link (without header or footer separator) with center-aligned content.') }}

                <template #footer>
                    <div class="flex justify-between font-semibold">
                        <span>
                            {{ $t('Footer') }}
                        </span>

                        <span>
                            {{ $t('from template') }}
                        </span>
                    </div>
                </template>
            </Card>

            <!-- Fourth row -->
            <Card
                place-content-center=""
                class="h-96">
                {{ $t('Normal card without a header or footer, and with center-aligned content.') }}
            </Card>

            <Card
                place-content-center=""
                class="h-96"
                header="Header from prop"
                active
                isLink>
                {{ $t('Card as link-selected with header and footer with center-aligned content.') }}

                <template #footer>
                    <div class="flex justify-between font-semibold">
                        <span>
                            {{ $t('Footer') }}
                        </span>

                        <span>
                            {{ $t('from template') }}
                        </span>
                    </div>
                </template>
            </Card>

            <!-- Fifth row -->
            <Card
                place-content-center=""
                class="h-96"
                header="Header from prop"
                disabled
                isLink>
                {{ $t('Card as link-selected with header and footer with center-aligned content.') }}

                <template #footer>
                    <div class="flex justify-between font-semibold">
                        <span>
                            {{ $t('Footer') }}
                        </span>

                        <span>
                            {{ $t('from template') }}
                        </span>
                    </div>
                </template>
            </Card>
        </div>
    </section>
</template>
