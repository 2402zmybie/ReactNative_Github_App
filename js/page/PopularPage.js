
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import { createMaterialTopTabNavigator } from 'react-navigation'

import NaivigationUtil from '../navigation/NaivigationUtil'

export default class PopularPage extends Component<Props> {
  render() {
    const TopTab = createMaterialTopTabNavigator({
      PopularTab1: {
        screen: PopularTab,
        navigationOptions:{
          title:'Tab1'
        }
      },
      PopularTab2: {
        screen:PopularTab,
        navigationOptions: {
          title: 'Tab2'
        }
      }
    })
    return <TopTab />
  }
}

class PopularTab extends Component<Props> {

  render() {
    const {label} = this.props;
    return (
        <View>
          <Text>{ label }</Text>
          <Text onPress={() => {
            NaivigationUtil.goPage("DetailPage")
          }}>跳转到详情页</Text>
        </View>
    )
  }
}

