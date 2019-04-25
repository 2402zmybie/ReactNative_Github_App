import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList,RefreshControl,ActivityIndicator} from 'react-native';
import PopularItem from '../common/PopularItem'

import {createMaterialTopTabNavigator} from 'react-navigation'
import Toast from 'react-native-easy-toast'
// 使用自定义的NavigationBar
import NavigationBar from '../common/NavigationBar'
//引入connect
import { connect } from 'react-redux'
import actions from '../action'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'

export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props)
        console.disableYellowBox = true
        this.tabNames = ['Java','Android','Ios','React','React Native','PHP']
    }

    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item,index) => {
            //初始化顶部tab的时候 向页面传递参数
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}/>,
                navigationOptions: {
                    title:item
                }
            }
        })
        return tabs;
    }


    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle:'light-content'
        }
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TopTab = createMaterialTopTabNavigator(this._genTabs(),{
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
            }
        })
        return <View style={{flex:1}}>
            {navigationBar}
            <TopTab/>
        </View>
    }
}

const pageSize = 10;
//PopolarTab让其进行绑定
class PopularTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
    }
    componentDidMount() {
        this.loadData();
    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store() {
        const {popular} = this.props
        let store = popular[this.storeName]
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
        const {onLoadPopularData,onLoadMorePopular} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        //判断是下拉刷新还是加载更多
        if(loadMore) {
            onLoadMorePopular(this.storeName,++store.pageIndex,pageSize,store.items,callBack=> {
                this.refs.toast.show('没有更多了')
            })
        }else {
            onLoadPopularData(this.storeName,url,pageSize)
        }

    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }
    renderItem(data) {
        const item = data.item;
        return <PopularItem
                item = {item}
                onSelect={() => {
                    console.warn('条目被点击了')
                }}
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
                    keyExtractor={item => item.id + ''}
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
    popular: state.popular
})
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName,url,pageSize) => dispatch(actions.onLoadPopularData(storeName,url,pageSize)),
    onLoadMorePopular: (storeName,pageIndex,pageSize,items,callBack) => dispatch(actions.onLoadMorePopular(storeName,pageIndex,pageSize,items,callBack))
})
const PopularTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab);



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

