import {
    actionTypes
} from "../actions";

export default (state = {}, action) => {

    if (action.type === actionTypes.CHANGE_CURRENT_PRIVATE_LEAGUE)
        return action.currentPrivateLeague

    return state;
}