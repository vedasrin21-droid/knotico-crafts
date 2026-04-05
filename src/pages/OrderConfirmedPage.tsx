import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmedPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Thank you for your order. Our team will contact you shortly to confirm the details and arrange delivery. Payment will be collected on delivery (COD).
        </p>
        <p className="text-sm text-muted-foreground mt-6">
          A confirmation email will be sent to your inbox.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-terracotta-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}
