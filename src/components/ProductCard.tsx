import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl bg-card border border-border">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <button
          onClick={() => toggleItem(product.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-md">
            Made to Order
          </span>
        )}
      </div>
      <div className="mt-3 px-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-lg font-semibold text-foreground hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-0.5 capitalize">{product.category}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">₹{product.compareAtPrice}</span>
            )}
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
          </div>
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
              })
            }
            className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-terracotta-dark transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
