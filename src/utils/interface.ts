export interface IIcon {
  name: string;
}
export interface IGraphic {
  x: string;
  y: number;
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
  id: number;
  name: string;
}
export interface IProduct {
  id: number;
  categoryname: string;
  name: string;
  price: number;
  photo: string;
}
export interface IClient {
  id: number;
  name: string;
  photo: string;
}
export interface IStock {
  id: string;
  product_id: number;
  product_name: string;
  product: IProduct | undefined; //remover
  amount: number;
  hasStock: boolean;
}
export interface IOrder {
  id: string;
  client_name: string;
  product_name: string;
  client: IClient | undefined; //remover
  product: IProduct | undefined; //remover
  amount: number;
  price: number;
  obs: string;
}
export interface ITransaction {
  id: number;
  modality: string;
  kind: string;
  place: string;
  product_name: string;
  client_name: string;
  amount: number;
  price: number;
  datetransaction: string;
  ispaid: boolean;
}
export interface IIngredient {
  id: string;
  name: string;
  amount: string;
  conditions: string;
}
export interface IRecipe {
  id: string;
  nameproduct: string;
  ingredients: IIngredient[];
  preparation: string;
  cooking: string;
}
//excluir
export interface IBuy {
  id: string;
  name: string;
  amount: number;
  price: number;
  datebuy: string;
}
//excluir
export interface ISale {
  id: string;
  client: IClient | undefined;
  product: IProduct | undefined;
  amount: number;
  price: number;
  isPaid: boolean;
  dateSale: string;
}
//excluir
export interface ITransactionOld {
  id: string;
  description: string;
  modality: string;
  color: string;
  datetransaction: string;
  amount: number;
  price: string;
}
