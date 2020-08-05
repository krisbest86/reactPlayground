// import {
//     serviceEndPoint
// } from '../config.json'
import clientHttp from "./httpService";

export async function register(user) {
    const response = await clientHttp.post(process.env.REACT_APP_ENTITY_SERVICE + '/users', {
        email: user.email,
        password: user.pass
    })

    return response;
}