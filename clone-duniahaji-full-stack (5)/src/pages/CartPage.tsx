import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight, Tag, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { imageMap } from "../data/imageMap";
import toast from "react-hot-toast";

function getCartProductImage(item: { product: { sourceId?: number; sourceUrl?: string; image: string } }): string {
  const p = item.product;
  let sourceId = p.sourceId;
  if (!sourceId && p.sourceUrl) {
    const match = p.sourceUrl.match(/-(\d+)$/);
    if (match) sourceId = parseInt(match[1], 10);
  }
  if (sourceId && imageMap[sourceId]) return imageMap[sourceId];
  return p.image;
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const shipping = totalPrice >= 300000 ? 0 : 25000;
  const discount = couponApplied ? Math.round(totalPrice * 0.1) : 0;
  const grandTotal = totalPrice - discount + shipping;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "BERKAH10") {
      setCouponApplied(true);
      toast.success("Kode promo berhasil diterapkan! Diskon 10%", { icon: "🎉" });
    } else {
      toast.error("Kode promo tidak valid", { icon: "❌" });
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Keranjang Masih Kosong</h2>
          <p className="text-gray-500 mb-8">Yuk, mulai belanja kebutuhan haji & umrohmu!</p>
          <Link
            to="/produk"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-full font-bold transition-colors"
          >
            <ShoppingCart size={18} /> Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600">Beranda</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium">Keranjang Belanja</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Keranjang Belanja <span className="text-green-600">({items.length} produk)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping notice */}
            {totalPrice < 300000 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <Truck size={20} className="text-amber-600 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold text-amber-800">Tambah </span>
                  <span className="text-amber-700">{formatPrice(300000 - totalPrice)} lagi</span>
                  <span className="text-amber-800"> untuk mendapatkan </span>
                  <span className="font-semibold text-amber-800">GRATIS ONGKIR!</span>
                </div>
              </div>
            )}
            {totalPrice >= 300000 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <Truck size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-green-800">🎉 Selamat! Kamu mendapat GRATIS ONGKIR!</span>
              </div>
            )}

            {items.map((item) => {
              const discount = item.product.originalPrice
                ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
                : 0;
              return (
                <div key={item.product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                  <div className="flex gap-4">
                    <Link to={`/produk/${item.product.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={getCartProductImage(item)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.product.image;
                            (e.target as HTMLImageElement).onerror = () => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/200x200/dcfce7/166534?text=RB";
                            };
                          }}
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs text-green-600 font-medium">{item.product.category}</span>
                          <Link to={`/produk/${item.product.slug}`}>
                            <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-snug hover:text-green-700 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.product.weight && (
                            <p className="text-xs text-gray-400 mt-0.5">{item.product.weight}</p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast.success("Produk dihapus dari keranjang");
                          }}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                        <div>
                          <div className="font-bold text-green-700 text-base md:text-lg">
                            {formatPrice(item.product.price)}
                          </div>
                          {item.product.originalPrice && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs line-through">{formatPrice(item.product.originalPrice)}</span>
                              <span className="text-red-500 text-xs font-semibold">-{discount}%</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="text-sm font-bold text-gray-700">
                            = {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear cart */}
            <button
              onClick={() => {
                clearCart();
                toast.success("Keranjang dikosongkan");
              }}
              className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} /> Kosongkan Keranjang
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Ringkasan Pesanan</h3>

              {/* Coupon */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                  <Tag size={14} className="text-green-600" /> Kode Promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !coupon}
                    className="px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pakai
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-xs mt-1 font-medium">✓ Kode BERKAH10 berhasil diterapkan (diskon 10%)</p>
                )}
                <p className="text-gray-400 text-xs mt-1">Coba kode: BERKAH10</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Diskon Promo (10%)</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck size={13} /> Ongkos Kirim
                  </span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? "GRATIS" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-gray-800 font-bold text-base">
                    <span>Total Pembayaran</span>
                    <span className="text-green-700 text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-5">
                <p className="text-xs text-gray-500 mb-2 font-medium">Metode Pembayaran:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["BCA", "Mandiri", "BRI", "BNI", "QRIS"].map((m) => (
                    <span key={m} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border font-medium">{m}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-200 transition-all hover:scale-[1.02] mb-3"
              >
                Lanjut ke Checkout →
              </button>

              <Link
                to="/produk"
                className="w-full block text-center py-3 border border-gray-200 text-gray-600 hover:text-green-700 hover:border-green-300 rounded-2xl font-medium text-sm transition-colors"
              >
                Lanjut Belanja
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>🔒</span>
                <span>Pembayaran aman & terenkripsi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
