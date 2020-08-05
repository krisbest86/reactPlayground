import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({
    adapter:new EnzymeAdapter(),
    //disable componentDidMount and other lifecycle methods when mounting a component
    // disableLifecycleMethods:true
})
