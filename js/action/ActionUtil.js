/**
 * 处理下拉刷新的数据
 * @param actionType
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 * @param favoriteDao
 */
import ProjectModel from "../model/ProjectModel";
import Utils from "../util/Utils";
import Types from "./types";
/**
 * 处理数据
 * @param actionType
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 * @param favoriteDao
 * @param params 其他参数
 */
export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
    let fixItems = [];
    if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data;
        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items;
        }
    }
    //第一次要加载的数据
    let showItems = pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize);
    _projectModels(showItems,favoriteDao,projectModes => {
        dispatch({
            type: actionType,
            items: fixItems,
            projectModes: projectModes,
            storeName,
            pageIndex : 1
        })
    })

}

//将item包装成有收藏状态的集合
export async function _projectModels(showItems, favoriteDao,callback) {
    let keys = [];
    try {
        //由于返回的是一个promise对象  所以异步转同步
        //获取收藏的key
        keys = await favoriteDao.getFavoriteKeys();
    }catch (e) {
        console.log(e)
    }
    let projectModels = [];
    for(let i = 0,len = showItems.length; i<len; i++) {
        projectModels.push(new ProjectModel(showItems[i],Utils.checkFavorite(showItems[i],keys)))
    }
    //将结果通过callback回传回去
    if(typeof callback === 'function') {
        callback(projectModels)
    }
}
