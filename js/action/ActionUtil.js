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
export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao,params) {
    let fixItems = [];
    if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data;
        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items;
        }
    }
    dispatch({
        type: actionType,
        projectModes: pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize),  //第一次要加载的数据
        storeName,
        items: fixItems,
        pageIndex : 1
    })
}
