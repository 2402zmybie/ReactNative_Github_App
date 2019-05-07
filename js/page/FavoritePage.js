import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList,RefreshControl,ActivityIndicator,DeviceInfo} from 'react-native';
import PopularItem from '../common/PopularItem'
import NavigationUtil from '../navigation/NaivigationUtil'

import {createMaterialTopTabNavigator} from 'react-navigation'
import EventBus from 'react-native-event-bus'
import Toast from 'react-native-easy-toast'
// 使用自定义的NavigationBar
import NavigationBar from '../common/NavigationBar'
//引入connect
import { connect } from 'react-redux'
import actions from '../action'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventTypes from "../util/EventTypes";

const THEME_COLOR = '#678'
//将favoriteDao实例化
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

export default class FavoritePage extends Component<Props> {
    constructor(props) {
        super(props)
        console.disableYellowBox = true
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle:'light-content'
        }
        let navigationBar = <NavigationBar
            title={'收藏'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TopTab = createMaterialTopTabNavigator({
            'Popular': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
                navigationOptions: {
                    title:'最热'
                }
            },
            'Trending': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
                navigationOptions: {
                    title:'趋势'
                }
            }
        },{
            tabBarOptions: {
                tabStyle:styles.tabStyle,
                scrollEnabled:false,
                upperCaseLabel:false,
                style: {
                    backgroundColor:'#678',
                    height: 30
                },
                indicatorStyle:styles.indicatorStyle,
                labelStyle:styles.labelStyle
            }
        })
        //判断是否运行在iphone x上面
        return <View style={{flex:1, marginTop: DeviceInfo.isIPhoneX_deprecated? 30 : 0}}>
            {navigationBar}
            <TopTab/>
        </View>
    }
}

class FavoriteTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { flag } = this.props;
        this.storeName = flag;
        this.favoriteDao = new FavoriteDao(flag);
    }

    componentDidMount() {
        this.loadData(true);
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
            if(data.to === 2) {
                this.loadData(false);  //当底部的tab切换到收藏的时候,静默地刷新数据
            }
        })
    }
    componentWillUnmount(): void {
        if(this.listener) {
            EventBus.getInstance().removeListener(this.listener)
        }
    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store() {
        const { favorite } = this.props
        let store = favorite[this.storeName]
        if(!store) {
            store = {
                items:[],
                isLoading:false,
                projectModels:[],  //要显示的数据
            }
        }
        return store;
    }

    loadData(isShowLoading) {
        const { onLoadFavoriteData } = this.props;
        onLoadFavoriteData(this.storeName,isShowLoading)
    }

    onFavorite(item,isFavorite){
        FavoriteUtil.onFavorite(this.favoriteDao,item,isFavorite,this.props.flag)
        if(this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_popular)
        }else if(this.storeName === FLAG_STORAGE.flag_trending) {
            EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending)
        }
    }
    renderItem(data) {
        const item = data.item;
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
        return <Item
            projectModel = {item}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    projectModel: item,
                    flag: this.storeName,
                    callback
                },'DetailPage')
            }}
            //当用户点击收藏按钮的回调的时候
            onFavorite={(item,isFavorite) => this.onFavorite(item,isFavorite)}
        />
    }

    render() {
        let store = this._store()
        return (
            <View>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => (item.item.id || item.item.fullName)+ ''}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={THEME_COLOR}
                        />
                    }
                />
                <Toast ref={'toast'} position={'center'}/>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    favorite: state.favorite
})
const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName,isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName,isShowLoading))
})
const FavoriteTabPage = connect(mapStateToProps,mapDispatchToProps)(FavoriteTab)


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

