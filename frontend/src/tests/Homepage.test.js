import React from "react";
import Router from "react-router-dom";
import { MemoryRouter } from "react-router"; // Need to wrap DisplayList in this because of its links

import Enzyme, { mount } from "enzyme";
import { act } from "react-dom/test-utils"; // Needed to test UseEffect as shallow does not mount.
import enableHooks from "jest-react-hooks-shallow";
// Have to use this unofficial adapter as no official one is available for React 17 yet.
// See: https://stackoverflow.com/questions/64658031/which-enzyme-adapter-works-with-react-17
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import Homepage from "../components/Homepage";
import SearchResult from "../components/SearchResult";

// To mock server functionality
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { UserContext } from "../App";

enableHooks(jest); // So we can use useEffect in shallow wrappers.
Enzyme.configure({ adapter: new Adapter() });

describe("Homepage unit test", () => {
	let user = {
		name: "testUser",
		email: "test@email.com",
		picture: "testPicture",
		accessToken: "token",
	};
	const setUser = (name, email, picture, accessToken) => {
		mockUser.name = name;
		mockUser.email = email;
		mockUser.picture = picture;
		mockUser.accessToken = accessToken;
	};
	const autoLogin = async () => {
		if (user.name) return;
		try {
			const res = await axios.post(
				"/api/auth/token",
				{},
				{ withCredentials: true }
			);
			if (!res.data.accessToken) return;
			const decodedToken = jwt_decode(res.data.accessToken);
			setUser({
				name: decodedToken.name,
				email: decodedToken.email,
				picture: decodedToken.picture,
				accessToken: res.data.accessToken,
			});
		} catch (err) {
			console.log(err);
		}
	};
	let mock;

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	test("API calls are correct", async () => {
		const testResponse = [];
		mock.onGet(`/api/list/latest`).reply(200, testResponse);
		mock.onGet(`/api/list/search`).reply(200, testResponse);

		// Doing it this way calls useEffect(). See: https://www.reactjunkie.com/test-react-use-effect-with-enzyme
		let wrapper;
		act(() => {
			wrapper = mount(
				<MemoryRouter>
					<UserContext.Provider value={{ user, setUser, autoLogin }}>
						<Homepage />
					</UserContext.Provider>
				</MemoryRouter>
			);
		});

		expect(mock.history.get[0].url).toEqual(`/api/list/latest`);

		await act(async () => {
			const universityWrapper = wrapper
				.find('div[className="search"]')
				.find("input")
				.at(0);
			universityWrapper.instance().value = "Test university";
			universityWrapper.simulate("change");

			const courseWrapper = wrapper
				.find('div[className="search"]')
				.find("input")
				.at(1);
			courseWrapper.instance().value = "Test course";
			courseWrapper.simulate("change");

			const moduleWrapper = wrapper
				.find('div[className="search"]')
				.find("input")
				.at(2);
			moduleWrapper.instance().value = "Test module";
			moduleWrapper.simulate("change");

			// wrapper.update();
		});

		await act(async () => {
			const searchButton = wrapper
				.find('div[className="search"]')
				.find("button");
			searchButton.simulate("click");
		});

		// console.log(mock.history.get[1]);

		expect(mock.history.get[1].url).toEqual(`/api/list/search`);

		expect(mock.history.get[1].params.university).toEqual(
			"Test university"
		);
		expect(mock.history.get[1].params.course).toEqual("Test course");
		expect(mock.history.get[1].params.module).toEqual("Test module");

		wrapper.unmount();
	});

	test("Populates search results according to response", async () => {
		const testLatestResults = [];
		const testSearchResults = [];
		for (let i = 0; i < 3; i++) {
			testSearchResults[i] = {
				_id: i,
				module: "test",
				university: "test",
				course: "test",
				description: "test",
			};
		}

		mock.onGet(`/api/list/latest`).reply(200, testLatestResults);
		mock.onGet(`/api/list/search`).reply(200, testSearchResults);

		let wrapper;
		act(() => {
			wrapper = mount(
				<MemoryRouter>
					<UserContext.Provider value={{ user, setUser, autoLogin }}>
						<Homepage />
					</UserContext.Provider>
				</MemoryRouter>
			);
		});

		await act(async () => {
			const searchButton = wrapper
				.find('div[className="search"]')
				.find("button");
			searchButton.simulate("click");
		});

		wrapper.update();

		const resultsWrapper = wrapper.find(SearchResult);
		expect(resultsWrapper).toHaveLength(3);

		const foundKeys = [];
		resultsWrapper.forEach((node) => {
			foundKeys.push(node.key());
		});

		for (let i = 0; i < 3; i++) {
			expect(foundKeys).toContain(i.toString());
		}

		wrapper.unmount();
	});
});
