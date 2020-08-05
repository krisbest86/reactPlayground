export const actionTypes = {
    CHANGE_CURRENT_LEAGUE: "CHANGE_CURRENT_LEAGUE",
    GET_AVAILABLE_LEAGUES: "GET_AVAILABLE_LEAGUES",
    SET_LANGUAGE: "SET_LANGUAGE",
    CHANGE_CURRENT_PRIVATE_LEAGUE: "CHANGE_CURRENT_PRIVATE_LEAGUE"
};

export function setCurrentLeague(league) {

    return {
        type: actionTypes.CHANGE_CURRENT_LEAGUE,
        currentLeague: league
    };
}

export function setCurrentPrivateLeague(league) {

    return {
        type: actionTypes.CHANGE_CURRENT_PRIVATE_LEAGUE,
        currentPrivateLeague: league
    };
}

export function setLanguage(language) {
    // console.log("setlanguage")
    return {
        type: actionTypes.SET_LANGUAGE,
        language: language
    };
}


export function setLeagues(leagues, store) {
    // console.log(leagues);

    if (leagues && leagues.length > 0) store.dispatch(setCurrentLeague(leagues[0]));


    return {
        type: actionTypes.GET_AVAILABLE_LEAGUES,
        leagues: leagues
    };
}