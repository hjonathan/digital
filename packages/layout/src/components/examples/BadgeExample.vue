<script setup>
import { Badge, Title, Card } from 'layout'
</script>

<template>
    <Title>
        {{ $t('Badges examples') }}
    </Title>

    <Card class="mx-auto air-sm">
        <div class="flex space-x-4">
            <!-- Default (success) -->
            <Badge
                :label="$t('Success')" />

            <!-- Warning -->
            <Badge
                :label="$t('Warning')"
                type="warning" />

            <!-- Info -->
            <Badge
                :label="$t('Info')"
                type="info" />

            <!-- Danger -->
            <Badge
                :label="$t('Danger')"
                type="danger" />

            <!-- Custom badge (custom ring, text and background color) -->
            <Badge
                :label="$t('Custom')"
                ring-color="ring-purple-400/30"
                text-color="text-purple-400"
                background-color="bg-purple-400/10" />
        </div>
    </Card>
</template>
