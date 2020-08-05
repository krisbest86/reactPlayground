import {isObjectEmpty} from './utils'


test('isObjectEmpty returns true when object empty',()=>{

    const result=isObjectEmpty({})

    expect(result).toBeTruthy()

});

test('isObjectEmpty returns false when object not empty',()=>{

    const result=isObjectEmpty({notempty:true})

    expect(result).toBeFalsy()

});