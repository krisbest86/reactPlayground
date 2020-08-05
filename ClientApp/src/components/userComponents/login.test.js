import {
    shallow
} from "enzyme";
import moxios from "moxios";
import React from "react";
import Login from "./login";

let wrapper;
const props = {
    location: "location"
}
const loginComponent = < Login {
    ...props
}
/>;
beforeEach(() => {
    wrapper = shallow(loginComponent);
    moxios.install();
});

afterEach(() => {
    moxios.uninstall();
});

test("check if renders", () => {
    // console.log(wrapper.debug());
});

test("check if page is reloaded when login successfull", async () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "reload");

    moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
            status: 200,
            response: "token"
        });
    });

    await instance.doSubmit();
    expect(instance.reload).toHaveBeenCalledTimes(1);
});

test("check if page is not reloaded when login failed", async () => {
    const instance = wrapper.instance();
    instance.props
    jest.spyOn(instance, "reload");

    moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
            status: 200,
            response: undefined
        });
    });

    await instance.doSubmit();
    expect(instance.reload).toHaveBeenCalledTimes(0);
});