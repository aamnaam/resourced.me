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

import CreateList from '../components/CreateList';
import { Button, Form } from "react-bootstrap";
import { UserContext } from "../App";

// To mock server functionality
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

enableHooks(jest); // So we can use useEffect in shallow wrappers.
Enzyme.configure({ adapter: new Adapter() });

describe('CreateList unit test', () => {
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

    test('submit is only clickable if privacy policy is accepted', async () => {

        // Doing it this way calls useEffect(). See: https://www.reactjunkie.com/test-react-use-effect-with-enzyme
        let wrapper;
        act(() => {
            wrapper = mount(
                <MemoryRouter>
                    <UserContext.Provider value={{ user, setUser, autoLogin }}>
						<CreateList />
                    </UserContext.Provider>
                </MemoryRouter>
            );
        });

        // Button is unclickable at first
        let submitWrapper = wrapper.find('div[className="submitBtn"]').find(Button);
        expect(submitWrapper.prop('disabled')).toEqual(true);

        // Accept privacy policy
        // Useful info about using enzyme to test Form: https://www.mydatahack.com/unit-testing-react-form-with-jest-and-enzyme/
        const checkboxWrapper = wrapper.find(Form).find('input').last();
        checkboxWrapper.instance().checked = true;
        checkboxWrapper.simulate('change');

        // Button is now clickable
        submitWrapper = wrapper.find('div[className="submitBtn"]').find(Button);
        expect(submitWrapper.prop('disabled')).toEqual(false);

        wrapper.unmount();
    });

    test('filling in fields and hitting submit gives correct API call', async () => {

        const testList = {
            _id: "test_id",
            module: "Test Module",
            university: "Test University",
            course: "Test Course",
            description: "Test Description",
            sections: [
                {
                    title: "Test Section 1",
                    resources: [
                        {
                            url: "https://test.com",
                            description: "Test Description"
                        }
                    ]
                }
            ]
        };

        mock.onPost(`/api/list/create`).reply(200, "testList");
        
        // Doing it this way calls useEffect(). See: https://www.reactjunkie.com/test-react-use-effect-with-enzyme
        let wrapper;
        act(() => {
            wrapper = mount(
                <MemoryRouter>
                    <UserContext.Provider value={{ user, setUser, autoLogin }}>
						<CreateList />
                    </UserContext.Provider>
                </MemoryRouter>
            );
        });

        const moduleWrapper = wrapper.find(Form).find('input').at(0);
        moduleWrapper.instance().value = testList.module;
        moduleWrapper.simulate('change');

        const universityWrapper = wrapper.find(Form).find('input').at(1);
        universityWrapper.instance().value = testList.university;
        universityWrapper.simulate('change');

        const courseWrapper = wrapper.find(Form).find('input').at(2);
        courseWrapper.instance().value = testList.course;
        courseWrapper.simulate('change');

        const descriptionWrapper = wrapper.find(Form).find('textarea');
        descriptionWrapper.instance().value = testList.description;
        descriptionWrapper.simulate('change');

        const sectionTitleWrapper = wrapper.find(Form).find('input').at(3);
        sectionTitleWrapper.instance().value = testList.sections[0].title;
        sectionTitleWrapper.simulate('change');

        const resourceUrlWrapper = wrapper.find(Form).find('input').at(4);
        resourceUrlWrapper.instance().value = testList.sections[0].resources[0].url;
        resourceUrlWrapper.simulate('change');

        const resourceDescriptionWrapper = wrapper.find(Form).find('input').at(5);
        resourceDescriptionWrapper.instance().value = testList.sections[0].resources[0].description;
        resourceDescriptionWrapper.simulate('change');

        // Accept privacy policy (this is required to submit)
        const checkboxWrapper = wrapper.find(Form).find('input').last();
        checkboxWrapper.instance().checked = true;
        checkboxWrapper.simulate('change');

        window.open = jest.fn();

        const submitWrapper = wrapper.find('div[className="submitBtn"]').find('button');
        submitWrapper.simulate('click');

        expect(mock.history.post[0].url).toEqual(`/api/list/create`);
        const sentData = JSON.parse(mock.history.post[0].data);

        expect(sentData.module).toEqual(testList.module);
        expect(sentData.university).toEqual(testList.university);
        expect(sentData.course).toEqual(testList.course);
        expect(sentData.description).toEqual(testList.description);
        expect(sentData.sections[0].title).toEqual(testList.sections[0].title);
        expect(sentData.sections[0].resources[0].url).toEqual(testList.sections[0].resources[0].url);
        expect(sentData.sections[0].resources[0].description).toEqual(testList.sections[0].resources[0].description);

        wrapper.unmount();
    });

    test('adding and removing sections works', async () => {
        // Doing it this way calls useEffect(). See: https://www.reactjunkie.com/test-react-use-effect-with-enzyme
        let wrapper;
        act(() => {
            wrapper = mount(
                <MemoryRouter>
                    <UserContext.Provider value={{ user, setUser, autoLogin }}>
						<CreateList />
                    </UserContext.Provider>
                </MemoryRouter>
            );
        });

        // Count sections
        let sections = wrapper.find('div[className="sectionWithButton"]');
        const initialNoOfSections = sections.length;

        // Add section
        let addButton = wrapper.find('div[className="addSection"]').find('button');
        addButton.simulate('click');
        wrapper.update();

        // Count sections
        sections = wrapper.find('div[className="sectionWithButton"]');
        expect(sections).toHaveLength(initialNoOfSections + 1);

        // Remove section
        let removeButton = wrapper.find('div[className="removeSection"]').find('button');
        removeButton.simulate('click');
        wrapper.update();

        // Count sections
        sections = wrapper.find('div[className="sectionWithButton"]');
        expect(sections).toHaveLength(initialNoOfSections);

        wrapper.unmount();
    });

    test('adding and removing resources works', async () => {
        // Doing it this way calls useEffect(). See: https://www.reactjunkie.com/test-react-use-effect-with-enzyme
        let wrapper;
        act(() => {
            wrapper = mount(
                <MemoryRouter>
                    <UserContext.Provider value={{ user, setUser, autoLogin }}>
						<CreateList />
                    </UserContext.Provider>
                </MemoryRouter>
            );
        });

        // Count resources
        let resources = wrapper.find('div[className="resourceBreak"]');
        const initialNoOfResources = resources.length;

        // Add resource
        let addButton = wrapper.find('div[className="addResource"]').find('button');
        addButton.simulate('click');
        wrapper.update();

        // Count resources
        resources = wrapper.find('div[className="resourceBreak"]');
        expect(resources).toHaveLength(initialNoOfResources + 1);

        // Remove section
        let removeButton = wrapper.find('div[className="removeResource"]').find('button');
        removeButton.simulate('click');
        wrapper.update();

        // Count resources
        resources = wrapper.find('div[className="resourceBreak"]');
        expect(resources).toHaveLength(initialNoOfResources);

        wrapper.unmount();
    });
});