import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, Image, ChevronDown, ChevronUp, Save, ArrowLeft } from "lucide-react";
import { db, Product, ProductImage, ProductVariant, ProductSpec, Category, generateId, slugify, initializeDatabase } from "../../data/database";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"basic" | "gallery" | "variants" | "specs">("basic");

  // Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState("");
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isDiscount, setIsDiscount] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");

  // Gallery
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantType, setVariantType] = useState("Ukuran");
  const [variantName, setVariantName] = useState("");
  const [variantPrice, setVariantPrice] = useState(0);
  const [variantStock, setVariantStock] = useState(0);

  // Specs
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  useEffect(() => {
    initializeDatabase();
    setCategories(db.getCategories());
    if (id) {
      const product = db.getProduct(id);
      if (product) {
        setName(product.name);
        setDescription(product.description);
        setBasePrice(product.basePrice);
        setOriginalPrice(product.originalPrice || 0);
        setThumbnail(product.thumbnail);
        setStock(product.stock);
        setWeight(product.weight || "");
        setIsActive(product.isActive);
        setIsBestSeller(product.isBestSeller);
        setIsNew(product.isNew);
        setIsDiscount(product.isDiscount);
        setSelectedCategories(product.categoryIds);
        setTagsInput(product.tags.join(", "));
        setImages(product.images);
        setVariants(product.variants);
        setSpecs(product.specifications);
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!name.trim()) { alert("Nama produk wajib diisi!"); return; }
    if (basePrice <= 0) { alert("Harga harus lebih dari 0!"); return; }

    const product: Product = {
      id: id || generateId(),
      name,
      slug: slugify(name),
      description,
      basePrice,
      originalPrice: originalPrice > 0 ? originalPrice : undefined,
      thumbnail: thumbnail || `https://placehold.co/500x500/166534/ffffff?text=${encodeURIComponent(name.substring(0, 20))}`,
      isActive,
      categoryIds: selectedCategories,
      images,
      variants,
      specifications: specs,
      stock,
      weight: weight || undefined,
      rating: 0,
      reviews: 0,
      isBestSeller,
      isNew,
      isDiscount,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.saveProduct(product);
    navigate("/admin/produk");
  };

  // Gallery functions
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, { id: generateId(), url: newImageUrl, alt: name, order: images.length }]);
    setNewImageUrl("");
  };
  const removeImage = (imgId: string) => setImages(images.filter((i) => i.id !== imgId));
  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    newImages.forEach((img, i) => (img.order = i));
    setImages(newImages);
  };

  // Variant functions
  const addVariant = () => {
    if (!variantName.trim()) return;
    setVariants([...variants, { id: generateId(), name: variantName, type: variantType, price: variantPrice, stock: variantStock }]);
    setVariantName(""); setVariantPrice(0); setVariantStock(0);
  };
  const removeVariant = (vId: string) => setVariants(variants.filter((v) => v.id !== vId));
  const updateVariant = (vId: string, field: string, value: any) => {
    setVariants(variants.map((v) => (v.id === vId ? { ...v, [field]: value } : v)));
  };

  // Spec functions
  const addSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;
    setSpecs([...specs, { key: specKey, value: specValue }]);
    setSpecKey(""); setSpecValue("");
  };
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  const toggleCategory = (catId: string) => {
    setSelectedCategories(selectedCategories.includes(catId) ? selectedCategories.filter((c) => c !== catId) : [...selectedCategories, catId]);
  };

  const tabs = [
    { key: "basic" as const, label: "📝 Info Dasar" },
    { key: "gallery" as const, label: "🖼️ Galeri" },
    { key: "variants" as const, label: "📦 Variasi" },
    { key: "specs" as const, label: "📋 Spesifikasi" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/produk")} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit Produk" : "Tambah Produk Baru"}</h1>
            <p className="text-gray-500 text-sm">Lengkapi informasi produk di bawah</p>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-green-200 transition-colors">
          <Save size={16} /> Simpan Produk
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50"}`}>
            {tab.label}
            {tab.key === "gallery" && images.length > 0 && <span className="ml-1 text-xs opacity-75">({images.length})</span>}
            {tab.key === "variants" && variants.length > 0 && <span className="ml-1 text-xs opacity-75">({variants.length})</span>}
            {tab.key === "specs" && specs.length > 0 && <span className="ml-1 text-xs opacity-75">({specs.length})</span>}
          </button>
        ))}
      </div>

      {/* BASIC INFO TAB */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Informasi Produk</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama produk" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Tulis deskripsi produk lengkap..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Dasar *</label>
                  <input type="number" value={basePrice || ""} onChange={(e) => setBasePrice(Number(e.target.value))} placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Coret (Opsional)</label>
                  <input type="number" value={originalPrice || ""} onChange={(e) => setOriginalPrice(Number(e.target.value))} placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input type="number" value={stock || ""} onChange={(e) => setStock(Number(e.target.value))} placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail</label>
                  <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                  {thumbnail && <img src={thumbnail} alt="Preview" className="mt-2 w-20 h-20 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat</label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Contoh: 500 gram" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (pisah dengan koma)</label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="KURMA AJWA, Kurma Madinah, kurma nabi" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Kategori Produk</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => toggleCategory(cat.id)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all ${selectedCategories.includes(cat.id) ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-200 hover:border-green-300"} ${cat.parentId ? "ml-4" : ""}`}>
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Status & Badge</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Produk Aktif", value: isActive, toggle: () => setIsActive(!isActive), color: "green" },
                { label: "Best Seller", value: isBestSeller, toggle: () => setIsBestSeller(!isBestSeller), color: "amber" },
                { label: "Produk Baru", value: isNew, toggle: () => setIsNew(!isNew), color: "blue" },
                { label: "Diskon", value: isDiscount, toggle: () => setIsDiscount(!isDiscount), color: "red" },
              ].map((item) => (
                <button key={item.label} onClick={item.toggle} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${item.value ? `border-${item.color}-500 bg-${item.color}-50 text-${item.color}-700` : "border-gray-200 text-gray-500"}`} style={item.value ? { borderColor: item.color === "green" ? "#22c55e" : item.color === "amber" ? "#f59e0b" : item.color === "blue" ? "#3b82f6" : "#ef4444", backgroundColor: item.color === "green" ? "#f0fdf4" : item.color === "amber" ? "#fffbeb" : item.color === "blue" ? "#eff6ff" : "#fef2f2" } : {}}>
                  {item.value ? "✅" : "⬜"} {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GALLERY TAB */}
      {activeTab === "gallery" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Galeri Produk ({images.length} gambar)</h3>
          <div className="flex gap-2 mb-6">
            <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Paste URL gambar..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
            <button onClick={addImage} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium"><Plus size={16} /> Tambah</button>
          </div>
          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Image size={48} className="mx-auto mb-3 opacity-50" />
              <p>Belum ada gambar. Tambahkan URL gambar produk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.sort((a, b) => a.order - b.order).map((img, i) => (
                <div key={img.id} className="relative group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <img src={img.url} alt={img.alt} className="w-full aspect-square object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300/f3f4f6/9ca3af?text=Error"; }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-1">
                      <button onClick={() => moveImage(i, "up")} disabled={i === 0} className="p-1.5 bg-white/90 rounded-lg disabled:opacity-30"><ChevronUp size={14} /></button>
                      <button onClick={() => moveImage(i, "down")} disabled={i === images.length - 1} className="p-1.5 bg-white/90 rounded-lg disabled:opacity-30"><ChevronDown size={14} /></button>
                    </div>
                    <button onClick={() => removeImage(img.id)} className="p-1.5 bg-red-500 text-white rounded-lg"><X size={14} /></button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{i + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VARIANTS TAB */}
      {activeTab === "variants" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Tambah Variasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <select value={variantType} onChange={(e) => setVariantType(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
                {["Ukuran", "Warna", "Berat", "Rasa", "Bahan", "Model"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="text" value={variantName} onChange={(e) => setVariantName(e.target.value)} placeholder="Nama (cth: 500gr, Merah)" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
              <input type="number" value={variantPrice || ""} onChange={(e) => setVariantPrice(Number(e.target.value))} placeholder="Harga" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
              <div className="flex gap-2">
                <input type="number" value={variantStock || ""} onChange={(e) => setVariantStock(Number(e.target.value))} placeholder="Stok" className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                <button onClick={addVariant} className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl"><Plus size={16} /></button>
              </div>
            </div>
          </div>

          {variants.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-bold text-gray-800">Daftar Variasi ({variants.length})</div>
              <div className="divide-y divide-gray-50">
                {variants.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">{v.type}</span>
                    <input type="text" value={v.name} onChange={(e) => updateVariant(v.id, "name", e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Rp</span>
                      <input type="number" value={v.price} onChange={(e) => updateVariant(v.id, "price", Number(e.target.value))} className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Stok</span>
                      <input type="number" value={v.stock} onChange={(e) => updateVariant(v.id, "stock", Number(e.target.value))} className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:border-green-500" />
                    </div>
                    <button onClick={() => removeVariant(v.id)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SPECS TAB */}
      {activeTab === "specs" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Tambah Spesifikasi</h3>
            <div className="flex gap-3">
              <input type="text" value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Key (cth: Bahan, Berat, Asal)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
              <input type="text" value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="Value (cth: Katun, 500gr, Madinah)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
              <button onClick={addSpec} className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl"><Plus size={16} /></button>
            </div>
          </div>

          {specs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-bold text-gray-800">Daftar Spesifikasi ({specs.length})</div>
              <div className="divide-y divide-gray-50">
                {specs.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                    <span className="font-medium text-gray-700 text-sm w-40 flex-shrink-0">{s.key}</span>
                    <span className="text-gray-500 text-sm flex-1">{s.value}</span>
                    <button onClick={() => removeSpec(i)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Button (Bottom) */}
      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold text-base shadow-lg shadow-green-200 transition-colors">
          <Save size={18} /> {isEdit ? "Update Produk" : "Simpan Produk"}
        </button>
      </div>
    </div>
  );
}
