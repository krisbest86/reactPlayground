import clientHttp from "./sharedServices/httpService";
import {
    getFromLocalStorage
} from "./sharedServices/getDataService";


export async function getPlayers(team, leagueSettingsId) {

    const key = "players" + leagueSettingsId;
    const players = await getFromLocalStorage(key, async () => {

        console.log("downloading")
        const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/players/clientData');
        localStorage.setItem(key, JSON.stringify(result.data));

        return result.data;
    });

    return players.filter(a => a.team === team)

}

export async function getOrigin(originId) {

    const key = "origin" + originId;
    const origin = await getFromLocalStorage(key, async () => {

        const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/origin/' + originId);
        localStorage.setItem(key, JSON.stringify(result.data));

        return result.data;
    });

    return origin

}