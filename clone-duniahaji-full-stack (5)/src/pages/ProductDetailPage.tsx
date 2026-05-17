import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Shield, Truck, Heart, ChevronRight, Minus, Plus, Phone, CheckCircle, Package } from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { imageMap } from "../data/imageMap";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

function getSourceId(product: typeof products[0]): number | undefined {
  if (product.sourceId) return product.sourceId;
  if (product.sourceUrl) {
    const match = product.sourceUrl.match(/-(\d+)$/);
    if (match) return parseInt(match[1], 10);
  }
  return undefined;
}

function getProductImage(product: typeof products[0]): string {
  const sourceId = getSourceId(product);
  if (sourceId && imageMap[sourceId]) return imageMap[sourceId];
  return product.image;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews">("desc");

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Produk tidak ditemukan</h2>
          <p className="text-gray-500 mb-6">Produk yang Anda cari tidak tersedia</p>
          <Link to="/produk" className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors">
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} ditambahkan ke keranjang!`, {
      icon: "🛒",
      style: { borderRadius: "12px", background: "#166534", color: "#fff" },
    });
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/keranjang");
  };

  const fakeReviews = [
    { name: "Ahmad F.", avatar: "AF", rating: 5, text: "Produk sangat berkualitas, pengiriman cepat! Puas banget belanja di sini.", date: "1 minggu lalu" },
    { name: "Siti R.", avatar: "SR", rating: 5, text: "Alhamdulillah, produknya asli dan berkualitas. Recommended banget!", date: "2 minggu lalu" },
    { name: "Budi S.", avatar: "BS", rating: 4, text: "Bagus, sesuai deskripsi. Akan beli lagi insyaAllah.", date: "1 bulan lalu" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600">Beranda</Link>
            <ChevronRight size={14} />
            <Link to="/produk" className="hover:text-green-600">Produk</Link>
            <ChevronRight size={14} />
            <Link to={`/produk?kategori=${product.categorySlug}`} className="hover:text-green-600">{product.category}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-md border border-gray-100">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = product.image;
                  (e.target as HTMLImageElement).onerror = () => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x600/dcfce7/166534?text=Ramdani+Barkah";
                  };
                }}
              />
            </div>
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}%</span>
              )}
              {product.isBestSeller && (
                <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">⭐ Best Seller</span>
              )}
              {product.isNew && (
                <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">✨ Baru</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category badge */}
            <Link
              to={`/produk?kategori=${product.categorySlug}`}
              className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3 hover:bg-green-200 transition-colors"
            >
              {product.category}
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
              <span className="font-bold text-amber-600">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews} ulasan)</span>
              <span className="text-green-600 text-sm font-medium">Terjual {product.reviews * 3}+</span>
            </div>

            {/* Price */}
            <div className="bg-green-50 rounded-2xl p-4 mb-5">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-green-700">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                    <span className="text-red-500 text-xs font-semibold">Hemat {formatPrice(product.originalPrice - product.price)}</span>
                  </div>
                )}
              </div>
              {product.weight && (
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Package size={13} /> {product.weight}
                </div>
              )}
            </div>

            {/* Stock info */}
            <div className={`flex items-center gap-2 text-sm mb-5 ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-orange-500" : "text-red-500"}`}>
              <CheckCircle size={15} />
              {product.stock > 10
                ? `Stok tersedia (${product.stock} unit)`
                : product.stock > 0
                ? `Stok terbatas! Sisa ${product.stock} unit`
                : "Stok habis"}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-medium text-gray-700 text-sm">Jumlah:</span>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm">Maks. {product.stock}</span>
                </div>

                {/* Total */}
                <div className="text-sm text-gray-600 mb-5">
                  Total: <span className="font-bold text-green-700 text-lg">{formatPrice(product.price * qty)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-6 py-3.5 rounded-2xl font-bold transition-all"
                  >
                    <ShoppingCart size={18} />
                    Keranjang
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/6281290576590?text=Assalamualaikum, saya ingin memesan *${product.name}* sebanyak ${qty} unit. Apakah masih tersedia?`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-medium transition-colors mb-6"
            >
              <Phone size={16} />
              Pesan via WhatsApp
            </a>

            {/* Trust Features */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
              {[
                { icon: <Shield size={18} className="text-green-600" />, text: "Produk Asli & Bersertifikat" },
                { icon: <Truck size={18} className="text-blue-600" />, text: "Pengiriman Cepat ke Seluruh Indonesia" },
                { icon: <Heart size={18} className="text-red-500" />, text: "Garansi Kepuasan Pelanggan" },
              ].map((feat, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center p-2">
                  {feat.icon}
                  <span className="text-xs text-gray-500 leading-snug">{feat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="flex border-b border-gray-100">
            {(["desc", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-semibold text-sm transition-colors ${
                  activeTab === tab ? "text-green-700 border-b-2 border-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "desc" ? "Deskripsi Produk" : `Ulasan (${product.reviews})`}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "desc" ? (
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <div className="bg-green-50 rounded-2xl p-4">
                  <h4 className="font-bold text-green-800 mb-3">Keunggulan Produk:</h4>
                  <ul className="space-y-2">
                    {[
                      "Produk asli dan berkualitas tinggi",
                      "Bersetifikat resmi dari Kementerian Pertanian RI",
                      "Dikemas dengan higienis dan aman",
                      "Dikirim dengan packaging yang kuat dan aman",
                      "Garansi kepuasan pelanggan",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                        <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-600">{product.rating}</div>
                    <div className="flex justify-center my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">{product.reviews} ulasan</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : 2}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6">{star === 5 ? "78%" : star === 4 ? "15%" : star === 3 ? "5%" : "2%"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {fakeReviews.map((review, i) => (
                    <div key={i} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                          <div className="flex">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{review.text}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle size={11} className="text-green-500" />
                          <span className="text-xs text-green-600">Pembelian Terverifikasi</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Produk Serupa</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
