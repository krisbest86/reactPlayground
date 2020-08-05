import {
    shallow
} from "enzyme";
import NavBarLeague from "./navBarLeague";
import React from "react";
import {
    testStore
} from "../../library/testUtils";
import {
    setLeagues,
    setCurrentLeague
} from "../../store/actions";

let store, wrapper;
let leaguesList = [{
    name: "1 liga"
}, {
    name: "2 liga"
}];
beforeEach(() => {
            store = testStore({});

            wrapper = shallow( < NavBarLeague store = {
                    store
                }
                />);
            });

        test("check if renders", () => {
            console.log(wrapper.debug());
        });

        test("pass one of the league name as navtitle if leagues defined", () => {
            store.dispatch(setLeagues(leaguesList, store));

            const navbar = wrapper.dive();

            // console.log(navbar.prop("navTitle"))
            const result = leaguesList.filter(a => a.name === navbar.prop("navTitle"));
            // console.log(result)
            expect(result.length).toEqual(1);
        });

        test("pass leagues as options if leagues defined", () => {
            store.dispatch(setLeagues(leaguesList, store));

            const navbar = wrapper.dive();

            //  console.log(navbar.prop("options"))

            expect(navbar.prop("options")).toEqual(leaguesList.map(a => {
                return a.name;
            }));
        });

        test('check if changing league in dropdown updates state', () => {
            //set
            const league = leaguesList[1];
            store.dispatch(setLeagues(leaguesList, store));

            const instance = wrapper.dive().instance();
            console.log(wrapper.dive())
            console.log(instance)
            jest.spyOn(instance, "dispatchCurrentLeague");

            //run

            instance.changeCurrentLeague("dropDownName", league.name)
            //assert
            expect(instance.dispatchCurrentLeague).toBeCalledWith(league);
        })