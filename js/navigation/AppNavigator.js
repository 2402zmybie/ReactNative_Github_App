import { createStackNavigator,createSwitchNavigator } from 'react-navigation'
//导入page页面
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'


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
        screen:DetailPage
    }
})

//建立欢迎页到首页导航
export default createSwitchNavigator({
    Init:Welcome,
    Main:Main
})

