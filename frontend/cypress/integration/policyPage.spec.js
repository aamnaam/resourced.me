const privPolicyRoute = Cypress.env("privPolicyRoute");

describe("Renders the Privacy Policy Page", () => {
	beforeEach(() => {
		cy.visit(privPolicyRoute);
	});
	it("Renders the Privacy Policy Contents", () => {
		cy.findAllByText("Table of contents");
	});
	it("Allows return to home page", () => {
		cy.get("#return-home").click();
		cy.url().should("eq", Cypress.config().baseUrl);
	});
});
