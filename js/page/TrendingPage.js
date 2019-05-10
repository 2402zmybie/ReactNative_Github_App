import React, {Component} from 'react';
import {DeviceEventEmitter,TouchableOpacity,Platform, StyleSheet, Text, View,FlatList,RefreshControl,ActivityIndicator,DeviceInfo} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TrendingItem from '../common/TrendingItem'

import {createMaterialTopTabNavigator} from 'react-navigation'
import Toast from 'react-native-easy-toast'
// 使用自定义的NavigationBar
import NavigationBar from '../common/NavigationBar'
//引入connect
import { connect } from 'react-redux'
import actions from '../action'

const URL = 'https://github.com/trending/';
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

//引入Modal
import TrendingDialog,{TimeSpans} from '../common/TrendingDialog'
import NavigationUtil from "../navigation/NaivigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'

class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props)
        console.disableYellowBox = true
        // this.tabNames = ['All','C','C#','PHP','JavaScript']
        const { onLoadLanguage } = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
        this.preKeys = []
        this.state = {
            timeSpan: TimeSpans[0]
        }
    }

    _genTabs() {
        const tabs = {};
        const { keys } = this.props
        this.preKeys = keys
        keys.forEach((item,index) => {
            if(item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name}/>,
                    navigationOptions: {
                        title:item.name
                    }
                }
            }

        })
        return tabs;
    }
    renderTitleView() {
        return <View>
            <TouchableOpacity
                ref='button'
                //点击背景变成透明
                underlayColor={'transparent'}
                onPress={() => this.dialog.show()}
            >
                <View style={{flexDirection:'row',alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#ffffff',
                        fontWeight: '400'
                    }}>
                        趋势 {this.state.timeSpan.showText}
                        <MaterialIcons
                            name={'arrow-drop-down'}
                            size={22}
                            style={{color: 'white'}}
                        />
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    }
    onSelectTimeSpan(tab) {
        this.dialog.dismiss()
        this.setState({
            timeSpan:tab
        })
        //利用rn自带的事件发射器发送事件
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab)
    }
    renderTrendingDialog() {
        return <TrendingDialog
            //这句话的意思是 通过dialog的变量去拿,然后将dialog赋值给这个组件的dialog
            ref={dialog => this.dialog=dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }
    //进行优化----优化切换今日,本周,本月,上面的Tab重新渲染的问题
    _tabNav() {
        if(!this.tabNav || !ArrayUtil.isEqual(this.preKeys,this.props.keys)) {  //优化效率,根据需要选择是否重新创建TopTabNavigator
            this.tabNav = createMaterialTopTabNavigator(this._genTabs(),{
                tabBarOptions: {
                    tabStyle:styles.tabStyle,
                    scrollEnabled:true,
                    upperCaseLabel:false,
                    style: {
                        backgroundColor:'#678',
                        height: 30
                    },
                    indicatorStyle:styles.indicatorStyle,
                    labelStyle:styles.labelStyle
                },
                lazy:true
            })
        }
        return this.tabNav
    }
    render() {
        const { keys } = this.props
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle:'light-content'
        }
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = keys.length ? this._tabNav() : null;
        return <View style={{flex:1, marginTop: DeviceInfo.isIPhoneX_deprecated? 30 : 0}}>
            {navigationBar}
            {TabNavigator && <TabNavigator/>}
            {this.renderTrendingDialog()}
        </View>
    }
}
const mapTrendingStateToProps = state => ({
    keys: state.language.languages
});
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapTrendingStateToProps,mapTrendingDispatchToProps)(TrendingPage)

const pageSize = 10;
class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { tabLabel,timeSpan } = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
    }
    componentDidMount() {
        this.loadData();
        //组件完成装载的时候 注册监听
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,(timeSpan) => {
            this.timeSpan = timeSpan;
            this.loadData();
        })
    }

    componentWillUnmount() {
        if(this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store() {
        const { trending } = this.props
        let store = trending[this.storeName]
        if(!store) {
            store = {
                items:[],
                isLoading:false,
                projectModes:[],  //要显示的数据
                hideLoadingMore:true,   //默认隐藏加载更多
            }
        }
        return store;
    }

    loadData(loadMore) {
        const {onRefreshTrending,onLoadMoreTrending} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        //判断是下拉刷新还是加载更多
        if(loadMore) {
            onLoadMoreTrending(this.storeName,++store.pageIndex,pageSize,store.items,favoriteDao,callBack=> {
                this.refs.toast.show('没有更多了')
            })
        }else {
            onRefreshTrending(this.storeName,url,pageSize,favoriteDao)
        }

    }
    //默认情况下请求的是今天的数据
    genFetchUrl(key) {
        return URL + key + '?' + this.timeSpan.searchText;
    }
    renderItem(data) {
        const item = data.item;
        return <TrendingItem
            projectModel = {item}
            //条目点击跳转,callback作为桥梁方法被传递到详情页
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback
                },'DetailPage')
            }}
            onFavorite={(item,isFavorite) => FavoriteUtil.onFavorite(favoriteDao,item,isFavorite, FLAG_STORAGE.flag_trending)}
        />
    }

    genIndicator() {
        return this._store().hideLoadingMore? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator}/>
                <Text>正在加载更多</Text>
            </View>
    }

    render() {
        let store = this._store()
        return (
            <View>
                <FlatList
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => item.item.fullName + ''}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    //解决初始进去会调用onEndReached和滑动一次会调用两次onEndReached的问题, 为什么要使用一个定时器,确保在onEndReached执行的时候onMomentumScrollBegin先执行
                    onEndReached={() => {
                        console.log('------------onEndReached--------------')
                        setTimeout(() => {
                            if(this.canLoadMore) {
                                this.loadData(true)
                                this.canLoadMore = false;
                            }
                        },100)
                    }}
                    onMomentumScrollBegin={() => {  //初始化滚动的时候调用onEndReached
                        this.canLoadMore = true;
                    }}
                    onEndReachedThreshold={0.5}
                />
                <Toast ref={'toast'} position={'center'}/>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    trending: state.trending
})
const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName,url,pageSize,favoriteDao) => dispatch(actions.onRefreshTrending(storeName,url,pageSize,favoriteDao)),
    onLoadMoreTrending: (storeName,pageIndex,pageSize,items,favoriteDao,callBack) => dispatch(actions.onLoadMoreTrending(storeName,pageIndex,pageSize,items,favoriteDao,callBack))
})
const TrendingTabPage = connect(mapStateToProps,mapDispatchToProps)(TrendingTab);



const styles = StyleSheet.create({
    tabStyle: {
        // minWidth:50  minWidth和scrollEnable会导致tabStyle初次加载时候闪烁
        padding:0
    },
    indicatorStyle: {
        height:2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize:13,
        margin: 0
    },
    indicatorContainer: {
        alignItems:'center'
    },
    indicator: {
        color:'red',
        margin:10
    }
})

