import React, { ChangeEvent, Component, RefObject } from 'react'
import {
    ExchangeContainer,
    CurrencyContainer,
    ExchangeInput,
    ExchangeInputContainer,
    CurrencyRateBlock,
    InputWrapper,
} from './styled'
import { Colored, H5, HiddenValue } from '../common/styled'
import Select from 'react-select'
import { ValueType } from 'react-select/lib/types'
import { theme } from '../../utils/theme'

type ExchangeProps = {
    currency: string
    currencyList: {
        value: string
        label: string
    }[]
    onCurrencyChange: (currency: ValueType<{ value: string; label: string }>, isSender: boolean) => void
    userAmount: number
    exchangeAmount: string
    isSender: boolean
    rate?: number
    onInputChange: (e: ChangeEvent<HTMLInputElement>, isSender: boolean) => void
    bgColor?: string
}

const colourStyles = (color: string | undefined) => ({
    control: (styles: any) => ({ ...styles, backgroundColor: color, color: theme.TEXT_COLOR }),
    singleValue: (styles: any) => ({ ...styles, color: theme.TEXT_COLOR }),
})

export const Exchange: React.FC<ExchangeProps> = ({
    currency,
    currencyList,
    onCurrencyChange,
    userAmount,
    exchangeAmount,
    rate,
    isSender,
    onInputChange,
    bgColor,
    ...props
}) => {
    let inputRef: any = React.createRef()

    //@ts-ignore
    return (
        <ExchangeContainer color={bgColor}>
            <CurrencyContainer>
                <Select
                    aria-label={'current-currency'}
                    value={currencyList.find(currencyItem => currencyItem.label === currency)}
                    onChange={(val: ValueType<{ value: string; label: string }>) => onCurrencyChange(val, isSender)}
                    options={currencyList}
                    styles={colourStyles(bgColor)}
                />
                <H5 aria-label={'user-amount'}>current amount: {userAmount}</H5>
            </CurrencyContainer>
            <ExchangeInputContainer>
                <Colored aria-label={'exchange-sign'} color={theme.TEXT_COLOR} style={{ paddingRight: '5px' }}>
                    {exchangeAmount ? (isSender ? '-' : '+') : ''}
                </Colored>
                <InputWrapper>
                    <HiddenValue>{exchangeAmount || '0'}</HiddenValue>
                    <ExchangeInput
                        data-testid={`exchange-input-${isSender ? 'sender' : 'receiver'}`}
                        aria-label={'exchange-input'}
                        color={bgColor}
                        //@ts-ignore
                        widthVal={(inputRef.current && inputRef.current.clientWidth) || '1'}
                        placeholder={'0'}
                        autoFocus={isSender}
                        value={exchangeAmount}
                        onChange={e => onInputChange(e, isSender)}
                    />
                </InputWrapper>
            </ExchangeInputContainer>
        </ExchangeContainer>
    )
}
