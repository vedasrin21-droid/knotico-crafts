import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", zip: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">Continue Shopping</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Please sign in to checkout</h1>
        <p className="text-muted-foreground mt-2">You need an account to place an order.</p>
        <Link to="/auth" className="inline-block mt-4 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-terracotta-dark transition-colors">Sign In</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: form.fullName,
        customer_email: form.email,
        phone: form.phone,
        total_amount: totalPrice(),
        shipping_address: form.address,
        city: form.city,
        zip: form.zip,
        notes: form.notes || null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      toast({ title: "Error placing order", description: orderError?.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      custom_note: item.customNote || null,
      variant: item.variant || null,
    }));

    await supabase.from("order_items").insert(orderItems);
    clearCart();
    setSubmitting(false);
    navigate("/order-confirmed");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <h2 className="font-heading text-xl font-semibold">Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Full Name *</label>
              <input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Phone *</label>
            <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Shipping Address *</label>
            <textarea required value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">City *</label>
              <input required value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">ZIP Code</label>
              <input value={form.zip} onChange={(e) => update("zip", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Order Notes</label>
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} placeholder="Any special instructions..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
          </div>

          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground">💰 <strong className="text-foreground">Cash on Delivery (COD)</strong> — Our team will contact you to confirm your order before shipping.</p>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50">
            {submitting ? "Placing Order..." : {submitting ? "Placing Order..." : `Place Order — ₹${totalPrice().toFixed(2)}`}}
          </button>
        </form>

        <div className="md:col-span-2">
          <div className="rounded-xl bg-card border border-border p-5 sticky top-24">
            <h2 className="font-heading text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold"><p className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p></p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">${totalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
