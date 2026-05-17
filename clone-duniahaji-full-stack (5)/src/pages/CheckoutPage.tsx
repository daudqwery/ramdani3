import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle, CreditCard, Truck, User, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { imageMap } from "../data/imageMap";
import toast from "react-hot-toast";

function getCheckoutImage(item: { product: { sourceId?: number; sourceUrl?: string; image: string } }): string {
  const p = item.product;
  let sourceId = p.sourceId;
  if (!sourceId && p.sourceUrl) {
    const match = p.sourceUrl.match(/-(\d+)$/);
    if (match) sourceId = parseInt(match[1], 10);
  }
  if (sourceId && imageMap[sourceId]) return imageMap[sourceId];
  return p.image;
}

const provinces = [
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten",
  "D.I. Yogyakarta", "Bali", "Sumatera Utara", "Sumatera Selatan", "Kalimantan Timur",
  "Sulawesi Selatan", "Papua", "Aceh", "Riau", "Lampung",
];

const paymentMethods = [
  { id: "bca", name: "Bank BCA", number: "1234567890", holder: "Ramdani Barkah" },
  { id: "mandiri", name: "Bank Mandiri", number: "0987654321", holder: "Ramdani Barkah" },
  { id: "bri", name: "Bank BRI", number: "1122334455", holder: "Ramdani Barkah" },
  { id: "bni", name: "Bank BNI", number: "5566778899", holder: "Ramdani Barkah" },
  { id: "qris", name: "QRIS", number: "", holder: "" },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("bca");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", province: "", postalCode: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const shipping = totalPrice >= 300000 ? 0 : 25000;
  const grandTotal = totalPrice + shipping;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama wajib diisi";
    if (!form.phone.trim()) errs.phone = "Nomor HP wajib diisi";
    else if (!/^08\d{8,11}$/.test(form.phone)) errs.phone = "Format nomor HP tidak valid (contoh: 081234567890)";
    if (!form.address.trim()) errs.address = "Alamat wajib diisi";
    if (!form.city.trim()) errs.city = "Kota wajib diisi";
    if (!form.province) errs.province = "Provinsi wajib dipilih";
    if (!form.postalCode.trim()) errs.postalCode = "Kode pos wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validate()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleOrder = () => {
    const orderId = "RB" + Date.now().toString().slice(-8);
    clearCart();
    navigate(`/pesanan-berhasil?id=${orderId}`);
    toast.success("Pesanan berhasil dibuat! Silakan lakukan pembayaran.", { duration: 5000 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Keranjang kosong</h2>
          <Link to="/produk" className="text-green-600 hover:underline">Belanja dulu yuk!</Link>
        </div>
      </div>
    );
  }

  const selectedPaymentInfo = paymentMethods.find((m) => m.id === selectedPayment);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600">Beranda</Link>
          <ChevronRight size={14} />
          <Link to="/keranjang" className="hover:text-green-600">Keranjang</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium">Checkout</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {[
            { num: 1, label: "Data Diri" },
            { num: 2, label: "Pembayaran" },
            { num: 3, label: "Konfirmasi" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step > s.num
                      ? "bg-green-600 text-white"
                      : step === s.num
                      ? "bg-green-600 text-white ring-4 ring-green-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.num ? <CheckCircle size={18} /> : s.num}
                </div>
                <span className={`text-xs mt-1 font-medium ${step >= s.num ? "text-green-700" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all ${step > s.num ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Info */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                  <User size={20} className="text-green-600" /> Data Pengiriman
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Masukkan nama lengkap" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-green-500 ${errors.name ? "border-red-400" : "border-gray-200"}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-green-500 ${errors.phone ? "border-red-400" : "border-gray-200"}`} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@contoh.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
                    <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..." className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none ${errors.address ? "border-red-400" : "border-gray-200"}`} />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kota *</label>
                      <input name="city" value={form.city} onChange={handleChange} placeholder="Kota/Kabupaten" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-green-500 ${errors.city ? "border-red-400" : "border-gray-200"}`} />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi *</label>
                      <select name="province" value={form.province} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-green-500 bg-white ${errors.province ? "border-red-400" : "border-gray-200"}`}>
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos *</label>
                      <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="12345" maxLength={5} className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-green-500 ${errors.postalCode ? "border-red-400" : "border-gray-200"}`} />
                      {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan untuk Penjual</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Contoh: Tolong dibungkus rapi, untuk hadiah" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none" />
                  </div>
                </div>
                <button onClick={handleNext} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold transition-colors">
                  Lanjut ke Pembayaran →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-green-600" /> Pilih Metode Pembayaran
                </h2>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedPayment === method.id ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-300"}`}>
                      <input type="radio" name="payment" value={method.id} checked={selectedPayment === method.id} onChange={(e) => setSelectedPayment(e.target.value)} className="accent-green-600" />
                      <div className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                        {method.name.split(" ")[1] || "QRIS"}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{method.name}</div>
                        {method.number && (
                          <div className="text-xs text-gray-500">No. Rek: {method.number} a.n. {method.holder}</div>
                        )}
                        {method.id === "qris" && (
                          <div className="text-xs text-gray-500">Scan QR untuk pembayaran instan</div>
                        )}
                      </div>
                      {selectedPayment === method.id && <CheckCircle size={18} className="text-green-600" />}
                    </label>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                  <strong>⚠️ Penting:</strong> Setelah melakukan pembayaran, segera konfirmasi via WhatsApp dengan menyertakan bukti transfer dan nomor pesanan.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
                    ← Kembali
                  </button>
                  <button onClick={handleNext} className="flex-2 flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold transition-colors">
                    Konfirmasi Pesanan →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" /> Konfirmasi Pesanan
                </h2>

                {/* Shipping Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-1.5">
                    <MapPin size={14} className="text-green-600" /> Info Pengiriman
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex gap-2"><span className="font-medium text-gray-700 w-20">Nama:</span>{form.name}</div>
                    <div className="flex gap-2"><span className="font-medium text-gray-700 w-20">HP:</span>{form.phone}</div>
                    <div className="flex gap-2"><span className="font-medium text-gray-700 w-20">Alamat:</span>{form.address}, {form.city}, {form.province} {form.postalCode}</div>
                    {form.notes && <div className="flex gap-2"><span className="font-medium text-gray-700 w-20">Catatan:</span>{form.notes}</div>}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-green-600" /> Metode Pembayaran
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-700">{selectedPaymentInfo?.name}</p>
                    {selectedPaymentInfo?.number && (
                      <p>No. Rek: <strong>{selectedPaymentInfo.number}</strong> a.n. {selectedPaymentInfo.holder}</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <h3 className="font-semibold text-gray-700 text-sm mb-3">Produk yang Dipesan</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product.name} x{item.quantity}</span>
                        <span className="font-medium text-gray-800">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
                    ← Kembali
                  </button>
                  <button onClick={handleOrder} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-lg shadow-green-200">
                    Buat Pesanan 🎉
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Pesanan Kamu</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={getCheckoutImage(item)} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/dcfce7/166534?text=RB"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-green-700 flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck size={12} /> Ongkir</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "GRATIS" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-green-700">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
