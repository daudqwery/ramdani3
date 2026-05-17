import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, Shield, Award, Truck, Heart, Phone, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { testimonials, faqs } from "../data/products";
import { db, initializeDatabase, Product as DbProduct, Category as DbCategory } from "../data/database";

// Adapter: convert DB product to ProductCard-compatible format
function adaptProduct(p: DbProduct) {
  return {
    id: parseInt(p.id.replace(/\D/g, "").slice(-4)) || Math.floor(Math.random() * 99999),
    name: p.name,
    slug: p.slug,
    price: p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price)) : p.basePrice,
    originalPrice: p.originalPrice || (p.variants.length > 0 ? undefined : undefined),
    image: p.thumbnail,
    category: p.categoryIds[0] || "",
    categorySlug: p.slug,
    tags: p.tags,
    description: p.description,
    weight: p.weight,
    stock: p.stock,
    rating: p.rating,
    reviews: p.reviews,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    isDiscount: p.isDiscount,
  };
}

function adaptCategory(c: DbCategory) {
  return {
    id: parseInt(c.id.replace(/\D/g, "")) || Math.floor(Math.random() * 9999),
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    color: c.color,
  };
}

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    initializeDatabase();
    const prods = db.getActiveProducts().map(adaptProduct);
    const cats = db.getParentCategories().map(adaptCategory);
    setDbProducts(prods);
    setDbCategories(cats);
  }, []);

  const bestSellers = dbProducts.filter((p: any) => p.isBestSeller).slice(0, 8);
  const newProducts = dbProducts.filter((p: any) => p.isNew).slice(0, 4);
  const discountProducts = dbProducts.filter((p: any) => p.isDiscount).slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Masjidil Haram"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-900/75 to-green-800/50" />
        </div>

        {/* Decorative Arabic Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span>🌿</span> Assalamu'alaikum Warahmatullahi Wabarakatuh
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Selamat Datang di{" "}
              <span className="text-amber-400">Ramdani Barkah</span>
            </h1>
            <p className="text-green-100 text-lg md:text-xl mb-3 leading-relaxed">
              Temukan kebutuhan <strong>Haji & Umroh</strong> berkualitas, aman, serta harga bersahabat.
            </p>
            <p className="text-green-200 text-base mb-8">
              Kurma Premium • Air Zamzam Asli • Sajadah • Perlengkapan Haji & Umroh
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/produk"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg shadow-amber-900/30 transition-all hover:scale-105"
              >
                Belanja Sekarang <ChevronRight size={18} />
              </Link>
              <a
                href="https://wa.me/6281290576590"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all"
              >
                <Phone size={18} /> Hubungi Kami
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-sm">
              {[
                { num: "10K+", label: "Pelanggan Puas" },
                { num: "500+", label: "Produk Pilihan" },
                { num: "5⭐", label: "Rating Toko" },
              ].map((stat) => (
                <div key={stat.num} className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{stat.num}</div>
                  <div className="text-green-300 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="text-green-600" size={32} />, title: "Terpercaya", desc: "Ribuan pelanggan puas" },
              { icon: <Award className="text-amber-500" size={32} />, title: "Kualitas Terjamin", desc: "Sertifikat Kementan RI" },
              { icon: <Truck className="text-blue-500" size={32} />, title: "Pengiriman Cepat", desc: "Same-day delivery" },
              { icon: <Heart className="text-red-500" size={32} />, title: "Produk Berkah", desc: "Halal & terpercaya" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-green-50 transition-colors">
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{item.title}</div>
                  <div className="text-gray-500 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Kategori Produk</h2>
            <p className="text-gray-500">Temukan produk sesuai kebutuhanmu</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {dbCategories.map((cat: any) => (
              <Link
                key={cat.id}
                to={`/produk?kategori=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="font-semibold text-gray-700 text-sm text-center group-hover:text-green-700 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-medium text-sm mb-1">
                <Star size={14} className="fill-amber-500" /> Best Seller
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Produk Terlaris</h2>
            </div>
            <Link to="/produk" className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-10 bg-gradient-to-r from-green-700 to-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <div className="text-amber-400 font-medium mb-1 text-sm">🎁 Penawaran Spesial</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Gratis Ongkir untuk Pembelian Di Atas Rp 300.000!</h3>
            <p className="text-green-200">Berlaku untuk seluruh wilayah Indonesia. Pesan sekarang sebelum kehabisan!</p>
          </div>
          <Link
            to="/produk"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg transition-all hover:scale-105"
          >
            Belanja Sekarang
          </Link>
        </div>
      </section>

      {/* DISCOUNT PRODUCTS */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-medium text-sm mb-1">
                🔥 Promo Spesial
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Produk Diskon</h2>
            </div>
            <Link to="/produk?promo=true" className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {discountProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* NEW PRODUCTS */}
      {newProducts.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-blue-500 font-medium text-sm mb-1">
                  ✨ Baru Hadir
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Produk Terbaru</h2>
              </div>
              <Link to="/produk?new=true" className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-14 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-green-600 font-medium text-sm mb-1">💬 Ulasan Pelanggan</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Pengalaman Mereka Berbelanja</h2>
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-2 text-gray-600 font-medium">4.9/5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
                  idx === activeTestimonial ? "border-green-300 shadow-green-100 shadow-md" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.location} • {t.date}</div>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all ${i === activeTestimonial ? "w-6 h-2 bg-green-600" : "w-2 h-2 bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-green-600 font-medium text-sm mb-1">❓ Pertanyaan Umum</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <button
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-green-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 text-sm md:text-base pr-4">{faq.question}</span>
                  {activeFaq === faq.id ? (
                    <ChevronUp size={20} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {activeFaq === faq.id && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-14 bg-gradient-to-br from-amber-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🤲</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Siap Melengkapi Kebutuhan Haji & Umroh Anda?
          </h2>
          <p className="text-gray-600 mb-8 text-base">
            Belanja di Ramdani Barkah insyaAllah Aman, Nyaman & Terpercaya. Hubungi kami untuk konsultasi produk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/produk"
              className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg transition-all hover:scale-105"
            >
              Lihat Semua Produk <ChevronRight size={18} />
            </Link>
            <a
              href="https://wa.me/6281290576590?text=Assalamualaikum, saya ingin bertanya tentang produk Ramdani Barkah"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg transition-all hover:scale-105"
            >
              <Phone size={18} /> Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
