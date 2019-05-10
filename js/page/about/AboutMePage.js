import React, {Component} from 'react';
import {Text, View,TouchableOpacity,ScrollView,StyleSheet,Linking,Clipboard} from 'react-native';
import NaivigationUtil from "../../navigation/NaivigationUtil";
import {MORE_MENU} from "../../common/MORE_MENU";
import GlobalStyles from "../../res/style/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon,{ FLAG_ABOUT } from "./AboutCommon";
const THEME_COLOR = '#678'
import Ionicons from 'react-native-vector-icons/Ionicons'
//导入本地配置文件(在网络数据还没加载的情况下)
import config from '../../res/data/config.json'
import Toast from 'react-native-easy-toast'
import BackPressComponent from "../../common/BackPressComponent";

//使用组装者模式来实现关于页面
export default class AboutMePage extends Component<Props> {
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
            data: config,
            showTutorial:true,
            showBlog:false,
            showQQ:false,
            showContact: false
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


    onClick(tab) {
        if(!tab) return;
        //链接
        if(tab.url) {
            NaivigationUtil.goPage({
                title: tab.title,
                url: tab.url
            }, 'WebViewPage')
            return;
        }
        //邮箱
        if(tab.account && tab.account.indexOf('@') > -1) {
            //点击的是邮箱 条目
            let url = 'mailto://' + tab.account;
            Linking.canOpenURL(url)
                .then(supported => {
                    if(!supported) {
                        console.warn('cannot handle url' + url)
                    }else {
                        Linking.openURL(url)
                    }
                })
                .catch(e => console.error(e.toString()))
            return
        }
        //String
        if(tab.account) {
            Clipboard.setString(tab.account);
            this.toast.show(tab.title + tab.account + '已复制到剪切板')
        }
    }


    _item(data,isShow,key) {
        return ViewUtil.getSettingItem(() => {
            this.setState({
                [key]: !this.state[key]
            })
        },data.name,THEME_COLOR,Ionicons,data.icon, isShow ? 'ios-arrow-up' :'ios-arrow-down')
    }

    /**
     * 显示列表上数据
     * @param dic
     * @param isShowAccount
     */
    renderItems(dic,isShowAccount) {
        if(!dic) return null;
        let views = [];
        for(let i in dic) {
            let title = isShowAccount ? dic[i].title + ":" + dic[i].account :dic[i].title
            views.push(
                <View key={i}>
                    {ViewUtil.getSettingItem(() => this.onClick(dic[i]),title,THEME_COLOR)}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return views;
    }

    render() {
        const content = <View>
            {this._item(this.state.data.aboutMe.Tutorial,this.state.showTutorial,'showTutorial')}
            <View style={GlobalStyles.line}/>
            {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

            {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

            {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

            {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}
        </View>
        return <View style={{flex:1}}>
            {this.aboutCommon.render(content,this.state.data.author)}
            <Toast
                ref={toast => this.toast = toast}
                positioon={'center'}
            />
        </View>
    }
}


