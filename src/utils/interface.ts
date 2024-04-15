export interface ICategory {
  id: string;
  name: string;
}
export interface IProduct {
  id: string;
  category: ICategory;
  name: string;
  price: number;
  photo: string;
}
export interface IClient {
  id: string;
  name: string;
  photo: string;
}
export interface IPurchase {
  id: string;
  name: string;
  amount: number;
  price: number;
}
export interface ISale {
  client: IClient;
  product: IProduct;
  amount: number;
  price: number;
  isPaid: boolean;
}
export interface IStock {
  id: string;
  product: IProduct;
  amount: number;
  hasStock: boolean;
}

