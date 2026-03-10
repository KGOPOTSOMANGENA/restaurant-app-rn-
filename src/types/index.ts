// src/types/index.ts
export type Category = {
  id: string;
  name: string;
  icon?: string;
  active: boolean;
  order?: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  active: boolean;
  options?: {
    sides?: { id: string; name: string; included?: boolean; maxSelect?: number; price?: number }[];
    drinks?: { id: string; name: string; included?: boolean; price?: number }[];
    extras?: { id: string; name: string; price: number }[];
    removableIngredients?: string[];
  };
  createdAt?: any;
  updatedAt?: any;
};