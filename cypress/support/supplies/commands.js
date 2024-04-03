import { correctItemDescription, incorrectItemDescription } from '../../fixtures/supplies/data'

Cypress.Commands.add('fillItemDescription', ({ type = 'CORRECT' }) => {
    const data = type === 'CORRECT' ? correctItemDescription : incorrectItemDescription

    cy.get('#2').type(data.nameOrTitle)
    cy.get('#textarea_3').type(data.description)
    cy.get('#4').type(data.sku)
    cy.get('#5').type(data.category)
    cy.get('#6').type(data.manufacturer)
    cy.get('#7').type(data.price)
    cy.get('#8').type(data.accountingNumber)
    cy.get('#9').type(data.quantity)

    cy.get('#10').click()
    cy.get('#pv_id_2_0 > .mb-0').click()
})
