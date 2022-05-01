const createListRoute = Cypress.env("createListRoute");
const privPolicyRoute = Cypress.env("privPolicyRoute");
const testListId = Cypress.env("testListId");
const testListSection = Cypress.env("testListSection");

describe("Renders a List's unique page", () => {
	beforeEach(() => {
		cy.visit(`/list/${testListId}`);
	});
	it("Renders all fields", () => {
		cy.get("#module").should("exist");
		cy.get("#university").should("exist");
		cy.get("#course").should("exist");
        cy.get("#description").should("exist");
        cy.findAllByText(testListSection).should("exist");
	});
	it("Allows redirect to Create List Page", () => {
		cy.get("#to-create-list").click();
		cy.location("pathname").should("eq", createListRoute);
	});
	it("Allows redirect to Home Page", () => {
		cy.get("#to-home").click();
		cy.url().should("eq", Cypress.config().baseUrl);
    });
    it("Allows access to Privacy Policy Page", () => {
        cy.get(".privPolLink").click();
		cy.location("pathname").should("eq", privPolicyRoute);
    })
});
