import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { getProductById } from "@/data/products";

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const wishlistProducts = items.map(getProductById).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Wishlist</h1>
      <p className="text-muted-foreground mb-8">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}</p>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Link to="/shop" className="text-primary hover:underline text-sm mt-2 inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => product && (
            <div key={product.id} className="rounded-xl bg-card border border-border overflow-hidden">
              <Link to={`/product/${product.id}`}>
                <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full aspect-square object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-heading font-semibold text-foreground hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-primary font-bold mt-1">${product.price}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.images[0] })}
                    className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-terracotta-dark transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button onClick={() => toggleItem(product.id)} className="w-10 rounded-lg border border-border flex items-center justify-center hover:border-destructive hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
