import React, {Component} from 'react';
import {Text, View,TouchableOpacity} from 'react-native';
import NaivigationUtil from "../navigation/NaivigationUtil";
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
//导入NavigationBar
import NavigationBar from '../common/NavigationBar'
const THEME_COLOR = '#678'

export default class MyPage extends Component<Props> {
    //右侧按钮
    getRightButton() {
        return <View style={{flexDirection:'row'}}>
            <TouchableOpacity>
                <View style={{padding: 5,marginRight:8}}>
                    <Feather
                        name={'search'}
                        size={24}
                        style={{color:'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }
    //左侧按钮
    getLeftButton(callBack) {
        return <TouchableOpacity style={{padding: 8,marginLeft:12}}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />
        </TouchableOpacity>
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle:'light-content'
        }
        return (
            <View>
                <NavigationBar
                    title={'我的'}
                    statusBar={statusBar}
                    rightButton={this.getRightButton()}
                    leftButton={this.getLeftButton()}
                    style={{backgroundColor: THEME_COLOR}}
                />
                <Text onPress={() => {
                    NaivigationUtil.goPage({},"DetailPage")
                }}>跳转到详情页</Text>
                <Text onPress={() => {
                    NaivigationUtil.goPage({},"FetchDemoPage")
                }}>Fetch Demo</Text>
                <Text onPress={() => {
                    NaivigationUtil.goPage({},"AsyncStorageDemoPage")
                }}>AsyncStorage Demo</Text>

                <Text onPress={() => {
                    NaivigationUtil.goPage({},"DataStoreDemoPage")
                }}>离线缓存框架</Text>
            </View>
        );
    }
}

