import React from 'react';
import { MemoryRouter } from 'react-router'; // Need to wrap DisplayList in this because of its links

import Enzyme, { mount } from 'enzyme';
import { act } from "react-dom/test-utils"; // Needed to test UseEffect as shallow does not mount.
import enableHooks from 'jest-react-hooks-shallow';
// Have to use this unofficial adapter as no official one is available for React 17 yet.
// See: https://stackoverflow.com/questions/64658031/which-enzyme-adapter-works-with-react-17
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Homepage from '../components/Homepage';
import SearchResult from '../components/SearchResult';

// To mock server functionality
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { UserContext } from "../App";

enableHooks(jest); // So we can use useEffect in shallow wrappers.
Enzyme.configure({ adapter: new Adapter() });

describe('Homepage integration test', () => {
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

    test('SearchResult internals render correctly according to Homepage search', async () => {

        const testLatestResults = [];
        const testSearchResults = [];
        for (let i = 0; i < 5; i++) {
            testSearchResults[i] = {
                _id: i,
                module: "module " + i,
                university: "university " + i,
                course: "course " + i,
                description: "description " + i
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

            const searchButton = wrapper.find('div[className="search"]').find('button');
            searchButton.simulate('click');
        
        });

        wrapper.update();

        const resultsWrapper = wrapper.find(SearchResult);
        resultsWrapper.forEach((node) => {
            const id = node.key();
            const text = node.find('p[className="resourceListResultText"]').text();
            expect(text).toMatch(new RegExp("module " + id));
            expect(text).toMatch(new RegExp("university " + id));
            expect(text).toMatch(new RegExp("course " + id));
            expect(text).toMatch(new RegExp("description " + id));
        });

        wrapper.unmount();

    });

});