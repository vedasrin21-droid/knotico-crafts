import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const product = getProductById(id || "");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Product Not Found</h1>
        <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      customNote: note || undefined,
      variant: product.variants[selectedVariant] 
        ? Object.values(product.variants[selectedVariant]).join(", ") 
        : undefined,
    }, qty);
    setCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl overflow-hidden bg-card border border-border">
          <img src={product.images[0]} alt={product.name} width={800} height={800} className="w-full aspect-square object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <span className="text-sm text-primary font-medium uppercase tracking-wider">{product.category}</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-1">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mt-3"><p className="text-3xl font-bold text-primary mt-3">₹{product.price}</p></p>
          <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>
          <p className="text-sm text-muted-foreground mt-3">Material: <span className="text-foreground">{product.material}</span></p>
          <p className="text-sm text-muted-foreground mt-1">
            {product.stock > 0 ? <span className="text-green-600">In Stock ({product.stock})</span> : <span className="text-primary">Made to Order</span>}
          </p>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      selectedVariant === i
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {Object.values(v).join(": ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Note */}
          {product.category === "custom" && (
            <div className="mt-6">
              <label className="text-sm font-medium block mb-2">Customization Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your personalization request..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-muted transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-muted transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-terracotta-dark transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={() => toggleItem(product.id)}
              className={`w-12 rounded-lg border flex items-center justify-center transition-colors ${
                wishlisted ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary"
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary" : ""}`} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
