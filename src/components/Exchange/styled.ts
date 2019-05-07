import styled from 'styled-components'
import { theme } from '../../utils/theme'
import {H5} from '../common/styled'

export const ExchangeContainer = styled.div`
    width: 100%;
    height: 50px;
    margin: 0 20px;
    padding: 20px 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: ${({ color }) => color || theme.PRIMARY_COLOR};
    caret-color: ${theme.TEXT_COLOR};
    position: relative;
`

export const CurrencyContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 120px;
`

export const UserAmountContainer = styled(H5)`
  white-space: nowrap;
`

export const ExchangeInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font: ${theme.H2} ${theme.FONT};
`

export const CurrencyRateBlock = styled.div`
    position: absolute;
    bottom: 70px;
    right: -30px;
`

export const InputWrapper = styled.div`
    position: relative;
    min-width: 5px;
    min-height: 26px;
`

export const ExchangeInput = styled('input')<{ value: string; widthVal?: string | null }>`
    background: ${({ color }) => color || theme.PRIMARY_COLOR};
    color: ${theme.TEXT_COLOR};
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;  
    font: ${theme.H2} ${theme.FONT};
    text-align: end;
    border: 0;
    overflow: hidden;
    :focus {
        outline: none;
    }
    ::placeholder {
        color: ${theme.TEXT_LIGHT_COLOR};
    }
`
