import {
    setCurrentLeague,
    actionTypes
} from './index.js'

describe('league actions', () => {

    test('check if there is an action called change current league', () => {
        const action = setCurrentLeague();
        expect(action).toEqual({
            type: actionTypes.CHANGE_CURRENT_LEAGUE
        })
    })
})