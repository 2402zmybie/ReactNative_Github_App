
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import NavigationUtil from '../navigation/NaivigationUtil'

//欢迎界面,200毫秒后跳转到首页
export default class WelcomePage extends Component<Props> {

  componentDidMount() {
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({navigation: this.props.navigation})
    },200)
  }

  componentWillUnmount() {
    //清除掉定时器
    this.timer && clearTimeout(this.timer)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{'Welcome'}</Text>
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

