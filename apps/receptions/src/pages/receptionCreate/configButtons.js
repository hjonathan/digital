import { computed, ref } from 'vue'
import { mdiContentSave, mdiEye } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import { round, formatDate } from 'shared'

export const configButtons = ({ data, indCost, errors, useGlobalStore }) => {
    const { t } = useI18n()

    const loaders = ref({
        save: false
    })

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')
    const receptionsStore = useGlobalStore('receptions')
    const inventoryStore = useGlobalStore('inventory')

    return computed(() => {
        return [
            {
                icon: mdiContentSave,
                classType: 'teal',
                label: t('Save reception'),
                disabled: !data.value?.vendor || !data.value?.items.length || loaders.value.save,
                spinner: loaders.value.save,
                action: async () => {
                    loaders.value.save = true

                    const apiData = {
                        reception_document_number: data.value?.reception_document_number,
                        reception_document_date: data.value?.reception_document_date ? formatDate(data.value?.reception_document_date, 'utcDateTime') : null,
                        vendor_id: data.value?.vendor?.rawData?.id,
                        reception_ind_costs: indCost.value
                            ? Object.entries(indCost.value).map((e, index) => {
                                return {
                                    reception_ind_cost_id: e[0],
                                    cost: e[1]
                                }
                            })
                            : null,
                        reception_items:
                            data.value.items.map(e => {
                                return {
                                    ...e,
                                    item_type_id: e.item_type?.id,
                                    amount: round(e.quantity * e.price)
                                }
                            })
                    }

                    const response = await api.post('/receptions/build', apiData)

                    loaders.value.save = false

                    if (response.success) {
                        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

                        errors.value = {}

                        tabsStore.closeTab('ReceptionCreate')

                        receptionsStore.fetch()

                        inventoryStore.fetch()
                    }

                    if (response.errors) {
                        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                        errors.value = response.errors
                    }
                }
            },
        ]
    })
}
