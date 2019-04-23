import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {createMaterialTopTabNavigator} from 'react-navigation'

import NaivigationUtil from '../navigation/NaivigationUtil'

export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['Java','Android','Ios','React','React Native','PHP']
    }

    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item,index) => {
            //初始化顶部tab的时候 向页面传递参数
            tabs[`tab${index}`] = {
                screen: props => <PopularTab {...props} tabLabel={item}/>,
                navigationOptions: {
                    title:item
                }
            }
        })
        return tabs;
    }


    render() {
        const TopTab = createMaterialTopTabNavigator(this._genTabs(),{
            tabBarOptions: {
                tabStyle:styles.tabStyle,
                scrollEnabled:true,
                upperCaseLabel:false,
                style: {
                    backgroundColor:'#678'
                },
                indicatorStyle:styles.indicatorStyle,
                labelStyle:styles.labelStyle
            }
        })
        return <TopTab/>
    }
}

class PopularTab extends Component<Props> {

    render() {
        const {tabLabel} = this.props;
        return (
            <View>
                <Text>{tabLabel}</Text>
                <Text onPress={() => {
                    NaivigationUtil.goPage("DetailPage")
                }}>跳转到详情页</Text>
                <Text onPress={() => {
                    NaivigationUtil.goPage("FetchDemoPage")
                }}>Fetch Demo</Text>
                <Text onPress={() => {
                    NaivigationUtil.goPage("AsyncStorageDemoPage")
                }}>AsyncStorage Demo</Text>

                <Text onPress={() => {
                    NaivigationUtil.goPage("DataStoreDemoPage")
                }}>离线缓存框架</Text>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabStyle: {
        minWidth:50
    },
    indicatorStyle: {
        height:2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize:13,
        marginTop:6,
        marginBottom:6
    }
})

