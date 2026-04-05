import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ShoppingCart, Users, FileText, TrendingUp } from "lucide-react";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalRequests: number;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, pendingOrders: 0, totalProducts: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [orders, pendingOrders, products, requests] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("custom_order_requests").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        totalOrders: orders.count ?? 0,
        pendingOrders: pendingOrders.count ?? 0,
        totalProducts: products.count ?? 0,
        totalRequests: requests.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You need admin privileges to access this page.</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Go Home</Link>
      </div>
    );
  }

  const cards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, to: "/admin/orders", color: "text-primary" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: TrendingUp, to: "/admin/orders", color: "text-primary" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, to: "/admin/products", color: "text-primary" },
    { label: "Custom Requests", value: stats.totalRequests, icon: FileText, to: "/admin/requests", color: "text-primary" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card) => (
            <Link key={card.label} to={card.to} className="rounded-xl bg-card border border-border p-5 hover:border-primary transition-colors">
              <div className="flex items-center justify-between">
                <card.icon className={`w-8 h-8 ${card.color}`} />
                <span className="font-heading text-3xl font-bold">{card.value}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/products" className="rounded-xl bg-card border border-border p-6 hover:border-primary transition-colors">
          <Package className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-heading font-semibold">Manage Products</h3>
          <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
        </Link>
        <Link to="/admin/orders" className="rounded-xl bg-card border border-border p-6 hover:border-primary transition-colors">
          <ShoppingCart className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-heading font-semibold">Manage Orders</h3>
          <p className="text-sm text-muted-foreground">View and update order statuses</p>
        </Link>
        <Link to="/admin/requests" className="rounded-xl bg-card border border-border p-6 hover:border-primary transition-colors">
          <FileText className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-heading font-semibold">Custom Requests</h3>
          <p className="text-sm text-muted-foreground">Review custom order submissions</p>
        </Link>
      </div>
    </div>
  );
}
