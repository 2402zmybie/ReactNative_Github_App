import { createStackNavigator,createSwitchNavigator } from 'react-navigation'
//导入page页面
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import WebViewPage from '../page/WebViewPage'
//引入react-redux
import { connect } from 'react-redux'
import {
    createReactNavigationReduxMiddleware,
    reduxifyNavigator
} from 'react-navigation-redux-helpers'
//设置根路由
export const rootCom = 'Init'  //设置根路由


const Welcome = createStackNavigator({
    WelcomePage: {
        screen:WelcomePage,
        navigationOptions: {
            header:null
        }
    }
})
const Main = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null
        }
    },
    DetailPage: {
        screen:DetailPage,
        navigationOptions: {
            header: null
        }
    },
    WebViewPage: {
        screen:WebViewPage,
        navigationOptions: {
            header:null
        }
    }
})

//建立欢迎页到首页导航
export const RootNavigator =  createSwitchNavigator({
    Init:Welcome,
    Main:Main
})

/**
 * 1 初始化react-navigation与redux中间件
 * 为了reduxifyNavigator的key设置actionSubscribers(行为订阅者)
 */
export const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
)
/**
 * 2 将根导航器组件传递给reduxifyNavigator函数
 * @type {React.ComponentType<any>}
 */
const AppWithNavigationState = reduxifyNavigator(RootNavigator,'root');
/**
 * state到props的映射关系
 * @param state
 */
const mapStateToProps = state => ({
    state: state.nav  //v2
})
/**
 * 3 连接React组件与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState)
