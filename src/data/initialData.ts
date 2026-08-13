import { Pizza, Order, User } from '../types';
import { DEFAULT_USER_AVATAR, DEFAULT_USER_AVATAR_MALE } from './presetImages';

export const INITIAL_PIZZAS: Pizza[] = [
  {
    id: 'pizza-1',
    name: {
      en: 'Pepperoni Supreme',
      ja: 'ペパロニ・シュプリーム'
    },
    description: {
      en: 'Loaded with double premium pepperoni, melted mozzarella cheese, and rich tomato sauce on a crispy artisan crust.',
      ja: 'ダブルプレミアムペパロニ、とろけるモッツァレラチーズ、濃厚トマトソースをたっぷり乗せた人気の王道ピザ。'
    },
    price: 1699,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'classic',
    inStock: true,
    rating: 4.9,
    calories: 1150,
    ingredients: {
      en: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Oregano'],
      ja: ['ペパロニ', 'モッツァレラチーズ', 'トマトソース', 'オレガノ']
    }
  },
  {
    id: 'pizza-2',
    name: {
      en: 'Margherita Artisan',
      ja: 'マルゲリータ・アルティザン'
    },
    description: {
      en: 'Fresh San Marzano tomato sauce, buffalo mozzarella, fresh basil leaves, and extra virgin olive oil.',
      ja: 'サンマルツァーノトマトソース、水牛モッツァレラ、フレッシュバジルと有機オリーブオイルで仕上げた伝統の味。'
    },
    price: 1450,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    category: 'vegetarian',
    inStock: true,
    rating: 4.8,
    calories: 920,
    ingredients: {
      en: ['San Marzano Tomato', 'Fresh Mozzarella', 'Fresh Basil', 'Olive Oil'],
      ja: ['サンマルツァーノトマト', 'フレッシュモッツァレラ', '生バジル', 'オリーブオイル']
    }
  },
  {
    id: 'pizza-3',
    name: {
      en: 'Teriyaki Chicken & Mayo',
      ja: '照り焼きチキン＆マヨ'
    },
    description: {
      en: 'Tender juicy teriyaki chicken, sweet corn, melted cheddar, Japanese kewpie mayo, and shredded nori seaweed.',
      ja: 'ジューシーな特製照り焼きチキン、スイートコーン、とろ〜りチェダーチーズに濃厚マヨネーズと刻み海苔をトッピング。'
    },
    price: 1825,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'specialty',
    inStock: true,
    rating: 4.95,
    calories: 1280,
    ingredients: {
      en: ['Teriyaki Chicken', 'Sweet Corn', 'Japanese Mayo', 'Cheddar', 'Nori'],
      ja: ['照り焼きチキン', 'スイートコーン', '特製マヨネーズ', 'チェダーチーズ', 'きざみ海苔']
    }
  },
  {
    id: 'pizza-4',
    name: {
      en: 'Quattro Formaggi',
      ja: 'クアトロ・フォルマッジ'
    },
    description: {
      en: 'A blend of four rich cheeses: Gorgonzola blue, Mozzarella, Parmesan, and Fontina, served with sweet honey dip.',
      ja: 'ゴルゴンゾーラ、モッツァレラ、パルミジャーノ、フォンティーナの4種濃厚チーズ。別添えのはちみつと相性抜群。'
    },
    price: 1750,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    category: 'specialty',
    inStock: true,
    rating: 4.7,
    calories: 1210,
    ingredients: {
      en: ['Gorgonzola', 'Mozzarella', 'Parmesan', 'Fontina', 'Honey'],
      ja: ['ゴルゴンゾーラ', 'モッツァレラ', 'パルミジャーノ', 'フォンティーナ', 'はちみつ']
    }
  },
  {
    id: 'pizza-5',
    name: {
      en: 'Spicy Jalapeño Feast',
      ja: 'スパイシー・ハラペーニョ'
    },
    description: {
      en: 'Fiery sliced jalapeños, spicy Italian sausage, red onions, chili flakes, and ghost pepper infused sauce.',
      ja: 'ピリッと辛いハラペーニョ、スパイシーソーセージ、レッドオニオン、唐辛子フライドソースでやみつきの旨辛味。'
    },
    price: 1650,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    category: 'spicy',
    inStock: true,
    rating: 4.6,
    calories: 1080,
    ingredients: {
      en: ['Jalapeños', 'Spicy Sausage', 'Red Onion', 'Chili Flakes'],
      ja: ['ハラペーニョ', 'スパイシーソーセージ', '赤玉ねぎ', 'チリフレーク']
    }
  },
  {
    id: 'pizza-6',
    name: {
      en: 'Garden Veggie Supreme',
      ja: 'ガーデン・ベジタブル'
    },
    description: {
      en: 'Bell peppers, mushrooms, black olives, sweet red onion, cherry tomatoes, and aromatic herbs.',
      ja: 'パプリカ、マッシュルーム、ブラックオリーブ、玉ねぎ、チェリートマト、香草をふんだんに乗せたヘルシーピザ。'
    },
    price: 1525,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    category: 'vegetarian',
    inStock: true,
    rating: 4.5,
    calories: 890,
    ingredients: {
      en: ['Bell Pepper', 'Mushrooms', 'Black Olives', 'Tomatoes'],
      ja: ['パプリカ', 'マッシュルーム', 'オリーブ', 'トマト']
    }
  }
];

export const INITIAL_USERS: Record<string, User> = {
  customer: {
    id: 'usr-customer-1',
    name: 'Customer Account',
    email: 'customer@example.com',
    role: 'customer',
    phone: '090-0000-0000',
    address: 'Shibuya-ku, Tokyo, Japan',
    avatar: DEFAULT_USER_AVATAR_MALE,
    loyaltyPoints: 120
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Store Manager',
    email: 'admin@pizzeriaroma.jp',
    role: 'admin',
    phone: '03-1111-2222',
    address: 'HQ - Tokyo, Japan',
    avatar: DEFAULT_USER_AVATAR,
    loyaltyPoints: 0
  }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ROMA-8012',
    customerId: 'usr-customer-1',
    customerName: 'Customer Account',
    customerPhone: '090-0000-0000',
    deliveryAddress: 'Shibuya-ku, Tokyo, Japan',
    orderType: 'delivery',
    items: [
      {
        id: 'item-1',
        pizzaId: 'pizza-1',
        pizzaName: {
          en: 'Pepperoni Supreme',
          ja: 'ペパロニ・シュプリーム'
        },
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
        size: 'L',
        crust: 'thin',
        extraToppings: ['Extra Cheese'],
        count: 1,
        pricePerUnit: 2340
      },
      {
        id: 'item-2',
        pizzaId: 'pizza-3',
        pizzaName: {
          en: 'Teriyaki Chicken & Mayo',
          ja: '照り焼きチキン＆マヨ'
        },
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        size: 'M',
        crust: 'pan',
        extraToppings: [],
        count: 1,
        pricePerUnit: 1975
      }
    ],
    totalAmount: 4747,
    status: 'baking',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedMinutes: 20,
    paymentMethod: 'card',
    notes: 'Please buzz room #402 when arriving.'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ROMA-8013',
    customerId: 'usr-guest-2',
    customerName: 'Guest Customer',
    customerPhone: '080-9988-7766',
    deliveryAddress: 'Shinjuku-ku, Tokyo, Japan',
    orderType: 'delivery',
    items: [
      {
        id: 'item-3',
        pizzaId: 'pizza-4',
        pizzaName: {
          en: 'Quattro Formaggi',
          ja: 'クアトロ・フォルマッジ'
        },
        image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
        size: 'M',
        crust: 'stuffed',
        extraToppings: ['Mushrooms'],
        count: 1,
        pricePerUnit: 2270
      }
    ],
    totalAmount: 2847,
    status: 'preparing',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    estimatedMinutes: 30,
    paymentMethod: 'mobile_pay',
    notes: 'Extra honey on the side if possible!'
  },
  {
    id: 'ord-1000',
    orderNumber: 'ROMA-8011',
    customerId: 'usr-customer-1',
    customerName: 'Customer Account',
    customerPhone: '090-0000-0000',
    deliveryAddress: 'Shibuya-ku, Tokyo, Japan',
    orderType: 'pickup',
    items: [
      {
        id: 'item-4',
        pizzaId: 'pizza-2',
        pizzaName: {
          en: 'Margherita Artisan',
          ja: 'マルゲリータ・アルティザン'
        },
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
        size: 'S',
        crust: 'thin',
        extraToppings: [],
        count: 2,
        pricePerUnit: 1233
      }
    ],
    totalAmount: 2713,
    status: 'delivered',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    estimatedMinutes: 0,
    paymentMethod: 'cash'
  }
];

export const TOPPING_OPTIONS = [
  { id: 'cheese', name: { en: 'Extra Cheese', ja: '追加チーズ' }, price: 220 },
  { id: 'mushrooms', name: { en: 'Sliced Mushrooms', ja: 'マッシュルーム' }, price: 220 },
  { id: 'olives', name: { en: 'Black Olives', ja: 'ブラックオリーブ' }, price: 180 },
  { id: 'bacon', name: { en: 'Crispy Bacon', ja: 'カリカリベーコン' }, price: 280 },
  { id: 'corn', name: { en: 'Sweet Corn', ja: 'スイートコーン' }, price: 150 },
  { id: 'jalapeno', name: { en: 'Jalapeño Slices', ja: 'ハラペーニョ' }, price: 220 }
];
