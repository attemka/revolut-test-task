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
    currentActive: string
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
        currentActive: 'sender',
    }

    updateRatesInterval?: number = undefined

    componentDidMount(): void {
        this.updateRates()
        this.updateRatesInterval = setInterval(this.updateRates, 10 * 1000)
    }

    updateRates = () => {
        const {
            currentSendCurrency,
            currentReceiveCurrency,
            sendExchangeAmount,
            receiveExchangeAmount,
            currentActive,
        } = this.state
        getCurrencyRates(currentSendCurrency).then(res => {
            this.setState({
                currencies: res,
                receiveExchangeAmount:
                    currentActive === 'sender' && sendExchangeAmount
                        ? (Number(sendExchangeAmount) * res[currentReceiveCurrency]).toFixed(2)
                        : receiveExchangeAmount,
                sendExchangeAmount:
                    currentActive === 'receiver' && receiveExchangeAmount
                        ? (Number(sendExchangeAmount) * res[currentReceiveCurrency]).toFixed(2)
                        : sendExchangeAmount,
            })
        })
    }

    updateRatesValues = (isSender: boolean, value: number): void => {
        const { currencies, currentReceiveCurrency } = this.state
        if (!currencies) return
        const calculatedValue: string = isSender
            ? (value * currencies[currentReceiveCurrency]).toFixed(2)
            : (value / currencies[currentReceiveCurrency]).toFixed(2)

        this.setState({
            sendExchangeAmount: isSender ? value : calculatedValue,
            receiveExchangeAmount: isSender ? calculatedValue : value,
            currentActive: isSender ? 'sender' : 'receiver',
        })
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement>, isSender: boolean) => {
        const floatRegex = /^([1-9][0-9]{0,9})([.][1-9]{0,2})?$|^0(\.[0-9]{0,2})?$/
        if (!floatRegex.test(event.target.value)) {
            if (!event.target.value) {
                this.setState({ sendExchangeAmount: '', receiveExchangeAmount: '' })
            }
            return
        }
        const value: string = event.target.value.match(floatRegex)![0]
        const numberValue: number = parseFloat(value)
        this.updateRatesValues(isSender, numberValue)
    }

    updateCurrenciesValues = (currencyValue: string, isSender: boolean): void => {
        const { currentReceiveCurrency, currentSendCurrency, receiveExchangeAmount, sendExchangeAmount } = this.state
        const sameValue: boolean = isSender
            ? currencyValue === currentReceiveCurrency
            : currencyValue === currentSendCurrency
        const requestCurrencyValue = isSender ? currencyValue : sameValue ? currentReceiveCurrency : currentSendCurrency

        getCurrencyRates(requestCurrencyValue).then((res: { [key: string]: number }) => {
            let secondFieldValue: string = ''
            const helperExchangeAmount: string = isSender
                ? sendExchangeAmount
                : sameValue
                    ? receiveExchangeAmount
                    : sendExchangeAmount

            if (helperExchangeAmount) {
                secondFieldValue = isSender
                    ? (
                          Number(sendExchangeAmount) * res[sameValue ? currentSendCurrency : currentReceiveCurrency]
                      ).toFixed(2)
                    : sameValue
                        ? (Number(helperExchangeAmount) * res[currentSendCurrency]).toFixed(2)
                        : (Number(helperExchangeAmount) / res[currencyValue]).toFixed(2)
            }
            isSender
                ? this.setState({
                      currencies: res,
                      currentReceiveCurrency: sameValue ? currentSendCurrency : currentReceiveCurrency,
                      receiveExchangeAmount: secondFieldValue,
                  })
                : this.setState({
                      currencies: res,
                      currentSendCurrency: sameValue ? currentReceiveCurrency : currentSendCurrency,
                      sendExchangeAmount: secondFieldValue,
                  })
        })
        this.setState({ [isSender ? 'currentSendCurrency' : 'currentReceiveCurrency']: currencyValue })
    }

    handleCurrencyChange = (currency: ValueType<{ value: string; label: string }>, isSender: boolean) => {
        if (currency && !Array.isArray(currency)) {
            this.updateCurrenciesValues(currency.value, isSender)
        } else {
            return
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
        const { userCurrencies } = this.props
        const currencyList = userCurrencies.map(currency => ({ value: currency.name, label: currency.name }))
        const sendCurrency = userCurrencies.find(currency => currency.name === currentSendCurrency)!
        const receiveCurrency = userCurrencies.find(currency => currency.name === currentReceiveCurrency)!

        return (
            <ExchangeScreenContainer>
                <Exchange
                    data-testid="send-exchange-field"
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
                        data-testid={'exchange-button'}
                        disabled={
                            !parseFloat(sendExchangeAmount) || parseFloat(sendExchangeAmount) > sendCurrency.userAmount
                        }
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
