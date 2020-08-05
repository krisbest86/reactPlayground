import React from 'react';
import NavBarGeneric from './navBarGeneric.jsx'
import Enzyme, {shallow,mount} from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

import {testIfRenders, testProps} from '../../library/testUtils'
Enzyme.configure({adapter:new EnzymeAdapter()})

//props
const props={
    returnTabs:()=>{return []},
    checked:true,
    withButton:true
}
//methods
test('check if renders',()=>{testIfRenders(<NavBarGeneric />)})

test('does not throw error with expected props',()=>{
    testProps(NavBarGeneric,props);
})

describe('test navBarTabs component',()=>{
    test('check if navbar tabs are expanded when clicked',()=>{



        const wrapper=shallow(<NavBarGeneric {...props}/>)
       
        const navBarTabs=wrapper.find('NavBarTabs');
    
        expect(navBarTabs.hasClass('navbar__links--enabled')).toBe(true)
    
    })
    
    test('check if navbar tabs are not expanded when not clicked',()=>{
    
        props.checked=false;
    
        const wrapper=shallow(<NavBarGeneric {...props}/>)
       
        const navBarTabs=wrapper.find('NavBarTabs');
    
        expect(navBarTabs.hasClass('navbar__links')).toBe(true)
    
    })
    
})

