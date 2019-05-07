import { theme } from '../../utils/theme'
import styled from 'styled-components'

export const H5 = styled('div')<{ color?: string }>`
    color: ${({ color }) => color || theme.TEXT_COLOR};
    font: ${theme.H5} ${theme.FONT};
`

export const H4 = styled('div')<{ color?: string }>`
    color: ${({ color, theme }) => color || theme.TEXT_COLOR};
    font: ${theme.H4} ${theme.FONT};
`

export const H3 = styled('div')<{ color?: string }>`
    color: ${({ color }) => color || theme.TEXT_COLOR};
    font: ${theme.H3} ${theme.FONT};
`

export const H2 = styled('div')<{ color?: string }>`
    color: ${({ color, theme }) => color || theme.TEXT_COLOR};
    font: ${theme.H2} ${theme.FONT};
`

export const H1 = styled('div')<{ color?: string }>`
    color: ${({ color }) => color || theme.TEXT_COLOR};
    font: ${theme.H1} ${theme.FONT};
`

export const ColoredButton = styled('button')<{ background?: string; disabled: boolean }>`
    width: 120px;
    height: 40px;
    color: ${theme.TEXT_COLOR};
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    background: ${({ background, disabled }) => (disabled ? theme.DISABLED_COLOR : background || theme.PRIMARY_COLOR)};
    text-transform: uppercase;
    border: 0;
    border-radius: 5px;
`

export const Colored = styled.div`
    color: ${({ color }) => color};
`

export const HiddenValue = styled.div`
    opacity: 0;
    font: ${theme.H2} ${theme.FONT};
`
