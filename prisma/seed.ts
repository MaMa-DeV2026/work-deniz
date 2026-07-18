import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const IMG = (id: string) => `/images/placeholder/${id}`;

const COLLECTION_IMAGES: Record<string, string> = {
  classic: 'collection-classic.svg',
  ocean: 'collection-ocean.svg',
  night: 'collection-night.svg',
};

async function main() {
  console.log('🌱 Seeding DENIZ Watch database...');

  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.location.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.careerApplication.deleteMany();

  // ---- Collections ----
  const classic = await prisma.collection.create({
    data: {
      name_fa: 'دنیز کلاسیک',
      name_en: 'DENIZ Classic',
      slug: 'deniz-classic',
      description_fa:
        'مجموعه کلاسیک دنیز، بازتابی از اصالت و وقار با بدنه‌ای از استیل ضدزنگ و طراحی همیشگی.',
      description_en:
        'The DENIZ Classic collection — a reflection of heritage and elegance with stainless steel cases and timeless design.',
      coverImage: IMG(COLLECTION_IMAGES.classic),
      sortOrder: 0,
    },
  });

  const ocean = await prisma.collection.create({
    data: {
      name_fa: 'دنیز اقیانوس',
      name_en: 'DENIZ Ocean',
      slug: 'deniz-ocean',
      description_fa:
        'مجموعه اقیانوس برای ماجراجویان دریا طراحی شده؛ مقاومت بالا در برابر آب و الهام از ژرفای اقیانوس.',
      description_en:
        'The DENIZ Ocean collection is designed for sea adventurers — high water resistance inspired by ocean depths.',
      coverImage: IMG(COLLECTION_IMAGES.ocean),
      sortOrder: 1,
    },
  });

  const night = await prisma.collection.create({
    data: {
      name_fa: 'دنیز شب',
      name_en: 'DENIZ Night',
      slug: 'deniz-night',
      description_fa:
        'مجموعه شب با صفحه تیره و جزئیات درخشان، برای لحظاتی که زمان در تاریکی می‌درخشد.',
      description_en:
        'The DENIZ Night collection with dark dials and luminous details — for moments when time shines in the dark.',
      coverImage: IMG(COLLECTION_IMAGES.night),
      sortOrder: 2,
    },
  });

  // ---- Products (4 per collection) ----
  const productData = [
    {
      collectionId: classic.id,
      name_fa: 'کلاسیک نقره‌ای',
      name_en: 'Classic Silver',
      material: 'Steel',
      movement: 'Automatic',
      waterResistance: '100m',
      caseDiameter: '40mm',
      description_fa: 'ساعتی با صفحه نقره‌ای و بند استیل، نماد سادگی لوکس.',
      description_en: 'A timepiece with a silver dial and steel bracelet — the symbol of quiet luxury.',
      rating: 5.0,
      sortOrder: 0,
      img: 'product-default.svg',
    },
    {
      collectionId: classic.id,
      name_fa: 'کلاسیک مشکی',
      name_en: 'Classic Black',
      material: 'Steel',
      movement: 'Quartz',
      waterResistance: '100m',
      caseDiameter: '40mm',
      description_fa: 'طراحی مینیمال با صفحه مشکی مات و دوام بالا.',
      description_en: 'Minimalist design with a matte black dial and lasting durability.',
      rating: 4.8,
      sortOrder: 1,
      img: 'product-default.svg',
    },
    {
      collectionId: classic.id,
      name_fa: 'کلاسیک طلایی',
      name_en: 'Classic Gold',
      material: 'Titanium',
      movement: 'Automatic',
      waterResistance: '100m',
      caseDiameter: '42mm',
      description_fa: 'ترکیب تیتانیوم و رنگ طلایی برای ظاهری باشکوه.',
      description_en: 'A blend of titanium and gold tone for a majestic look.',
      rating: 4.9,
      sortOrder: 2,
      img: 'product-default.svg',
    },
    {
      collectionId: classic.id,
      name_fa: 'کلاسیک سرامیک',
      name_en: 'Classic Ceramic',
      material: 'Ceramic',
      movement: 'Mechanical',
      waterResistance: '100m',
      caseDiameter: '40mm',
      description_fa: 'بدنه سرامیکی سبک با صفحه صدفی و حس لوکس مدرن.',
      description_en: 'Lightweight ceramic case with a mother-of-pearl dial and modern luxury feel.',
      rating: 4.7,
      sortOrder: 3,
      img: 'product-default.svg',
    },
    {
      collectionId: ocean.id,
      name_fa: 'اقیانوس آبی',
      name_en: 'Ocean Blue',
      material: 'Steel',
      movement: 'Automatic',
      waterResistance: '300m',
      caseDiameter: '42mm',
      description_fa: 'با مقاومت ۳۰۰ متری، همراه غواصی شما در ژرفای اقیانوس.',
      description_en: 'With 300m resistance, your diving companion into the ocean depths.',
      rating: 5.0,
      sortOrder: 0,
      img: 'product-default.svg',
    },
    {
      collectionId: ocean.id,
      name_fa: 'اقیانوس سبز',
      name_en: 'Ocean Green',
      material: 'Titanium',
      movement: 'Automatic',
      waterResistance: '300m',
      caseDiameter: '42mm',
      description_fa: 'صفحه سبز مخلوط و قاب تیتانیوم برای ماجراجویی.',
      description_en: 'Teal dial and titanium case built for adventure.',
      rating: 4.9,
      sortOrder: 1,
      img: 'product-default.svg',
    },
    {
      collectionId: ocean.id,
      name_fa: 'اقیانوس کربن',
      name_en: 'Ocean Carbon',
      material: 'Ceramic',
      movement: 'Quartz',
      waterResistance: '300m',
      caseDiameter: '42mm',
      description_fa: 'بدنه کربنی سبک و مقاوم برای ورزش‌های آبی.',
      description_en: 'Lightweight carbon case resistant for water sports.',
      rating: 4.6,
      sortOrder: 2,
      img: 'product-default.svg',
    },
    {
      collectionId: ocean.id,
      name_fa: 'اقیانوس صورتی',
      name_en: 'Ocean Coral',
      material: 'Steel',
      movement: 'Mechanical',
      waterResistance: '300m',
      caseDiameter: '42mm',
      description_fa: 'رنگ مرجانی زنده با جزئیات درخشان برای زیر آب.',
      description_en: 'Vivid coral tone with luminous details for underwater.',
      rating: 4.8,
      sortOrder: 3,
      img: 'product-default.svg',
    },
    {
      collectionId: night.id,
      name_fa: 'شب تاریک',
      name_en: 'Night Dark',
      material: 'Steel',
      movement: 'Automatic',
      waterResistance: '100m',
      caseDiameter: '40mm',
      description_fa: 'صفحه تیره با شاخص‌های درخشان برای شب‌های بی‌انتها.',
      description_en: 'Dark dial with luminous indices for endless nights.',
      rating: 4.9,
      sortOrder: 0,
      img: 'product-default.svg',
    },
    {
      collectionId: night.id,
      name_fa: 'شب نقره‌ای',
      name_en: 'Night Silver',
      material: 'Titanium',
      movement: 'Quartz',
      waterResistance: '100m',
      caseDiameter: '42mm',
      description_fa: 'ترکیب تیتانیوم تیره و جزئیات نقره‌ای ظریف.',
      description_en: 'Dark titanium with delicate silver details.',
      rating: 4.7,
      sortOrder: 1,
      img: 'product-default.svg',
    },
    {
      collectionId: night.id,
      name_fa: 'شب بنفش',
      name_en: 'Night Violet',
      material: 'Ceramic',
      movement: 'Mechanical',
      waterResistance: '100m',
      caseDiameter: '40mm',
      description_fa: 'رنگ بنفش عمیق با صفحه مات و حس اسرارآمیز.',
      description_en: 'Deep violet tone with a matte dial and a mysterious feel.',
      rating: 4.8,
      sortOrder: 2,
      img: 'product-default.svg',
    },
    {
      collectionId: night.id,
      name_fa: 'شب طلایی',
      name_en: 'Night Gold',
      material: 'Steel',
      movement: 'Automatic',
      waterResistance: '100m',
      caseDiameter: '42mm',
      description_fa: 'جزئیات طلایی روی صفحه تیره برای درخشش شبانه.',
      description_en: 'Gold details on a dark dial for nighttime shine.',
      rating: 5.0,
      sortOrder: 3,
      img: 'product-default.svg',
    },
  ];

  for (const p of productData) {
    const { img, ...rest } = p;
    await prisma.product.create({
      data: {
        ...rest,
        images: [IMG(img), IMG(img)],
      },
    });
  }

  // ---- Locations ----
  await prisma.location.createMany({
    data: [
      {
        city_fa: 'یزد',
        city_en: 'Yazd',
        address_fa: 'خیابان امام، پلاک ۱۲، یزد',
        address_en: 'Imam St., No. 12, Yazd',
        phone: '+98 35 1234 5678',
        isActive: true,
        sortOrder: 0,
      },
      {
        city_fa: 'قم',
        city_en: 'Qom',
        address_fa: 'بلوار امین، مجتمع زمان، واحد ۵',
        address_en: 'Amin Blvd., Zaman Complex, Unit 5, Qom',
        phone: '+98 25 9876 5432',
        isActive: true,
        sortOrder: 1,
      },
      {
        city_fa: 'اصفهان',
        city_en: 'Isfahan',
        address_fa: 'چهارباغ عباسی، پاساژ نقش جهان',
        address_en: 'Chaharbagh Abbasi, Naqsh-e Jahan Bazaar, Isfahan',
        phone: '+98 31 1122 3344',
        isActive: true,
        sortOrder: 2,
      },
      {
        city_fa: 'تهران',
        city_en: 'Tehran',
        address_fa: 'خیابان ولیعصر، مجتمع پالادیوم',
        address_en: 'Valiasr St., Palladium Complex, Tehran',
        phone: '+98 21 5566 7788',
        isActive: true,
        sortOrder: 3,
      },
    ],
  });

  // ---- Blog posts ----
  const blogPosts = [
    {
      title_fa: 'هنر ساعت‌سازی در دنیز',
      title_en: 'The Art of Watchmaking at DENIZ',
      slug: 'art-of-watchmaking-deniz',
      excerpt_fa: 'چگونه دنیز زمان را به هنر تبدیل می‌کند؛ از انتخاب متریال تا دقت نهایی.',
      excerpt_en: 'How DENIZ turns time into art — from material selection to final precision.',
      content_fa:
        'در دنیز، هر ساعت محصول ماه‌ها تلاش و دقت است. ما از استیل ضدزنگ گرفته تا تیتانیوم سبک را با ظرافت ترکیب می‌کنیم.\n\nهنر ساعت‌سازی در دنیز یعنی احترام به زمان. هر قطعه با دست بازبینی می‌شود تا بالاترین کیفیت را تضمین کند.\n\nما معتقدیم یک ساعت تنها ابزار اندازه‌گیری نیست، بلکه روایتی از لحظه‌های زندگی شماست.',
      content_en:
        'At DENIZ, every watch is the product of months of effort and precision. We combine everything from stainless steel to lightweight titanium with finesse.\n\nThe art of watchmaking at DENIZ means respect for time. Each piece is hand-inspected to guarantee the highest quality.\n\nWe believe a watch is not merely a measuring tool, but a narrative of your life moments.',
      coverImage: IMG('blog-default.svg'),
      readTime: 5,
    },
    {
      title_fa: 'تفاوت حرکت اتوماتیک و کارتز',
      title_en: 'Automatic vs Quartz Movements',
      slug: 'automatic-vs-quartz',
      excerpt_fa: 'راهنمای کامل انتخاب میان دقت کارتز و جذابیت مکانیکی اتوماتیک.',
      excerpt_en: 'A complete guide to choosing between quartz precision and mechanical charm.',
      content_fa:
        'حرکت اتوماتیک با حرکت مچ شما نیرو می‌گیرد و روح مکانیکی دارد. کارتز با باتری کار می‌کند و دقت بیشتری دارد.\n\nبرای علاقه‌مندان به سنت ساعت‌سازی، اتوماتیک بهترین انتخاب است. برای استفاده روزمره با دقت بالا، کارتز ایده‌آل است.',
      content_en:
        'Automatic movements are powered by your wrist motion and carry a mechanical soul. Quartz runs on a battery and offers greater accuracy.\n\nFor traditional watch enthusiasts, automatic is the best choice. For everyday high-accuracy use, quartz is ideal.',
      coverImage: IMG('blog-default.svg'),
      readTime: 6,
    },
    {
      title_fa: 'نگهداری از ساعت لوکس',
      title_en: 'Caring for Your Luxury Watch',
      slug: 'caring-for-luxury-watch',
      excerpt_fa: 'چند نکته ساده برای ماندگاری بیشتر ساعت دنیز شما.',
      excerpt_en: 'Simple tips to extend the life of your DENIZ watch.',
      content_fa:
        'ساعت خود را دور از میدان‌های مغناطیسی نگه دارید و سالی یکبار سرویس کنید.\n\nبند چرمی را از رطوبت دور نگه دارید؛ بند فلزی را با پارچه نرم تمیز کنید.\n\nبا گارانتی ۵ ساله دنیز، خیال شما از خدمات پس از فروش آسوده است.',
      content_en:
        'Keep your watch away from magnetic fields and service it once a year.\n\nKeep leather straps away from moisture; clean metal bracelets with a soft cloth.\n\nWith DENIZ’s 5-year warranty, your after-sales peace of mind is assured.',
      coverImage: IMG('blog-default.svg'),
      readTime: 4,
    },
    {
      title_fa: 'مجموعه اقیانوس معرفی شد',
      title_en: 'Introducing the Ocean Collection',
      slug: 'introducing-ocean-collection',
      excerpt_fa: 'ساعت‌هایی با الهام از ژرفای اقیانوس و مقاومت ۳۰۰ متری.',
      excerpt_en: 'Watches inspired by ocean depths with 300m resistance.',
      content_fa:
        'مجموعه اقیانوس با مقاومت ۳۰۰ متری برای غواصان و دوستداران دریا طراحی شده است.\n\nصفحه‌های مخلوط و قاب تیتانیوم، حس ماجراجویی را زنده می‌کنند.\n\nهر مدل اقیانوس داستانی از ژرفای آبی اقیانوس دارد.',
      content_en:
        'The Ocean collection, with 300m resistance, is designed for divers and sea lovers.\n\nTeal dials and titanium cases bring the spirit of adventure alive.\n\nEvery Ocean model tells a story of the blue ocean depths.',
      coverImage: IMG('blog-default.svg'),
      readTime: 5,
    },
    {
      title_fa: 'چرا تیتانیوم؟',
      title_en: 'Why Titanium?',
      slug: 'why-titanium',
      excerpt_fa: 'مزایای استفاده از تیتانیوم در ساعت‌های دنیز.',
      excerpt_en: 'The advantages of using titanium in DENIZ watches.',
      content_fa:
        'تیتانیوم سبک‌تر از استیل و مقاوم‌تر در برابر خوردگی است.\n\nبرای افرادی با پوست حساس، تیتانیوم ضدحساسیت است.\n\nدنیز از تیتانیوم درو کالکشن‌های کلاسیک و اقیانوس استفاده می‌کند.',
      content_en:
        'Titanium is lighter than steel and more corrosion-resistant.\n\nFor those with sensitive skin, titanium is hypoallergenic.\n\nDENIZ uses titanium in its Classic and Ocean collections.',
      coverImage: IMG('blog-default.svg'),
      readTime: 4,
    },
    {
      title_fa: 'گارانتی و اصالت دنیز',
      title_en: 'DENIZ Warranty & Authenticity',
      slug: 'deniz-warranty-authenticity',
      excerpt_fa: 'چگونه اصالت ساعت دنیز خود را بررسی کنید.',
      excerpt_en: 'How to verify the authenticity of your DENIZ watch.',
      content_fa:
        'هر ساعت دنیز دارای شماره سریال منحصر به فرد است که در سیستم ما ثبت شده.\n\nبا گارانتی ۵ ساله، تعمیر و نگهداری در نمایندگی‌های فعال انجام می‌شود.\n\nبرای بررسی اصالت، شماره سریال را از طریق فرم تماس ارسال کنید.',
      content_en:
        'Every DENIZ watch has a unique serial number registered in our system.\n\nWith a 5-year warranty, service is performed at active representatives.\n\nTo verify authenticity, send the serial number via the contact form.',
      coverImage: IMG('blog-default.svg'),
      readTime: 5,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        ...post,
        published: true,
        publishedAt: new Date(),
        author: 'رضا احمدی',
      },
    });
  }

  // NOTE: Admin user is configured via environment variables (ADMIN_USERNAME / ADMIN_PASSWORD_HASH),
  // not stored in the database.

  console.log('✅ Seed complete:');
  console.log(`   • 3 collections`);
  console.log(`   • 12 products`);
  console.log(`   • 4 locations (all active)`);
  console.log(`   • 6 blog posts (published)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });