describe('Login Flow - Fantasy World Cinema', () => {

    beforeEach(() => {
        // 1. Visit the homepage base URL
        cy.visit('/');

        // 2. Click the button that triggers the modal using our Case-Insensitive RegEx
        cy.contains('button', /login|sign in/i)
            .first()
            .click();

        // 3. Validate that the Ant Design Modal opened successfully by checking its title
        cy.contains('.auth-title', 'HELLO!', { timeout: 10000})
            .should('be.visible');
    });

    it('should successfully log in with valid credentials', () => {
        // Correctly extracting your environment variables inside the 'it' block
        const identifier = Cypress.env('loginIdentifier');
        const password = Cypress.env('loginPassword');

        // Ant Design generates the element ID based on the 'name' property of your Form.Item
        cy.get('#identifier')
            .should('be.visible')
            .type(identifier);

        cy.get('#password')
            .type(password);

        // Target the native submit button containing your dynamic inner text
        cy.get('button[type="submit"]')
            .contains('LogIn')
            .click();

        // Confirm the modal closed successfully (the 'HELLO!' title should disappear from the DOM)
        cy.contains('Welcome back!', { timeout: 10000})
            .should('be.visible');

        cy.contains('.auth-title', 'HELLO!')
            .should('not.be.visible');

        cy.get('.anticon-user')
            .should('be.visible');
    });

    it('should display an error alert with invalid credentials', () => {
        cy.get('#identifier').type('wrong-user@test.com');
        cy.get('#password').type('wrong-password-123');

        cy.get('button[type="submit"]')
            .contains('LogIn')
            .click();

        // Verify Ant Design's global floating error message popup
        cy.contains('Invalid Username or Password')
            .should('be.visible');
    });

    it('should enforce field validation requirements when submitted empty', () => {
        cy.get('button[type="submit"]')
            .contains('LogIn')
            .click();

        // Ant Design injects validation messages inside the '.ant-form-item-explain-error' CSS class
        cy.get('.ant-form-item-explain-error')
            .should('have.length', 2) // Exactly two error messages should pop up on the screen
            .and('contain', 'Please input your username!')
            .and('contain', 'Please input your password!');
    });

    it('should close the modal when clicking the close button or the backdrop mask', () => {
        // Option A: Click the native Ant Design close "X" button
        cy.get('.ant-modal-close')
            .click();

        cy.contains('.auth-title', 'HELLO!')
            .should('not.be.visible');

        // Option B: Re-open it and click the background mask to close
        cy.contains('button', /login|sign in/i)
            .first()
            .click();

        cy.get('.ant-modal-wrap')
            .click('topLeft');

        cy.contains('.auth-title', 'HELLO!')
            .should('not.be.visible');
    });
});
