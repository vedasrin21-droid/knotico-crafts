import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronRight } from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  variant: string | null;
  custom_note: string | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  city: string | null;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-orange-100 text-orange-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const fetchOrders = async () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    const orderList = (data as Order[]) ?? [];
    setOrders(orderList);

    // Fetch all order items for these orders
    if (orderList.length > 0) {
      const orderIds = orderList.map((o) => o.id);
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);
      if (items) {
        const grouped: Record<string, OrderItem[]> = {};
        items.forEach((item: any) => {
          if (!grouped[item.order_id]) grouped[item.order_id] = [];
          grouped[item.order_id].push(item);
        });
        setOrderItems(grouped);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      fetchOrders();
    }
  };

  if (!isAdmin) return <div className="container mx-auto px-4 py-20 text-center"><p>Access Denied</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mt-1">Orders</h1>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-lg bg-card border border-border animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No orders found</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const items = orderItems[order.id] || [];
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="rounded-xl bg-card border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email} · {order.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">{order.shipping_address}{order.city ? `, ${order.city}` : ""}</p>
                    {order.notes && <p className="text-xs text-muted-foreground mt-1 italic">Note: {order.notes}</p>}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(order.created_at).toLocaleDateString()}</p>

                    {/* Toggle products */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="mt-2 text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      {items.length} product{items.length !== 1 ? "s" : ""} ordered
                    </button>

                    {isExpanded && items.length > 0 && (
                      <div className="mt-3 space-y-2 pl-2 border-l-2 border-primary/20">
                        {items.map((item) => (
                          <div key={item.id} className="text-sm">
                            <p className="font-medium">{item.product_name} {item.variant ? `(${item.variant})` : ""}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}</p>
                            {item.custom_note && <p className="text-xs text-muted-foreground italic">Note: {item.custom_note}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-primary">₹{Number(order.total_amount).toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="text-xs border border-border rounded-md px-2 py-1 bg-background"
                    >
                      {(["pending", "confirmed", "processing", "shipped", "delivered"] as OrderStatus[]).map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
