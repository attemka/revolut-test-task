import React from 'react'
import ExchangeScreen from './ExchangeScreen'
import { render, cleanup, fireEvent, waitForDomChange } from 'react-testing-library'
import 'jest-dom/extend-expect'

describe('Component: ExchangeScreen', () => {
    afterEach(cleanup)

    const setup = () => {
        const currencyChangeMock = jest.fn()
        const utils = render(
            <ExchangeScreen
                userCurrencies={[
                    { name: 'GBP', userAmount: 100.0 },
                    { name: 'USD', userAmount: 100.0 },
                    { name: 'EUR', userAmount: 100.0 },
                ]}
                onCurrencyExchange={currencyChangeMock}
            />,
        )

        const senderInput = utils.getByTestId('exchange-input-sender') as HTMLInputElement
        const receiverInput = utils.getByTestId('exchange-input-receiver') as HTMLInputElement
        const exchangeButton = utils.getByTestId('exchange-button')
        return {
            senderInput,
            receiverInput,
            exchangeButton,
            ...utils,
        }
    }

    test('sender input change triggers receiver input change', async () => {
        const { senderInput, receiverInput } = setup()
        // @ts-ignore
        waitForDomChange().then(async () => {
            fireEvent.change(senderInput, { target: { value: '123' } })
            // @ts-ignore
            await waitForDomChange().then(() => expect(receiverInput.value).toBe())
        })
    })

    test('receiver input change triggers sender input change', async () => {
        const { senderInput, receiverInput } = setup()
        // @ts-ignore
        waitForDomChange().then(async () => {
            fireEvent.change(receiverInput, { target: { value: '123' } })
            // @ts-ignore
            await waitForDomChange().then(() => expect(senderInput.value).toBe())
        })
    })

    test('only valid input value can be displayed', async () => {
        const { senderInput } = setup()
        // @ts-ignore
        waitForDomChange().then(async () => {
            fireEvent.change(senderInput, { target: { value: '123' } })

            fireEvent.change(senderInput, { target: { value: '123_four_five' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('123'))

            fireEvent.change(senderInput, { target: { value: '123.ff' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('123'))

            fireEvent.change(senderInput, { target: { value: 'aaaa' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('123'))

            fireEvent.change(senderInput, { target: { value: '.8' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('123'))
        })
    })

    test('all valid values are displayed', async () => {
        const { senderInput } = setup()
        waitForDomChange().then(async () => {
            fireEvent.change(senderInput, { target: { value: '1234567' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('1234567'))

            fireEvent.change(senderInput, { target: { value: '123456.01' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('123456.01'))

            fireEvent.change(senderInput, { target: { value: '123456.78' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('123456.78'))

            fireEvent.change(senderInput, { target: { value: '0.22' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('0.22'))

            fireEvent.change(senderInput, { target: { value: '0.01' } })
            await waitForDomChange().then(() => expect(senderInput.value).toEqual('0.01'))
        })
    })

    test('confirm button is disabled when exchange value is incorrect', async () => {
        const { senderInput, exchangeButton } = setup()
        waitForDomChange().then(async () => {
            fireEvent.change(senderInput, { target: { value: '0' } })
            await waitForDomChange().then(() => expect(exchangeButton).toHaveAttribute('disabled'))

            fireEvent.change(senderInput, { target: { value: '100.01' } })
            await waitForDomChange().then(() => expect(exchangeButton).toHaveAttribute('disabled'))

            fireEvent.change(senderInput, { target: { value: '50' } })
            await waitForDomChange().then(() => expect(exchangeButton).not.toHaveAttribute('disabled'))
        })
    })
})
