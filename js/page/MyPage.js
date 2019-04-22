import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';

export default class MyPage extends Component<Props> {
    render() {
        const {navigation} = this.props
        return (
            <View>
                <Text>{'我的'}</Text>
            </View>
        );
    }
}

