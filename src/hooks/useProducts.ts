import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductCategory } from "@/data/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) {
        const mapped: Product[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: Number(p.price),
          compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
          images: p.images || [],
          category: p.category as ProductCategory,
          variants: Array.isArray(p.variants) ? (p.variants as any[]) : [],
          stock: p.stock,
          featured: p.featured,
          material: p.material || "",
          createdAt: p.created_at,
        }));
        setProducts(mapped);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getFeaturedProducts = () => products.filter((p) => p.featured);
  const getProductsByCategory = (cat: ProductCategory) => products.filter((p) => p.category === cat);

  return { products, loading, getProductById, getFeaturedProducts, getProductsByCategory };
}
