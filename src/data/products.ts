import apple from '../assets/products/apple.png';
import orange from '../assets/products/orange.png';
import pineapple from '../assets/products/pineapple.png';
import tomato from '../assets/products/tomato.png';
import fish from '../assets/products/fish.png';
import onion from '../assets/products/onion.png';
import strawberry from '../assets/products/strawberry.png';
import lemon from '../assets/products/lemon.png';
import ketchup from '../assets/products/ketchup.png';
import mango from '../assets/products/mango.png';
import grapes from '../assets/products/grapes.png';
import teabag from '../assets/products/teabag.png';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  category: string;
}

export const products: Product[] = [
  { id: 1, name: 'Fresh Apple', price: 20.00, oldPrice: 25.00, image: apple, rating: 5, category: 'fruits' },
  { id: 2, name: 'Orange', price: 15.00, oldPrice: 18.00, image: orange, rating: 4, category: 'fruits' },
  { id: 3, name: 'Pineapple', price: 35.00, image: pineapple, rating: 5, category: 'fruits' },
  { id: 4, name: 'Red Tomato', price: 12.00, oldPrice: 15.00, image: tomato, rating: 4, category: 'vegetables' },
  { id: 5, name: 'Fresh Fish', price: 55.00, oldPrice: 65.00, image: fish, rating: 5, category: 'fish' },
  { id: 6, name: 'Red Onion', price: 8.00, image: onion, rating: 4, category: 'vegetables' },
  { id: 7, name: 'Strawberry', price: 24.00, oldPrice: 30.00, image: strawberry, rating: 5, category: 'fruits' },
  { id: 8, name: 'Fresh Lemon', price: 10.00, image: lemon, rating: 4, category: 'fruits' },
  { id: 9, name: 'Tomato Ketchup', price: 8.99, oldPrice: 12.00, image: ketchup, rating: 4, category: 'grocery' },
  { id: 10, name: 'Fresh Mango', price: 18.00, oldPrice: 22.00, image: mango, rating: 5, category: 'fruits' },
  { id: 11, name: 'Black Grapes', price: 28.00, image: grapes, rating: 5, category: 'fruits' },
  { id: 12, name: 'Green Tea', price: 15.00, oldPrice: 20.00, image: teabag, rating: 4, category: 'drinks' },
];

export const categories = [
  { name: 'Vegetables', icon: '🥬' },
  { name: 'Grain', icon: '🌾' },
  { name: 'Milk', icon: '🥛' },
  { name: 'Fruits', icon: '🍎' },
  { name: 'Drinks', icon: '🥤' },
  { name: 'Bread', icon: '🍞' },
  { name: 'Grocery', icon: '🛒' },
  { name: 'Fruits', icon: '🍎' },
  { name: 'Drinks', icon: '🥤' },
  { name: 'Bread', icon: '🍞' },
];

export interface ShopProduct {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number;
  badge?: string;
  category: string;
}

export const shopProducts: ShopProduct[] = [
  {
    id: 1,
    name: "Great Value Rising Crust Frozen Pizza, Supreme",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop",
    rating: 4,
    reviews: 5,
    price: 4.99,
    category: "fruits",
    oldPrice: 8.99,
  },
  {
    id: 2,
    name: "Mountain Nature's Sweet Bounty Fresh Organic Strawberries",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop",
    rating: 5,
    reviews: 3,
    price: 0.50,
    oldPrice: 1.98,
    category: "vegetables",
    badge: "Sale",
  },
  {
    id: 4,
    name: "Whole Foods Market Organic Trimmed Leeks",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop",
    rating: 3,
    reviews: 4,
    category: "fruits",
    price: 2.45,
    oldPrice: 3.49,
  },
  {
    id: 5,
    name: "Mini Cinnamon Rolls - Fresh Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
    rating: 4,
    reviews: 6,
    price: 0.50,
    oldPrice: 0.68,
    category: "vegetables",
  },
  {
    id: 6,
    name: "Simply Orange Pulp Free Juice - 52 Fl Oz",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop",
    rating: 5,
    reviews: 8,
    price: 2.45,
    category: "fruits",
    oldPrice: 3.49,
  },
  {
    id: 7,
    name: "Mini Strawberry Rolls Bakery Fresh",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop",
    rating: 4,
    reviews: 3,
    price: 0.50,
    category: "vegetables",
    oldPrice: 0.68,
  },
  {
    id: 8,
    name: "Simply Orange Pulp Free Juice - 32 Fl Oz",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop",
    rating: 4,
    reviews: 5,
    category: "fruits",
    price: 2.45,
    oldPrice: 4.13,
  },
  {
    id: 10,
    name: "Simply Orange Free Juice - 52 Fl Oz",
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=200&h=200&fit=crop",
    rating: 3,
    reviews: 7,
    price: 2.45,
    oldPrice: 3.49,
    category: "vegetables",
  },
  {
    id: 11,
    name: "Simple Orange Pulp Free Juice",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&h=200&fit=crop",
    rating: 4,
    reviews: 4,
    price: 2.45,
    category: "fruits",
    oldPrice: 4.13,
  },
  {
    id: 12,
    name: "Simple Orange Juice Classic",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=200&h=200&fit=crop",
    rating: 5,
    reviews: 9,
    price: 2.45,
    category: "fruits",
    oldPrice: 3.99,
  },
];

export interface TopRatedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
}

export const topRatedProducts: TopRatedProduct[] = [
  {
    id: 1,
    name: "Organic Cage Grade A Large Eggs",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=80&h=80&fit=crop",
    price: 24.00,
  },
  {
    id: 2,
    name: "Naturally Flavored Cinnamon Vanilla",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=80&h=80&fit=crop",
    price: 33.00,
  },
  {
    id: 3,
    name: "Dried fruit apricots figs, prunes",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=200&h=200&fit=crop",
    price: 19.00,
  },
  {
    id: 4,
    name: "Pre-carbonated, low-fat ice cream yogurt",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop",
    price: 50.00,
  },
];
