import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products as localProducts, type Product, type ProductCategory } from "@/data/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const mapped: Product[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: Number(p.price),
          images: p.images || [],
          category: p.category as ProductCategory,
          variants: Array.isArray(p.variants) ? (p.variants as any[]) : [],
          stock: p.stock,
          featured: p.featured,
          material: p.material || "",
          createdAt: p.created_at,
        }));
        // Merge: DB products first, then local products not in DB
        const dbIds = new Set(mapped.map((m) => m.id));
        const merged = [...mapped, ...localProducts.filter((l) => !dbIds.has(l.id))];
        setProducts(merged);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getFeaturedProducts = () => products.filter((p) => p.featured);
  const getProductsByCategory = (cat: ProductCategory) => products.filter((p) => p.category === cat);

  return { products, loading, getProductById, getFeaturedProducts, getProductsByCategory };
}
