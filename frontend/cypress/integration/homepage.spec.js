const privPolicyRoute = Cypress.env("privPolicyRoute");
const createListRoute = Cypress.env("createListRoute");
const uniSearchQuery = "Uni";
const moduleSearchQuery = "MERN";
const expectedSearchResultModule = "MERN Stack";

describe("Renders the home page", () => {
	beforeEach(() => {
		cy.visit("/");
	});
	it("Renders correctly", () => {
		cy.get("#home-div").should("exist");
    });
    it("Renders latest lists by default", () => {
        cy.get(".resourceListResult").should("exist");
    })
	it("Allows search to be used", () => {
		cy.get("#university-box").type(uniSearchQuery);
		cy.get("#module-box").type(moduleSearchQuery);
		cy.get("#search-btn").click();
		cy.findAllByText("MERN stack").should("exist");
	});
	it("Allows allows access to PrivacyPolicy", () => {
		cy.get(".privPolLink").click();
		cy.location("pathname").should("eq", privPolicyRoute);
	});
	it("Allows clicking of Create a List", () => {
		cy.get("#link-to-create").click();
		cy.location("pathname").should("eq", createListRoute);
	});
});
