import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import { Provider } from 'react-redux'
import AppNavigator from './navigation/AppNavigator'
import store from './store'

export default class App extends Component<Props> {
  render() {
    return (
        //用Provider将AppNavigator包裹起来,并且将store传递给App框架
        <Provider store={store}>
          <AppNavigator/>
        </Provider>
    );
  }
}

