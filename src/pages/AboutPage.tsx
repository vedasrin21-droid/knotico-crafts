import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={heroBg} alt="Our workshop" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-background">Our Story</h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">The Art of Knotting</h2>
            <p className="text-muted-foreground leading-relaxed">
              Knotico was born from a deep love for the ancient art of wool knotting. What started as a passion project in a small workshop has grown into a brand dedicated to bringing handcrafted beauty into everyday life. Every product in our collection is a testament to the patience, skill, and artistry of traditional textile craftsmanship.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Craft</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wool knotting is more than a technique — it's a meditative practice. Our artisans carefully select each strand of premium wool and cotton, hand-dye them in our signature earthy palette, and knot them into intricate patterns that tell stories. From functional bags to decorative wall hangings, every piece carries the warmth of human touch.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Meet Our Artisans</h2>
            <p className="text-muted-foreground leading-relaxed">
              Behind every Knotico piece is a skilled artisan with years of experience. Our team of creators brings diverse backgrounds and unique perspectives to their craft, united by a shared commitment to quality and authenticity. We believe in fair work, sustainable practices, and preserving traditional craftsmanship for future generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {[
              { stat: "500+", label: "Products Crafted" },
              { stat: "50+", label: "Happy Customers" },
              { stat: "100%", label: "Handmade" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center p-6 rounded-xl bg-card border border-border">
                <p className="font-heading text-3xl font-bold text-primary">{stat}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
