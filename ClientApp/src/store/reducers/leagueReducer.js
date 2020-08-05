import {
    actionTypes
} from "../actions";

export default (state = {}, action) => {

    if (action.type === actionTypes.CHANGE_CURRENT_LEAGUE)
        return action.currentLeague

    return state;
}