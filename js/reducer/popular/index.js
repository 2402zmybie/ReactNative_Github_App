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
        case Types.LOAD_POPULAR_SUCCESS:  //下拉刷新成功
            return {
                ...state,
                [action.storeName]:{
                    //表示整个tab下面的数据
                    ...state[action.storeName],
                    items: action.items,  //原始数据
                    projectModes:action.projectModes,  //此次要展示的数据
                    isLoading:false,
                    hideLoadingMore:false,
                    pageIndex:action.pageIndex
                }
            }
        case Types.POPULAR_REFRESH:  //下拉刷新
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:true,
                    hideLoadingMore:true,
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
        case Types.POPULAR_LOAD_MORE_SUCCESS:  //上拉加载更多成功
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    projectModes:action.projectModes,
                    hideLoadingMore:true,
                    pageIndex: action.pageIndex
                }
            }
        case Types.POPULAR_LOAD_MORE_FAIL:   //上拉加载更多失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex
                }
            }
        default:
            return state;
    }
}