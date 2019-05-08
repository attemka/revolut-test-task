import { combineReducers } from 'redux';
import { RootState } from './state';
import currenciesReducer from './currencies'


export const rootReducer = combineReducers<RootState>({
    currencies: currenciesReducer as any
});