import React from 'react';
import Enzyme, { shallow } from 'enzyme';
/*
 * Have to use this unofficial adapter as no official one is available for React 17 yet.
 * See: https://stackoverflow.com/questions/64658031/which-enzyme-adapter-works-with-react-17
 */
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Resource from '../components/Resource';

Enzyme.configure({ adapter: new Adapter() });

describe('Resource unit test', () => {
    it('should render description in a <p /> tag', () => {
        const testResource = {url:"https://google.com", description:"Search website"};
        const wrapper = shallow(<Resource key={testResource.url} resourceData={testResource} />);
        const paragraph = wrapper.find('p');
        expect(paragraph.text()).toEqual(testResource.description);
    });

    it('should render the resource url in an <a /> tag with href of same url', () => {
        const testResource = {url:"https://google.com", description:"Search website"};
        const wrapper = shallow(<Resource key={testResource.url} resourceData={testResource} />);
        const link = wrapper.find('a');
        expect(link.text()).toEqual(testResource.url);
        expect(link.prop('href')).toEqual(testResource.url);
    });
});