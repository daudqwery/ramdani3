import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Mohon isi semua field yang wajib diisi");
      return;
    }
    setSubmitted(true);
    toast.success("Pesan berhasil dikirim! Kami akan segera menghubungi Anda.", { duration: 5000 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Hubungi Kami</h1>
          <p className="text-green-200 text-lg">Kami siap membantu Anda menemukan produk haji & umroh terbaik</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-5">Informasi Kontak</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <MapPin size={22} className="text-green-600" />,
                    title: "Alamat Toko",
                    content: "Jl. K.H. Mas Mansyur No.94A, RT.7/RW.17, Kb. Melati, Tanah Abang, Jakarta Pusat 10240",
                    link: "https://maps.app.goo.gl/bhpywC2JzjKrUS2L9",
                    linkLabel: "Lihat di Maps",
                  },
                  {
                    icon: <Phone size={22} className="text-green-600" />,
                    title: "WhatsApp & Telepon",
                    content: "+62 812-9057-6590",
                    link: "https://wa.me/6281290576590",
                    linkLabel: "Chat WhatsApp",
                  },
                  {
                    icon: <Mail size={22} className="text-green-600" />,
                    title: "Email",
                    content: "info@ramdanibarkah.com",
                    link: "mailto:info@ramdanibarkah.com",
                    linkLabel: "Kirim Email",
                  },
                  {
                    icon: <Clock size={22} className="text-green-600" />,
                    title: "Jam Operasional",
                    content: "Senin – Sabtu: 08.00 – 17.00 WIB\nMinggu: 08.00 – 14.00 WIB",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-sm whitespace-pre-line mt-0.5">{item.content}</p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-700 text-xs font-medium mt-1 inline-block hover:underline">
                          {item.linkLabel} →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/6281290576590?text=Assalamualaikum, saya ingin bertanya tentang produk Ramdani Barkah"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-green-200"
            >
              <MessageCircle size={22} />
              Chat via WhatsApp Sekarang
            </a>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Ikuti Kami di Social Media</h3>
              <div className="space-y-2">
                {[
                  { platform: "Instagram", handle: "@ramdanibarkah", color: "bg-pink-50 text-pink-600 border-pink-100", emoji: "📸" },
                  { platform: "TikTok", handle: "@ramdanibarkah", color: "bg-gray-50 text-gray-700 border-gray-200", emoji: "🎵" },
                  { platform: "YouTube", handle: "Ramdani Barkah Official", color: "bg-red-50 text-red-600 border-red-100", emoji: "▶️" },
                ].map((social, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${social.color}`}>
                    <span>{social.emoji}</span>
                    <div>
                      <p className="font-semibold text-xs">{social.platform}</p>
                      <p className="text-xs opacity-75">{social.handle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Pesan Terkirim! 🎉</h3>
                  <p className="text-gray-500 mb-2">Terima kasih telah menghubungi kami.</p>
                  <p className="text-gray-500 text-sm mb-6">Tim kami akan menghubungi Anda dalam 1x24 jam kerja.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="bg-green-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama Anda"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor HP / WhatsApp *</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="08xxxxxxxxxx"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="email@contoh.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subjek</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 bg-white transition-colors"
                      >
                        <option value="">Pilih subjek pesan</option>
                        <option value="produk">Pertanyaan Produk</option>
                        <option value="pesanan">Pertanyaan Pesanan</option>
                        <option value="pengiriman">Pertanyaan Pengiriman</option>
                        <option value="komplain">Komplain / Masukan</option>
                        <option value="kerjasama">Kerjasama / Reseller</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Pesan *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tuliskan pesan, pertanyaan, atau saran Anda di sini..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-base transition-colors shadow-lg shadow-green-200"
                    >
                      <Send size={18} /> Kirim Pesan
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Atau langsung hubungi via WhatsApp untuk respon lebih cepat
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-14">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Pertanyaan Umum</h2>
            <p className="text-gray-500 text-sm mt-1">Temukan jawaban cepat untuk pertanyaan yang sering diajukan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: "Bagaimana cara memesan?", a: "Pilih produk → Tambah ke keranjang → Checkout → Bayar. Sesederhana itu!" },
              { q: "Apakah produk dijamin asli?", a: "Ya! Semua produk bersertifikat resmi Kementan RI. 100% asli dan aman." },
              { q: "Berapa lama pengiriman?", a: "Order sebelum jam 14.00 dikirim hari yang sama ke seluruh Indonesia." },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 text-sm mb-2">❓ {faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
