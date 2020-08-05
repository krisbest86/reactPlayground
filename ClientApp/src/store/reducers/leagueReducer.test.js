import leagueReducer from './leagueReducer'
import {actionTypes} from '../actions/index'


test('check if default currentLeague is equal to empty string',()=>{
    const newState=leagueReducer(undefined,{});
    expect(newState).toEqual({})
})



test('check if currentLeague is changed upon receiving action ChangeCurrentLeague',()=>{
    //as we want to test how it behaves for inital state we pass 'undefined' as state
    const currentLeague={name:"currentLeague"};
    const newState=leagueReducer(undefined,{type:actionTypes.CHANGE_CURRENT_LEAGUE,currentLeague:currentLeague});
    // const {currentLeague:currentLeagueStore}=newState;

    
    expect(newState).toBe(currentLeague)
})