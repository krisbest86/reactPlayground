import {
    actionTypes
} from "../actions";

export default (state = [], action) => {


    if (action.type === actionTypes.GET_AVAILABLE_LEAGUES) {
        return action.leagues

    }
    return state;
}