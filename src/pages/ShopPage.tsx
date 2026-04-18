import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/ProductCard";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const { products } = useProducts();
  const { categories: categoryList } = useCategories();

  const maxPrice = useMemo(() => {
    if (!products.length) return 1000;
    return Math.max(1000, Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100);
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  // Keep upper bound in sync if it was at the previous max (i.e. user hasn't customized)
  const [userAdjusted, setUserAdjusted] = useState(false);
  useMemo(() => {
    if (!userAdjusted) setPriceRange([0, maxPrice]);
  }, [maxPrice, userAdjusted]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "newest") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else result.sort((a, b) => b.price - a.price);
    return result;
  }, [category, sort, search, priceRange, products]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Shop</h1>
        <p className="text-muted-foreground mt-1">Browse our handcrafted collection</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-8 flex items-center gap-4">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Price:</span>
        <input
          type="range"
          min={0}
          max={1000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-40 accent-primary"
        />
        <span className="text-sm font-medium">₹{priceRange[0]} – ₹{priceRange[1]}</span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No products found matching your criteria.</p>
          <button onClick={() => { setSearch(""); setCategory("all"); setPriceRange([0, 200]); }} className="mt-3 text-primary hover:underline text-sm">Clear filters</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
