import { useState, useEffect } from "react";
import { db, initializeDatabase } from "../../data/database";
import { Users, ShoppingCart, DollarSign, Package, Star, AlertTriangle, BarChart3, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from "lucide-react";

interface Customer { id: string; name: string; email: string; phone: string; address: string; city: string; province: string; totalOrders: number; totalSpent: number; createdAt: string; }
interface Order { id: string; customerId: string; customerName: string; items: { name: string; qty: number; price: number }[]; total: number; shipping: number; grandTotal: number; status: string; paymentMethod: string; paymentStatus: string; createdAt: string; }
interface Invoice { id: string; orderId: string; customerName: string; customerEmail: string; customerPhone: string; items: { name: string; qty: number; price: number }[]; subtotal: number; shipping: number; discount: number; grandTotal: number; status: string; sentVia: string; createdAt: string; }

const DB_CUSTOMERS = "rb_db_customers";
const DB_ORDERS = "rb_db_orders";
const DB_INVOICES = "rb_db_invoices";
export const DB_CONTENT = "rb_db_content";
export const DB_PAYMENTS = "rb_db_payments";

function getCustomers(): Customer[] { try { return JSON.parse(localStorage.getItem(DB_CUSTOMERS) || "[]"); } catch { return []; } }
function getOrders(): Order[] { try { return JSON.parse(localStorage.getItem(DB_ORDERS) || "[]"); } catch { return []; } }
function getInvoices(): Invoice[] { try { return JSON.parse(localStorage.getItem(DB_INVOICES) || "[]"); } catch { return []; } }

function seedData() {
  if (localStorage.getItem("rb_admin_seeded") === "true") return;
  const now = new Date().toISOString();
  const customers: Customer[] = [
    { id: "c1", name: "Ahmad Fauzi", email: "ahmad@email.com", phone: "081234567890", address: "Jl. Sudirman No. 10", city: "Jakarta Selatan", province: "DKI Jakarta", totalOrders: 5, totalSpent: 1250000, createdAt: now },
    { id: "c2", name: "Siti Rahmawati", email: "siti@email.com", phone: "082345678901", address: "Jl. Gatot Subroto No. 5", city: "Bandung", province: "Jawa Barat", totalOrders: 3, totalSpent: 750000, createdAt: now },
    { id: "c3", name: "Muhammad Ridwan", email: "ridwan@email.com", phone: "083456789012", address: "Jl. Diponegoro No. 20", city: "Surabaya", province: "Jawa Timur", totalOrders: 8, totalSpent: 2500000, createdAt: now },
    { id: "c4", name: "Fatimah Azzahra", email: "fatimah@email.com", phone: "084567890123", address: "Jl. Ahmad Yani No. 15", city: "Depok", province: "Jawa Barat", totalOrders: 2, totalSpent: 450000, createdAt: now },
    { id: "c5", name: "Budi Santoso", email: "budi@email.com", phone: "085678901234", address: "Jl. Pahlawan No. 8", city: "Bekasi", province: "Jawa Barat", totalOrders: 6, totalSpent: 1800000, createdAt: now },
  ];
  const orders: Order[] = [
    { id: "ORD-20240101", customerId: "c1", customerName: "Ahmad Fauzi", items: [{ name: "Kurma Ajwa 1KG", qty: 2, price: 145000 }, { name: "Air Zamzam 5L", qty: 1, price: 359000 }], total: 649000, shipping: 0, grandTotal: 649000, status: "delivered", paymentMethod: "BCA Transfer", paymentStatus: "paid", createdAt: "2024-01-15T09:00:00Z" },
    { id: "ORD-20240102", customerId: "c2", customerName: "Siti Rahmawati", items: [{ name: "Sajadah Turki Premium", qty: 1, price: 185000 }], total: 185000, shipping: 25000, grandTotal: 210000, status: "shipping", paymentMethod: "Mandiri Transfer", paymentStatus: "paid", createdAt: "2024-01-18T10:30:00Z" },
    { id: "ORD-20240103", customerId: "c3", customerName: "Muhammad Ridwan", items: [{ name: "Hampers Haji Premium", qty: 1, price: 450000 }, { name: "Kurma Sukari 1KG", qty: 3, price: 64500 }], total: 643500, shipping: 0, grandTotal: 643500, status: "processing", paymentMethod: "QRIS", paymentStatus: "paid", createdAt: "2024-01-20T14:00:00Z" },
    { id: "ORD-20240104", customerId: "c4", customerName: "Fatimah Azzahra", items: [{ name: "Coklat Arab Mix", qty: 2, price: 75000 }], total: 150000, shipping: 25000, grandTotal: 175000, status: "pending", paymentMethod: "BNI Transfer", paymentStatus: "unpaid", createdAt: "2024-01-22T08:00:00Z" },
    { id: "ORD-20240105", customerId: "c5", customerName: "Budi Santoso", items: [{ name: "Paket Perlengkapan Haji", qty: 1, price: 350000 }, { name: "Sorban Almas", qty: 2, price: 45000 }], total: 440000, shipping: 0, grandTotal: 440000, status: "delivered", paymentMethod: "BRI Transfer", paymentStatus: "paid", createdAt: "2024-01-10T11:00:00Z" },
    { id: "ORD-20240106", customerId: "c1", customerName: "Ahmad Fauzi", items: [{ name: "Kurma Medjool Jumbo", qty: 1, price: 250000 }], total: 250000, shipping: 0, grandTotal: 250000, status: "cancelled", paymentMethod: "BCA Transfer", paymentStatus: "refunded", createdAt: "2024-01-05T16:00:00Z" },
  ];
  const invoices: Invoice[] = orders.filter(o => o.paymentStatus === "paid").map(o => ({
    id: "INV-" + o.id.replace("ORD-", ""), orderId: o.id, customerName: o.customerName,
    customerEmail: customers.find(c => c.id === o.customerId)?.email || "", customerPhone: customers.find(c => c.id === o.customerId)?.phone || "",
    items: o.items, subtotal: o.total, shipping: o.shipping, discount: 0, grandTotal: o.grandTotal,
    status: "sent", sentVia: "email", createdAt: o.createdAt,
  }));
  localStorage.setItem(DB_CUSTOMERS, JSON.stringify(customers));
  localStorage.setItem(DB_ORDERS, JSON.stringify(orders));
  localStorage.setItem(DB_INVOICES, JSON.stringify(invoices));
  localStorage.setItem("rb_admin_seeded", "true");
}

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

export function FullDashboard() {
  const [stats, setStats] = useState(db.getStats());
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    initializeDatabase();
    seedData();
    setStats(db.getStats());
    setCustomers(getCustomers());
    setOrders(getOrders());
    setInvoices(getInvoices());
  }, []);

  const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.grandTotal, 0);
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
  const _unpaidInvoices = invoices.filter(i => i.status === "draft").length;
  void _unpaidInvoices;

  const statCards = [
    { label: "Total Pendapatan", value: fmt(totalRevenue), icon: <DollarSign size={20} />, color: "bg-green-50 text-green-700 border-green-200", trend: "+12%", up: true },
    { label: "Total Pesanan", value: orders.length, icon: <ShoppingCart size={20} />, color: "bg-blue-50 text-blue-700 border-blue-200", trend: "+8%", up: true },
    { label: "Pesanan Pending", value: pendingOrders, icon: <Clock size={20} />, color: "bg-amber-50 text-amber-700 border-amber-200", trend: "-3%", up: false },
    { label: "Total Pelanggan", value: customers.length, icon: <Users size={20} />, color: "bg-purple-50 text-purple-700 border-purple-200", trend: "+5%", up: true },
    { label: "Produk Aktif", value: stats.activeProducts, icon: <Package size={20} />, color: "bg-teal-50 text-teal-700 border-teal-200", trend: "+2", up: true },
    { label: "Invoice Terkirim", value: invoices.filter(i => i.status === "sent").length, icon: <CheckCircle size={20} />, color: "bg-indigo-50 text-indigo-700 border-indigo-200", trend: "+4", up: true },
    { label: "Stok Rendah", value: stats.lowStock, icon: <AlertTriangle size={20} />, color: "bg-orange-50 text-orange-700 border-orange-200", trend: "2 produk", up: false },
    { label: "Best Seller", value: stats.bestSellers, icon: <Star size={20} />, color: "bg-rose-50 text-rose-700 border-rose-200", trend: "Top 5", up: true },
  ];

  const statusColor = (s: string) => {
    switch (s) {
      case "delivered": return "bg-green-100 text-green-700";
      case "shipping": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-amber-100 text-amber-700";
      case "pending": return "bg-gray-100 text-gray-600";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };
  const statusLabel = (s: string) => ({ delivered: "Selesai", shipping: "Dikirim", processing: "Diproses", pending: "Pending", cancelled: "Dibatalkan" }[s] || s);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Ringkasan lengkap toko Ramdani Barkah</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl border p-4 ${card.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">{card.icon}<span className="text-xs font-medium">{card.label}</span></div>
              <span className={`text-xs flex items-center gap-0.5 ${card.up ? "text-green-600" : "text-red-500"}`}>
                {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{card.trend}
              </span>
            </div>
            <div className="text-xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2"><ShoppingCart size={16} /> Pesanan Terbaru</h2>
            <a href="/admin/pesanan" className="text-green-600 text-sm font-medium hover:underline">Lihat Semua</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                <tr><th className="text-left p-3">Order ID</th><th className="text-left p-3">Pelanggan</th><th className="text-right p-3">Total</th><th className="text-center p-3">Status</th><th className="text-center p-3">Bayar</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs text-gray-600">{o.id}</td>
                    <td className="p-3 font-medium text-gray-800">{o.customerName}</td>
                    <td className="p-3 text-right font-bold text-green-700">{fmt(o.grandTotal)}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(o.status)}`}>{statusLabel(o.status)}</span></td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.paymentStatus === "paid" ? "bg-green-100 text-green-700" : o.paymentStatus === "refunded" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{o.paymentStatus === "paid" ? "Lunas" : o.paymentStatus === "refunded" ? "Refund" : "Belum Bayar"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2"><Users size={16} /> Pelanggan Teratas</h2>
            <a href="/admin/pelanggan" className="text-green-600 text-sm font-medium hover:underline">Lihat Semua</a>
          </div>
          <div className="divide-y divide-gray-50">
            {customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5).map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-700" : "bg-gray-300"}`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.totalOrders} pesanan</p>
                </div>
                <span className="text-sm font-bold text-green-700">{fmt(c.totalSpent)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={16} /> Ringkasan Penjualan</h2>
        <div className="grid grid-cols-7 gap-2 items-end h-40">
          {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all" style={{ height: `${h}%` }} />
              <span className="text-xs text-gray-400">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== CUSTOMER MANAGER =====================
export function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCust, setEditCust] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", province: "" });

  useEffect(() => { seedData(); setCustomers(getCustomers()); }, []);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const all = getCustomers();
    if (editCust) {
      const idx = all.findIndex(c => c.id === editCust.id);
      if (idx >= 0) all[idx] = { ...all[idx], ...form };
    } else {
      all.push({ id: "c" + Date.now(), ...form, totalOrders: 0, totalSpent: 0, createdAt: new Date().toISOString() });
    }
    localStorage.setItem(DB_CUSTOMERS, JSON.stringify(all));
    setCustomers(all);
    setShowForm(false); setEditCust(null); setForm({ name: "", email: "", phone: "", address: "", city: "", province: "" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin hapus pelanggan ini?")) return;
    const all = getCustomers().filter(c => c.id !== id);
    localStorage.setItem(DB_CUSTOMERS, JSON.stringify(all));
    setCustomers(all);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Kelola Pelanggan</h1><p className="text-gray-500 text-sm">{customers.length} pelanggan terdaftar</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditCust(null); setForm({ name: "", email: "", phone: "", address: "", city: "", province: "" }); }} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm">
          {showForm ? "✕ Batal" : "+ Tambah Pelanggan"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{editCust ? "Edit Pelanggan" : "Pelanggan Baru"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp *</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Kota</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label><textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label><input value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm">{editCust ? "Update" : "Simpan"}</button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, email, atau no HP..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
              <tr><th className="text-left p-4">Pelanggan</th><th className="text-left p-4 hidden md:table-cell">Kontak</th><th className="text-left p-4 hidden lg:table-cell">Alamat</th><th className="text-center p-4">Order</th><th className="text-right p-4">Total Belanja</th><th className="text-center p-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xs">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><p className="font-medium text-gray-800">{c.name}</p><p className="text-xs text-gray-400 md:hidden">{c.phone}</p></div></div></td>
                  <td className="p-4 hidden md:table-cell"><p className="text-gray-700">{c.email}</p><p className="text-xs text-gray-400">{c.phone}</p></td>
                  <td className="p-4 hidden lg:table-cell text-gray-500 text-xs">{c.city}, {c.province}</td>
                  <td className="p-4 text-center font-medium">{c.totalOrders}</td>
                  <td className="p-4 text-right font-bold text-green-700">{fmt(c.totalSpent)}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <a href={`https://wa.me/${c.phone.replace(/^0/, "62")}`} target="_blank" rel="noreferrer" className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="WhatsApp">💬</a>
                      <button onClick={() => { setEditCust(c); setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, city: c.city, province: c.province }); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">✏️</button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
