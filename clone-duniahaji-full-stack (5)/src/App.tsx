import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackPage from "./pages/OrderTrackPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLayout from "./pages/admin/AdminLayout";
import { ProductList, CategoryManager } from "./pages/admin/AdminPages";
import { FullDashboard, CustomerManager } from "./pages/admin/DashboardFull";
import ProductForm from "./pages/admin/ProductForm";
import { PaymentGatewayManager, InvoiceManager } from "./pages/admin/PaymentInvoice";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/produk" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/produk/:slug" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/keranjang" element={<Layout><CartPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
          <Route path="/pesanan-berhasil" element={<Layout><OrderSuccessPage /></Layout>} />
          <Route path="/cek-pesanan" element={<Layout><OrderTrackPage /></Layout>} />
          <Route path="/tentang" element={<Layout><AboutPage /></Layout>} />
          <Route path="/kontak" element={<Layout><ContactPage /></Layout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<FullDashboard />} />
            <Route path="produk" element={<ProductList />} />
            <Route path="produk/tambah" element={<ProductForm />} />
            <Route path="produk/edit/:id" element={<ProductForm />} />
            <Route path="kategori" element={<CategoryManager />} />
            <Route path="pelanggan" element={<CustomerManager />} />
            <Route path="payment" element={<PaymentGatewayManager />} />
            <Route path="invoice" element={<InvoiceManager />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center px-4">
                  <div className="text-8xl mb-6">🕌</div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">Halaman Tidak Ditemukan</h2>
                  <p className="text-gray-500 mb-8">Maaf, halaman yang Anda cari tidak tersedia.</p>
                  <a href="/" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-full font-bold transition-colors">Kembali ke Beranda</a>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
