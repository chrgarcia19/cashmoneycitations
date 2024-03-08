describe('Manually Add Reference', () => {
  it('Manually Adds a Reference & Saves to Database', () => {
    // Visit /new webpage
    cy.visit('http://localhost:3000/new')

    cy.get('#reference-select-entrytype')
    
    cy.get('#reference-title').type('Sherlock Holmes')
  })
})