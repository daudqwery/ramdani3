import { useState, useEffect } from "react";
import { CheckCircle, Mail, MessageCircle, Edit2, Trash2, Plus, Eye, Printer } from "lucide-react";

// ===================== PAYMENT GATEWAY =====================
// =====================================================
// PAYMENT GATEWAY LIST - Mudah Ditambah
// =====================================================
const gateways = [
  // === EXISTING ===
  { id: "ayolinx", name: "AyoLinx", logo: "💳", status: "active", type: "Bank Transfer & E-Wallet", fee: "2.5%", desc: "Payment aggregator untuk transfer bank, e-wallet, dan QRIS" },
  { id: "onebric", name: "OneBric.io", logo: "🔗", status: "active", type: "Multi Payment", fee: "2.0%", desc: "Gateway pembayaran multi-channel dengan API modern" },
  { id: "duitku", name: "Duitku", logo: "💰", status: "active", type: "Bank Transfer, VA, E-Wallet", fee: "1.5% - 3%", desc: "Payment gateway Indonesia dengan Virtual Account lengkap" },
  { id: "faspay", name: "Faspay", logo: "⚡", status: "active", type: "Bank Transfer, CC, E-Wallet", fee: "2.5%", desc: "Payment gateway terpercaya dengan 70+ channel pembayaran" },
  { id: "p2cp", name: "P2CP", logo: "🔄", status: "inactive", type: "Peer to Peer", fee: "1.0%", desc: "Platform pembayaran P2P untuk transaksi cepat" },
  { id: "midtrans", name: "Midtrans", logo: "🏦", status: "active", type: "All-in-One", fee: "2.0% - 2.9%", desc: "Payment gateway terbesar di Indonesia by GoTo" },
  { id: "xendit", name: "Xendit", logo: "🌐", status: "active", type: "Multi Payment", fee: "1.5% - 2.5%", desc: "Payment gateway Asia Tenggara dengan API lengkap" },
  { id: "tripay", name: "TriPay", logo: "💎", status: "active", type: "Bank Transfer, QRIS, E-Wallet", fee: "1.0% - 2.5%", desc: "Payment gateway Indonesia dengan harga terjangkau" },
  { id: "oy", name: "OY! Indonesia", logo: "📱", status: "active", type: "Transfer Bank, E-Wallet", fee: "1.5%", desc: "Solusi pembayaran digital untuk bisnis Indonesia" },
  { id: "ipg", name: "iPaymu", logo: "🎯", status: "inactive", type: "Multi Payment", fee: "2.5%", desc: "Payment gateway Indonesia untuk UMKM" },

  // === NEW GATEWAYS YANG DIMINTA USER ===
  { id: "certenz", name: "Certenz", logo: "🛡️", status: "inactive", type: "Bank Transfer & QRIS", fee: "2.0%", desc: "Payment gateway dengan fitur keamanan tinggi dan QRIS" },
  { id: "e2pay", name: "E2Pay", logo: "💼", status: "inactive", type: "Multi Payment", fee: "1.8%", desc: "Payment gateway Indonesia untuk bisnis dan marketplace" },

  // =====================================================
  // CARA MENAMBAHKAN PAYMENT GATEWAY BARU:
  // =====================================================
  // 1. Copy format di atas
  // 2. Ganti id, name, logo, status, type, fee, dan desc
  // 3. Simpan file
  //
  // Contoh menambah gateway baru:
  // { id: "nama-baru", name: "Nama Gateway", logo: "🔥", status: "active", type: "Bank Transfer", fee: "2.0%", desc: "Deskripsi singkat" },
  //
  // Status yang tersedia: "active" atau "inactive"
  // =====================================================
];

const paymentChannels = [
  { name: "BCA Virtual Account", icon: "🏦", gateway: "Duitku / Midtrans", fee: "Rp 4.000" },
  { name: "Mandiri Virtual Account", icon: "🏦", gateway: "Duitku / Faspay", fee: "Rp 4.000" },
  { name: "BRI Virtual Account", icon: "🏦", gateway: "Duitku / TriPay", fee: "Rp 4.000" },
  { name: "BNI Virtual Account", icon: "🏦", gateway: "Midtrans / Xendit", fee: "Rp 4.000" },
  { name: "QRIS (All E-Wallet)", icon: "📱", gateway: "AyoLinx / TriPay", fee: "0.7%" },
  { name: "GoPay", icon: "💚", gateway: "Midtrans / Xendit", fee: "2.0%" },
  { name: "OVO", icon: "💜", gateway: "Midtrans / Duitku", fee: "2.0%" },
  { name: "DANA", icon: "💙", gateway: "Xendit / TriPay", fee: "1.5%" },
  { name: "ShopeePay", icon: "🧡", gateway: "Xendit / Faspay", fee: "1.5%" },
  { name: "LinkAja", icon: "❤️", gateway: "Midtrans / Duitku", fee: "1.5%" },
  { name: "Kartu Kredit/Debit", icon: "💳", gateway: "Midtrans / Faspay", fee: "2.9%" },
  { name: "Indomaret / Alfamart", icon: "🏪", gateway: "Duitku / Midtrans", fee: "Rp 5.000" },
];

export function PaymentGatewayManager() {
  const [activeTab, setActiveTab] = useState<"gateways" | "manual" | "channels" | "settings">("gateways");
  const [gatewayStatuses, setGatewayStatuses] = useState<Record<string, boolean>>({});
  const [selectedGateway, setSelectedGateway] = useState<any>(null);
  const [configForm, setConfigForm] = useState({
    merchantId: "",
    apiKey: "",
    secretKey: "",
    callbackUrl: "",
    mode: "sandbox",
  });

  useEffect(() => {
    const saved = localStorage.getItem("rb_gateway_status");
    if (saved) setGatewayStatuses(JSON.parse(saved));
    else {
      const initial: Record<string, boolean> = {};
      gateways.forEach(g => { initial[g.id] = g.status === "active"; });
      setGatewayStatuses(initial);
    }
  }, []);

  const toggleGateway = (id: string) => {
    const updated = { ...gatewayStatuses, [id]: !gatewayStatuses[id] };
    setGatewayStatuses(updated);
    localStorage.setItem("rb_gateway_status", JSON.stringify(updated));
  };

  const openConfig = (gateway: any) => {
    setSelectedGateway(gateway);
    // Load saved config if exists
    const savedConfig = localStorage.getItem(`rb_gateway_config_${gateway.id}`);
    if (savedConfig) {
      setConfigForm(JSON.parse(savedConfig));
    } else {
      setConfigForm({
        merchantId: "",
        apiKey: "",
        secretKey: "",
        callbackUrl: `${window.location.origin}/payment/callback/${gateway.id}`,
        mode: "sandbox",
      });
    }
  };

  const saveConfig = () => {
    if (!selectedGateway) return;

    const fullConfig = {
      ...configForm,
      gatewayId: selectedGateway.id,
      gatewayName: selectedGateway.name,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`rb_gateway_config_${selectedGateway.id}`, JSON.stringify(fullConfig));
    
    // Juga simpan status jika diubah
    const statusUpdate = { ...gatewayStatuses, [selectedGateway.id]: true };
    setGatewayStatuses(statusUpdate);
    localStorage.setItem("rb_gateway_status", JSON.stringify(statusUpdate));

    alert(`✅ Konfigurasi ${selectedGateway.name} berhasil disimpan!\n\nGateway sekarang aktif dan siap digunakan.`);
    setSelectedGateway(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Gateway</h1>
        <p className="text-gray-500 text-sm">Kelola payment gateway Indonesia untuk toko Anda</p>
      </div>

      <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm overflow-x-auto">
        {(["gateways", "manual", "channels", "settings"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50"}`}>
            {tab === "gateways" ? "🏦 Gateway" : tab === "manual" ? "🏦 Rekening Manual" : tab === "channels" ? "📱 Channel Pembayaran" : "⚙️ Pengaturan"}
          </button>
        ))}
      </div>

      {activeTab === "gateways" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gateways.map(g => (
            <div key={g.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${gatewayStatuses[g.id] ? "border-green-200" : "border-gray-100 opacity-70"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{g.logo}</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{g.name}</h3>
                    <p className="text-xs text-gray-400">{g.type}</p>
                  </div>
                </div>
                <button onClick={() => toggleGateway(g.id)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${gatewayStatuses[g.id] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {gatewayStatuses[g.id] ? "✅ Aktif" : "⬜ Nonaktif"}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">{g.desc}</p>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-400">Biaya: <strong className="text-gray-600">{g.fee}</strong></span>
                <div className="flex gap-2">
                  {gatewayStatuses[g.id] && (
                    <button 
                      onClick={() => openConfig(g)}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all"
                    >
                      Konfigurasi
                    </button>
                  )}
                  <span className={gatewayStatuses[g.id] ? "text-green-600 font-medium" : "text-gray-400"}>
                    {gatewayStatuses[g.id] ? "● Connected" : "○ Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "channels" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-bold text-gray-800">Channel Pembayaran Tersedia</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {paymentChannels.map((ch, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all">
                <span className="text-2xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{ch.name}</p>
                  <p className="text-xs text-gray-400">{ch.gateway}</p>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{ch.fee}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TAB REKENING MANUAL === */}
      {activeTab === "manual" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="font-bold text-xl text-gray-800">Rekening Transfer Manual</h3>
            <p className="text-gray-500 text-sm mt-1">Isi nomor rekening di bawah ini. Rekening ini akan muncul di invoice jika pelanggan memilih metode "Transfer ke Rekening".</p>
          </div>

          <div className="space-y-6">
            {[
              { bank: "BCA", color: "from-blue-600 to-blue-700" },
              { bank: "Mandiri", color: "from-yellow-500 to-yellow-600" },
              { bank: "BRI", color: "from-blue-700 to-blue-800" },
              { bank: "BNI", color: "from-orange-500 to-orange-600" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-5 border border-gray-200 rounded-2xl hover:border-green-300 transition-all">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                  {item.bank.slice(0, 1)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-800">{item.bank}</div>
                  <input 
                    type="text" 
                    placeholder="Nomor Rekening (contoh: 1234567890)" 
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500 font-mono"
                    defaultValue={localStorage.getItem(`rb_rekening_${item.bank.toLowerCase()}`) || ""}
                    onChange={(e) => localStorage.setItem(`rb_rekening_${item.bank.toLowerCase()}`, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <strong>Catatan:</strong> Nomor rekening yang diisi di sini akan otomatis muncul di invoice ketika pelanggan memilih metode pembayaran "Transfer ke Rekening".
          </div>
        </div>
      )}

      {/* === MODAL KONFIGURASI GATEWAY LENGKAP === */}
      {selectedGateway && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <span className="text-4xl">{selectedGateway.logo}</span>
              <div>
                <h3 className="font-bold text-2xl text-gray-900">{selectedGateway.name}</h3>
                <p className="text-sm text-gray-500">{selectedGateway.type} • Fee: {selectedGateway.fee}</p>
              </div>
            </div>

            <div className="space-y-5">
              
              {/* Merchant ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Merchant ID <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={configForm.merchantId} 
                  onChange={e => setConfigForm({...configForm, merchantId: e.target.value})}
                  placeholder="Contoh: M123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500 font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">ID merchant yang diberikan oleh {selectedGateway.name}</p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  API Key / Public Key <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={configForm.apiKey} 
                  onChange={e => setConfigForm({...configForm, apiKey: e.target.value})}
                  placeholder="Contoh: pub_xxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500 font-mono"
                />
              </div>

              {/* Secret Key */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Secret Key / Private Key <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  value={configForm.secretKey} 
                  onChange={e => setConfigForm({...configForm, secretKey: e.target.value})}
                  placeholder="Masukkan secret key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500 font-mono"
                />
                <p className="text-xs text-red-500 mt-1">Jangan bagikan secret key ke siapapun</p>
              </div>

              {/* Webhook / Callback URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Webhook URL / Callback URL</label>
                <input 
                  type="text" 
                  value={configForm.callbackUrl} 
                  onChange={e => setConfigForm({...configForm, callbackUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500 font-mono text-xs"
                />
                <p className="text-xs text-gray-400 mt-1">URL untuk menerima notifikasi pembayaran dari gateway</p>
              </div>

              {/* Environment Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Environment Mode</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfigForm({...configForm, mode: "sandbox"})}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      configForm.mode === "sandbox" 
                        ? "bg-amber-500 text-white border-amber-500" 
                        : "bg-white text-gray-600 border-gray-300 hover:border-amber-300"
                    }`}
                  >
                    🧪 Sandbox (Testing)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfigForm({...configForm, mode: "production"})}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      configForm.mode === "production" 
                        ? "bg-green-600 text-white border-green-600" 
                        : "bg-white text-gray-600 border-gray-300 hover:border-green-300"
                    }`}
                  >
                    🚀 Production (Live)
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                <p className="font-semibold mb-1">💡 Cara Mendapatkan API Key:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Daftar akun di dashboard {selectedGateway.name}</li>
                  <li>Buat project / merchant baru</li>
                  <li>Copy API Key, Secret Key, dan Merchant ID</li>
                  <li>Paste ke form di atas</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setSelectedGateway(null)} 
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={saveConfig} 
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                Simpan & Aktifkan
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Pengaturan Pembayaran</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-800 text-sm">Auto-Confirm Pembayaran</p><p className="text-xs text-gray-400">Otomatis konfirmasi saat pembayaran diterima</p></div>
              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-800 text-sm">Batas Waktu Pembayaran</p><p className="text-xs text-gray-400">Durasi maksimal pelanggan melakukan pembayaran</p></div>
              <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"><option>24 Jam</option><option>48 Jam</option><option>72 Jam</option></select>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-800 text-sm">Notifikasi Pembayaran</p><p className="text-xs text-gray-400">Kirim notifikasi ke admin saat ada pembayaran baru</p></div>
              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-800 text-sm">Gratis Ongkir Otomatis</p><p className="text-xs text-gray-400">Gratis ongkir untuk pembelian di atas Rp 300.000</p></div>
              <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== INVOICE MANAGER =====================
interface InvoiceItem { name: string; qty: number; price: number; }
interface InvoiceData {
  id: string; orderId: string; customerName: string; customerEmail: string; customerPhone: string;
  customerAddress: string; items: InvoiceItem[]; subtotal: number; shipping: number; discount: number;
  grandTotal: number; status: string; sentVia: string; notes: string; createdAt: string; paymentMethod: string;
}

const DB_INVOICES = "rb_db_invoices";
const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

function getInvoices(): InvoiceData[] {
  try { return JSON.parse(localStorage.getItem(DB_INVOICES) || "[]"); } catch { return []; }
}

export function InvoiceManager() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [previewInv, setPreviewInv] = useState<InvoiceData | null>(null);
  const [editInv, setEditInv] = useState<InvoiceData | null>(null);
  const [form, setForm] = useState({ orderId: "", customerName: "", customerEmail: "", customerPhone: "", customerAddress: "", paymentMethod: "BCA Transfer", notes: "", shipping: 0, discount: 0 });
  const [items, setItems] = useState<InvoiceItem[]>([{ name: "", qty: 1, price: 0 }]);
  const [sendStatus, setSendStatus] = useState("");

  useEffect(() => { setInvoices(getInvoices()); }, []);

  const addItem = () => setItems([...items, { name: "", qty: 1, price: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: any) => {
    const updated = [...items]; (updated[i] as any)[field] = value; setItems(updated);
  };

  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const grandTotal = subtotal + form.shipping - form.discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inv: InvoiceData = {
      id: editInv ? editInv.id : "INV-" + Date.now().toString().slice(-8),
      ...form,
      orderId: form.orderId || "ORD-" + Date.now().toString().slice(-8),
      items, subtotal, grandTotal,
      status: editInv ? editInv.status : "draft",
      sentVia: editInv ? editInv.sentVia : "-",
      createdAt: editInv ? editInv.createdAt : new Date().toISOString(),
    };
    const all = getInvoices();
    if (editInv) { const idx = all.findIndex(i => i.id === editInv.id); if (idx >= 0) all[idx] = inv; }
    else all.push(inv);
    localStorage.setItem(DB_INVOICES, JSON.stringify(all));
    setInvoices(all);
    setShowForm(false); setEditInv(null);
    setForm({ orderId: "", customerName: "", customerEmail: "", customerPhone: "", customerAddress: "", paymentMethod: "BCA Transfer", notes: "", shipping: 0, discount: 0 });
    setItems([{ name: "", qty: 1, price: 0 }]);
  };

  const sendInvoice = (inv: InvoiceData, via: "email" | "whatsapp") => {
    if (via === "whatsapp") {
      const msg = `*INVOICE - Ramdani Barkah*\n\nNo. Invoice: ${inv.id}\nNo. Order: ${inv.orderId}\nPelanggan: ${inv.customerName}\n\n*Item:*\n${inv.items.map(it => `• ${it.name} x${it.qty} = ${fmt(it.qty * it.price)}`).join("\n")}\n\nSubtotal: ${fmt(inv.subtotal)}\nOngkir: ${fmt(inv.shipping)}\nDiskon: ${fmt(inv.discount)}\n*TOTAL: ${fmt(inv.grandTotal)}*\n\nMetode: ${inv.paymentMethod}\n\nTerima kasih telah berbelanja! 🤲`;
      window.open(`https://wa.me/${inv.customerPhone.replace(/^0/, "62")}?text=${encodeURIComponent(msg)}`, "_blank");
      setSendStatus(`Invoice ${inv.id} dikirim via WhatsApp!`);
    } else {
      setSendStatus(`Invoice ${inv.id} dikirim ke email ${inv.customerEmail}! (simulasi)`);
    }
    const all = getInvoices();
    const idx = all.findIndex(i => i.id === inv.id);
    if (idx >= 0) { all[idx].status = "sent"; all[idx].sentVia = via; }
    localStorage.setItem(DB_INVOICES, JSON.stringify(all));
    setInvoices(all);
    setTimeout(() => setSendStatus(""), 3000);
  };

  const deleteInvoice = (id: string) => {
    if (!confirm("Hapus invoice ini?")) return;
    const all = getInvoices().filter(i => i.id !== id);
    localStorage.setItem(DB_INVOICES, JSON.stringify(all));
    setInvoices(all);
  };

  const statusColor = (s: string) => ({ sent: "bg-green-100 text-green-700", draft: "bg-amber-100 text-amber-700", paid: "bg-blue-100 text-blue-700" }[s] || "bg-gray-100 text-gray-600");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Kelola Invoice</h1><p className="text-gray-500 text-sm">{invoices.length} invoice</p></div>
        <button onClick={() => { setShowForm(!showForm); setEditInv(null); setPreviewInv(null); setForm({ orderId: "", customerName: "", customerEmail: "", customerPhone: "", customerAddress: "", paymentMethod: "BCA Transfer", notes: "", shipping: 0, discount: 0 }); setItems([{ name: "", qty: 1, price: 0 }]); }} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm">
          {showForm ? "✕ Batal" : "+ Buat Invoice"}
        </button>
      </div>

      {sendStatus && <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-center gap-2 text-green-700 text-sm font-medium"><CheckCircle size={16} />{sendStatus}<button onClick={() => setSendStatus("")} className="ml-auto text-green-400 hover:text-green-600">✕</button></div>}

      {/* Invoice Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{editInv ? "Edit Invoice" : "Buat Invoice Baru"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">No. Order</label><input value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} placeholder="ORD-20240101" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan *</label><input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Pelanggan</label><input type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp *</label><input value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label><input value={form.customerAddress} onChange={e => setForm({ ...form, customerAddress: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
                <option disabled>--- Transfer Manual ---</option>
                <option>BCA Transfer</option>
                <option>Mandiri Transfer</option>
                <option>BRI Transfer</option>
                <option>BNI Transfer</option>
                <option disabled>--- Payment Gateway ---</option>
                <option>QRIS (Semua E-Wallet)</option>
                <option>GoPay</option>
                <option>OVO</option>
                <option>DANA</option>
                <option>ShopeePay</option>
                <option>LinkAja</option>
                <option>Virtual Account (BCA/Mandiri/BRI/BNI)</option>
                <option>Kartu Kredit/Debit</option>
              </select>
            </div>
          </div>

          {/* Items */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-gray-700">Item Produk</label><button type="button" onClick={addItem} className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1"><Plus size={14} /> Tambah Item</button></div>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={item.name} onChange={e => updateItem(i, "name", e.target.value)} placeholder="Nama produk" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                <input type="number" value={item.qty || ""} onChange={e => updateItem(i, "qty", Number(e.target.value))} placeholder="Qty" className="w-16 px-2 py-2 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:border-green-500" />
                <input type="number" value={item.price || ""} onChange={e => updateItem(i, "price", Number(e.target.value))} placeholder="Harga" className="w-28 px-2 py-2 border border-gray-200 rounded-xl text-sm text-right focus:outline-none focus:border-green-500" />
                <span className="text-sm font-bold text-green-700 w-28 text-right py-2">{fmt(item.qty * item.price)}</span>
                {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div><label className="text-xs text-gray-500">Subtotal</label><p className="font-bold text-gray-800">{fmt(subtotal)}</p></div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ongkir</label>
              <input type="number" value={form.shipping || ""} onChange={e => setForm({ ...form, shipping: Number(e.target.value) })} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Diskon</label>
              <input type="number" value={form.discount || ""} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:border-green-500" />
            </div>
            <div><label className="text-xs text-gray-500">Grand Total</label><p className="font-bold text-green-700 text-lg">{fmt(grandTotal)}</p></div>
          </div>

          <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none" placeholder="Catatan tambahan..." /></div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm">{editInv ? "Update Invoice" : "Simpan Invoice"}</button>
        </form>
      )}

      {/* Invoice Preview Modal - PROFESSIONAL DESIGN */}
      {previewInv && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreviewInv(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-[720px] w-full max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            
            {/* Invoice Content */}
            <div className="p-8" id="invoice-preview">
              
              {/* === HEADER === */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-700 to-green-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">RB</span>
                    </div>
                    <div>
                      <h1 className="font-bold text-2xl text-gray-900 tracking-tight">Ramdani Barkah</h1>
                      <p className="text-sm text-green-600 font-medium">Oleh-Oleh Haji & Umroh</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-3 leading-tight">
                    Jl. K.H. Mas Mansyur No.94A, RT.7/RW.17<br />
                    Kb. Melati, Tanah Abang, Jakarta Pusat 10240
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
                    INVOICE
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="text-gray-400">No. Invoice</div>
                    <div className="font-mono font-bold text-lg text-gray-900">{previewInv.id}</div>
                  </div>
                  <div className="mt-1 text-sm">
                    <div className="text-gray-400">Tanggal</div>
                    <div className="font-medium text-gray-700">
                      {new Date(previewInv.createdAt).toLocaleDateString("id-ID", { 
                        day: "numeric", month: "long", year: "numeric" 
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* === CUSTOMER & PAYMENT INFO === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Bill To */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 tracking-wider mb-2">DITERBITKAN KEPADA</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="font-semibold text-lg text-gray-900">{previewInv.customerName}</div>
                    <div className="text-gray-600 mt-1">{previewInv.customerPhone}</div>
                    <div className="text-gray-600">{previewInv.customerEmail}</div>
                    {previewInv.customerAddress && (
                      <div className="text-gray-500 mt-2 text-sm leading-snug">{previewInv.customerAddress}</div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 tracking-wider mb-2">DETAIL PEMBAYARAN</div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Metode</span>
                      <span className="font-semibold text-gray-900">{previewInv.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-gray-100 mt-1">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold ${previewInv.status === "paid" ? "text-green-600" : "text-amber-600"}`}>
                        {previewInv.status === "paid" ? "Lunas" : previewInv.status === "sent" ? "Belum Dibayar" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* === ITEMS TABLE === */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-900">
                      <th className="text-left py-3 font-semibold text-gray-700">Deskripsi</th>
                      <th className="text-center py-3 w-16 font-semibold text-gray-700">Qty</th>
                      <th className="text-right py-3 w-28 font-semibold text-gray-700">Harga</th>
                      <th className="text-right py-3 w-32 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewInv.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-4 text-gray-800 font-medium">{item.name}</td>
                        <td className="py-4 text-center text-gray-600">{item.qty}</td>
                        <td className="py-4 text-right text-gray-600 font-mono">{fmt(item.price)}</td>
                        <td className="py-4 text-right font-semibold text-gray-900 font-mono">
                          {fmt(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* === TOTALS === */}
              <div className="flex justify-end mb-8">
                <div className="w-full md:w-80">
                  <div className="flex justify-between py-2 text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-mono">{fmt(previewInv.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-mono">{fmt(previewInv.shipping)}</span>
                  </div>
                  {previewInv.discount > 0 && (
                    <div className="flex justify-between py-2 text-sm text-red-600">
                      <span>Diskon</span>
                      <span className="font-mono">-{fmt(previewInv.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t-2 border-gray-900 pt-3 mt-1">
                    <span className="font-bold text-lg">TOTAL</span>
                    <span className="font-bold text-2xl text-green-700 font-mono">{fmt(previewInv.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* === PAYMENT INSTRUCTIONS === */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-6">
                <div className="font-bold text-green-800 mb-3">Instruksi Pembayaran</div>
                
                {["BCA Transfer", "Mandiri Transfer", "BRI Transfer", "BNI Transfer"].includes(previewInv.paymentMethod) ? (
                  // Transfer Manual
                  <div className="text-sm text-green-700 space-y-2">
                    <p className="font-semibold">Silakan transfer ke rekening berikut:</p>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <p><strong>Bank:</strong> {previewInv.paymentMethod.replace(" Transfer", "")}</p>
                      <p><strong>No. Rekening:</strong> <span className="font-mono font-bold text-lg">{localStorage.getItem(`rb_rekening_${previewInv.paymentMethod.replace(" Transfer", "").toLowerCase()}`) || "Belum diatur admin"}</span></p>
                      <p><strong>Atas Nama:</strong> Ramdani Barkah</p>
                    </div>
                    <p className="mt-2">Setelah transfer, konfirmasi via WhatsApp: <strong>+62 812-9057-6590</strong></p>
                    <p>Sertakan nomor invoice: <strong>{previewInv.id}</strong></p>
                  </div>
                ) : (
                  // Payment Gateway
                  <div className="text-sm text-green-700 space-y-1">
                    <p>1. Buka aplikasi {previewInv.paymentMethod} atau scan QRIS</p>
                    <p>2. Bayar sesuai nominal yang tertera</p>
                    <p>3. Simpan bukti pembayaran</p>
                    <p>4. Konfirmasi via WhatsApp: <strong>+62 812-9057-6590</strong></p>
                    <p>5. Sertakan nomor invoice: <strong>{previewInv.id}</strong></p>
                  </div>
                )}
              </div>

              {/* === FOOTER === */}
              <div className="text-center border-t pt-6">
                <p className="text-green-700 font-medium">Terima kasih telah berbelanja di Ramdani Barkah</p>
                <p className="text-xs text-gray-500 mt-1">Semoga berkah dan menjadi oleh-oleh yang penuh makna 🤲</p>
                
                <div className="mt-4 text-xs text-gray-400">
                  WA: +62 812-9057-6590 • Email: info@ramdanibarkah.com
                </div>
              </div>

            </div>

            {/* === ACTION BUTTONS === */}
            <div className="border-t p-4 bg-gray-50 rounded-b-2xl flex flex-wrap gap-2">
              <button 
                onClick={() => sendInvoice(previewInv, "whatsapp")} 
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.985]"
              >
                <MessageCircle size={18} /> Kirim WhatsApp
              </button>
              <button 
                onClick={() => sendInvoice(previewInv, "email")} 
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.985]"
              >
                <Mail size={18} /> Kirim Email
              </button>
              <button 
                onClick={() => window.print()} 
                className="px-5 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm transition-all"
              >
                <Printer size={18} /> Print
              </button>
              <button 
                onClick={() => setPreviewInv(null)} 
                className="px-5 flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm transition-all"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Invoice List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
              <tr><th className="text-left p-4">Invoice</th><th className="text-left p-4">Pelanggan</th><th className="text-right p-4">Total</th><th className="text-center p-4">Status</th><th className="text-center p-4">Terkirim</th><th className="text-center p-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-4"><p className="font-mono font-bold text-gray-800 text-xs">{inv.id}</p><p className="text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString("id-ID")}</p></td>
                  <td className="p-4"><p className="font-medium text-gray-800">{inv.customerName}</p><p className="text-xs text-gray-400">{inv.customerPhone}</p></td>
                  <td className="p-4 text-right font-bold text-green-700">{fmt(inv.grandTotal)}</td>
                  <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>{inv.status === "sent" ? "Terkirim" : inv.status === "paid" ? "Lunas" : "Draft"}</span></td>
                  <td className="p-4 text-center text-xs text-gray-500">{inv.sentVia !== "-" ? (inv.sentVia === "email" ? "📧 Email" : "💬 WA") : "-"}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setPreviewInv(inv)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Preview"><Eye size={15} /></button>
                      <button onClick={() => sendInvoice(inv, "whatsapp")} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Kirim WA"><MessageCircle size={15} /></button>
                      <button onClick={() => sendInvoice(inv, "email")} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Kirim Email"><Mail size={15} /></button>
                      <button onClick={() => { setEditInv(inv); setForm({ orderId: inv.orderId, customerName: inv.customerName, customerEmail: inv.customerEmail, customerPhone: inv.customerPhone, customerAddress: inv.customerAddress || "", paymentMethod: inv.paymentMethod, notes: inv.notes || "", shipping: inv.shipping, discount: inv.discount }); setItems(inv.items); setShowForm(true); setPreviewInv(null); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit2 size={15} /></button>
                      <button onClick={() => deleteInvoice(inv.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Hapus"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-gray-400">Belum ada invoice. Buat invoice baru untuk memulai.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
