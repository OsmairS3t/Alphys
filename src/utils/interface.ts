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
  id: number;
  email: string;
  name: string;
  password: string;
  photo: string;
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
  id: number;
  product_id: number;
  product_name: string;
  amount: number;
  hasstock: boolean;
}
export interface IOrder {
  id: number;
  client_name: string;
  product_name: string;
  amount: number;
  price: number;
  obs: string;
}
export interface IIngredient {
  id: number;
  name: string;
  amount: string;
  conditions: string;
}
export interface IRecipe {
  id: number;
  nameproduct: string;
  ingredients: IIngredient[];
  preparation: string;
  cooking: string;
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
  stock_id: number;
}
export type TList = {
  modalidy: string
  datetransaction: string
  price: number
}