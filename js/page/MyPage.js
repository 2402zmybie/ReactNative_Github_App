import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import NaivigationUtil from "../navigation/NaivigationUtil";

export default class MyPage extends Component<Props> {
    render() {
        const {navigation} = this.props
        return (
            <View>
                <Text>{'我的'}</Text>
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
        );
    }
}

