import { applyMiddleware,createStore } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducer'
import { middleware } from '../navigation/AppNavigator'

//自定义中间件
const logger = store => next => action => {
    if(typeof action === 'function') {
        console.log('dispatching a function');
    }else {
        console.log('dispatch ',action)
    }
    const result = next(action);
    console.log('nextState', store.getState())
}

const middlewares = [
    middleware,
    logger,
    thunk
]

export default createStore(reducers, applyMiddleware(...middlewares))