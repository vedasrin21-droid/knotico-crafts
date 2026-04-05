import { Link } from "react-router-dom";
import { ArrowRight, Gift, Sparkles, Truck } from "lucide-react";
import { getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 6);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <img src={heroBg} alt="Handcrafted wool knotting products" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-foreground/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-background leading-tight">
              Handcrafted with Heart, Knotted with Love
            </h1>
            <p className="text-background/80 text-lg mt-4 font-body leading-relaxed">
              Discover unique wool knotting products — bags, accessories, and personalized pieces crafted by skilled artisans.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-terracotta-dark transition-colors"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/custom-order"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background/20 backdrop-blur-sm text-background font-medium hover:bg-background/30 transition-colors border border-background/30"
              >
                Custom Orders
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Handcrafted", desc: "Every piece is made by hand with premium materials" },
            { icon: Gift, title: "Perfect Gifts", desc: "Personalized items for every special occasion" },
            { icon: Truck, title: "COD Available", desc: "Cash on delivery — order confirmed via call" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Featured Collection</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">Handpicked pieces that showcase our finest craftsmanship</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Teaser */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            At Knotico, we believe in the beauty of slow craftsmanship. Each knot, each strand of wool, carries the warmth of human hands and the tradition of textile artistry passed down through generations. Our artisans pour their passion into every piece, creating functional art that brings warmth and character to your life.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline"
          >
            Read Our Full Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Stay in the Loop</h2>
          <p className="text-muted-foreground mt-2">Get updates on new collections, seasonal specials, and artisan stories.</p>
          {subscribed ? (
            <p className="mt-6 text-primary font-medium">Thank you for subscribing! 🎉</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2 mt-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-terracotta-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
