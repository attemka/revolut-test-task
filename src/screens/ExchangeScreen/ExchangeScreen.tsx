import React, { ChangeEvent, Component } from 'react'
import { ExchangeScreenContainer, ConfirmButtonContainer } from './styled'
import { Exchange } from '../../components/Exchange/Exchange'
import { ValueType } from 'react-select/lib/types'
import { getCurrencyRates } from '../../api'
import { ColoredButton, H5 } from '../../components/common/styled'
import { theme } from '../../utils/theme'
import { CurrencyRateBlock } from '../../components/Exchange/styled'

type ExchangeScreenState = {
    sendExchangeAmount: string
    receiveExchangeAmount: string
    currentSendCurrency: string
    currentReceiveCurrency: string
    currencies?: {
        [key: string]: number
    }
}

type ExchangeScreenProps = {
    userCurrencies: CurrencyEntity[]
    onCurrencyExchange: (fromCurr: string, toCurr: string, amount: number, rate: number) => void
}

export type CurrencyEntity = {
    name: string
    userAmount: number
}

class ExchangeScreen extends Component<ExchangeScreenProps> {
    state: ExchangeScreenState = {
        sendExchangeAmount: '',
        receiveExchangeAmount: '',
        currentReceiveCurrency: this.props.userCurrencies[0].name,
        currentSendCurrency: this.props.userCurrencies[1].name,
    }

    updateRatesInterval?: number = undefined

    componentDidMount(): void {
        this.updateRates()
        this.updateRatesInterval = setInterval(this.updateRates, 10 * 1000)
    }

    updateRates = () => {
        const { currentSendCurrency, currentReceiveCurrency, sendExchangeAmount, receiveExchangeAmount } = this.state
        getCurrencyRates(currentSendCurrency).then(res =>
            this.setState({
                currencies: res,
                receiveExchangeAmount: sendExchangeAmount
                    ? (Number(sendExchangeAmount) * res[currentReceiveCurrency]).toFixed(2)
                    : receiveExchangeAmount,
            }),
        )
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement>, isSender: boolean) => {
        const floatRegex = /([+-]?)([1-9]+)[.]?[0-9]{0,2}|^0$/
        if (!floatRegex.test(event.target.value)) {
            if (!event.target.value) {
                this.setState({ sendExchangeAmount: '', receiveExchangeAmount: '' })
                return
            } else return
        }
        const value = event.target.value.match(floatRegex)![0]
        const numberValue: number = parseFloat(value)
        const { currencies, currentReceiveCurrency } = this.state
        if (!currencies) {
            return
        }

        if (isSender) {
            const receiverRate: string = (numberValue * currencies[currentReceiveCurrency]).toFixed(2)
            this.setState({ sendExchangeAmount: value, receiveExchangeAmount: receiverRate })
        } else {
            const senderRate: string = (numberValue / currencies[currentReceiveCurrency]).toFixed(2)
            this.setState({ receiveExchangeAmount: value, sendExchangeAmount: senderRate })
        }
    }

    handleCurrencyChange = (currency: ValueType<{ value: string; label: string }>, isParent: boolean) => {
        const { currentReceiveCurrency, currentSendCurrency, sendExchangeAmount, receiveExchangeAmount } = this.state
        if (Array.isArray(currency)) {
            return //type checking
        } else {
            if (!currency) {
                return
            }
            if (isParent) {
                if (currency.value === currentReceiveCurrency) {
                    getCurrencyRates(currency.value).then((res: { [key: string]: number }) => {
                        const receiverRate: string = (Number(sendExchangeAmount) * res[currentSendCurrency]).toFixed(2)
                        this.setState({
                            currencies: res,
                            receiveExchangeAmount: receiverRate,
                            currentReceiveCurrency: currentSendCurrency,
                        })
                    })
                } else {
                    getCurrencyRates(currency.value).then((res: { [key: string]: number }) => {
                        const receiverRate: string = (Number(sendExchangeAmount) * res[currentReceiveCurrency]).toFixed(
                            2,
                        )
                        this.setState({ currencies: res, receiveExchangeAmount: receiverRate })
                    })
                }
                this.setState({ currentSendCurrency: currency.value })
            } else {
                if (currency.value === currentSendCurrency) {
                    getCurrencyRates(currentReceiveCurrency).then(res => {
                        const senderValue: string = (Number(receiveExchangeAmount) * res[currentSendCurrency]).toFixed(
                            2,
                        )
                        this.setState({
                            currencies: res,
                            currentSendCurrency: currentReceiveCurrency,
                            sendExchangeAmount: senderValue,
                        })
                    })
                } else {
                    getCurrencyRates(currentSendCurrency).then(res => {
                        const senderValue: string = (Number(sendExchangeAmount) / res[currency.value]).toFixed(2)
                        this.setState({ currencies: res, sendExchangeAmount: senderValue })
                    })
                }
                this.setState({ currentReceiveCurrency: currency.value })
            }
        }
    }

    handleCurrencyExchange = () => {
        const { sendExchangeAmount, currentReceiveCurrency, currentSendCurrency, currencies } = this.state
        if (!currencies) return
        this.props.onCurrencyExchange(
            currentSendCurrency,
            currentReceiveCurrency,
            parseFloat(sendExchangeAmount),
            currencies[currentReceiveCurrency],
        )
        this.setState({ sendExchangeAmount: '', receiveExchangeAmount: '' })
    }

    render(): React.ReactElement<any> {
        const {
            sendExchangeAmount,
            receiveExchangeAmount,
            currentReceiveCurrency,
            currentSendCurrency,
            currencies,
        } = this.state
        const currencyList = this.props.userCurrencies.map(currency => ({ value: currency.name, label: currency.name }))
        const sendCurrency = this.props.userCurrencies.find(currency => currency.name === currentSendCurrency)!
        const receiveCurrency = this.props.userCurrencies.find(currency => currency.name === currentReceiveCurrency)!

        return (
            <ExchangeScreenContainer>
                <Exchange
                    data-testid={'send-exchange-field'}
                    currency={currentSendCurrency}
                    currencyList={currencyList}
                    onCurrencyChange={this.handleCurrencyChange}
                    userAmount={sendCurrency.userAmount}
                    exchangeAmount={sendExchangeAmount}
                    isSender={true}
                    onInputChange={this.handleInputChange}
                    bgColor={theme.PRIMARY_COLOR}
                />
                <Exchange
                    data-testid={'receive-exchange-field'}
                    currency={currentReceiveCurrency}
                    currencyList={currencyList}
                    onCurrencyChange={this.handleCurrencyChange}
                    userAmount={receiveCurrency.userAmount}
                    exchangeAmount={receiveExchangeAmount}
                    isSender={false}
                    rate={currencies && currencies[currentSendCurrency]}
                    onInputChange={this.handleInputChange}
                    bgColor={theme.SECONDARY_COLOR}
                />
                {currencies && (
                    <CurrencyRateBlock>
                        <H5>
                            {new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: currentSendCurrency,
                            }).format(1)}{' '}
                            =
                            {new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: currentReceiveCurrency,
                            }).format(currencies[currentReceiveCurrency])}
                        </H5>
                    </CurrencyRateBlock>
                )}
                <ConfirmButtonContainer>
                    <ColoredButton
                        disabled={!sendExchangeAmount || parseFloat(sendExchangeAmount) > sendCurrency.userAmount}
                        onClick={this.handleCurrencyExchange}
                    >
                        exchange
                    </ColoredButton>
                </ConfirmButtonContainer>
            </ExchangeScreenContainer>
        )
    }
}

export default ExchangeScreen
