import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Phone, Package, Home, Clock } from "lucide-react";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id") || "RB00000000";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={44} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Pesanan Berhasil! 🎉</h1>
            <p className="text-green-200 text-sm">Terima kasih telah berbelanja di Ramdani Barkah</p>
          </div>

          {/* Order Info */}
          <div className="p-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 text-center">
              <p className="text-sm text-green-700 mb-1">Nomor Pesanan Kamu:</p>
              <p className="text-2xl font-bold text-green-800 tracking-wider">{orderId}</p>
              <p className="text-xs text-green-600 mt-1">Simpan nomor ini untuk melacak pesanan</p>
            </div>

            {/* Steps */}
            <h3 className="font-bold text-gray-800 mb-4">Langkah Selanjutnya:</h3>
            <div className="space-y-3 mb-6">
              {[
                {
                  icon: <Package size={18} className="text-amber-600" />,
                  bg: "bg-amber-50",
                  title: "Lakukan Pembayaran",
                  desc: "Transfer ke rekening yang telah dipilih sesuai total tagihan",
                },
                {
                  icon: <Phone size={18} className="text-green-600" />,
                  bg: "bg-green-50",
                  title: "Konfirmasi via WhatsApp",
                  desc: "Kirim bukti transfer ke +62 812-9057-6590 beserta nomor pesanan",
                },
                {
                  icon: <Clock size={18} className="text-blue-600" />,
                  bg: "bg-blue-50",
                  title: "Pesanan Diproses",
                  desc: "Pesanan sebelum 14.00 akan dikirim hari ini, setelah 14.00 besok",
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-9 h-9 ${step.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
                    <p className="text-gray-500 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/6281290576590?text=Assalamualaikum, saya ingin konfirmasi pembayaran untuk pesanan *${orderId}*`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-2xl font-bold transition-colors mb-3 shadow-lg shadow-green-200"
            >
              <Phone size={18} /> Konfirmasi via WhatsApp
            </a>

            <Link
              to="/cek-pesanan"
              className="flex items-center justify-center gap-2 w-full bg-white border-2 border-green-200 text-green-700 py-3.5 rounded-2xl font-bold hover:bg-green-50 transition-colors mb-3"
            >
              <Package size={18} /> Cek Status Pesanan
            </Link>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-3 rounded-2xl font-medium transition-colors text-sm"
            >
              <Home size={16} /> Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Extra info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Ada pertanyaan? Hubungi kami di{" "}
            <a href="https://wa.me/6281290576590" className="text-green-600 font-semibold hover:underline">
              +62 812-9057-6590
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-1">Senin–Sabtu 08.00–17.00 | Minggu 08.00–14.00</p>
        </div>
      </div>
    </div>
  );
}
