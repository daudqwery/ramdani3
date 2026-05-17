import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { imageMap } from "../data/imageMap";
import toast from "react-hot-toast";

// Extract duniahaji product ID from sourceUrl
function getSourceId(product: Product): number | undefined {
  if (product.sourceId) return product.sourceId;
  if (product.sourceUrl) {
    const match = product.sourceUrl.match(/-(\d+)$/);
    if (match) return parseInt(match[1], 10);
  }
  return undefined;
}

// Get the best available image for a product
function getProductImage(product: Product): string {
  const sourceId = getSourceId(product);
  if (sourceId && imageMap[sourceId]) {
    return imageMap[sourceId];
  }
  return product.image;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} ditambahkan ke keranjang!`, {
      icon: "🛒",
      style: { borderRadius: "12px", background: "#166534", color: "#fff" },
    });
  };

  return (
    <Link to={`/produk/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = product.image;
              (e.target as HTMLImageElement).onerror = () => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x400/dcfce7/166534?text=Ramdani+Barkah";
              };
            }}
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Baru
              </span>
            )}
          </div>
          {product.stock <= 10 && product.stock > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Stok Terbatas
              </span>
            </div>
          )}
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <ShoppingCart size={15} />
              Tambah ke Keranjang
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 md:p-4">
          <div className="text-xs text-green-600 font-medium mb-1">{product.category}</div>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          {/* Price */}
          <div className="flex items-end gap-2">
            <span className="text-green-700 font-bold text-base md:text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.weight && (
            <div className="text-xs text-gray-400 mt-1">{product.weight}</div>
          )}
          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-green-50 hover:bg-green-600 hover:text-white text-green-700 border border-green-200 hover:border-green-600 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
          >
            <ShoppingCart size={15} />
            <span>Tambah Keranjang</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
