import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {handleData} from "../ActionUtil";

export function onLoadPopularData(storeName,url,pageSize) {
    return dispatch => {
        dispatch({type : Types.POPULAR_REFRESH, storeName: storeName})
        let dataStore = new DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_popular)
            //请求成功
            .then(data => {
                handleData(Types.LOAD_POPULAR_SUCCESS,dispatch, storeName,data,pageSize);
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

/**
 *
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize  每页展示条数
 * @param dataArray 原始数据
 * @param callback  回调函数,可以通过回调函数向页面通信,比如异常信息的展示,没有更多等待等
 */
export function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray=[],callBack) {
    return dispatch => {
        setTimeout(() => {
            //模拟网络请求
            if((pageIndex - 1) * pageSize >= dataArray.length) {
                if(typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type:Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray
                })
            }else {
                //本次载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0,max)
                })
            }
        },500);
    }
}
