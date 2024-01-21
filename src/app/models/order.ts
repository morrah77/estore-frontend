import {OrderedProduct} from "./ordered-product";

export interface Order {
  id: number;
  userId: number;
  dateCreated: number;
  dateUpdated: number;
  products: OrderedProduct[];
  totalPrice: number;
  status: string;
  deliveryInfo: string;
}
