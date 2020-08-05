import clientHttp from "./sharedServices/httpService";
import {
    getFromSessionStorage
} from "./sharedServices/getClientDataService";


export async function saveTeam(team) {

    console.log("savin")
    return await clientHttp.post(process.env.REACT_APP_ENTITY_SERVICE + '/userteams', team);
}

export async function updateTeam(team) {

    console.log(team)

    return await clientHttp.put(process.env.REACT_APP_ENTITY_SERVICE + '/userteams', team);
}

export async function getTeamById(id) {
    return await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/userteams/' + id);
}

export async function getTeam(leagueSettings) {

    var id = leagueSettings._id || leagueSettings.parentLeague;
    var key = "team" + id;

    return await getFromSessionStorage(key, async (key) => {

        let {
            data: team
        } = await clientHttp.get(process.env.REACT_APP_ENTITY_SERVICE + '/userteams/league/' + id)

        // console.log(team)
        if (!team.league) {

            team = {
                Empty: true,
                Value: 0
            }
            team.squad = leagueSettings && getEmptySquad(leagueSettings);
            team.league = id;
        }

        sessionStorage.setItem(key, JSON.stringify(team));
        return team;


    })



}

function getEmptySquad(leagueSettings) {
    let index = 0;
    let positionIndex = 0;
    const team = [];
    const key = "draftTeam" + leagueSettings._id;

    console.log("getEmptySquad")
    return getFromSessionStorage(key, () => {

        for (const formation of leagueSettings.availableFormations[0]) {
            if (formation === "-") continue;
            team.push(createFormation(formation, leagueSettings, index, positionIndex++));
            index = index + parseInt(formation);
        }

        positionIndex = 0;
        let subs = [];
        for (const formation of leagueSettings.availableSubstitutions[0]) {
            if (formation === "-") continue;

            for (const sub of createFormation(formation, leagueSettings, index, positionIndex++)) {
                subs.push(sub);
            }
            index = index + parseInt(formation);
        }
        team.push(subs);
        return team;
    })
};


function createFormation(formation, leagueSettings, index, positionIndex) {

    let newFormation = [];
    for (let i = 0; i < parseInt(formation); i++) {
        newFormation.push({
            No: ++index,
            position: leagueSettings.origin.positionTypesValues[positionIndex]
        });
    }
    return newFormation;
}