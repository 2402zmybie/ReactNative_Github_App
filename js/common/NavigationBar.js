import React,{ Component } from 'react'
import { ViewPropTypes,View,Text,StyleSheet,Platform,StatusBar } from 'react-native'
import { PropTypes } from 'prop-types'

const NAV_BAR_HEIGHT_IOS = 44;   //导航栏在ios中的高度
const NAV_BAT_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGH = 20;  //状态栏的高度
const StatusBarShape = {
    //设置状态栏所接受的属性
    barStyle: PropTypes.oneOf(['light-content','default']),
    hide: PropTypes.bool,
    backgroundColor:PropTypes.string
}

export default class NavigationBar extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton:PropTypes.element,
        leftButton: PropTypes.element
    }
    //设置默认属性
    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hide:false
        }
    };
    render() {
        //自定义组件如果没有设置的话  则创建StatusBar
        let statusBar = !this.props.statusBar.hide ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar}/>
            </View> : null
        //如果没有设置, 则返回一个自定义的Text  head表示显示不下,则开头的位置显示省略号  ...txt
        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode='head' numberOfLines={1} style={styles.title}>{this.props.title}</Text>
        //content 有左边的按钮 中间的标题, 和右边的按钮
        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton)}
            </View>
        return (
            //上面显示状态栏  底部显示导航栏(安卓中状态栏高度已经留出,不用设置)
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        )
    }

    getButtonElement(data) {
        return <View style={styles.navBarButton}>
            {data ? data : null}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#2196f3'
    },
    navBarButton: {
        alignItems:'center'
    },
    //导航条的样式, 分布为左边 中间  右边
    navBar: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        height: Platform.OS === 'ios'? NAV_BAR_HEIGHT_IOS : NAV_BAT_HEIGHT_ANDROID
    },
    navBarTitleContainer: {
        alignItems:'center',
        justifyContent: 'center',
        position:'absolute',
        left: 40,
        right: 40,
        top: 0,
        bottom: 0
    },
    title: {
        fontSize: 20,
        color:'white'
    },
    statusBar: {
        height: Platform.OS === 'ios'? STATUS_BAR_HEIGH : 0
    }
})