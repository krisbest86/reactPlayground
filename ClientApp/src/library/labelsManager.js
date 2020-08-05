import en from '../resources/languages/english'
import pl from '../resources/languages/polish'
import store from "../store/configureStore";

export default function(key){
    const globalState=store.getState()
    
    switch ( globalState.languageReducer) {
        case 'pl':
            return pl[key];
    
        default:
            return en[key];
    }
}
