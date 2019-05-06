import React, {Component} from 'react';
import {WebView, StyleSheet, Text, View, TouchableOpacity, DeviceInfo} from 'react-native';
//导入NavigationBar
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigation/NaivigationUtil";
import BackPressComponent from "../common/BackPressComponent";

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'


export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        const {projectModel} = this.params;
        this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
        const title = projectModel.full_name || projectModel.fullName;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false
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

    renderRightButton() {
        return <View>
            <TouchableOpacity style={{flexDirection: 'row'}}>
                {/*收藏按钮*/}
                <FontAwesome
                    name={'star-o'}
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

