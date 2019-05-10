import React, {Component} from 'react';
import {Text, View,TouchableOpacity,ScrollView,StyleSheet,Linking} from 'react-native';
import NaivigationUtil from "../../navigation/NaivigationUtil";
import {MORE_MENU} from "../../common/MORE_MENU";
import GlobalStyles from "../../res/style/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon,{ FLAG_ABOUT } from "./AboutCommon";
const THEME_COLOR = '#678'
//导入本地配置文件(在网络数据还没加载的情况下)
import config from '../../res/data/config.json'
import BackPressComponent from "../../common/BackPressComponent";

//使用组装者模式来实现关于页面
export default class AboutPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: e => this.onBackPress(e)})
        //组装者的构造的第二个参数表示 将网络数据设置给state
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation:this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about
        },data => this.setState({...data}));
        this.state = {
            data: config
        }
    }

    onBackPress(e) {
        NaivigationUtil.goBack(this.props.navigation)
        return true
    }
    componentDidMount(): void {
        this.backPress.componentDidMount()
    }
    componentWillUnmount(): void {
        this.backPress.componentWillUnmount()
    }

    onClick(menu) {
        let RouteName, params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage';
                params.title='教程';
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
                break;
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage';
                break
            case MORE_MENU.Feedback:  //反馈
                const url = 'tel: 10086';  //调用第三方拨打电话的功能
                //打开第三方
                Linking.canOpenURL(url)
                    .then(support => {
                        if(!support) {
                            console.log('cannot handle url' + url)
                        }else {
                            Linking.openURL(url)
                        }
                    }).catch(e => {
                        console.error('An error occurred',e)
                })
        }
        if(RouteName) {
            NaivigationUtil.goPage(params,RouteName)
        }
    }
    getItem(menu) {
        return ViewUtil.getMenuItem(() => {
            this.onClick(menu)
        }, menu,THEME_COLOR)
    }
    render() {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback)}
        </View>
        return this.aboutCommon.render(content,this.state.data.app)
    }
}


