import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, FolderTree, Menu, X, Home, BarChart3, Plus } from "lucide-react";

import { Users, CreditCard, FileText } from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} />, exact: true },
  { path: "/admin/produk", label: "Produk", icon: <Package size={20} /> },
  { path: "/admin/produk/tambah", label: "Tambah Produk", icon: <Plus size={20} /> },
  { path: "/admin/kategori", label: "Kategori", icon: <FolderTree size={20} /> },
  { path: "/admin/pelanggan", label: "Pelanggan", icon: <Users size={20} /> },
  { path: "/admin/payment", label: "Payment Gateway", icon: <CreditCard size={20} /> },
  { path: "/admin/invoice", label: "Invoice", icon: <FileText size={20} /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path) && path !== "/admin";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">RB</span>
            </div>
            <div>
              <div className="font-bold text-green-800 text-sm">Ramdani Barkah</div>
              <div className="text-[10px] text-gray-400">Admin Panel</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path, item.exact)
                  ? "bg-green-600 text-white shadow-md shadow-green-200"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <Home size={20} /> Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BarChart3 size={16} className="text-green-600" />
            <span className="font-medium text-gray-800">Admin Panel</span>
            <span>/</span>
            <span className="capitalize">{location.pathname.split("/admin/")[1]?.split("/")[0] || "Dashboard"}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
