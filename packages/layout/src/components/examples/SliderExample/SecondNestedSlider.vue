<script setup>
import { ref } from 'vue'
import { Slider, Title, Button } from 'layout'

const showAlternativeSlot = ref(null)
const openSlider = ref(null)
</script>

<template>
    <!-- Div for GRID positioning  -->
    <div>
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
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis nulla nostrum porro cum, dicta
                    enim debitis maxime asperiores, fugit, quasi quibusdam. Quos ipsam quo quod eaque animi harum fuga
                    nulla?

                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit dolore libero dolores at
                    expedita, et similique. Autem, expedita hic labore, assumenda, voluptas doloribus amet consequuntur
                    minima ullam natus magni quas.
                </p>
            </template>
        </Slider>
    </div>
</template>
