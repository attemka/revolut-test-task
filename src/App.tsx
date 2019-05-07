import React from 'react'
import logo from './logo.svg'
import ExchangeScreen, { CurrencyEntity } from './screens/ExchangeScreen/ExchangeScreen'

type AppState = {
    userCurrencies: CurrencyEntity[]
}

class App extends React.Component {
    state: AppState = {
        userCurrencies: [
            { name: 'GBP', userAmount: 100.00 },
            { name: 'USD', userAmount: 100.00 },
            { name: 'EUR', userAmount: 100.00 },
        ],
    }

    exchangeCurrency = (fromCurr: string, toCurr: string, amount: number, rate: number) => {
        const { userCurrencies } = this.state
        const fromCurrencyIndex = userCurrencies.findIndex(currency => currency.name === fromCurr)
        const toCurrencyIndex = userCurrencies.findIndex(currency => currency.name === toCurr)

        userCurrencies[fromCurrencyIndex].userAmount = parseFloat((userCurrencies[fromCurrencyIndex].userAmount - amount).toFixed(2))
        userCurrencies[toCurrencyIndex].userAmount = parseFloat(
            (userCurrencies[toCurrencyIndex].userAmount + parseFloat((amount * rate).toFixed(2))).toFixed(2),
        )
        this.setState({ userCurrencies })
    }

    render(): React.ReactElement<any> {
        const { userCurrencies } = this.state

        return (
            <div className="App">
                <ExchangeScreen userCurrencies={userCurrencies} onCurrencyExchange={this.exchangeCurrency} />
            </div>
        )
    }
}

export default App
