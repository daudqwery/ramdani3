import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, MessageCircle, Mail, Shield, Truck, Award, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      {/* Trust Badges */}
      <div className="bg-green-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Shield size={28} />, title: "Terpercaya", desc: "Sudah melayani ribuan pelanggan" },
              { icon: <Award size={28} />, title: "Kualitas Terjamin", desc: "Produk bersertifikat resmi" },
              { icon: <Truck size={28} />, title: "Pengiriman Cepat", desc: "Same-day delivery sebelum 14.00" },
              { icon: <Heart size={28} />, title: "Produk Halal", desc: "Terjamin halal & berkah" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="text-amber-400 flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-green-300 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-base">RB</span>
                </div>
                <div>
                  <div className="font-bold text-lg leading-tight">Ramdani Barkah</div>
                  <div className="text-green-300 text-xs">Oleh-Oleh Haji & Umroh</div>
                </div>
              </div>
              <p className="text-green-300 text-sm leading-relaxed mb-4">
                Toko oleh-oleh haji dan umroh terlengkap. Temukan kebutuhan Haji & Umroh berkualitas, aman, serta harga bersahabat. Semoga berkah 🤲
              </p>
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-green-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors" title="Instagram">
                  <span className="text-sm font-bold">IG</span>
                </a>
                <a href="https://wa.me/6281290576590" target="_blank" rel="noreferrer" className="w-9 h-9 bg-green-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                  <MessageCircle size={16} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-green-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors" title="YouTube">
                  <span className="text-sm font-bold">YT</span>
                </a>
                <a href="mailto:info@ramdanibarkah.com" className="w-9 h-9 bg-green-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* Kategori */}
            <div>
              <h4 className="font-bold text-base mb-4 text-amber-400">Kategori Produk</h4>
              <ul className="space-y-2">
                {[
                  ["Kurma Premium", "/produk?kategori=kurma"],
                  ["Air Zamzam", "/produk?kategori=air-zamzam"],
                  ["Sajadah", "/produk?kategori=sajadah"],
                  ["Coklat Arab", "/produk?kategori=coklat-arab"],
                  ["Perlengkapan Haji", "/produk?kategori=perlengkapan-haji"],
                  ["Sabun Arab", "/produk?kategori=sabun-arab"],
                  ["Tasbih & Sorban", "/produk?kategori=tasbih-sorban"],
                  ["Hampers & Paket", "/produk?kategori=hampers-paket"],
                ].map(([name, href]) => (
                  <li key={name}>
                    <Link to={href} className="text-green-300 hover:text-amber-400 text-sm transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-base mb-4 text-amber-400">Informasi</h4>
              <ul className="space-y-2">
                {[
                  ["Beranda", "/"],
                  ["Semua Produk", "/produk"],
                  ["Tentang Kami", "/tentang"],
                  ["Kontak", "/kontak"],
                  ["Cek Pesanan", "/cek-pesanan"],
                  ["Keranjang Belanja", "/keranjang"],
                  ["FAQ", "/#faq"],
                  ["Syarat & Ketentuan", "/syarat"],
                ].map(([name, href]) => (
                  <li key={name}>
                    <Link to={href} className="text-green-300 hover:text-amber-400 text-sm transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-base mb-4 text-amber-400">Hubungi Kami</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-green-300 text-sm">
                    Jl. K.H. Mas Mansyur No.94A, RT.7/RW.17, Kb. Melati, Tanah Abang, Jakarta Pusat 10240
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-400 flex-shrink-0" />
                  <a href="https://wa.me/6281290576590" target="_blank" rel="noreferrer" className="text-green-300 hover:text-amber-400 text-sm transition-colors">
                    +62 812-9057-6590
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-amber-400 flex-shrink-0" />
                  <a href="mailto:info@ramdanibarkah.com" className="text-green-300 hover:text-amber-400 text-sm transition-colors">
                    info@ramdanibarkah.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-green-300 text-sm">
                    <div>Senin – Sabtu: 08.00 – 17.00</div>
                    <div>Minggu: 08.00 – 14.00</div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-5">
                <div className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">Metode Pembayaran</div>
                <div className="flex flex-wrap gap-2">
                  {["BCA", "Mandiri", "BRI", "BNI", "QRIS"].map((bank) => (
                    <span key={bank} className="px-2.5 py-1 bg-green-800 text-green-200 text-xs rounded border border-green-700 font-medium">
                      {bank}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-green-400">
          <p>© 2024 Ramdani Barkah. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart size={12} className="text-red-400 fill-red-400" /> untuk para jamaah haji & umroh
          </p>
        </div>
      </div>
    </footer>
  );
}
