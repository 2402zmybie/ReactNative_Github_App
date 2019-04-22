import { applyMiddleware,createStore } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducer'
import { middleware } from '../navigation/AppNavigator'

const middlewares = [
    middleware
]

export default createStore(reducers, applyMiddleware(...middlewares))