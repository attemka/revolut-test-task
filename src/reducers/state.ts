import { CurrenciesState } from './currencies'

export interface RootState {
    currencies: CurrenciesState;
    router?: any;
}

// export namespace RootState {
//     export type TodoState = TodoModel[];
// }