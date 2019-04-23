import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput,ScrollView} from 'react-native';
//导入离线缓存框架
import DataStore from '../expand/dao/DataStore'

export default class DataStoreDemoPage extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
        this.dataStore = new DataStore();
    }

    _loadData() {
            // https://api.github.com/search/repositories?q=java
            const url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
            this.dataStore.fetchData(url)
                .then(jsonData => {
                    //返回的是带有时间戳的json对象
                    let showData = `初次加载时间: ${new Date(jsonData.timestamp)}\n${JSON.stringify(jsonData.data)}`
                    this.setState({
                        text: showData
                    })
                }).catch(error => {
                    error && console.log(error.toString())
            })
        }

    render() {
        return (
            <View>
                <View style={{flexDirection:'row'}}>
                    <TextInput
                        style={{height:40,borderWidth:1,borderColor:'black',borderRadius:5,flex:1}}
                        onChangeText={text => {
                            this.searchKey = text;
                        }}
                    />
                    <Button
                        title={'获取'} onPress={() => {
                        console.log(this.searchKey)
                        this._loadData();
                    }}/>
                </View>
                <Text>{this.state.text}</Text>
            </View>
        );
    }
}

