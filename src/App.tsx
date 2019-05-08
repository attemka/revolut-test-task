import React from 'react'
import ExchangeScreen, { CurrencyEntity } from './screens/ExchangeScreen/ExchangeScreen'

type AppState = {
    userCurrencies: CurrencyEntity[]
}

class App extends React.Component {
    state: AppState = {
        userCurrencies: [
            { name: 'GBP', userAmount: 100.0 },
            { name: 'USD', userAmount: 100.0 },
            { name: 'EUR', userAmount: 100.0 },
        ],
    }



    exchangeCurrency = (fromCurr: string, toCurr: string, amount: number, rate: number): void => {
        const { userCurrencies } = this.state
        const fromCurrencyIndex = userCurrencies.findIndex(currency => currency.name === fromCurr)
        const toCurrencyIndex = userCurrencies.findIndex(currency => currency.name === toCurr)

        userCurrencies[fromCurrencyIndex].userAmount = this.floorNum(
            userCurrencies[fromCurrencyIndex].userAmount - amount,
        )

        userCurrencies[toCurrencyIndex].userAmount = this.floorNum(
            userCurrencies[toCurrencyIndex].userAmount + amount * rate,
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
