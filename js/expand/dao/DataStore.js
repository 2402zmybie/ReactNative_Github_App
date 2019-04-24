import { AsyncStorage } from 'react-native'


export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

export default class DataStore {

    /**
     * 离线缓存策略的入口方法
     */
    fetchData(url) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then(wrapData => {
                //在有效期内
                if(wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData)
                }else {
                    this.fetchNetData(url).then(data => {
                        resolve(this._wrapData(data))
                    }).catch(error => {
                        reject(error)
                    })
                }
            }).catch(error => {
                this.fetchNetData(url).then(data => {
                    resolve(this._wrapData(data))
                }).catch(error => {
                    reject(error)
                })
            })
        })
    }



    /**
     * 保存数据
     */
    saveData(url,data,callback) {
        if(!data || !url) return;
        //key是url 数据是打了时间戳的json字符串
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)),callback)
    }

    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()}
    }

    //从本地获取数据
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if(!error) {
                    try {
                        //如果请求的url为新的, 则result为也会进来这里, 但result为null
                        resolve(JSON.parse(result))  //将有时间戳的json数据转化为json对象并成功返回
                    }catch (e) {
                        reject(e)
                        console.error(e)
                    }
                }else {
                    reject(error)
                    console.error(error)
                }
            })
        })
    }

    //从网络获取数据
    fetchNetData(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if(response.ok) {
                        return response.json()
                    }
                    throw new Error('Network response was not ok')
                })
                .then(responseData => {
                    //保存本地
                    this.saveData(url,responseData)
                    resolve(responseData)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp)
        if(currentDate.getMonth() !== targetDate.getMonth()) return false;  //月
        if(currentDate.getDate() !== targetDate.getDate()) return false;   //日
        if(currentDate.getHours() - targetDate.getHours() > 4) return false; //小时
        return true;

    }
}