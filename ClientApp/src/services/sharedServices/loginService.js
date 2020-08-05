import clientHttp from "./httpService";
import jwtDecode from "jwt-decode";

//setting jwt for httpService
if (clientHttp)
    clientHttp.setJwt(getJwt());

export async function login(user) {
    return await clientHttp.post(process.env.REACT_APP_ENTITY_SERVICE + '/users/auth', {
        password: user.pass,
        email: user.username
    })

}

export async function resetPass(email, pass) {
    return await clientHttp.post(process.env.REACT_APP_ENTITY_SERVICE + '/users/reset', {
        email: email,
        password: pass
    })

}

export function getJwt() {
    return sessionStorage.getItem("token");
}

export function logout() {
    sessionStorage.removeItem("token");

}

export function getCurrentToken() {
    const jwt = sessionStorage.getItem("token");
    if (jwt) {
        const user = jwtDecode(jwt);

        // console.log(user);
        return user;
    }

    return undefined;
}

export async function getCurrentUser(isRefresh) {

    const user = JSON.parse(sessionStorage.getItem("user"));



    if (!user || isRefresh) {
        // console.log(isRefresh);
        const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/users/me')

        if (!result || !result.data) return;
        sessionStorage.setItem("user", JSON.stringify(result.data));

        return result.data;
    }
    return user;
}