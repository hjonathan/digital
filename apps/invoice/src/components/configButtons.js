import { mdiInboxArrowDown, mdiContentSaveCheck, mdiCheckAll, mdiDeleteEmpty, mdiPrinter, mdiPencil, mdiEye } from '@mdi/js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { jsonLogic } from 'jsonRules'
import { buttonRulesDisable } from './configRules'
/**
 * Buttons when: NOTHING is selected
 */
export const configButtons = ({ useGlobalStore, key, selectedRows, type }) => {
    const tabsStore = useGlobalStore('tabs')

    const { t } = useI18n()

    return computed(() => {
        return [
            {
                icon: mdiInboxArrowDown,
                classType: 'primary',
                label: t('Create'),
                disabled: selectedRows.value.length > 0,
                action () {
                    tabsStore.openTab({ path: 'invoicing/create', name: 'CreateInvoice' })
                }
            },
            {
                icon: mdiPencil,
                classType: 'primary',
                label: t('Edit'),
                show: ['draft', 'normal'].includes(type),
                disabled: !selectedRows.value.length || selectedRows.value[0].invoice_status?.slug !== 'draft',
                action () {
                    tabsStore.openTab({ name: 'EditInvoice', params: { id: selectedRows.value[0].id } })
                }
            },
            {
                icon: mdiEye,
                classType: 'primary',
                label: t('Show'),
                show: ['invoiced', 'normal'].includes(type),
                disabled: !selectedRows.value.length || selectedRows.value[0].invoice_status?.slug !== 'invoiced',
                action () {
                    tabsStore.openTab({ name: 'ShowInvoice', params: { id: selectedRows.value[0].id } })
                }
            },
        ]
    })
}

/**
 * Buttons when: invoice edit
 */
export const configButtonsInvoice = ({ actions, data, dataValidate }) => {
    const { t } = useI18n()

    return computed(() => {
        return [
            {
                icon: mdiContentSaveCheck,
                classType: 'teal',
                label: t('Save draft'),
                spinner: dataValidate.value.saveButton,
                disabled: jsonLogic.apply(buttonRulesDisable.save, dataValidate.value),
                action () {
                    actions.saveInvoice({ type: 'save', sync: true })
                }
            },
            {
                icon: mdiCheckAll,
                classType: 'primary',
                label: t('Invoice'),
                spinner: dataValidate.value.invoiceButton,
                disabled: jsonLogic.apply(buttonRulesDisable.invoice, dataValidate.value),
                action () {
                    actions.invoiced()
                }
            },
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                spinner: dataValidate.value.printButton,
                disabled: jsonLogic.apply(buttonRulesDisable.print, dataValidate.value),
                action () {
                    actions.print()
                }
            },
            {
                icon: mdiDeleteEmpty,
                classType: 'red',
                label: t('Delete draft'),
                disabled: jsonLogic.apply(buttonRulesDisable.deleteDraft, dataValidate.value),
                action () {
                    actions.deleteInvoice()
                }
            },
        ]
    })
}

/**
 * Buttons when: invoice edit
 */
export const configButtonsInvoiceShow = ({ loadings, print }) => {
    const { t } = useI18n()

    return computed(() => [
        {
            icon: mdiPrinter,
            classType: 'primary',
            label: t('Print'),
            spinner: loadings.value.printButton,
            disabled: loadings.value.printButton,
            action () {
                print()
            }
        },
    ])
}
