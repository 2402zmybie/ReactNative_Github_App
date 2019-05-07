import Types from "../../action/types";

const defaultState = {};

/**
 * state树的结构
    {
 *     popular: {
 *         projectModels: [],
 *         isLoading:false
 *     },
 *     trending: {
 *         projectModels: [],
 *         isLoading:false
 *     }
 * }
 * @param state
 * @param action
 */
export default function onAction(state = defaultState,action) {
    switch (action.type) {
        case Types.FAVORITE_LOAD_DATA:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:true
                }
            };
        case Types.FAVORITE_LOAD_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    isLoading:false
                }
            };
        case Types.FAVORITE_LOAD_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:false
                }
            };
        default:
            return state
    }
}