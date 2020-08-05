import {
    shallow
} from "enzyme"
import RankingComponent from "./ranking"
import React from 'react'
import {
    testStore
} from "../library/testUtils"
import {
    setCurrentLeague
} from "../store/actions"

let league = {
    name: "currentLeague"
}
let store = testStore();

//tests
test('check if renders', () => {
            const wrapper = shallow( < RankingComponent store = {
                    store
                }
                />)  
                // console.log(wrapper.debug()) 
            })

        test('check if headline does not render if no league', () => {
                const wrapper = shallow( < RankingComponent store = {
                        store
                    }
                    />)

                    const headline = wrapper.dive().find('h2')

                    expect(headline.length).toBe(0)
                })

            test('check if headline include league name if league defined', () => {

                    store.dispatch(setCurrentLeague(league))
                    const wrapper = shallow( < RankingComponent store = {
                            store
                        }
                        />)


                        const headline = wrapper.dive().find('h2')
                        const rgx = new RegExp(`${league.name}`)
                        const result = rgx.test(headline.text());

                        // console.log(headline.text())

                        expect(result).toBe(true)

                    })