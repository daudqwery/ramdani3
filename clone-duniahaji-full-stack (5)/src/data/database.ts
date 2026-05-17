// ============================================
// RAMDANI BARKAH - DATABASE LAYER
// localStorage-based database for catalog management
// ============================================

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image?: string;
  sku?: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  thumbnail: string;
  isActive: boolean;
  categoryIds: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpec[];
  stock: number;
  weight?: string;
  rating: number;
  reviews: number;
  isBestSeller: boolean;
  isNew: boolean;
  isDiscount: boolean;
  tags: string[];
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  parentId: string | null;
  order: number;
  productCount?: number;
}

// ============================================
// DATABASE KEYS
// ============================================
const DB_KEYS = {
  PRODUCTS: "rb_db_products",
  CATEGORIES: "rb_db_categories",
  ORDERS: "rb_db_orders",
  SETTINGS: "rb_db_settings",
  INITIALIZED: "rb_db_initialized",
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

// ============================================
// DATABASE CRUD OPERATIONS
// ============================================
export const db = {
  // ---- PRODUCTS ----
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(DB_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getActiveProducts(): Product[] {
    return this.getProducts().filter((p) => p.isActive);
  },

  getProduct(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },

  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find((p) => p.slug === slug);
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      products.push({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  },

  toggleProductStatus(id: string): void {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      product.isActive = !product.isActive;
      product.updatedAt = new Date().toISOString();
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    }
  },

  searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return this.getProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  },

  getProductsByCategory(categoryId: string): Product[] {
    return this.getActiveProducts().filter((p) => p.categoryIds.includes(categoryId));
  },

  // ---- CATEGORIES ----
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(DB_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getParentCategories(): Category[] {
    return this.getCategories().filter((c) => !c.parentId).sort((a, b) => a.order - b.order);
  },

  getSubCategories(parentId: string): Category[] {
    return this.getCategories().filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order);
  },

  getCategory(id: string): Category | undefined {
    return this.getCategories().find((c) => c.id === id);
  },

  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  deleteCategory(id: string): void {
    let categories = this.getCategories().filter((c) => c.id !== id && c.parentId !== id);
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(categories));
    // Remove category from products
    const products = this.getProducts();
    products.forEach((p) => {
      p.categoryIds = p.categoryIds.filter((cid) => cid !== id);
    });
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // ---- STATS ----
  getStats() {
    const products = this.getProducts();
    const categories = this.getCategories();
    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.isActive).length,
      inactiveProducts: products.filter((p) => !p.isActive).length,
      totalCategories: categories.length,
      bestSellers: products.filter((p) => p.isBestSeller).length,
      newProducts: products.filter((p) => p.isNew).length,
      discountProducts: products.filter((p) => p.isDiscount).length,
      outOfStock: products.filter((p) => p.stock <= 0).length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    };
  },

  // ---- INIT ----
  isInitialized(): boolean {
    return localStorage.getItem(DB_KEYS.INITIALIZED) === "true";
  },

  initialize(products: Product[], categories: Category[]): void {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(categories));
    localStorage.setItem(DB_KEYS.INITIALIZED, "true");
  },

  reset(): void {
    Object.values(DB_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};

// ============================================
// SEED DATA - Convert existing products to DB format
// ============================================
export function getSeedCategories(): Category[] {
  return [
    { id: "cat-kurma", name: "Kurma", slug: "kurma", icon: "🌴", color: "from-amber-400 to-amber-600", parentId: null, order: 1 },
    { id: "cat-zamzam", name: "Air Zamzam", slug: "air-zamzam", icon: "💧", color: "from-blue-400 to-blue-600", parentId: null, order: 2 },
    { id: "cat-sajadah", name: "Sajadah", slug: "sajadah", icon: "🕌", color: "from-green-400 to-green-600", parentId: null, order: 3 },
    { id: "cat-coklat", name: "Coklat Arab", slug: "coklat-arab", icon: "🍫", color: "from-amber-700 to-amber-900", parentId: null, order: 4 },
    { id: "cat-haji", name: "Perlengkapan Haji", slug: "perlengkapan-haji", icon: "🤲", color: "from-teal-400 to-teal-600", parentId: null, order: 5 },
    { id: "cat-sabun", name: "Sabun & Herbal", slug: "sabun-herbal", icon: "🧼", color: "from-pink-400 to-pink-600", parentId: null, order: 6 },
    { id: "cat-kacang", name: "Kacang & Kismis", slug: "kacang-kismis", icon: "🥜", color: "from-yellow-500 to-yellow-700", parentId: null, order: 7 },
    { id: "cat-hampers", name: "Hampers & Paket", slug: "hampers-paket", icon: "🎁", color: "from-rose-400 to-rose-600", parentId: null, order: 8 },
    { id: "cat-sorban", name: "Sorban & Peci", slug: "sorban-peci", icon: "🧕", color: "from-purple-400 to-purple-600", parentId: null, order: 9 },
    { id: "cat-biskuit", name: "Biskuit & Snack", slug: "biskuit-snack", icon: "🍪", color: "from-orange-400 to-orange-600", parentId: null, order: 10 },
    { id: "cat-madu", name: "Madu & Rempah", slug: "madu-rempah", icon: "🍯", color: "from-amber-500 to-amber-700", parentId: null, order: 11 },
    { id: "cat-souvenir", name: "Souvenir & Mainan", slug: "souvenir-mainan", icon: "🐪", color: "from-indigo-400 to-indigo-600", parentId: null, order: 12 },
    // Sub-categories
    { id: "cat-ajwa", name: "Kurma Ajwa", slug: "kurma-ajwa", icon: "⚫", color: "from-gray-700 to-gray-900", parentId: "cat-kurma", order: 1 },
    { id: "cat-sukari", name: "Kurma Sukari", slug: "kurma-sukari", icon: "🟡", color: "from-yellow-400 to-yellow-600", parentId: "cat-kurma", order: 2 },
    { id: "cat-medjool", name: "Kurma Medjool", slug: "kurma-medjool", icon: "🟤", color: "from-amber-600 to-amber-800", parentId: "cat-kurma", order: 3 },
    { id: "cat-tunisia", name: "Kurma Tunisia", slug: "kurma-tunisia", icon: "🌿", color: "from-green-500 to-green-700", parentId: "cat-kurma", order: 4 },
  ];
}

export function getSeedProducts(): Product[] {
  const BASE1 = "https://raw.githubusercontent.com/daudqwery/ramdani-barokah/main/duniahaji.com_04765391-3546-4187-a1a3-164114864fda";
  const BASE2 = "https://raw.githubusercontent.com/daudqwery/ramdani-barokah/main/duniahaji.com_5f0ca7ac-2846-4aae-9f2e-9bb709c43c8e";

  // Image map available for future use
  void BASE1; void BASE2;

  const ph = (text: string, bg = "166534") => `https://placehold.co/500x500/${bg}/ffffff?text=${encodeURIComponent(text)}`;

  const now = new Date().toISOString();

  const products: Product[] = [
    {
      id: "p1", name: "Kurma Sukari 1KG Al Qassim Asli Madinah Saudi Arabia", slug: "kurma-sukari-1kg-al-qassim",
      basePrice: 64500, originalPrice: 99000, thumbnail: ph("Kurma Sukari 1KG", "78350f"),
      description: "🌴 Kurma Sukari 1Kg Al Qassim Asli Madina – Saudi Arabia\n\nManis Alami, Lembut Berkelas, Asli dari Tanah Suci Madina 🌙\n\n✅ Asli Al Qassim – Madina, Saudi Arabia 🇸🇦\n✅ Rasa Manis Lembut & Tidak Enyek\n✅ Tekstur Premium & Berdaging Tebal\n✅ Kemasan 1kg Higienis & Elegan\n✅ 100% Natural Tanpa Pengawet",
      isActive: true, categoryIds: ["cat-kurma", "cat-sukari"],
      images: [{ id: "img1", url: ph("Kurma Sukari 1KG", "78350f"), alt: "Kurma Sukari 1KG", order: 0 }],
      variants: [
        { id: "v1", name: "1 KG", type: "Ukuran", price: 64500, originalPrice: 99000, stock: 200 },
        { id: "v2", name: "500 GR", type: "Ukuran", price: 34500, originalPrice: 52500, stock: 300 },
      ],
      specifications: [
        { key: "Jenis", value: "Kurma Sukari" }, { key: "Asal", value: "Al Qassim – Madina, Saudi Arabia" },
        { key: "Kualitas", value: "Super Premium Grade A" }, { key: "Kemasan", value: "Box higienis eksklusif" },
        { key: "Ketahanan", value: "±12 bulan (wajib simpan kulkas)" },
      ],
      stock: 500, weight: "1 kg", rating: 4.9, reviews: 342, isBestSeller: true, isNew: false, isDiscount: true,
      tags: ["KURMA SUKARI", "Kurma Saudi", "kurma madu"], sourceUrl: "https://duniahaji.com/produk/kurma-sukari-1kg-al-qassim-asli-madinah-saudi-arabia-3",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p2", name: "Kurma Ajwa / Kurma Nabi Asli Madinah Saudi Arabia Grade A", slug: "kurma-ajwa-grade-a",
      basePrice: 77000, originalPrice: 145000, thumbnail: ph("Kurma Ajwa Grade A", "1c1917"),
      description: "🌴 Kurma Ajwa Asli Madinah – Varian 1Kg & 500gr Premium Grade A\n\nKurma Nabi yang Penuh Berkah & Khasiat 🌙\n\n✅ Asli Madinah – Saudi Arabia 🇸🇦\n✅ Rasa Manis Lembut & Tidak Terlalu Pekat\n✅ Kaya Nutrisi & Khasiat Sunnah\n✅ Kualitas Premium Grade A\n✅ 100% Natural Tanpa Pengawet",
      isActive: true, categoryIds: ["cat-kurma", "cat-ajwa"],
      images: [{ id: "img2", url: ph("Kurma Ajwa Grade A", "1c1917"), alt: "Kurma Ajwa Grade A", order: 0 }],
      variants: [
        { id: "v3", name: "1 KG", type: "Ukuran", price: 145000, originalPrice: 185000, stock: 100 },
        { id: "v4", name: "500 GR", type: "Ukuran", price: 77000, originalPrice: 99000, stock: 200 },
      ],
      specifications: [
        { key: "Jenis", value: "Kurma Ajwa (Kurma Nabi)" }, { key: "Asal", value: "Madinah Al-Munawwarah, Saudi Arabia" },
        { key: "Kualitas", value: "Premium Grade A" }, { key: "Kemasan", value: "Box eksklusif higienis" },
        { key: "Ketahanan", value: "±12 bulan pada suhu dingin" },
      ],
      stock: 300, weight: "500gr - 1kg", rating: 5.0, reviews: 520, isBestSeller: true, isNew: false, isDiscount: true,
      tags: ["KURMA AJWA", "KURMA NABI", "Kurma Madinah"], sourceUrl: "https://duniahaji.com/produk/kurma-ajwa-kurma-nabi-asli-madinah-saudi-arabia-grade-a-9",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p3", name: "Air Zam Zam 5 L 5 Liter Asli Saudi", slug: "air-zamzam-5-liter",
      basePrice: 359000, originalPrice: 500000, thumbnail: ph("Air Zamzam 5L", "1e40af"),
      description: "💧 Air Zam Zam Asli Mekkah – Kemasan Galon 5 Liter Premium\n\n✅ Asli dari Mekkah Al-Mukarramah 🇸🇦\n✅ Kemasan Galon 5 Liter Premium & Higienis\n✅ Murni Tanpa Tambahan Apapun\n✅ 100% Asli, Food Grade, Siap Minum",
      isActive: true, categoryIds: ["cat-zamzam"],
      images: [{ id: "img3", url: ph("Air Zamzam 5L", "1e40af"), alt: "Air Zamzam 5L", order: 0 }],
      variants: [
        { id: "v5", name: "5 Liter", type: "Ukuran", price: 359000, originalPrice: 500000, stock: 300 },
        { id: "v6", name: "1 Liter", type: "Ukuran", price: 80000, originalPrice: 100000, stock: 500 },
        { id: "v7", name: "80 ml", type: "Ukuran", price: 5000, stock: 1000 },
      ],
      specifications: [
        { key: "Asal", value: "Sumur Zam Zam – Masjidil Haram, Mekkah" }, { key: "Kapasitas", value: "5 Liter" },
        { key: "Kualitas", value: "100% Asli, Food Grade" },
      ],
      stock: 1800, weight: "5 Liter", rating: 5.0, reviews: 520, isBestSeller: true, isNew: false, isDiscount: true,
      tags: ["Air Zamzam"], sourceUrl: "https://duniahaji.com/produk/air-zam-zam-5-l-5-liter-asli-saudi-16",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p4", name: "Sajadah Alif Spigel Besar Dewasa 70x110 cm Tebal", slug: "sajadah-alif-spigel-besar",
      basePrice: 85000, thumbnail: ph("Sajadah Alif Spigel", "166534"),
      description: "Sajadah Alif Spigel Besar Dewasa Ukuran 70 x 110 cm Tebal. Bahan bludru berkualitas tinggi.",
      isActive: true, categoryIds: ["cat-sajadah"],
      images: [{ id: "img4", url: ph("Sajadah Alif Spigel", "166534"), alt: "Sajadah Alif", order: 0 }],
      variants: [
        { id: "v8", name: "Besar 70x110", type: "Ukuran", price: 85000, stock: 90 },
        { id: "v9", name: "Tanggung 53x105", type: "Ukuran", price: 55000, stock: 120 },
        { id: "v10", name: "Mini 35x60", type: "Ukuran", price: 35000, stock: 200 },
      ],
      specifications: [
        { key: "Bahan", value: "Bludru Tebal" }, { key: "Ukuran", value: "70 x 110 cm" }, { key: "Asal", value: "Turki" },
      ],
      stock: 410, rating: 4.9, reviews: 203, isBestSeller: true, isNew: false, isDiscount: false,
      tags: ["Sajadah Alif Spigel", "Sajadah Besar"], sourceUrl: "https://duniahaji.com/produk/sajadah-alif-spigel-besar-dewasa-ukuran-70-x-110-cm-tebal-75",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p5", name: "Cokelat Arab Kerikil Turki Coklat Batu Warna Warni", slug: "cokelat-arab-kerikil",
      basePrice: 9900, originalPrice: 84000, thumbnail: ph("Coklat Kerikil", "78350f"),
      description: "Cokelat Arab Kerikil Turki Coklat Batu Warna Warni. Snack viral favorit dari Turki.",
      isActive: true, categoryIds: ["cat-coklat"],
      images: [{ id: "img5", url: ph("Coklat Kerikil", "78350f"), alt: "Coklat Kerikil", order: 0 }],
      variants: [
        { id: "v11", name: "250 GR", type: "Ukuran", price: 9900, stock: 300 },
        { id: "v12", name: "500 GR", type: "Ukuran", price: 45000, stock: 200 },
        { id: "v13", name: "1 KG", type: "Ukuran", price: 84000, stock: 100 },
      ],
      specifications: [
        { key: "Jenis", value: "Coklat Kerikil / Batu" }, { key: "Asal", value: "Turki" },
      ],
      stock: 600, rating: 4.8, reviews: 278, isBestSeller: true, isNew: false, isDiscount: true,
      tags: ["Cokelat Arab", "Cokelat Turki"], sourceUrl: "https://duniahaji.com/produk/cokelat-arab-kerikil-turki-coklat-batu-warna-warni-30",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p6", name: "Perlengkapan Haji Kain Ihrom Ihram JUMBO 1 Set", slug: "kain-ihrom-jumbo",
      basePrice: 190000, originalPrice: 250000, thumbnail: ph("Kain Ihram Jumbo", "0f766e"),
      description: "Perlengkapan Haji Kain Ihrom Ihram JUMBO 1 Set Kualitas Tinggi untuk Haji dan Umroh.",
      isActive: true, categoryIds: ["cat-haji"],
      images: [{ id: "img6", url: ph("Kain Ihram Jumbo", "0f766e"), alt: "Kain Ihram", order: 0 }],
      variants: [
        { id: "v14", name: "JUMBO", type: "Ukuran", price: 250000, stock: 50 },
        { id: "v15", name: "Standar", type: "Ukuran", price: 190000, stock: 100 },
      ],
      specifications: [
        { key: "Bahan", value: "Katun Premium" }, { key: "Isi Paket", value: "2 lembar kain + sabuk + tas" },
      ],
      stock: 150, rating: 4.8, reviews: 167, isBestSeller: true, isNew: false, isDiscount: true,
      tags: ["Kain Ihrom", "Perlengkapan Haji"], sourceUrl: "https://duniahaji.com/produk/perlengkapan-haji-kain-ihrom-ihram-jumbo-1-set-kualitas-tinggi-untuk-haji-dan-umroh-18",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p7", name: "Sabun Arab Pyary Nalpamara Original Import Dubai", slug: "sabun-pyary-nalpamara",
      basePrice: 25000, thumbnail: ph("Sabun Pyary", "be185d"),
      description: "Sabun Arab Pyary Nalpamara Original Import Dubai Al Nasamat Herbal Alami Pencerah Kulit.",
      isActive: true, categoryIds: ["cat-sabun"],
      images: [{ id: "img7", url: ph("Sabun Pyary", "be185d"), alt: "Sabun Pyary", order: 0 }],
      variants: [],
      specifications: [
        { key: "Jenis", value: "Sabun Herbal" }, { key: "Asal", value: "Import Dubai" }, { key: "Fungsi", value: "Pencerah Kulit" },
      ],
      stock: 500, rating: 4.8, reviews: 456, isBestSeller: true, isNew: false, isDiscount: false,
      tags: ["Sabun Arab", "Sabun Nalpamara", "Sabun Pyary"], sourceUrl: "https://duniahaji.com/produk/sabun-arab-pyary-nalpamara-original-import-dubai-al-nasamat-herbal-alami-pencerah-kulit-54",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p8", name: "Kacang Pistachio Kulit Fustuk Roasted", slug: "kacang-pistachio-kulit",
      basePrice: 62000, originalPrice: 294500, thumbnail: ph("Pistachio Kulit", "a16207"),
      description: "Kacang Pistachio Kulit Fustuk Roasted. Kacang pistachio panggang berkualitas premium.",
      isActive: true, categoryIds: ["cat-kacang"],
      images: [{ id: "img8", url: ph("Pistachio Kulit", "a16207"), alt: "Pistachio", order: 0 }],
      variants: [
        { id: "v16", name: "250 GR", type: "Ukuran", price: 62000, stock: 150 },
        { id: "v17", name: "500 GR", type: "Ukuran", price: 145000, stock: 100 },
        { id: "v18", name: "1 KG", type: "Ukuran", price: 294500, stock: 50 },
      ],
      specifications: [
        { key: "Jenis", value: "Kacang Pistachio" }, { key: "Proses", value: "Roasted / Panggang" },
      ],
      stock: 300, rating: 4.8, reviews: 167, isBestSeller: true, isNew: false, isDiscount: true,
      tags: ["KACANG PISTACHIO", "KACANG FUSTUK"], sourceUrl: "https://duniahaji.com/produk/kacang-pistachio-kulit-fustuk-roasted-26",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p9", name: "Paket Saudi Oleh Oleh Haji & Umroh Souvenir", slug: "paket-saudi-souvenir",
      basePrice: 34500, originalPrice: 75000, thumbnail: ph("Paket Saudi", "9f1239"),
      description: "Paket Saudi Oleh Oleh Haji & Umroh Paketan Souvenir Sajadah Kurma Air Zam-zam Tasbih Mutiara Kemasan Box Cantik.",
      isActive: true, categoryIds: ["cat-hampers"],
      images: [{ id: "img9", url: ph("Paket Saudi", "9f1239"), alt: "Paket Saudi", order: 0 }],
      variants: [],
      specifications: [
        { key: "Isi", value: "Sajadah, Kurma, Air Zamzam, Tasbih Mutiara" }, { key: "Kemasan", value: "Box Cantik" },
      ],
      stock: 200, rating: 4.9, reviews: 234, isBestSeller: true, isNew: false, isDiscount: true,
      tags: ["Paket saudi", "Paket Oleh Oleh Umroh"], sourceUrl: "https://duniahaji.com/produk/paket-saudi-oleh-oleh-haji-umroh-paketan-souvenir-sajadah-kurma-air-zam-zam-tasbih-mutiara-kemasan-box-cantik-44",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p10", name: "Sorban Almas Arafat Putih Polos Persegi", slug: "sorban-almas-putih",
      basePrice: 28900, originalPrice: 49000, thumbnail: ph("Sorban Almas", "6b21a8"),
      description: "Sorban Almas Arafat Putih Polos Persegi Surban Semagh Imamah Shawl.",
      isActive: true, categoryIds: ["cat-sorban"],
      images: [{ id: "img10", url: ph("Sorban Almas", "6b21a8"), alt: "Sorban Almas", order: 0 }],
      variants: [
        { id: "v19", name: "Putih Polos", type: "Warna", price: 28900, stock: 100 },
        { id: "v20", name: "Motif Yasmagh", type: "Warna", price: 44900, stock: 80 },
      ],
      specifications: [
        { key: "Bahan", value: "Kain Halus Premium" }, { key: "Ukuran", value: "Persegi" },
      ],
      stock: 180, rating: 4.7, reviews: 89, isBestSeller: false, isNew: false, isDiscount: true,
      tags: ["Sorban Almas", "Sorban Polos"], sourceUrl: "https://duniahaji.com/produk/sorban-almas-arafat-putih-polos-persegi-surban-semagh-imamah-shawl-48",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p11", name: "Madu Arab Alshifa Paket 500+125gram Madu Murni", slug: "madu-alshifa-500-125",
      basePrice: 95000, thumbnail: ph("Madu Alshifa", "b45309"),
      description: "Madu Arab Alshifa Paket 500+125gram Madu Murni Al Shifa 500 gr Free 125 gr Herbal 100% Original.",
      isActive: true, categoryIds: ["cat-madu"],
      images: [{ id: "img11", url: ph("Madu Alshifa", "b45309"), alt: "Madu Alshifa", order: 0 }],
      variants: [
        { id: "v21", name: "500+125 GR", type: "Ukuran", price: 95000, stock: 80 },
        { id: "v22", name: "1KG+250 GR", type: "Ukuran", price: 175000, stock: 60 },
      ],
      specifications: [
        { key: "Jenis", value: "Madu Murni Al Shifa" }, { key: "Asal", value: "Arab Saudi" }, { key: "Sertifikasi", value: "100% Original" },
      ],
      stock: 140, rating: 4.9, reviews: 156, isBestSeller: true, isNew: false, isDiscount: false,
      tags: ["Madu & Herbal"], sourceUrl: "https://duniahaji.com/produk/madu-arab-alshifa-paket-500125gram-madu-murni-al-shifa-500-gr-free-125-gr-herbal-100-original-131",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p12", name: "Souvenir Gantungan Kunci Onta 3D Stainles", slug: "gantungan-kunci-onta-3d",
      basePrice: 15000, thumbnail: ph("Ganci Onta 3D", "4338ca"),
      description: "Souvenir Gantungan Kunci Onta 3D Stainles. Gantungan kunci onta stainless steel.",
      isActive: true, categoryIds: ["cat-souvenir"],
      images: [{ id: "img12", url: ph("Ganci Onta 3D", "4338ca"), alt: "Gantungan Kunci Onta", order: 0 }],
      variants: [],
      specifications: [
        { key: "Bahan", value: "Stainless Steel" }, { key: "Bentuk", value: "Onta 3D" },
      ],
      stock: 500, rating: 4.6, reviews: 234, isBestSeller: true, isNew: false, isDiscount: false,
      tags: ["Gantungan Kunci", "Ganci Onta"], sourceUrl: "https://duniahaji.com/produk/souvenir-gantungan-kunci-onta-3d-stainles-69",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p13", name: "Biskuit Maamoul Pack Isi 16 Biskuit Kurma Arab Original", slug: "biskuit-maamoul-pack-16",
      basePrice: 45000, thumbnail: ph("Biskuit Maamoul", "c2410c"),
      description: "Biskuit Maamoul Pack Isi 16 Biskuit Kurma Biskuit Arab Original. Biskuit khas Arab berisi kurma.",
      isActive: true, categoryIds: ["cat-biskuit"],
      images: [{ id: "img13", url: ph("Biskuit Maamoul", "c2410c"), alt: "Biskuit Maamoul", order: 0 }],
      variants: [],
      specifications: [
        { key: "Isi", value: "16 pcs" }, { key: "Jenis", value: "Biskuit Kurma" },
      ],
      stock: 150, rating: 4.7, reviews: 112, isBestSeller: false, isNew: false, isDiscount: false,
      tags: ["Biskuit Mammoul", "Mammoul"], sourceUrl: "https://duniahaji.com/produk/biskuit-maamoul-pack-isi-16-biskuit-biskuit-kurma-biskuit-arab-original-72",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p14", name: "Kurma Medjool Jumbo Premium King of Dates", slug: "kurma-medjool-jumbo",
      basePrice: 135000, thumbnail: ph("Kurma Medjool Jumbo", "78350f"),
      description: "Kurma Medjool Jumbo Premium King of Dates. Kurma terbesar dan terlezat di dunia.",
      isActive: true, categoryIds: ["cat-kurma", "cat-medjool"],
      images: [{ id: "img14", url: ph("Kurma Medjool", "78350f"), alt: "Kurma Medjool", order: 0 }],
      variants: [
        { id: "v23", name: "500 GR", type: "Ukuran", price: 135000, stock: 60 },
        { id: "v24", name: "1 KG", type: "Ukuran", price: 250000, stock: 40 },
      ],
      specifications: [
        { key: "Jenis", value: "Kurma Medjool" }, { key: "Asal", value: "Palestina" }, { key: "Kualitas", value: "Jumbo Premium" },
      ],
      stock: 100, rating: 4.9, reviews: 134, isBestSeller: true, isNew: true, isDiscount: false,
      tags: ["kurma legit"], sourceUrl: "https://duniahaji.com/produk/kurma-medjool-jumbo-premium-king-of-dates-81",
      createdAt: now, updatedAt: now,
    },
    {
      id: "p15", name: "Konafetto Roshen Rolled Wafer Coklat Arab Snack Viral", slug: "konafetto-roshen",
      basePrice: 45000, thumbnail: ph("Konafetto Roshen", "78350f"),
      description: "Konafetto Roshen Rolled Wafer Coklat Arab Snack Viral Best Seller. Camilan premium oleh-oleh haji umroh.",
      isActive: true, categoryIds: ["cat-coklat"],
      images: [{ id: "img15", url: ph("Konafetto Roshen", "78350f"), alt: "Konafetto", order: 0 }],
      variants: [],
      specifications: [
        { key: "Jenis", value: "Rolled Wafer" }, { key: "Merek", value: "Roshen Konafetto" },
      ],
      stock: 250, rating: 4.9, reviews: 312, isBestSeller: true, isNew: false, isDiscount: false,
      tags: ["Cokelat Konafetto", "COkelat Viral"], sourceUrl: "https://duniahaji.com/produk/konafetto-roshen-rolled-wafer-coklat-arab-snack-viral-best-seller-oleh-oleh-haji-umroh-camilan-premium-127",
      createdAt: now, updatedAt: now,
    },
  ];

  return products;
}

// Initialize database if not already done
export function initializeDatabase(): void {
  if (!db.isInitialized()) {
    db.initialize(getSeedProducts(), getSeedCategories());
  }
}
