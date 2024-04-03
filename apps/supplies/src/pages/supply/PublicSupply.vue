<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { Title, Button } from 'layout'
import { InputLabel } from 'form'
import { ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const router = inject('router')

const data = ref({
    id: 'f6258ca3-9dba-414b-81f1-db7d9ff7dbd1',
    name: 'Supply 001: T Virus',
    category: 'Office supplies',
    location: 'Shelving area',
    measure: 'boxes',
    quantity: '12 boxes',
    updated_at: '12/12/12'
})

const onClick = () => {
    router.push({
        path: `/supplies/item-transactions/${data.value.id}`,
        params: {
            id: data.value.id
        }
    })
}

</script>

<template>
    <DocumentWrapper class="flex justify-center items-center">
        <section class="paper-sm">
            <Title
                title="Supply Information"
                title-type="h2"
                :has-border-bottom-line="false">
            </Title>

            <div class="row">
                <div class="!space-y-1">
                    <InputLabel
                        v-model="data.id"
                        :label="$t('ID')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="data.name"
                        :label="$t('Name')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="data.category"
                        :label="$t('Category')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="data.location"
                        :label="$t('Location')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="data.quantity"
                        :label="$t('Quantity')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="data.updated_at"
                        :label="$t('Updated at')"
                        mode="readonly"
                        outline
                        dense />
                </div>
            </div>
            <div class="row">
                <div class="flex justify-end">
                    <Button
                        @click="onClick"
                        link
                        color="primary"
                        label="More information"
                    />
                </div>
            </div>
        </section>
    </DocumentWrapper>
</template>
