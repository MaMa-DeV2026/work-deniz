import { z } from 'zod';

// Accepts absolute URLs, root-relative paths (e.g. /uploads/x.png) and data URIs.
const imageRef = z
  .string()
  .refine(
    (v) => /^https?:\/\//.test(v) || v.startsWith('/') || v.startsWith('data:'),
    'آدرس تصویر معتبر نیست'
  );

export const contactSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(100),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  subject: z.string().min(3, 'موضوع باید حداقل ۳ کاراکتر باشد').max(200),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد').max(2000),
});

export const careerSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(100),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  phone: z.string().min(10, 'شماره تماس معتبر وارد کنید').max(20),
  position: z.enum(['designer', 'sales', 'support', 'other'], { errorMap: () => ({ message: 'موقعیت شغلی را انتخاب کنید' }) }),
  message: z.string().min(20, 'پیام باید حداقل ۲۰ کاراکتر باشد').max(3000),
  resumeUrl: z.string().url('لینک رزومه معتبر نیست').optional().or(z.literal('')),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

export const collectionSchema = z.object({
  name_fa: z.string().min(1, 'نام فارسی الزامی است').max(100),
  name_en: z.string().min(1, 'English name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description_fa: z.string().min(1, 'توضیحات فارسی الزامی است').max(1000),
  description_en: z.string().min(1, 'English description is required').max(1000),
  coverImage: imageRef,
  sortOrder: z.number().int().min(0).default(0),
});

export const productSchema = z.object({
  name_fa: z.string().min(1, 'نام فارسی الزامی است').max(100),
  name_en: z.string().min(1, 'English name is required').max(100),
  collectionId: z.string().cuid('Invalid collection ID'),
  material: z.enum(['Steel', 'Titanium', 'Ceramic']),
  movement: z.enum(['Automatic', 'Quartz', 'Mechanical']),
  waterResistance: z.enum(['100m', '300m']),
  caseDiameter: z.enum(['40mm', '42mm']),
  description_fa: z.string().min(1, 'توضیحات فارسی الزامی است').max(2000),
  description_en: z.string().min(1, 'English description is required').max(2000),
  images: z.array(imageRef).min(1, 'حداقل یک تصویر الزامی است'),
  rating: z.number().min(0).max(5).default(5.0),
  sortOrder: z.number().int().min(0).default(0),
});

export const blogSchema = z.object({
  title_fa: z.string().min(1, 'عنوان فارسی الزامی است').max(200),
  title_en: z.string().min(1, 'English title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  excerpt_fa: z.string().min(1, 'خلاصه فارسی الزامی است').max(500),
  excerpt_en: z.string().min(1, 'English excerpt is required').max(500),
  content_fa: z.string().min(1, 'محتوا فارسی الزامی است').max(50000),
  content_en: z.string().min(1, 'English content is required').max(50000),
  coverImage: imageRef,
  author: z.string().max(100).default('رضا احمدی'),
  published: z.boolean().default(false),
  readTime: z.number().int().min(1).max(60).default(5),
});

export const locationSchema = z.object({
  city_fa: z.string().min(1, 'نام شهر فارسی الزامی است').max(100),
  city_en: z.string().min(1, 'English city name is required').max(100),
  address_fa: z.string().min(1, 'آدرس فارسی الزامی است').max(500),
  address_en: z.string().min(1, 'English address is required').max(500),
  phone: z.string().min(10, 'شماره تماس معتبر وارد کنید').max(20),
  isActive: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type CareerInput = z.infer<typeof careerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type LocationInput = z.infer<typeof locationSchema>;