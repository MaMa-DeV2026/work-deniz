import type {
  Collection as PrismaCollection,
  Product as PrismaProduct,
  BlogPost as PrismaBlogPost,
} from '@prisma/client';

export type Collection = PrismaCollection;
export type Product = PrismaProduct;
export type BlogPost = PrismaBlogPost;

export type CollectionWithProducts = PrismaCollection & {
  products: Product[];
};
