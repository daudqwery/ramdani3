import { Link } from "react-router-dom";
import { Shield, Award, Truck, Heart, Star, MapPin, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-bold text-2xl">RB</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tentang Ramdani Barkah</h1>
          <p className="text-green-200 text-lg leading-relaxed max-w-2xl mx-auto">
            Toko oleh-oleh haji dan umroh terlengkap dan terpercaya. Melayani dengan sepenuh hati untuk keberkahan bersama.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-green-600 font-medium text-sm mb-2">📖 Kisah Kami</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Perjalanan Ramdani Barkah</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-green-700">Ramdani Barkah</strong> berdiri dengan satu visi sederhana namun mulia: menyediakan oleh-oleh haji dan umroh yang berkualitas, asli, dan terjangkau untuk semua kalangan.
                </p>
                <p>
                  Berawal dari kecintaan terhadap saudara-saudara Muslim yang ingin membawa pulang keberkahan dari Tanah Suci, kami hadir sebagai solusi terpercaya untuk semua kebutuhan haji dan umroh.
                </p>
                <p>
                  Setiap produk yang kami sediakan telah melalui seleksi ketat — mulai dari kurma pilihan langsung dari Madinah, air zamzam asli bersertifikat, hingga perlengkapan ibadah berkualitas tinggi.
                </p>
                <p>
                  Dengan pengalaman bertahun-tahun dan kepercayaan ribuan pelanggan, kami terus berkomitmen untuk memberikan produk terbaik dengan layanan yang ramah, cepat, dan penuh keikhlasan.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "10.000+", label: "Pelanggan Puas", icon: "😊" },
                { num: "500+", label: "Produk Tersedia", icon: "🏪" },
                { num: "5 Tahun", label: "Pengalaman", icon: "⭐" },
                { num: "50+", label: "Kota Terlayani", icon: "🗺️" },
              ].map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-center border border-green-100">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-green-700 mb-1">{stat.num}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-green-600 font-medium text-sm mb-2">💚 Nilai Kami</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Mengapa Memilih Kami?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield size={32} className="text-green-600" />,
                title: "Terpercaya",
                desc: "Ribuan pelanggan telah membuktikan kualitas dan kejujuran kami. Ulasan positif yang konsisten menjadi bukti kepercayaan.",
                color: "bg-green-50 border-green-100",
              },
              {
                icon: <Award size={32} className="text-amber-500" />,
                title: "Kualitas Terjamin",
                desc: "Semua produk telah bersetifikat resmi dari Kementerian Pertanian RI. Asli, aman, dan berkualitas tinggi.",
                color: "bg-amber-50 border-amber-100",
              },
              {
                icon: <Truck size={32} className="text-blue-500" />,
                title: "Pengiriman Cepat",
                desc: "Pesanan sebelum pukul 14.00 dikirim hari yang sama. Menjangkau seluruh wilayah Indonesia dengan aman.",
                color: "bg-blue-50 border-blue-100",
              },
              {
                icon: <Heart size={32} className="text-red-500" />,
                title: "Pelayanan Tulus",
                desc: "Tim kami siap membantu dengan ramah dan tulus. Kepuasan pelanggan adalah prioritas utama kami.",
                color: "bg-red-50 border-red-100",
              },
            ].map((val, i) => (
              <div key={i} className={`${val.color} border rounded-2xl p-6 flex flex-col items-center text-center`}>
                <div className="mb-4">{val.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{val.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-green-600 font-medium text-sm mb-2">👥 Tim Kami</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Orang-Orang di Balik Ramdani Barkah</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ramdani", role: "Pendiri & CEO", avatar: "R", desc: "Berpengalaman lebih dari 10 tahun di industri produk haji dan umroh." },
              { name: "Barkah Sari", role: "Manajer Produk", avatar: "B", desc: "Memastikan setiap produk yang kami jual memenuhi standar kualitas tertinggi." },
              { name: "Ahmad Firdaus", role: "Customer Service", avatar: "A", desc: "Siap membantu pelanggan dengan sepenuh hati setiap hari." },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{member.name}</h3>
                <p className="text-green-600 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-green-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-green-600 font-medium text-sm mb-2">🏅 Sertifikasi & Penghargaan</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Diakui & Terpercaya</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Sertifikat Kementan RI", desc: "Semua produk kurma dan air zamzam bersertifikat Kementerian Pertanian Republik Indonesia.", icon: "📜" },
              { title: "Produk Halal MUI", desc: "Produk-produk kami telah mendapatkan sertifikasi halal dari Majelis Ulama Indonesia.", icon: "✅" },
              { title: "Toko Terpercaya", desc: "Mendapatkan badge 'Toko Terpercaya' dengan rating bintang 5 dari pelanggan setia kami.", icon: "⭐" },
            ].map((cert, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{cert.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-green-600 font-medium text-sm mb-2">📍 Lokasi Kami</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Kunjungi Toko Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
              <div className="space-y-4">
                {[
                  { icon: <MapPin className="text-green-600" size={20} />, label: "Alamat", value: "Jl. K.H. Mas Mansyur No.94A, RT.7/RW.17, Kb. Melati, Tanah Abang, Jakarta Pusat 10240" },
                  { icon: <Phone className="text-green-600" size={20} />, label: "Telepon/WA", value: "+62 812-9057-6590" },
                  { icon: <Star className="text-amber-500 fill-amber-500" size={20} />, label: "Jam Operasional", value: "Senin–Sabtu: 08.00–17.00 WIB\nMinggu: 08.00–14.00 WIB" },
                ].map((info, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-0.5 flex-shrink-0">{info.icon}</div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{info.label}</p>
                      <p className="text-gray-700 text-sm whitespace-pre-line">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="https://maps.app.goo.gl/bhpywC2JzjKrUS2L9"
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium text-sm transition-colors w-full"
              >
                <MapPin size={16} /> Buka di Google Maps
              </a>
            </div>
            <div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl h-64 flex items-center justify-center border border-green-200">
                <div className="text-center">
                  <MapPin size={48} className="text-green-500 mx-auto mb-3" />
                  <p className="text-green-700 font-semibold">Ramdani Barkah</p>
                  <p className="text-green-600 text-sm">Tanah Abang, Jakarta Pusat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Siap Berbelanja Bersama Kami?</h2>
          <p className="text-green-200 mb-8">Temukan produk haji & umroh terbaik dengan harga yang bersahabat.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/produk" className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3.5 rounded-full font-bold transition-colors">
              Lihat Produk Kami
            </Link>
            <Link to="/kontak" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-full font-bold transition-colors">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
