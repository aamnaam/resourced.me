import React from 'react';
import Enzyme, { shallow } from 'enzyme';
/*
 * Have to use this unofficial adapter as no official one is available for React 17 yet.
 * See: https://stackoverflow.com/questions/64658031/which-enzyme-adapter-works-with-react-17
 */
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import SearchResult from '../components/SearchResult';

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: jest.fn(),
}));

describe('SearchResult unit test', () => {

    test('renders module, university, course and description inside the same <p> tag', () => {
        const testResource = {
            university: "Test university",
            module: "Test module",
            course: "Test course",
            description: "Test description",
            _id: 1234
        };
        const wrapper = shallow(<SearchResult result={testResource} />);
        const paragraph = wrapper.find('p[className="resourceListResultText"]');
        const text = paragraph.text();
        expect(text).toMatch(new RegExp(testResource.university));
        expect(text).toMatch(new RegExp(testResource.module));
        expect(text).toMatch(new RegExp(testResource.course));
        expect(text).toMatch(new RegExp(testResource.description));
    });
});