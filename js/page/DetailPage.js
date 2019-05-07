import React, {Component} from 'react';
import {WebView, StyleSheet, Text, View, TouchableOpacity, DeviceInfo} from 'react-native';
//导入NavigationBar
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigation/NaivigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'


export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        const {projectModel,flag} = this.params;
        this.favoriteDao = new FavoriteDao(flag);
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
        const title = projectModel.item.full_name || projectModel.item.fullName;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
            isFavorite: projectModel.isFavorite
        }
        //安卓物理返回键封装以及用法
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    }
    componentDidMount (){
        this.backPress.componentDidMount()
    }
    componentWillUnmount(){
        this.backPress.componentWillUnmount()
    }
    onBackPress() {
        this.onBack();
        return true   //处理了事件
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    //点击收藏按钮
    onFavoriteButtonClick() {
        const { projectModel,callback } = this.params
        const isFavorite = projectModel.isFavorite = !projectModel.isFavorite
        //通知收藏状态到外面的条目中去
        callback(isFavorite)
        this.setState({
            isFavorite: isFavorite
        })
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if(projectModel.isFavorite) {
            //如果是收藏状态
            this.favoriteDao.saveFavoriteItem(key,JSON.stringify(projectModel))
        }else {
            //如果是非收藏状态
            this.favoriteDao.removeFavoriteItem(key)
        }
    }
    renderRightButton() {
        return <View>
            <TouchableOpacity  style={{flexDirection: 'row'}} onPress={() => this.onFavoriteButtonClick()}>
                {/*收藏按钮*/}
                <FontAwesome
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={20}
                    style={{color: 'white', marginRight: 10}}
                />
                {/*分享按钮*/}
                {ViewUtil.getShareButton(() => {
                    // 分享按钮点击回调
                })}
            </TouchableOpacity>
        </View>
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }

    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 20} : null;
        let navigationBar = <NavigationBar
            title={this.state.title}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={this.renderRightButton()}
            titleLayoutStyle={titleLayoutStyle}
            style={{backgroundColor: THEME_COLOR}}
        />
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={navState => this.onNavigationStateChange(navState)}
                    source={{uri: this.state.url}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    }
})

