export interface ICategory {
  id: string;
  nameCategory: string;
}
export interface IProduct {
  id: string;
  category: ICategory;
  nameProduct: string;
  price: number;
  photo: string;
}
export interface IClient {
  id: string;
  nameClient: string;
  photo: string;
}
export interface IPurchase {
  id: string;
  nameItem: string;
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

