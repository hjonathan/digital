<script setup>
import { Button, Title } from 'layout'
import { ref } from 'vue'
import { mdiClose, mdiCheckAll } from '@mdi/js'

const loading = ref(false)

setInterval(() => {
    loading.value = !loading.value
}, 2000)

const clickDemo = () => {
    console.log('Demo click')
}
</script>

<template>
    <section>
        <Title>Button color</Title>

        <Button
            label="Primary"
            color="primary"
            @click="clickDemo" />

        <Button
            label="Secondary"
            color="secondary"
            @click="clickDemo" />

        <Button
            label="Info"
            color="info"
            @click="clickDemo" />

        <Button
            label="Warning"
            color="warning"
            @click="clickDemo" />

        <Button
            label="Success"
            color="success"
            @click="clickDemo" />

        <Button
            label="Error"
            color="error"
            @click="clickDemo" />

        <Button
            label="Neutral"
            color="neutral"
            @click="clickDemo" />
    </section>

    <section>
        <Title>Button flat</Title>

        <Button
            label="Primary"
            color="primary"
            flat
            @click="clickDemo" />
    </section>

    <section>
        <Title>Button outline</Title>

        <Button
            label="Primary"
            color="primary"
            outline
            @click="clickDemo" />
    </section>

    <section>
        <Title>Button size</Title>

        <Button
            label="Button xs"
            color="primary"
            size="xs"
            @click="clickDemo" />

        <Button
            label="Button sm"
            color="primary"
            size="sm"
            @click="clickDemo" />

        <Button
            label="Button md"
            color="primary"
            size="md"
            @click="clickDemo" />

        <Button
            label="Button lg"
            color="primary"
            size="lg"
            @click="clickDemo" />

        <Button
            label="Button xl"
            color="primary"
            size="xl"
            @click="clickDemo" />
    </section>

    <section>
        <Title>Rounded</Title>

        <Button
            rounded
            :icon="mdiClose"
            color="primary"
            size="xl"
            @click="clickDemo" />
    </section>

    <section>
        <Title>Button state</Title>

        <Title
            title-type="h3"
            :has-border-bottom-line="false">
            Disabled
        </Title>

        <Button
            label="Primary"
            color="primary"
            :disabled="true"
            @click="clickDemo" />

        <Title
            title-type="h3"
            :has-border-bottom-line="false">
            Loading
        </Title>

        <Button
            label="Primary"
            color="primary"
            :loading="loading"
            @click="clickDemo" />
    </section>

    <section>
        <Title>Icons</Title>

        <Button
            :icon="mdiClose"
            label="Icon left"
            color="primary"
            @click="clickDemo" />

        <Button
            :iconRight="mdiCheckAll"
            label="Icon right"
            color="primary"
            @click="clickDemo" />
    </section>
</template>
