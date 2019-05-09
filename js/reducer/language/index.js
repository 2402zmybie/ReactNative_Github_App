import Types from "../../action/types";
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";

const defaultState = {
    languages: [],
    keys: []
};
export default function onAction(state = defaultState,action) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS:  //获取数据成功
            //根据action中flag的不同 返回的数据也不同
            if(FLAG_LANGUAGE.flag_key === action.flag) {
                //最热
                return {
                    ...state,
                    keys: action.languages
                }
            }else {
                //趋势
                return {
                    ...state,
                    languages: action.languages
                }
            }
        default:
            return state
    }
}