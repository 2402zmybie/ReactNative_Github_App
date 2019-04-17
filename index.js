/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';

import AppNavigator from './js/navigation/AppNavigator'

AppRegistry.registerComponent(appName, () => AppNavigator);
