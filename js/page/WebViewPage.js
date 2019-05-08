import React, {Component} from 'react';
import {WebView, StyleSheet, Text, View, TouchableOpacity, DeviceInfo} from 'react-native';
//导入NavigationBar
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigation/NaivigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";


const THEME_COLOR = '#678'


export default class WebViewPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        const {title,url}  = this.params;
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
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

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }

    render() {
        let navigationBar = <NavigationBar
            title={this.state.title}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
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

