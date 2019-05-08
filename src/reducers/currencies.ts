import { Action, createAction, createReducer, SimpleActionCreator } from 'redux-act'
import { ThunkDispatch } from 'redux-thunk'
import { RootState } from './state'
import { floorNum } from '../utils'

type UserCurrency = {
    name: string
    userAmount: number
}

export type CurrenciesState = {
    userCurrencies: UserCurrency[]
}

const initialState: CurrenciesState = {
    userCurrencies: [
        { name: 'GBP', userAmount: 100.0 },
        { name: 'USD', userAmount: 100.0 },
        { name: 'EUR', userAmount: 100.0 },
    ],
}

const userCurrenciesSelector = (state: RootState) => state.currencies.userCurrencies

export const exchangeCurrency = createAction<UserCurrency[]>('currencies/exchange-currency')

export const exchangeUserCurrency = (fromCurr: string, toCurr: string, amount: number, rate: number) => (
    dispatch: ThunkDispatch<{}, {}, any>,
    getState: Function,
) => {
    const userCurrencies = userCurrenciesSelector(getState())
    const fromCurrencyIndex = userCurrencies.findIndex((currency: UserCurrency) => currency.name === fromCurr)
    const toCurrencyIndex = userCurrencies.findIndex((currency: UserCurrency) => currency.name === toCurr)

    userCurrencies[fromCurrencyIndex].userAmount = floorNum(userCurrencies[fromCurrencyIndex].userAmount - amount)

    userCurrencies[toCurrencyIndex].userAmount = floorNum(userCurrencies[toCurrencyIndex].userAmount + amount * rate)

    dispatch(exchangeCurrency(userCurrencies))
}

const reducer = createReducer<CurrenciesState>({}, initialState)

reducer.on(exchangeCurrency, (state: CurrenciesState, currencies: UserCurrency[]) => ({...state, userCurrencies: currencies}))

export default reducer

