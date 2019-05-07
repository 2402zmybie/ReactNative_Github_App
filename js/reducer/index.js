import { combineReducers } from 'redux'
import theme from './theme'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import {rootCom,RootNavigator} from '../navigation/AppNavigator'

/**
 * 1 指定默认state
 */
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom))
/**
 * 创建自己的navigation reducer
 */
const navReducer = (state = navState,action) => {
    const nextState = RootNavigator.router.getStateForAction(action,state);
    //如果nextState为null或未定义, 则返回原始state
    return nextState || state
}

const index = combineReducers({
    nav: navReducer,
    theme: theme,
    popular:popular,
    trending:trending,
    favorite:favorite
})

export default index;