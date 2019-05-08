import {Store, createStore, applyMiddleware, compose, combineReducers } from 'redux'
import reduxThunk from 'redux-thunk'
import { func } from 'prop-types'



export default function configureStore(initialState?: RootState): Store<RootState> {

}