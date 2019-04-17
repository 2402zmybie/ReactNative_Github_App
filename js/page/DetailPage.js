
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';



type Props = {};
export default class DetailPage extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text>{"从首页点击的详情页面"}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})

