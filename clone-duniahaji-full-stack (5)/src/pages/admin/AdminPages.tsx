import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, TrendingUp, AlertTriangle, Eye, EyeOff, Tag, Star, Edit2, Trash2, Plus, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { db, Product, Category, initializeDatabase } from "../../data/database";

// ===================== DASHBOARD =====================
export function Dashboard() {
  const [stats, setStats] = useState(db.getStats());
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    initializeDatabase();
    setStats(db.getStats());
    setRecentProducts(db.getProducts().slice(-5).reverse());
  }, []);

  const statCards = [
    { label: "Total Produk", value: stats.totalProducts, icon: <Package size={22} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Produk Aktif", value: stats.activeProducts, icon: <Eye size={22} />, color: "bg-green-50 text-green-600 border-green-100" },
    { label: "Produk Nonaktif", value: stats.inactiveProducts, icon: <EyeOff size={22} />, color: "bg-gray-50 text-gray-600 border-gray-100" },
    { label: "Best Seller", value: stats.bestSellers, icon: <Star size={22} />, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { label: "Produk Baru", value: stats.newProducts, icon: <Tag size={22} />, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Diskon", value: stats.discountProducts, icon: <TrendingUp size={22} />, color: "bg-red-50 text-red-600 border-red-100" },
    { label: "Stok Habis", value: stats.outOfStock, icon: <AlertTriangle size={22} />, color: "bg-red-50 text-red-600 border-red-100" },
    { label: "Stok Rendah", value: stats.lowStock, icon: <AlertTriangle size={22} />, color: "bg-orange-50 text-orange-600 border-orange-100" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Ringkasan katalog produk Ramdani Barkah</p>
        </div>
        <Link to="/admin/produk/tambah" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl border p-4 ${card.color}`}>
            <div className="flex items-center gap-2 mb-2">{card.icon}<span className="text-xs font-medium">{card.label}</span></div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Produk Terbaru</h2>
          <Link to="/admin/produk" className="text-green-600 text-sm font-medium hover:underline">Lihat Semua</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
              <img src={p.thumbnail} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/dcfce7/166534?text=RB"; }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                <p className="text-xs text-gray-400">Rp {p.basePrice.toLocaleString("id-ID")} • Stok: {p.stock}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {p.isActive ? "Aktif" : "Nonaktif"}
              </span>
              <Link to={`/admin/produk/edit/${p.id}`} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Edit2 size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== PRODUCT LIST =====================
export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    initializeDatabase();
    loadProducts();
    setCategories(db.getCategories());
  }, []);

  const loadProducts = () => setProducts(db.getProducts());

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus === "active" && !p.isActive) return false;
    if (filterStatus === "inactive" && p.isActive) return false;
    if (filterCategory && !p.categoryIds.includes(filterCategory)) return false;
    return true;
  });

  const handleToggle = (id: string) => { db.toggleProductStatus(id); loadProducts(); };
  const handleDelete = (id: string) => { if (confirm("Yakin ingin menghapus produk ini?")) { db.deleteProduct(id); loadProducts(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Produk</h1>
          <p className="text-gray-500 text-sm">{filtered.length} produk ditemukan</p>
        </div>
        <Link to="/admin/produk/tambah" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm">
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">Semua Kategori</option>
          {categories.filter((c) => !c.parentId).map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left p-4">Produk</th>
                <th className="text-left p-4 hidden md:table-cell">Kategori</th>
                <th className="text-right p-4">Harga</th>
                <th className="text-center p-4">Stok</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/dcfce7/166534?text=RB"; }} />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-48">{p.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {p.isBestSeller && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Best</span>}
                          {p.isNew && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Baru</span>}
                          {p.isDiscount && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Diskon</span>}
                          {p.variants.length > 0 && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{p.variants.length} Varian</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {p.categoryIds.slice(0, 2).map((cid) => {
                        const cat = categories.find((c) => c.id === cid);
                        return cat ? <span key={cid} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{cat.icon} {cat.name}</span> : null;
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-green-700">Rp {p.basePrice.toLocaleString("id-ID")}</div>
                    {p.originalPrice && <div className="text-xs text-gray-400 line-through">Rp {p.originalPrice.toLocaleString("id-ID")}</div>}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-medium ${p.stock <= 0 ? "text-red-600" : p.stock <= 10 ? "text-orange-500" : "text-gray-700"}`}>{p.stock}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleToggle(p.id)} className="flex items-center justify-center mx-auto">
                      {p.isActive ? <ToggleRight size={28} className="text-green-600" /> : <ToggleLeft size={28} className="text-gray-300" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <Link to={`/admin/produk/edit/${p.id}`} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Edit2 size={15} /></Link>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-gray-400">Tidak ada produk ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===================== CATEGORY MANAGER =====================
export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "", color: "from-green-400 to-green-600", parentId: "" as string | null });

  useEffect(() => { initializeDatabase(); loadCategories(); }, []);
  const loadCategories = () => setCategories(db.getCategories());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat: Category = editCat
      ? { ...editCat, ...form, slug: form.name.toLowerCase().replace(/\s+/g, "-") }
      : { id: "cat-" + Date.now(), name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, "-"), icon: form.icon || "📦", color: form.color, parentId: form.parentId || null, order: categories.length + 1 };
    db.saveCategory(cat);
    loadCategories();
    setShowForm(false);
    setEditCat(null);
    setForm({ name: "", icon: "", color: "from-green-400 to-green-600", parentId: "" });
  };

  const handleEdit = (cat: Category) => {
    setEditCat(cat);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color, parentId: cat.parentId || "" });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus kategori ini? Sub-kategori juga akan terhapus.")) {
      db.deleteCategory(id);
      loadCategories();
    }
  };

  const parents = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId);
  const getProductCount = (catId: string) => db.getProducts().filter((p) => p.categoryIds.includes(catId)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Kategori</h1>
          <p className="text-gray-500 text-sm">{categories.length} kategori</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditCat(null); setForm({ name: "", icon: "", color: "from-green-400 to-green-600", parentId: "" }); }} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm">
          <Plus size={16} /> {showForm ? "Batal" : "Tambah Kategori"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{editCat ? "Edit Kategori" : "Kategori Baru"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Contoh: Kurma Premium" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ikon (Emoji)</label>
              <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🌴" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Kategori</label>
              <select value={form.parentId || ""} onChange={(e) => setForm({ ...form, parentId: e.target.value || null })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
                <option value="">Tidak ada (Kategori Utama)</option>
                {parents.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warna Gradient</label>
              <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
                {["from-amber-400 to-amber-600", "from-blue-400 to-blue-600", "from-green-400 to-green-600", "from-red-400 to-red-600", "from-purple-400 to-purple-600", "from-pink-400 to-pink-600", "from-teal-400 to-teal-600", "from-orange-400 to-orange-600", "from-indigo-400 to-indigo-600", "from-yellow-400 to-yellow-600"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
            {editCat ? "Update Kategori" : "Simpan Kategori"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {parents.map((parent) => (
          <div key={parent.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-gray-50">
              <div className={`w-10 h-10 bg-gradient-to-br ${parent.color} rounded-xl flex items-center justify-center text-lg`}>{parent.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{parent.name}</div>
                <div className="text-xs text-gray-400">{getProductCount(parent.id)} produk • {getChildren(parent.id).length} sub-kategori</div>
              </div>
              <button onClick={() => handleEdit(parent)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Edit2 size={15} /></button>
              <button onClick={() => handleDelete(parent.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
            </div>
            {getChildren(parent.id).length > 0 && (
              <div className="p-3 bg-gray-50 flex flex-wrap gap-2">
                {getChildren(parent.id).map((child) => (
                  <div key={child.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-100">
                    <span>{child.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{child.name}</span>
                    <span className="text-xs text-gray-400">({getProductCount(child.id)})</span>
                    <button onClick={() => handleEdit(child)} className="text-gray-300 hover:text-green-600"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(child.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
