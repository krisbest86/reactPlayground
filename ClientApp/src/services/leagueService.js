import clientHttp from "./sharedServices/httpService";
import {
    getFromLocalStorage
} from "./sharedServices/getClientDataService";

export async function getLeague(id) {

    if (!id)
        return;


    const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/leagues/' + id);
    return result.data;
}


export async function getLeagues(filter) {

    const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/leagues/userleagues');
    return result.data;
}

export async function getPrivateLeagues(id) {

    if (!id)
        return;

    const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/leagues/userprivateleagues/' + id);
    return result.data;
}

export async function getPrivateLeagueByCode(code) {

    if (!code)
        return;

    const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/leagues/privateLeague/' + code);
    return result.data[0];
}

export async function saveUserLeagues(data) {

    return await clientHttp.post(process.env.REACT_APP_ENTITY_SERVICE + '/leagues/userleagues', data);
}

export async function saveLeague(data) {

    return await clientHttp.post(process.env.REACT_APP_ENTITY_SERVICE + '/leagues', data);
}


export async function getTransferList(leagueSettings, team, position) {
    const key = "players" + leagueSettings._id;
    const players = await getFromLocalStorage(key, async () => {

        console.log("downloading")
        const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/players/clientData');
        localStorage.setItem(key, JSON.stringify(result.data));

        return result.data;
    });

    // console.log("from local storage" + position)
    // console.log("from local storage" + players.length)

    if (position)
        return players.filter((element) => {
            // console.log(element)
            return (element.position === position && (team.Value + element.price) <= leagueSettings.budget && !isExistInTeam(element, team.squad) &&
                !isMaxPlayersFromOneTeam(element, team.squad, leagueSettings.maxPlayersFromTeam))
        })

    return players
}



function isExistInTeam(player, team) {

    for (const formation of team) {
        for (const p of formation) {
            if (p._id === player._id)
                return true;
        }
    }


    return false
}


function isMaxPlayersFromOneTeam(player, team, max) {

    let counter = 0;
    for (const formation of team) {
        for (const p of formation) {
            if (p.team === player.team)
                if (++counter === max)
                    return true;
        }
    }


    return false
}



export async function getCurrentRanking(leagueId) {


    try {
        const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/ranking/' + leagueId);
        return result.data;
    } catch (error) {
        return null
    }
}

export async function getSchedule(leagueSettings) {

    try {
        const result = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/fixtures/data/' + leagueSettings._id);
        const sorted = result.data.sort((a, b) => new Date(a.from) - new Date(b.from));
        // console.log(sorted)
        return sorted;
    } catch (error) {
        return null
    }


}