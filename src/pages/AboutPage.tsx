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
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Turning passion into something ours ✨</h2>
            <p className="text-muted-foreground leading-relaxed">
              Just a girl with a passion and a deep love for everything handmade. Knotico started as a quiet little dream — a few knots, a lot of heart, and the belief that something beautiful could grow from simple beginnings.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">A little brand, a big dream 🌱</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every piece is knotted slowly, lovingly, and with intention. There are no factories here — only hands, threads, and hours poured into creating something that feels personal. This little brand carries a big dream: to share handmade warmth with the world, one knot at a time.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">From our hearts to yours 🫶</h2>
            <p className="text-muted-foreground leading-relaxed">
              Each Knotico creation is a tiny piece of love sent your way. Whether it's a bag, a charm, or a custom piece made just for you — it's made with care, packed with joy, and meant to feel like a gift, even to yourself.
            </p>
          </div>

          <div className="text-center pt-4">
            <p className="font-heading text-2xl md:text-3xl font-bold text-primary">Knotico, made together 🧶</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
