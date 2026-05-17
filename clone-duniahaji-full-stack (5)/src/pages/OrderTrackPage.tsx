import { useState } from "react";
import { Search, Package, CheckCircle, Truck, Clock, Home } from "lucide-react";

const fakeOrders = [
  {
    id: "RB12345678",
    status: "delivered",
    date: "2024-01-15",
    items: [{ name: "Kurma Ajwa Madinah Premium", qty: 2, price: 125000 }],
    total: 250000,
    tracking: [
      { status: "Pesanan dibuat", date: "15 Jan 2024, 09:00", done: true },
      { status: "Pembayaran dikonfirmasi", date: "15 Jan 2024, 10:30", done: true },
      { status: "Pesanan diproses", date: "15 Jan 2024, 11:00", done: true },
      { status: "Dalam pengiriman", date: "15 Jan 2024, 14:00", done: true },
      { status: "Pesanan diterima", date: "16 Jan 2024, 13:00", done: true },
    ],
  },
  {
    id: "RB87654321",
    status: "shipping",
    date: "2024-01-20",
    items: [{ name: "Air Zamzam Asli 5 Liter", qty: 1, price: 85000 }],
    total: 85000,
    tracking: [
      { status: "Pesanan dibuat", date: "20 Jan 2024, 08:30", done: true },
      { status: "Pembayaran dikonfirmasi", date: "20 Jan 2024, 09:15", done: true },
      { status: "Pesanan diproses", date: "20 Jan 2024, 10:00", done: true },
      { status: "Dalam pengiriman", date: "20 Jan 2024, 13:30", done: true },
      { status: "Pesanan diterima", date: "", done: false },
    ],
  },
];

export default function OrderTrackPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<typeof fakeOrders[0] | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = fakeOrders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const statusConfig = {
    delivered: { label: "Pesanan Diterima", color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={16} className="text-green-600" /> },
    shipping: { label: "Dalam Pengiriman", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Truck size={16} className="text-blue-600" /> },
    processing: { label: "Diproses", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Package size={16} className="text-amber-600" /> },
    pending: { label: "Menunggu Pembayaran", color: "bg-gray-100 text-gray-600 border-gray-200", icon: <Clock size={16} className="text-gray-500" /> },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Cek Status Pesanan</h1>
          <p className="text-gray-500">Masukkan nomor pesanan dan nomor HP untuk melacak pesananmu</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Pesanan</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Contoh: RB12345678"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">Coba nomor: RB12345678 atau RB87654321</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor HP</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold transition-colors"
            >
              <Search size={18} /> Cek Pesanan
            </button>
          </div>
        </form>

        {/* Not Found */}
        {notFound && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">😕</div>
            <h3 className="font-bold text-red-700 mb-1">Pesanan Tidak Ditemukan</h3>
            <p className="text-red-600 text-sm">Pastikan nomor pesanan dan nomor HP yang dimasukkan benar.</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Order Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Nomor Pesanan</p>
                  <p className="font-bold text-gray-800 text-lg">{result.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Tanggal: {new Date(result.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusConfig[result.status as keyof typeof statusConfig]?.color}`}>
                  {statusConfig[result.status as keyof typeof statusConfig]?.icon}
                  {statusConfig[result.status as keyof typeof statusConfig]?.label}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700 text-sm mb-3">Produk</h3>
              {result.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x{item.qty}</span>
                  <span className="font-medium text-gray-800">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-gray-800 mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-green-700">{formatPrice(result.total)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-5">
              <h3 className="font-semibold text-gray-700 text-sm mb-4">Tracking Pesanan</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
                <div className="space-y-4">
                  {result.tracking.map((step, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.done ? "bg-green-500" : "bg-gray-200"}`}>
                        {step.done ? <CheckCircle size={16} className="text-white" /> : <Clock size={14} className="text-gray-400" />}
                      </div>
                      <div className="pb-1">
                        <p className={`font-semibold text-sm ${step.done ? "text-gray-800" : "text-gray-400"}`}>{step.status}</p>
                        {step.date && <p className="text-xs text-gray-400">{step.date}</p>}
                        {!step.date && !step.done && <p className="text-xs text-gray-400 italic">Menunggu...</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="p-5 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-600 text-center">
                Ada pertanyaan?{" "}
                <a href={`https://wa.me/6281290576590?text=Halo, saya ingin menanyakan status pesanan ${result.id}`} target="_blank" rel="noreferrer" className="text-green-600 font-semibold hover:underline">
                  Hubungi kami via WhatsApp
                </a>
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <Home size={14} /> Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
