<script setup>
import { ref } from 'vue'
import { Title, Button, Slider, Alert } from 'layout'
import NestedSlider from './NestedSlider.vue'
import FormExample from './FormExample.vue'

/* First slider */
const openSlider = ref(false)
const showAlternativeSlot = ref(false)

/* Second slider */
const openSlider2 = ref(false)
const showAlternativeSlot2 = ref(false)
</script>

<template>
    <Title
        :title="$t('Slider example')" />

    <section>
        <!-- Oppen slider -->
        <Button
            @click="openSlider = !openSlider"
            color="success"
            label="Open slider" />

        <!-- Allows toggling between the default slot and the alternate slot-->
        <Button
            @click="showAlternativeSlot = !showAlternativeSlot"
            color="success"
            label="Toggle slot" />

        <!-- First slider -->
        <Slider
            :show-alternative-slot="showAlternativeSlot"
            :isOpen="openSlider">
            <Title
                title-type="h4"
                :has-border-bottom-line="false"
                :title="$t('Default slot content')" />

            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aut voluptatum cum non deserunt atque
                tempora tenetur. Saepe laboriosam corporis inventore nobis ad veritatis omnis, non provident autem unde
                officiis!

                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam aperiam qui vitae perferendis fuga
                atque voluptate ad? Soluta, excepturi similique! Reprehenderit nisi voluptatem ipsa voluptatum ab! In
                tenetur vel quibusdam.

                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores, perferendis repellendus ullam
                blanditiis quae voluptatum enim, dolorem quidem nobis quis ut autem suscipit voluptatibus illo,
                praesentium maxime velit recusandae veniam.

                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam maxime quo adipisci perferendis
                quibusdam beatae possimus id pariatur officia sunt distinctio, commodi ducimus? Corporis a dignissimos
                adipisci qui in facere.
            </p>

            <template #alternativeSlot>
                <Title
                    title-type="h4"
                    :has-border-bottom-line="false"
                    :title="$t('Alternative slot content')" />

                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis nulla nostrum porro cum,
                        dicta enim debitis maxime asperiores, fugit, quasi quibusdam. Quos ipsam quo quod eaque animi
                        harum fuga nulla?

                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit dolore libero dolores at
                        expedita, et similique. Autem, expedita hic labore, assumenda, voluptas doloribus amet
                        consequuntur minima ullam natus magni quas.
                    </p>
            </template>
        </Slider>

        <!-- Second Slider Section -->
        <Title
            :title="$t('Nested slider')" />

        <!-- Oppen slider -->
        <Button
            @click="openSlider2 = !openSlider2"
            color="success"
            label="Open slider" />

        <!-- Allows toggling between the default slot and the alternate slot-->
        <Button
            @click="showAlternativeSlot2 = !showAlternativeSlot2"
            color="success"
            label="Toggle slot" />

        <!-- Second Slider -->
        <Slider
            :show-alternative-slot="showAlternativeSlot2"
            :isOpen="openSlider2">
            <Title
                title-type="h4"
                :has-border-bottom-line="false"
                :title="$t('Default slot content')" />

            <FormExample />

            <NestedSlider />

            <template #alternativeSlot>
                <Title
                    title-type="h4"
                    :has-border-bottom-line="false"
                    :title="$t('Alternative slot content')" />

                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis nulla nostrum porro cum,
                        dicta enim debitis maxime asperiores, fugit, quasi quibusdam. Quos ipsam quo quod eaque animi
                        harum fuga nulla?

                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit dolore libero dolores at
                        expedita, et similique. Autem, expedita hic labore, assumenda, voluptas doloribus amet
                        consequuntur minima ullam natus magni quas.
                    </p>
            </template>
        </Slider>

        <Alert :hasCloseButton="false">
            {{ $t('External content outside the Slider') }}
        </Alert>
    </section>
</template>
