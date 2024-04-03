<script setup>
import { Title, Card } from 'layout'
</script>

<template>
    <section>
        <Title>{{ $t('Grid layout') }}</Title>

        <div class="row">
            <div class="bg-green-200">
                {{ $t('EXAMPLE ONE COLUMN') }}
            </div>
        </div>

        <div class="row cols-2">
            <div class="bg-indigo-200">{{ $t('EXAMPLE TWO COLUMNS') }}</div>
            <div class="bg-indigo-200">{{ $t('EXAMPLE TWO COLUMNS') }}</div>
        </div>

        <div class="row cols-3">
            <div class="bg-red-200">{{ $t('EXAMPLE TREE COLUMNS') }}</div>
            <div class="bg-red-200">{{ $t('EXAMPLE TREE COLUMNS') }}</div>
            <div class="bg-red-200">{{ $t('EXAMPLE TREE COLUMNS') }}</div>
        </div>

        <div class="row cols-4">
            <div class="bg-yellow-200">
                <div class="row cols-4 col-gutter-xs">
                    <div class="bg-yellow-200">
                        <div class="row cols-4 col-gutter-xs">
                            <div class="bg-yellow-200">
                                <Card></Card>
                            </div>

                            <div class="bg-yellow-200">
                                <Card></Card>
                            </div>

                            <div class="bg-yellow-200">
                                <Card></Card>
                            </div>

                            <div class="bg-yellow-200">
                                <Card></Card>
                            </div>
                        </div>
                    </div>

                    <div class="bg-yellow-200">
                        <Card></Card>
                    </div>

                    <div class="bg-yellow-200">
                        <Card></Card>
                    </div>

                    <div class="bg-yellow-200">
                        <Card></Card>
                    </div>
                </div>
            </div>
            <div class="bg-yellow-200">{{ $t('EXAMPLE FOUR COLUMNS') }}</div>
            <div class="bg-yellow-200">{{ $t('EXAMPLE FOUR COLUMNS') }}</div>
            <div class="bg-yellow-200">{{ $t('EXAMPLE FOUR COLUMNS') }}</div>
        </div>

        <div class="row cols-6">
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
        </div>
    </section>

    <section>
        <Title>{{ $t('Grid layout colspan') }}</Title>

        <div class="row cols-6">
            <div class="bg-primary-200 col-3/6">{{ $t('EXAMPLE SIX COLUMNS 3/6') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
            <div class="bg-primary-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
        </div>

        <div class="row cols-4">
            <div class="bg-yellow-200 col-3/4">{{ $t('EXAMPLE SIX COLUMNS 3/4') }}</div>
            <div class="bg-yellow-200">{{ $t('EXAMPLE SIX COLUMNS') }}</div>
        </div>
    </section>
</template>
