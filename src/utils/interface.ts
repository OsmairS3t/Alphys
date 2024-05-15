export interface IIcon {
  name: string;
}
export interface ISelectProps {
  key: string;
  value: string;
}
export interface IUser {
  email: string;
  name: string;
  password: string;
}
export interface ICategory {
  id: string;
  name: string;
}
export interface IProduct {
  id: string;
  category: ICategory | undefined;
  name: string;
  price: number;
  photo: string;
}
export interface IClient {
  id: string;
  name: string;
  photo: string;
}
export interface IStock {
  id: string;
  product: IProduct | undefined;
  amount: number;
  hasStock: boolean;
}
export interface IBuy {
  id: string;
  name: string;
  amount: string;
  price: number;
  datebuy: string;
}
export interface ISale {
  id: string;
  client: IClient | undefined;
  product: IProduct | undefined;
  amount: number;
  price: number;
  isPaid: boolean;
  dateSale: string;
}
export interface IOrder {
  id: string;
  client: IClient | undefined;
  product: IProduct | undefined;
  amount: number;
  price: number;
  obs: string;
}
export interface IIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  conditions: string;
}
export interface IRecipe {
  id: string;
  nameproduct: string;
  ingredients: IIngredient[];
  preparation: string;
  cooking: string;
}
//transactions: buy + sale = replications table
export interface ITransactionViewProps {
  id: string;
  description: string;
  modality: 'buy'|'sell';
  modalityicon: string;
  datetransaction: string;
  amount: number;
  price: string;
}

export interface ITransactionProps {
  id: string;
  idtransactiontype: string;
  description: string;
  modality: 'buy'|'sell';
  modalityicon: string;
  datetransaction: Date;
  amount: number;
  price: number;
}

interface HighlightTypeProps {
  price: string;
  lastTransaction: string;
}

export interface IHightLightProps {
  buys: HighlightTypeProps;
  sells: HighlightTypeProps;
  total: HighlightTypeProps;
}
