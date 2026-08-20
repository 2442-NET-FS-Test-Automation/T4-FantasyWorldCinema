
export class MenuPage {
     
    visit() {
        cy.visit("/home");
        return this; 
    }

    getTitle() {
        return cy.get("h1").contains("Fantasy World Cinema").first();
    }

    getCinemas() {
        cy.get('input').click();

        return cy.get('.ant-select-dropdown')
            .find('.ant-select-item-option-content')
            .should('be.visible');
    }

    getMovie(name) {

        return cy.get(`img[alt="${name}"]`);
    }
}