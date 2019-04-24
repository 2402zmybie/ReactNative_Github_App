import Types from '../../action/types'

const defaultState = {
}

/**
 *state的设计:
 * popular: {
 *     java: {
 *         items:[],
 *         isLoading: false
 *     },
 *     ios: {
 *         items:[],
 *         isLoading: false
 *     }
 * }
 *
 * 如果动态的设置store 和动态获取store
 */
export default (state = defaultState,action) => {
    switch (action.type) {
        case Types.LOAD_POPULAR_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    //表示整个tab下面的数据
                    ...state[action.storeName],
                    items:action.items,
                    isLoading:false
                }
            }
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:true
                }
            }
        case Types.LOAD_POPULAR_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:false
                }
            }
        default:
            return state;
    }
}