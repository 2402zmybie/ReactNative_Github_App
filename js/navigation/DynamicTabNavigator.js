import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {createBottomTabNavigator} from 'react-navigation'
//导入首页底部的四个页面
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'

//导入图标
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Foundation from 'react-native-vector-icons/Foundation'

//导入组件跳转
import NaivigationUtil from '../navigation/NaivigationUtil'
//动态配置底部TabBar样式
import { BottomTabBar } from 'react-navigation-tabs'
//导入react-redux
import { connect } from 'react-redux'

const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({tintColor,focused}) => {
                return <FontAwesome5
                    name={'hotjar'}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor,focused}) => {
                return <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({tintColor,focused}) => {
                return <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor,focused}) => {
                return <Foundation
                    name={"social-myspace"}
                    size={26}
                    style={{color:tintColor}}
                />
            }
        }
    }
};

class DynamicTabNavigator extends Component<Props> {

    _tabNavigator() {
        if(this.Tabs) {
            return this.Tabs;
        }
        //自定义底部的Tab
        const { PopularPage,TrendingPage,FavoritePage,MyPage } = TABS;
        const tabs = {PopularPage,TrendingPage,FavoritePage,MyPage}
        //动态配置Tab属性
        PopularPage.navigationOptions.tabBarLabel = '最新呀'
        return this.Tabs = createBottomTabNavigator(tabs, {
            tabBarComponent: props => {
                return <TabBarComponent theme={this.props.theme} {...props}/>
            }
        });
    }

    render() {
        const Tab = this._tabNavigator();
        return (
            <Tab />
        );
    }
}


class TabBarComponent extends React.Component {
    constructor(props) {
        super(props)
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime:new Date().getTime()
        }
    }

    render() {
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme}
        />
    }
}

//使用react-redux
const mapStateToProps = state => ({
    theme: state.theme.theme   //将state里面的theme关联到props里面的theme
})

export default connect(mapStateToProps)(DynamicTabNavigator)