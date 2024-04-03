<script setup>
import { Title, Connector } from 'layout'
</script>

<template>
    <Title>
        {{ $t('Connector examples') }}
    </Title>

    <div class="flex flex-row gap-10">
        <div class="flex flex-col w-6/12">
            <Title
                titleType="h2"
                :title="$t('Connector vertical')" />

            <div id="elemento_cinco" class="w-10 h-10 bg-sky-500 ml-48"></div>

            <div id="elemento_seis" class="w-10 h-10 bg-green-500 mt-48 ml-48"></div>
        </div>

        <div class="gap-52 justify-center">
            <Title
                titleType="h2"
                :title="$t('Connector horizontal')" />
            <div class="flex flex-row gap-52">
                <div id="elemento_uno" class="w-10 h-10 bg-primary-500"></div>
                <div id="elemento_dos" class="w-10 h-10 bg-teal-500"></div>
                <div id="elemento_tres" class="w-10 h-10 bg-sky-500"></div>
                <div id="elemento_cuatro" class="w-10 h-10 bg-green-500 mt-48"></div>
            </div>

        </div>
    </div>

    <Connector
        originId="elemento_uno"
        destinationId="elemento_dos"
        :vertical="false"
        :animationDuration="10"
        color="primary" />

    <Connector
        originId="elemento_dos"
        destinationId="elemento_tres"
        :vertical="false"
        color="danger" />

    <Connector
        originId="elemento_uno"
        destinationId="elemento_cuatro"
        :vertical="false"
        size="3xl"
        space="3xl" />

    <Connector
        originId="elemento_tres"
        destinationId="elemento_cuatro"
        :vertical="false"
        :animationDuration="0" />

    <Connector
        originId="elemento_cinco"
        destinationId="elemento_seis"
        :vertical="true" />
</template>
