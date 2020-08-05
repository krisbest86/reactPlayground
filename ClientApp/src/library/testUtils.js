import Enzyme, {
    shallow
} from 'enzyme'
import {
    checkPropTypes
} from 'prop-types';
import {
    createStore
} from 'redux'
import rootReducer from '../store/reducers'



export const testIfRenders = (component) => {
    shallow(component)
}

export const testProps = (component, expectedProps) => {
    let propsError = checkPropTypes(component.propTypes, expectedProps, 'prop', component.name)
    // expect(propsError).toEqual({});
    expect(propsError).toEqual(undefined);
}

export const testStore = (initialState) => {
    return createStore(rootReducer, initialState);
}