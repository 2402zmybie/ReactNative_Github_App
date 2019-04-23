import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput,ScrollView} from 'react-native';

export default class FetchDemoPage extends Component<Props> {

    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
    }

    _loadData() {
        // https://api.github.com/search/repositories?q=java
        const url = `https://api.github.com/search/repositories?q=${this.searchKey}`
        fetch(url)
            .then(resp => resp.text())  //调用text()方法将其转化为String
            .then(response => {
                this.setState({
                    text: response
                })
            })
    }

    _loadData2() {
        // https://api.github.com/search/repositories?q=java
        const url = `https://api.github.com/search/repositories?q=${this.searchKey}`
        fetch(url)
            .then(resp => {
                if(resp.ok) {
                    return resp.text()
                }
                throw new Error('network is not fine')
            })
            .then(response => {
                this.setState({
                    text: response
                })
            })
            .catch(e => {
                this.setState({
                    text: e.toString()
                })
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
                        style={{}}
                        title={'发送请求'} onPress={() => {
                        console.log(this.searchKey)
                        this._loadData2();
                    }}/>
                </View>
                <ScrollView>
                    <Text>{this.state.text}</Text>
                </ScrollView>
            </View>
        );
    }
}

