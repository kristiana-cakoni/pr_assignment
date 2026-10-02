export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  unit: string;
};

export type OrderLine = {
  productId: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
};

export type Receipt = {
  id: string;
  createdAt: string;
  lines: OrderLine[];
  total: number;
};
