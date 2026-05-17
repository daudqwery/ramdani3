import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products, categories } from "../data/products";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const searchQuery = searchParams.get("search") || "";
  const activeCategory = searchParams.get("kategori") || "";
  const showPromo = searchParams.get("promo") === "true";
  const showNew = searchParams.get("new") === "true";

  const filtered = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory) result = result.filter((p) => p.categorySlug === activeCategory);
    if (showPromo) result = result.filter((p) => p.isDiscount);
    if (showNew) result = result.filter((p) => p.isNew);
    if (priceMin) result = result.filter((p) => p.price >= Number(priceMin));
    if (priceMax) result = result.filter((p) => p.price <= Number(priceMax));

    switch (sortBy) {
      case "price-asc": return result.sort((a, b) => a.price - b.price);
      case "price-desc": return result.sort((a, b) => b.price - a.price);
      case "rating": return result.sort((a, b) => b.rating - a.rating);
      case "newest": return result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case "popular": return result.sort((a, b) => b.reviews - a.reviews);
      default: return result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
  }, [searchQuery, activeCategory, showPromo, showNew, sortBy, priceMin, priceMax]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("kategori", slug);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceMin("");
    setPriceMax("");
    setSortBy("default");
  };

  const hasFilters = activeCategory || showPromo || showNew || priceMin || priceMax || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {activeCategory
              ? categories.find((c) => c.slug === activeCategory)?.name || "Produk"
              : searchQuery
              ? `Hasil Pencarian: "${searchQuery}"`
              : showPromo
              ? "Produk Promo & Diskon"
              : showNew
              ? "Produk Terbaru"
              : "Semua Produk"}
          </h1>
          <p className="text-green-200 text-sm">
            {filtered.length} produk ditemukan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filter & Kategori
            <ChevronDown size={14} className={`ml-auto transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500 whitespace-nowrap">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-500 shadow-sm"
            >
              <option value="default">Rekomendasi</option>
              <option value="popular">Terpopuler</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="newest">Terbaru</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"} md:block`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Filter</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <X size={12} /> Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-5">
                <h4 className="font-semibold text-gray-700 text-sm mb-3">Kategori</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !activeCategory ? "bg-green-600 text-white font-medium" : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        activeCategory === cat.slug ? "bg-green-600 text-white font-medium" : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <h4 className="font-semibold text-gray-700 text-sm mb-3">Rentang Harga</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Harga minimum"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Harga maximum"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-3">Filter Khusus</h4>
                <div className="space-y-2">
                  {[
                    { label: "🔥 Produk Promo", key: "promo", val: "true", active: showPromo },
                    { label: "✨ Produk Baru", key: "new", val: "true", active: showNew },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        if (filter.active) {
                          params.delete(filter.key);
                        } else {
                          params.set(filter.key, filter.val);
                        }
                        setSearchParams(params);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filter.active ? "bg-green-600 text-white font-medium" : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeCategory && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {categories.find((c) => c.slug === activeCategory)?.name}
                    <button onClick={() => setCategory("")}><X size={12} /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    Pencarian: {searchQuery}
                    <button onClick={() => setSearchParams({})}><X size={12} /></button>
                  </span>
                )}
                {showPromo && (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                    Promo
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete("promo"); setSearchParams(p); }}><X size={12} /></button>
                  </span>
                )}
                {showNew && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    Produk Baru
                    <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete("new"); setSearchParams(p); }}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Produk tidak ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba ubah filter atau kata kunci pencarian</p>
                <button
                  onClick={clearFilters}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-green-700 transition-colors"
                >
                  Lihat Semua Produk
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
