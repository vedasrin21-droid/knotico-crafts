import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Shield, LogIn, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/custom-order", label: "Custom Orders" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { toggleCart, totalItems } = useCartStore();
  const { isAdmin } = useAuth();
  const itemCount = totalItems();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-heading text-2xl md:text-3xl font-bold text-foreground tracking-wide">
          Knotico
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="p-2 hover:text-primary transition-colors" aria-label="Admin" title="Admin Dashboard">
              <Shield className="w-5 h-5" />
            </Link>
          )}
          <Link to="/wishlist" className="p-2 hover:text-primary transition-colors" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </Link>
          <button onClick={toggleCart} className="p-2 hover:text-primary transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={`py-2 text-sm font-medium transition-colors ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"}`}>
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
