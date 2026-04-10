import bag1 from "@/assets/products/bag-1.jpg";
import bag2 from "@/assets/products/bag-2.jpg";
import bag3 from "@/assets/products/bag-3.jpg";
import bag4 from "@/assets/products/bag-4.jpg";
import accessory1 from "@/assets/products/accessory-1.jpg";
import accessory2 from "@/assets/products/accessory-2.jpg";
import accessory3 from "@/assets/products/accessory-3.jpg";
import accessory4 from "@/assets/products/accessory-4.jpg";
import custom1 from "@/assets/products/custom-1.jpg";
import custom2 from "@/assets/products/custom-2.jpg";
import custom3 from "@/assets/products/custom-3.jpg";
import custom4 from "@/assets/products/custom-4.jpg";

export type ProductCategory = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  category: string;
  variants: { color?: string; size?: string }[];
  stock: number;
  featured: boolean;
  material: string;
  createdAt: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Terracotta Drawstring Bag",
    description: "A stunning handcrafted drawstring bag made with premium terracotta and cream wool. Perfect for everyday use or as a unique gift. Each knot is carefully tied by our skilled artisans.",
    price: 78,
    images: [bag1],
    category: "bags",
    variants: [{ color: "Terracotta" }, { color: "Cream" }],
    stock: 12,
    featured: true,
    material: "100% Merino Wool",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    name: "Bohemian Tote Bag",
    description: "Our signature tote bag features intricate knotting patterns with cream and brown wool, finished with handmade tassels. Spacious enough for daily essentials.",
    price: 95,
    images: [bag2],
    category: "bags",
    variants: [{ color: "Natural/Brown" }, { size: "Medium" }, { size: "Large" }],
    stock: 8,
    featured: true,
    material: "Organic Cotton & Wool Blend",
    createdAt: "2024-11-15",
  },
  {
    id: "3",
    name: "Sage Garden Clutch",
    description: "An elegant evening clutch with sage green and cream macrame knotting, adorned with a gold-tone frame. Perfect for special occasions.",
    price: 65,
    images: [bag3],
    category: "bags",
    variants: [{ color: "Sage/Cream" }, { color: "Dusty Rose/Cream" }],
    stock: 15,
    featured: false,
    material: "Cotton Rope & Wool",
    createdAt: "2024-12-10",
  },
  {
    id: "4",
    name: "Rosewood Fringe Bag",
    description: "A bohemian shoulder bag in dusty rose and cream with cascading fringe detailing. A statement piece that turns heads.",
    price: 88,
    images: [bag4],
    category: "bags",
    variants: [{ color: "Dusty Rose" }, { color: "Terracotta" }],
    stock: 6,
    featured: true,
    material: "Hand-dyed Cotton Rope",
    createdAt: "2024-12-05",
  },
  {
    id: "5",
    name: "Spiral Coaster Set",
    description: "Set of 4 handcrafted coasters with a mesmerizing spiral pattern in terracotta and cream. Protects your surfaces in style.",
    price: 32,
    images: [accessory1],
    category: "accessories",
    variants: [{ color: "Terracotta/Cream" }, { color: "Brown/Cream" }],
    stock: 25,
    featured: true,
    material: "Cotton Rope",
    createdAt: "2024-11-20",
  },
  {
    id: "6",
    name: "Tassel Keychain",
    description: "A charming macrame keychain with wooden beads and flowing tassels. Makes a wonderful small gift or personal accessory.",
    price: 18,
    images: [accessory2],
    category: "accessories",
    variants: [{ color: "Terracotta" }, { color: "Natural" }, { color: "Sage" }],
    stock: 40,
    featured: false,
    material: "Cotton Thread & Wood",
    createdAt: "2024-12-08",
  },
  {
    id: "7",
    name: "Macrame Plant Hanger",
    description: "Bring nature indoors with this elegant macrame plant hanger. Fits pots up to 6 inches in diameter. Hand-knotted with care.",
    price: 42,
    images: [accessory3],
    category: "accessories",
    variants: [{ size: "Small (4\" pot)" }, { size: "Medium (6\" pot)" }, { size: "Large (8\" pot)" }],
    stock: 18,
    featured: true,
    material: "Natural Cotton Rope",
    createdAt: "2024-11-25",
  },
  {
    id: "8",
    name: "Artisan Bookmark",
    description: "A beautiful macrame bookmark with intricate knotwork and decorative tassels. Perfect gift for book lovers.",
    price: 15,
    images: [accessory4],
    category: "accessories",
    variants: [{ color: "Terracotta/Cream" }, { color: "Brown/Gold" }],
    stock: 50,
    featured: false,
    material: "Cotton Thread",
    createdAt: "2024-12-12",
  },
  {
    id: "9",
    name: "Custom Name Wall Hanging",
    description: "A personalized wall hanging featuring your chosen name or word, hand-knotted in vibrant terracotta and cream wool. Perfect for nurseries and gifts.",
    price: 120,
    images: [custom1],
    category: "custom",
    variants: [{ color: "Terracotta/Cream" }, { color: "Brown/Cream" }],
    stock: 0,
    featured: true,
    material: "Premium Wool",
    createdAt: "2024-11-10",
  },
  {
    id: "10",
    name: "Heart Wall Tapestry",
    description: "A stunning large-scale wall tapestry featuring a handcrafted heart design in terracotta on cream. Makes a bold statement in any room.",
    price: 185,
    images: [custom2],
    category: "custom",
    variants: [{ size: "Medium (24\")" }, { size: "Large (36\")" }],
    stock: 0,
    featured: true,
    material: "Cotton Rope & Wool",
    createdAt: "2024-12-01",
  },
  {
    id: "11",
    name: "Boho Dreamcatcher",
    description: "A handcrafted dreamcatcher with intricate web pattern, wooden beads, and terracotta tassels. Brings warmth and charm to any space.",
    price: 55,
    images: [custom3],
    category: "custom",
    variants: [{ size: "Small (8\")" }, { size: "Medium (12\")" }],
    stock: 10,
    featured: false,
    material: "Cotton Thread & Wood",
    createdAt: "2024-12-15",
  },
  {
    id: "12",
    name: "Wedding Ring Pillow",
    description: "An exquisite handcrafted macrame ring pillow in cream and gold, perfect for your special day. Each pillow is uniquely made to order.",
    price: 75,
    images: [custom4],
    category: "custom",
    variants: [{ color: "Cream/Gold" }, { color: "Cream/Blush" }],
    stock: 0,
    featured: false,
    material: "Fine Cotton & Gold Thread",
    createdAt: "2024-12-18",
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getFeaturedProducts = () => products.filter((p) => p.featured);
export const getProductsByCategory = (category: ProductCategory) =>
  products.filter((p) => p.category === category);
