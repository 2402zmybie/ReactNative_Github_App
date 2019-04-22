/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
//配置程序入口为Provider包裹的App.js
import App from './js/App'

AppRegistry.registerComponent(appName, () => App);
