import { actionTypes } from "../actions";

export default (state="en",action)=>{

    if(action.type===actionTypes.SET_LANGUAGE)
        return action.language

    return state;
}