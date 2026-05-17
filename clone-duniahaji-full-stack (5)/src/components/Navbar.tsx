import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produk?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const categories = [
    { name: "Kurma", slug: "kurma" },
    { name: "Air Zamzam", slug: "air-zamzam" },
    { name: "Sajadah", slug: "sajadah" },
    { name: "Coklat Arab", slug: "coklat-arab" },
    { name: "Perlengkapan Haji", slug: "perlengkapan-haji" },
    { name: "Sabun Arab", slug: "sabun-arab" },
    { name: "Tasbih & Sorban", slug: "tasbih-sorban" },
    { name: "Hampers & Paket", slug: "hampers-paket" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-green-800 text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={12} />
              <a href="https://wa.me/6281290576590" target="_blank" rel="noreferrer" className="hover:text-green-200 transition-colors">
                +62 812-9057-6590
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              Jl. K.H. Mas Mansyur No.94A, Tanah Abang, Jakarta Pusat
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Senin–Sabtu: 08.00–17.00 | Minggu: 08.00–14.00</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm md:text-base">RB</span>
              </div>
              <div>
                <div className="font-bold text-green-800 text-sm md:text-base leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Ramdani Barkah
                </div>
                <div className="text-[10px] md:text-xs text-green-600 leading-tight">Oleh-Oleh Haji & Umroh</div>
              </div>
            </Link>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk haji & umroh..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-green-200 focus:border-green-500 focus:outline-none text-sm bg-green-50 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-green-600 text-white rounded-r-full hover:bg-green-700 transition-colors"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/keranjang"
                className="relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-full transition-colors text-sm font-medium"
              >
                <ShoppingCart size={18} />
                <span className="hidden md:inline">Keranjang</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-lg"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 pb-2 border-t border-green-50 pt-1">
            <Link to="/" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              Beranda
            </Link>
            <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                Kategori <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-48 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/produk?kategori=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/produk" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              Semua Produk
            </Link>
            <Link to="/tentang" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              Tentang Kami
            </Link>
            <Link to="/kontak" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              Kontak
            </Link>
            <Link to="/cek-pesanan" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              Cek Pesanan
            </Link>
            <Link to="/admin" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              🔧 Admin
            </Link>
            <a
              href="https://wa.me/6281290576590"
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-1.5 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Phone size={14} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <form onSubmit={handleSearch} className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-green-200 focus:border-green-500 focus:outline-none text-sm bg-green-50"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-green-600 text-white rounded-r-full">
                  <Search size={16} />
                </button>
              </div>
            </form>
            <div className="p-4 space-y-1">
              <Link to="/" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">Beranda</Link>
              <Link to="/produk" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">Semua Produk</Link>
              <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">Kategori</div>
              {categories.map((cat) => (
                <Link key={cat.slug} to={`/produk?kategori=${cat.slug}`} className="block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-lg pl-6">
                  {cat.name}
                </Link>
              ))}
              <hr className="my-2" />
              <Link to="/tentang" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">Tentang Kami</Link>
              <Link to="/kontak" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">Kontak</Link>
              <Link to="/cek-pesanan" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">Cek Pesanan</Link>
              <a href="https://wa.me/6281290576590" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg mt-2">
                <Phone size={14} /> Hubungi via WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
