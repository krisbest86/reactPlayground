import React from 'react';
import App from './App.jsx';
import {
    shallow
} from 'enzyme'
import {
    testIfRenders
} from './library/testUtils'
import moxios from 'moxios'
//variables
let wrapper;
beforeEach(() => {
    wrapper = shallow( < App / > );
    moxios.install()
})
afterEach(() => {
    moxios.uninstall()
})


//tests
test('check if renders', () => {
    testIfRenders( < App / > )
})

test('check if contains navbar', () => {

    expect(wrapper.find('NavBarMain').length).toBe(1)
})


test('navbarLeagueClicked setting should be set to false at the beginning', () => {
    const settings = wrapper.state('settings')
    expect(settings.navbarLeagueClicked).toBe(false);
})


test('test if app component tries to refresh user on componentDidMount', async () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'refreshUser');
    await instance.componentDidMount();
    expect(instance.refreshUser).toHaveBeenCalledTimes(1);
})

test('test if app component get from server an user and save to state on componentDidMount', async () => {
    const instance = wrapper.instance();
    const user = {
        email: "test@email.com"
    }


    moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
            status: 200,
            response: user
        })
    })

    instance.getToken = jest.fn(() => "token")
    await instance.componentDidMount();



    // console.log(instance)
    expect(instance.state.user).toEqual(user);

})


test('test if user is not refreshed  when token is not provided', async () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getUser');
    await instance.refreshUser();
    expect(instance.getUser).toHaveBeenCalledTimes(0);
})


test('test if user is  refreshed when token is  provided', async () => {
    const instance = wrapper.instance();
    instance.getToken = jest.fn(() => "token")
    instance.getUser = jest.fn(() => "getUser")
    jest.spyOn(instance, 'getUser');
    await instance.refreshUser();
    expect(instance.getUser).toHaveBeenCalledTimes(1);
}, 10000)