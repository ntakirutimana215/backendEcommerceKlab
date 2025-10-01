// types/cart.d.ts (or inside CartContext.tsx if you prefer)
export interface CartProduct {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  user: string;
  products: CartProduct[];
}
