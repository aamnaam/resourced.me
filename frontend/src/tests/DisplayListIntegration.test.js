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
import Resource from '../components/Resource';
import { UserContext } from "../App";
// To mock server functionality
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

enableHooks(jest); // So we can use useEffect in shallow wrappers.
Enzyme.configure({ adapter: new Adapter() });

// Required to mock useParams. See: https://stackoverflow.com/questions/58883556/mocking-react-router-dom-hooks-using-jest-is-not-working
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useNavigate: jest.fn()
}));

describe('DisplayList, Resource and Section integration test', () => {
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

    test('Nested Resource and Section components in DisplayList reflect input list', async () => {
        const testList = {
            author: "1",
            module: "Integration Module",
            university: "University of Tests",
            course: "Integration Testing MSc",
            description: "A list designed to test integration of Resource, Section and DisplayList components",
            sections: [
                {
                    title: "Test Section 1",
                    resources: [
                        {
                            url: "https://example.com",
                            description: "Test resource 1"
                        },
                        {
                            url: "https://google.com",
                            description: "Test resource 2"
                        }
                    ]
                },
                {
                    title: "Test section 2",
                    resources: []
                },
                {
                    title: "Test section 3",
                    resources: [
                        {
                            url: "http://hasthelargehadroncolliderdestroyedtheworldyet.com/",
                            description: "A lone resource"
                        }
                    ]
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

            // Correct number of sections
            expect(sections).toHaveLength(testList.sections.length);

            // Section 1
            // Title
            expect(sections.at(0).find('b').first().text()).toEqual(testList.sections[0].title);
            // Correct number of resources
            expect(sections.at(0).find(Resource)).toHaveLength(2);
            // Resource 1
            expect(sections.at(0).find(Resource).at(0).find('a').text())
                .toEqual(testList.sections[0].resources[0].url);
            expect(sections.at(0).find(Resource).at(0).find('p').text())
                .toEqual(testList.sections[0].resources[0].description);
            // Resource 2
            expect(sections.at(0).find(Resource).at(1).find('a').text())
                .toEqual(testList.sections[0].resources[1].url);
            expect(sections.at(0).find(Resource).at(1).find('p').text())
                .toEqual(testList.sections[0].resources[1].description);

            // Section 2
            // Title
            expect(sections.at(1).find('b').first().text()).toEqual(testList.sections[1].title);
            // Correct number of resources
            expect(sections.at(1).find(Resource)).toHaveLength(0);

            // Section 3
            // Title
            expect(sections.at(2).find('b').first().text()).toEqual(testList.sections[2].title);
            // Correct number of resources
            expect(sections.at(2).find(Resource)).toHaveLength(1);
            // Resource 1
            expect(sections.at(2).find(Resource).at(0).find('a').text())
                .toEqual(testList.sections[2].resources[0].url);
            expect(sections.at(2).find(Resource).at(0).find('p').text())
                .toEqual(testList.sections[2].resources[0].description);
        });

        wrapper.unmount();
    });

});