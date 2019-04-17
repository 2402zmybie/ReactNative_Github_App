import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {createBottomTabNavigator} from 'react-navigation'
//导入首页底部的四个页面
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './MyPage'

//导入图标
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Foundation from 'react-native-vector-icons/Foundation'

//引入底部动态组件库
import DynamicTabNavigator from '../navigation/DynamicTabNavigator'
//导入组件跳转
import NaivigationUtil from '../navigation/NaivigationUtil'

export default class HomePage extends Component<Props> {

    render() {
        NaivigationUtil.navigation = this.props.navigation;
        return (
            <DynamicTabNavigator />
        );
    }
}

