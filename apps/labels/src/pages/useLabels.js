import { ref, watch } from 'vue'
import { isNumber } from 'lodash'

export function useLabels ({ useGlobalStore }) {
    const inventoryStore = useGlobalStore('inventory')

    // Contains all selected labels in the label step.
    const labelSelected = ref(null)

    // Contains all selected products in the products step
    const productsSelected = ref([])

    // Contains all selected products and their children, if any.
    const productsToPrint = ref([])

    // To enable quantity tab
    const isFetchQuantity = ref(false)

    const apiGridProducts = ref()

    const apiGrid = ref()

    const step = ref()

    // To enable or disable the navigation buttons of the Stepper
    const disableBackButton = ref(false)
    const disableNextButton = ref(true)

    // Enable or disable the 'next button' of the 'products step' when no products are selected
    watch(
        () => productsSelected.value,
        () => {
            if (productsSelected.value.length) {
                disableNextButton.value = false

                return
            }

            disableNextButton.value = true
        })

    // Enable or disable the 'next button' of the 'labels/templates step' when no label is selected
    watch(
        () => labelSelected.value,
        () => {
            if (!isNumber(labelSelected?.value?.id)) {
                disableNextButton.value = true

                return
            }

            disableNextButton.value = false
        })

    const enableQuantityStep = async () => {
        isFetchQuantity.value = true

        const nProductList = []

        for (const product of productsSelected.value) {
            const realProduct = await getProduct(product)

            nProductList.push(realProduct)
        }

        productsToPrint.value = nProductList

        isFetchQuantity.value = false
    }

    const getProduct = async (product) => {
        const defaultQuantityLabels = 1

        const existProduct = productsToPrint.value.find(productIterator => productIterator.id === product.id)

        if (existProduct) return existProduct

        if (product.children_count) {
            const nProduct = await inventoryStore.getInventoryItem(product.id)

            for (const child of nProduct.data.children) {
                // Defines the default quantity of labels.
                child.quantityLabels = defaultQuantityLabels
            }

            return nProduct.data
        }

        // Defines the default quantity of labels.
        product.quantityLabels = defaultQuantityLabels

        return product
    }

    return {
        labelSelected,
        step,
        productsSelected,
        apiGrid,
        productsToPrint,
        isFetchQuantity,
        enableQuantityStep,
        apiGridProducts,
        disableBackButton,
        disableNextButton
    }
}
