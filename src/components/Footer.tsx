import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Knotico</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Handcrafted wool knotting products made with love. Each piece tells a story of artistry and tradition.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop?category=bags" className="hover:text-primary transition-colors">Bags</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
              <li><Link to="/shop?category=custom" className="hover:text-primary transition-colors">Custom Items</Link></li>
              <li><Link to="/custom-order" className="hover:text-primary transition-colors">Custom Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="mailto:hello@knotico.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Knotico. All rights reserved. Handmade with ❤️
        </div>
      </div>
    </footer>
  );
}
