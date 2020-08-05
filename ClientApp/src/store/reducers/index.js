//this file gets reducers that you want to have working with the store

import {
    combineReducers
} from 'redux'
import leagueReducer from './leagueReducer'
import leagueListReducer from './leaguesListReducer'
import languageReducer from './languageReducer'
import privateLeagueReducer from './privateLeagueReducer'

export default combineReducers({
    leagueReducer,
    leagueListReducer,
    languageReducer,
    privateLeagueReducer
})