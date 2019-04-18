import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';

export default class MyPage extends Component<Props> {
    render() {
        const {navigation} = this.props
        return (
            <View>
                <Text>{'我的'}</Text>
                <Button title={'改变主体颜色'} onPress={() => {
                    //setParams设置的属性 都会存放在navigation的state里面
                    navigation.setParams({
                        theme: {
                            tintColor: 'pink',
                            updateTime: new Date().getTime()
                        }
                    })
                }
                }/>
            </View>
        );
    }
}

