import React, {Component} from 'react';

//引入底部动态组件库
import DynamicTabNavigator from '../navigation/DynamicTabNavigator'
//导入组件跳转
import NaivigationUtil from '../navigation/NaivigationUtil'

import { connect } from 'react-redux'

//处理安卓中的物理返回键
import { BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import BackPressComponent from "../common/BackPressComponent";

class HomePage extends Component<Props> {
    constructor(props) {
        super(props)
        //实例化安卓物理返回键公共类方法, 并向其传递一个backPress
        this.backPress = new BackPressComponent({backPress: this.onBackPress()})
    }
    componentDidMount (){
        this.backPress.componentDidMount()
    }

    componentWillUnmount(){
        this.backPress.componentWillUnmount()
    }

    /**
     * 处理安卓中的物理返回键
     */
    onBackPress = () => {
        const { dispatch,nav } = this.props;
        if(nav.routes[1].index === 0) {  //这里routes的下标不是0 ,是因为RootNaviagtor里面的Main是第二个
            //不处理物理返回键
            return false;
        }
        //处理物理返回键
        dispatch(NavigationActions.back())
        return true //这里返回true则系统不会处理了,由上面我们自己处理
    }

    render() {
        NaivigationUtil.navigation = this.props.navigation;
        return (
            <DynamicTabNavigator />
        );
    }
}

const mapStateToProps = state => ({
    nav: state.nav
})

export default connect(mapStateToProps)(HomePage)




