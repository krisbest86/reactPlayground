import React from 'react';
import Row from './updateRow'
import {
    shallow
} from 'enzyme'
import {
    testIfRenders
} from '../../library/testUtils'

const props={
    columnsDefinition:{name:{key:'name',title:'nazwa'}},
    row:{_id:"123",name:"name"},
    updateRow:()=>{}
}

//tests
test('check if renders', () => {
    testIfRenders( < Row  {...props}/> )
})


test('check if id is passed when update is triggered',()=>{

//arrange
    const mockCallBack = jest.fn();
    const wrapper=shallow(< Row  {...props} updateRow={mockCallBack}/> )
    wrapper.setState({isUpdated:true})
    const updateButton=wrapper.find('.fa-refresh')
//  console.log(refreshButton.debug())

//test
    updateButton.simulate('click')
    expect(mockCallBack.mock.calls[0][0]._id).toBe(props.row._id)
})