import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  price: z.number().positive(),
  cat: z.string().min(1),
  desc: z.string().optional(),
  image: z.string().optional(),
});

export const ProductListSchema = z.object({
  Items: z.array(ProductSchema),
});

export const CartItemSchema = z.object({
  id: z.string(),
  cookie: z.string(),
  prod_id: z.number(),
  flag: z.string(),
});

export const CartSchema = z.object({
  Items: z.array(CartItemSchema).nullable(),
});

export const AuthResponseSchema = z.union([
  z.string().min(1),
  z.object({
    errorMessage: z.string(),
  }),
]);

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
export type Cart = z.infer<typeof CartSchema>;
