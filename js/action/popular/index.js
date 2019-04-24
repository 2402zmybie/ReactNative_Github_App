import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

export function onLoadPopularData(storeName,url) {
    return dispatch => {
        dispatch({type : Types.POPULAR_REFRESH, storeName: storeName})
        let dataStore = new DataStore();
        dataStore.fetchData(url)
            //请求成功
            .then(data => {
                handleData(dispatch, storeName,data);
            })
            //请求失败
            .catch(error => {
                console.log(error)
                dispatch({
                    type: Types.LOAD_POPULAR_FAIL,
                    storeName,
                    error
                })
            })
    }
}

function handleData(dispatch, storeName,data) {
    dispatch({
        type: Types.LOAD_POPULAR_SUCCESS,
        items: data && data.data && data.data.items,
        storeName
    })
}