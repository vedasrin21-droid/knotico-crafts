import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { Plus, Pencil, Trash2, X, ImagePlus, Tags } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  material: string | null;
}

export default function AdminProducts() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", compareAtPrice: "", category: "accessories", stock: "0", featured: false, material: "" });
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const { categories, refetch: refetchCategories } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", compareAtPrice: "", category: "accessories", stock: "0", featured: false, material: "" });
    setImageUrls([""]);
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      compareAtPrice: p.compare_at_price ? String(p.compare_at_price) : "",
      category: p.category,
      stock: String(p.stock),
      featured: p.featured,
      material: p.material || "",
    });
    setImageUrls(p.images?.length ? p.images : [""]);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = imageUrls.map(u => u.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compare_at_price: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
      category: form.category as any,
      stock: parseInt(form.stock),
      featured: form.featured,
      material: form.material,
      images: cleanImages,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product updated" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product added" });
    }
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const addImageField = () => setImageUrls([...imageUrls, ""]);
  const removeImageField = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index));
  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };
  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { error } = await supabase.from("categories").insert({ name, slug } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Category added" });
    setNewCategory("");
    refetchCategories();
  };

  const handleDeleteCategory = async (id: string, slug: string) => {
    const productsInCategory = products.filter(p => p.category === slug);
    if (productsInCategory.length > 0) {
      toast({ title: "Cannot delete", description: `${productsInCategory.length} product(s) are using this category. Reassign them first.`, variant: "destructive" });
      return;
    }
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Category deleted" });
    refetchCategories();
  };

  if (!isAdmin) return <div className="container mx-auto px-4 py-20 text-center"><p>Access Denied</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mt-1">Products</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCategoryManager(!showCategoryManager)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Tags className="w-4 h-4" /> Categories
          </button>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-terracotta-dark transition-colors">
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Product</>}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-card border border-border p-5 mb-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold">{editing ? "Edit Product" : "Add New Product"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Price *</label>
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Compare at Price (Original)</label>
              <input type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} placeholder="Leave empty if no discount" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option value="bags">Bags</option>
                <option value="accessories">Accessories</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Material</label>
              <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          {/* Multiple Image URLs */}
          <div>
            <label className="text-sm font-medium block mb-2">Product Images</label>
            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {url && (
                    <img src={url} alt="" className="w-10 h-10 rounded object-cover border border-border" onError={(e) => (e.currentTarget.style.display = "none")} />
                  )}
                  {imageUrls.length > 1 && (
                    <button type="button" onClick={() => removeImageField(index)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addImageField} className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline">
              <ImagePlus className="w-3.5 h-3.5" /> Add another image
            </button>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
            Featured product
          </label>
          <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-terracotta-dark transition-colors">
            {editing ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-card border border-border animate-pulse" />)}</div>
      ) : products.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No products yet. Add your first product above.</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex -space-x-2">
                {(p.images?.length ? p.images.slice(0, 3) : []).map((img, i) => (
                  <img key={i} src={img} alt={p.name} className="w-12 h-12 rounded-lg object-cover border-2 border-card" />
                ))}
                {(p.images?.length ?? 0) > 3 && (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs font-medium border-2 border-card">+{p.images.length - 3}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{p.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{p.category} · Stock: {p.stock} · {p.images?.length || 0} images {p.featured && "· ⭐ Featured"}</p>
              </div>
              <div className="text-right">
                {p.compare_at_price && p.compare_at_price > p.price && (
                  <span className="text-xs text-muted-foreground line-through block">₹{Number(p.compare_at_price).toFixed(2)}</span>
                )}
                <span className="text-sm font-bold text-primary">₹{Number(p.price).toFixed(2)}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(p)} className="p-2 hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}