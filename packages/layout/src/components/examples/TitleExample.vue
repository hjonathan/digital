<script setup>
import { Title } from 'layout'

// The purpose of this paragraph is to allow us to see in context how the title behaves.
const paragraph = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, vel fugiat. Eligendi dignissimos tenetur ea ab maiores, vitae mollitia culpa. Id ipsam cum sunt porro doloremque cupiditate eos tempore ducimus. Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
</script>

<template>
    <section class="paper">
        <Title :has-padding="false">
            {{ $t('Sizes') }}
        </Title>

        <div class="bg-white">
            <Title>
                {{ $t('Heading 1 (h1) with default') }}
            </Title>
        </div>

        <div class="bg-white">
            <Title title-type="h2">
                {{ $t('Heading 2 (h2) with default') }}
            </Title>
        </div>

        <div class="bg-white">
            <Title title-type="h3">
                {{ $t('Heading 3 (h3) with default') }}
            </Title>
        </div>

        <div class="bg-white">
            <Title title-type="h4">
                {{ $t('Heading 4 (h4) with default') }}
            </Title>
        </div>

        <div class="bg-white">
            <Title title-type="h5">
                {{ $t('Heading 5 (h5) with default') }}
            </Title>
        </div>

        <div class="bg-white">
            <Title title-type="h6">
                {{ $t('Heading 6 (h6) with default') }}
            </Title>
        </div>
    </section>

    <section class="paper">
        <Title :has-padding="false">
            {{ $t('Props') }}
        </Title>

        <div class="bg-white">
            <Title :has-border-bottom-line="false">
                {{ $t('Heading 1 (h1) without border bottom line') }}
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>

        <div class="bg-white">
            <Title in-slide-over>
                {{ $t("Heading 1 (h1) with 'InSlideover' in true") }}
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>

        <div class="bg-white">
            <Title
                in-slide-over
                :has-margin="false">
                {{ $t("Heading 1 (h1), 'InSlideover' in true and 'has-margin' in false") }}
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>

        <div class="bg-white">
            <Title
                :has-padding="false"
                :has-margin="false">
                {{ $t("Heading 1 (h1), with 'has-padding' in false and 'has-margin' in false") }}
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>

        <div class="bg-white">
            <Title
                :has-padding="true"
                :has-margin="false">
                {{ $t("Heading 1 (h1), with 'has-padding' in true and 'has-margin' in false") }}
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>

        <div class="bg-white">
            <Title
                :has-padding="false"
                :has-margin="true">
                {{ $t("Heading 1 (h1), with 'has-padding' in false and 'has-margin' in true") }}
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>
    </section>

    <section class="paper">
        <Title :has-padding="false">
            {{ $t('Titles with slots') }}
        </Title>

        <!-- Title with default and rightTitle slot -->
        <div class="bg-white">
            <Title>
                {{ $t("Default title") }}

                <template #rightTitle>
                    <div>
                        {{ $t('Right title') }}
                    </div>
                </template>
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>

        <div class="bg-white">
            <Title :has-breakpoint="false">
                {{ $t("Default title without breakpoint (smalls screens 'md')") }}

                <template #rightTitle>
                    <div>
                        {{ $t('Right title') }}
                    </div>
                </template>
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>

        <!-- Title with default, centerTitle and rightTitle slot. -->
        <div class="bg-white">
            <Title>
                {{ $t("Default title") }}

                <template #rightTitle>
                    <div>
                        {{ $t('Right title') }}
                    </div>
                </template>

                <template #centerTitle>
                    <div>
                        {{ $t('Center title') }}
                    </div>
                </template>
            </Title>

            <p>
                {{ paragraph }}
            </p>
        </div>
    </section>
</template>
