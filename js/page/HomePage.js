import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {createBottomTabNavigator} from 'react-navigation'
//导入首页底部的四个页面
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './MyPage'

export default class HomePage extends Component<Props> {

    _tabNavigator() {
        return createBottomTabNavigator({
            PopularPage: {
                screen: PopularPage
            },
            TrendingPage: {
                screen: TrendingPage
            },
            FavoritePage: {
                screen: FavoritePage
            },
            MyPage: {
                screen: MyPage
            }
        })
    }

    render() {
        const Tab = this._tabNavigator();
        return (
            <Tab />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

