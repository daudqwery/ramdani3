import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Package,
  LayoutDashboard,
  FolderTree,
  Menu,
  X,
  Home,
  BarChart3,
  Plus,
  Users,
  CreditCard,
  FileText,
  LogOut,
} from "lucide-react";

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

  // LOGIN STATE
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("adminLogin") === "true"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminLogin", "true");
      setIsLogin(true);
    } else {
      alert("Username atau password salah");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLogin");
    window.location.reload();
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path) && path !== "/admin";
  };

  // LOGIN PAGE
  if (!isLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              RB
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Admin Login
            </h1>

            <p className="text-gray-500 text-sm">
              Ramdani Barkah Dashboard
            </p>
          </div>

          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN PANEL
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">RB</span>
            </div>

            <div>
              <div className="font-bold text-green-800 text-sm">
                Ramdani Barkah
              </div>

              <div className="text-[10px] text-gray-400">
                Admin Panel
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
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
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Home size={20} />
            Kembali ke Toko
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BarChart3 size={16} className="text-green-600" />

            <span className="font-medium text-gray-800">
              Admin Panel
            </span>

            <span>/</span>

            <span className="capitalize">
              {location.pathname
                .split("/admin/")[1]
                ?.split("/")[0] || "Dashboard"}
            </span>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}