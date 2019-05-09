import Types from '../types'
import LanguageDao from "../../expand/dao/LanguageDao";

//redux的action创建函数
export function onLoadLanguage(flagKey) {
    return async dispatch => {
        //得到的是一个Promise对象 所以用async await
        try {
            let languages = await new LanguageDao(flagKey).fetch();
            dispatch({type: Types.LANGUAGE_LOAD_SUCCESS,languages:languages,flag:flagKey})
        }catch (e) {
            console.log(e)
        }

    }
}

