import { useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function CustomOrderPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", productType: "", description: "", quantity: "1", timeline: "", 
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setSubmitting(false);
    toast({ title: "Request Submitted!", description: "We'll get back to you within 24-48 hours." });
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Thank You!</h1>
          <p className="text-muted-foreground mt-3">Your custom order request has been submitted. Our team will review it and contact you within 24-48 hours to discuss the details.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Custom Order</h1>
        <p className="text-muted-foreground mt-2">Have something special in mind? Tell us about your dream piece and we'll bring it to life.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name *</label>
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Email *</label>
            <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Phone</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Product Type *</label>
            <select required value={form.productType} onChange={(e) => update("productType", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option value="">Select type</option>
              <option>Wall Hanging</option>
              <option>Bag / Purse</option>
              <option>Home Decor</option>
              <option>Gift Item</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Design Description *</label>
          <textarea required value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Describe what you'd like us to create — colors, size, style, purpose..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Quantity</label>
            <input type="number" min="1" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Preferred Timeline</label>
            <select value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option value="">No rush</option>
              <option>Within 1 week</option>
              <option>Within 2 weeks</option>
              <option>Within 1 month</option>
              <option>Flexible</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Reference Image (optional)</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Custom Order Request"}
        </button>
      </form>
    </div>
  );
}
