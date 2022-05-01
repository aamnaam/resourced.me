import React from 'react';
import Enzyme, { shallow } from 'enzyme';
/*
 * Have to use this unofficial adapter as no official one is available for React 17 yet.
 * See: https://stackoverflow.com/questions/64658031/which-enzyme-adapter-works-with-react-17
 */
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Section from '../components/Section';
import Resource from '../components/Resource'; // To test whether section contains this component

Enzyme.configure({ adapter: new Adapter() });

describe('Section unit test', () => {
    it('should render title in a <b /> tag', () => {
        // Create test component
        const testSection = {title:"Useful Resources", resources:[]};
        const wrapper = shallow(<Section key={testSection.title} sectionData={testSection} />);

        // Verify title is correct
        const bold = wrapper.find('b');
        expect(bold.text()).toEqual(testSection.title);
    });

    it('should not contain any Resource components if the resource list is empty', () => {
        // Create test component
        const testSection = {title:"Useful Resources", resources:[]};
        const wrapper = shallow(<Section key={testSection.title} sectionData={testSection} />);

        // Verify that there or no Resource components anywhere in the test component
        expect(wrapper.exists(Resource)).toBe(false);
    });

    it('should have a <div /> containing one Resource component for every resource passed in', () => {
        // Create test component
        const testSection = {title:"Useful Resources", resources:[
            {url:"https://google.com", description:"Most popular search website"},
            {url:"https://duckduckgo.com", description:"Privacy-concious search website"},
            {url:"https://bing.com", description:"Why"}
        ]};
        const wrapper = shallow(<Section key={testSection.title} sectionData={testSection} />);

        // Get resources from div (.children() is because root element is a div, and we don't want to include this)
        const resources = wrapper.children().find('div').find(Resource);

        // Correct length?
        expect(resources).toHaveLength(testSection.resources.length);
        
        // Grab all the keys, so we can check every resource is present
        const foundKeys = [];
        resources.forEach((node) => {
            foundKeys.push(node.key());
        });
        
        // Do we have one of each resource?
        for (let i = 0; i < testSection.resources.length; i++) {
            const expectedUrl = testSection.resources[i].url;
            expect(foundKeys.includes(expectedUrl)).toBe(true);
        }
    });
});