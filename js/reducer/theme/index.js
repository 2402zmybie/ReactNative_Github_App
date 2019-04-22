import Types from '../../action/types'

const defaultState = {
    theme: 'blue'
}

//注意 指定了theme的reducer 别忘了在reducer下面的index 下面做一个聚合 combineReducers()
export default (state = defaultState,action) => {
    switch (action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme
            }
        default:
            return state;
    }
}