import React from 'react'
import { Exchange } from './Exchange'
import { render, cleanup, fireEvent } from 'react-testing-library'

function isElementInput<T extends HTMLElement>(element: T): T is HTMLInputElement {
    // Validate that element is actually an input
    return element instanceof HTMLInputElement
}
describe('Component: exchange', () => {
    afterEach(cleanup)

    const setup = () => {
        const utils = render(
            <Exchange
                onCurrencyChange={jest.fn()}
                currencyList={[
                    { value: 'GBP', label: 'GBP' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                ]}
                currency={'USD'}
                exchangeAmount={'228'}
                isSender={true}
                onInputChange={jest.fn()}
                userAmount={100}
            />,
        )
        const input = utils.getByLabelText('exchange-input')
        const sign = utils.getByLabelText('exchange-sign')
        const userAmount = utils.getByLabelText('user-amount')
        const currencySelect = utils.getByLabelText('current-currency')
        return {
            input,
            sign,
            userAmount,
            currencySelect,
            ...utils,
        }
    }

    test('displays passed currency amount correctly', () => {
        const { input } = setup()
        // @ts-ignore
        expect(input.value).toEqual('228')
    })

    test('should render correct sign', () => {
        const { sign } = setup()
        expect(sign.textContent).toEqual('-')
    })

    test('displays user amount correctly', () => {
        const { userAmount } = setup()
        expect(userAmount.textContent).toEqual('current amount: 100')
    })

    test('displays current currency correctly', () => {
        const { getByText } = setup()
        expect(getByText('USD').textContent).toEqual('USD')
    })
})
