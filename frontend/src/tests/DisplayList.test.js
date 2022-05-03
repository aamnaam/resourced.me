import React from 'react';
import Router from "react-router-dom";
import { MemoryRouter } from 'react-router'; // Need to wrap DisplayList in this because of its links

import Enzyme, { shallow, mount } from 'enzyme';
import { act } from "react-dom/test-utils"; // Needed to test UseEffect as shallow does not mount.
import { waitFor } from "@testing-library/react";
import enableHooks from 'jest-react-hooks-shallow';
// Have to use this unofficial adapter as no official one is available for React 17 yet.
// See: https://stackoverflow.com/questions/64658031/which-enzyme-adapter-works-with-react-17
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import DisplayList from '../components/DisplayList';
import Section from '../components/Section';
import { UserContext } from "../App";
// To mock server functionality
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

enableHooks(jest); // So we can use useEffect in shallow wrappers.
Enzyme.configure({ adapter: new Adapter() });

// Required to mock useParams. See: https://stackoverflow.com/questions/58883556/mocking-react-router-dom-hooks-using-jest-is-not-working
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn()
}));

describe('DisplayList unit test', () => {
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

    test('module, university and course display correctly', async () => {
        const testList = {
            author: 1,
            module: "LI Team Project",
            university: "University of Birmingham",
            course: "Computer Science BSc",
            description: "Test resource list",
            sections: []
        };
        const testUser = {
            _id: 1,
            name: "testUser",
            email: null,
            picture: null,
            lists: []
        }

        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        mock.onGet("/api/list/find/1234").reply(200, testList);
        mock.onGet("/api/users/1").reply(200, testUser);


        // Doing it this way calls useEffect(). See: https://www.reactjunkie.com/test-react-use-effect-with-enzyme
        let wrapper;
        act(() => {
            wrapper = mount(
                <MemoryRouter>
                    <UserContext.Provider value={{ user, setUser, autoLogin }}>
						<DisplayList />
                    </UserContext.Provider>
                </MemoryRouter>
            );
        });

        // Need to wait for components to update. See: https://dev.to/il3ven/fix-warning-in-react-update-was-not-wrapped-in-act-bk6
        await waitFor(() => {
            const authorWrapper = wrapper.find({ className: "displayList" }).childAt(1);
            const moduleWrapper = wrapper.find({ className: "displayList" }).childAt(2);
            const universityWrapper = wrapper.find({ className: "displayList" }).childAt(3);
            const courseWrapper = wrapper.find({ className: "displayList" }).childAt(4);
            const descriptionWrapper = wrapper.find({ className: "displayList" }).childAt(5);

            expect(authorWrapper.text()).toMatch(new RegExp(testUser.name));
            expect(moduleWrapper.text()).toMatch(new RegExp(testList.module));
            expect(universityWrapper.text()).toMatch(new RegExp(testList.university));
            expect(courseWrapper.text()).toMatch(new RegExp(testList.course));
            expect(descriptionWrapper.text()).toMatch(new RegExp(testList.description));
        });

        wrapper.unmount();
    });

    test('Populates with sections', async () => {
        const testList = {
            author: 1,
            module: "Population Module",
            university: "University of Sections",
            course: "Section Testing Studies BSc",
            description: "Section Test List",
            sections: [
                {
                    title: "Test Section 1",
                    resources: []
                },
                {
                    title: "Hello World",
                    resources: []
                }
            ]
        };
        const testUser = {
            _id: 1,
            name: "testUser",
            email: null,
            picture: null,
            lists: []
        }

        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        mock.onGet("/api/list/find/1234").reply(200, testList);
        mock.onGet("/api/users/1").reply(200, testUser);

        // Doing it this way calls useEffect(). See: https://www.reactjunkie.com/test-react-use-effect-with-enzyme
        let wrapper;
        act(() => {
            wrapper = mount(
                <MemoryRouter>
                    <UserContext.Provider value={{ user, setUser, autoLogin }}>
						<DisplayList />
                    </UserContext.Provider>
                </MemoryRouter>
            );
        });

        // Need to wait for components to update. See: https://dev.to/il3ven/fix-warning-in-react-update-was-not-wrapped-in-act-bk6
        await waitFor(() => {
            wrapper.update(); // Must do this because render tree has changed, so that find(Section) can find the new components.
            const sections = wrapper.find({ className: "displayList" }).find(Section);
            expect(sections).toHaveLength(testList.sections.length);

            // Grab all the keys, so we can check every section is present
            const foundKeys = [];
            sections.forEach((node) => {
                foundKeys.push(node.key());
            });

            for (let i = 0; i < testList.sections.length; i++) {
                const expectedTitle = testList.sections[i].title;
                expect(foundKeys.includes(expectedTitle)).toBe(true);
            }
        });

        //wrapper.unmount();
    });

});