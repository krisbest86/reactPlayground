import clientHttp from "./httpService";


export async function getDataLocalStorage(key, query, isNotString) {

    if (localStorage.hasOwnProperty(key))
        return isNotString ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key);


    const {
        data
    } = await clientHttp.get(query)

    // console.log(data)

    localStorage.setItem(key, isNotString ? JSON.stringify(data) : data);
    return data;
}


export function getFromSessionStorage(key, query) {
    if (sessionStorage.hasOwnProperty(key))
        return JSON.parse(sessionStorage.getItem(key));


    return query(key);
}

export function getFromLocalStorage(key, query) {
    if (localStorage.hasOwnProperty(key))
        return JSON.parse(localStorage.getItem(key));


    return query(key);
}