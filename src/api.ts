export const getCurrencyRates = (currencyName: string): Promise<string> =>{
    return fetch(
        ` https://api.exchangeratesapi.io/latest?base=${currencyName}`,
    )
        .then(res => res.json())
        .then(res => res.rates)
}