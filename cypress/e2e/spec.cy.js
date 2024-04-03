
const data = require('../fixtures/example.json')

describe('template spec', () => {
    it('passes', () => {
        cy.viewport(1920, 1024)

        cy.loginSystem()

        cy.get('.space-y-6 > .justify-center').click()

        cy.get(':nth-child(12) > .relative').click()

        cy.get(':nth-child(12) > .mb-2 > .text-gray-600').click()

        cy.get('#Startpurchaserequest').click()

        cy.fillItemDescription({ type: 'INCORRECT' })


        cy.get('#textarea_11').type('Vendor information')

        cy.get('#textarea_12').type('Some note')

        cy.get('#textarea_13').type('Some budget information')

        cy.get('#addNote').click()

        cy.get('#addDeliveryInformation').click()

        cy.get('#15').type('02/02/2024')

        cy.get('#textarea_14').type('Some note')

        cy.get('#textarea_16').type('Some instructions')

        cy.get('#Submit').click()

        cy.get('.primary').click()

        if (cy.get('.border-l-4')) {
            cy.fillItemDescription({ type: 'CORRECT' })

            cy.get('#Submit').click()

            cy.get('.primary').click()
        }
    })
})
