import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';


export default class Trending extends Component<Props> {
    render() {
        const {navigation} = this.props;
        return (
            <View>
                <Text>{'趋势'}</Text>
                <Button title={'改变主体颜色'} onPress={() => {
                    //setParams设置的属性 都会存放在navigation的state里面
                    navigation.setParams({
                        theme: {
                            tintColor: 'red',
                            updateTime: new Date().getTime()
                        }
                    })
                }
                }/>
            </View>
        )
    }
}

