const homePageRoute = Cypress.env("homePageRoute");
const createListRoute = Cypress.env("createListRoute");
const uniFieldText = "Uni";
const moduleFieldText = "MERN";
const courseFieldText = "Course";
const descriptionFieldText = "Description";

describe("Renders the Create a List Page", () => {
	beforeEach(() => {
		cy.visit("/create");
	});
	it("Allows editing of fields", () => {
		cy.get("#university-box-create").type(uniFieldText);
		cy.get("#module-box-create").type(moduleFieldText);
		cy.get("#course-box-create").type(courseFieldText);
		cy.get("#description-box").type(descriptionFieldText);
	});
	it("Allows accepting Privacy Policy", () => {
		cy.get("#accept-policy-create").click();
	});
	it("Does not allows submit without accepting policy", () => {
		cy.location("pathname").should("eq", createListRoute);
	});
	it("Allows return to home page", () => {
		cy.get("#return-home").click();
		cy.url().should("eq", Cypress.config().baseUrl);
	});
});
