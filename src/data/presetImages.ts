export interface PresetAvatar {
  id: string;
  label: string;
  url: string;
}

export interface PresetPizzaImage {
  id: string;
  name: {
    en: string;
    ja: string;
  };
  category: 'classic' | 'specialty' | 'vegetarian' | 'spicy';
  url: string;
}

// Neutral / Male FB/IG Style Avatar Silhouette
export const DEFAULT_USER_AVATAR_MALE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23CBD5E1"/><circle cx="64" cy="46" r="22" fill="%2364748B"/><path d="M26 108c0-20.987 17.013-38 38-38s38 17.013 38 38v10H26v-10z" fill="%2364748B"/></svg>';

// Female FB/IG Style Avatar Silhouette
export const DEFAULT_USER_AVATAR_FEMALE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23FBCFE8"/><path d="M64 20c-15 0-26 12-26 27 0 10 5 18 13 22.5V70c-20 0-35 15-35 35v11h96v-11c0-20-15-35-35-35v-0.5c8-4.5 13-12.5 13-22.5 0-15-11-27-26-27z" fill="%23DB2777"/><path d="M40 46c0 14 10 24 24 24s24-10 24-24c0-5-2-18-24-18S40 41 40 46z" fill="%23F472B6"/></svg>';

// Standard Default
export const DEFAULT_USER_AVATAR = DEFAULT_USER_AVATAR_MALE;

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'fb-male',
    label: 'Default Silhouette (Male)',
    url: DEFAULT_USER_AVATAR_MALE
  },
  {
    id: 'fb-female',
    label: 'Default Silhouette (Female)',
    url: DEFAULT_USER_AVATAR_FEMALE
  },
  {
    id: 'fb-neutral-blue',
    label: 'Classic Blue Silhouette',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23DBEAFE"/><circle cx="64" cy="46" r="22" fill="%232563EB"/><path d="M26 108c0-20.987 17.013-38 38-38s38 17.013 38 38v10H26v-10z" fill="%232563EB"/></svg>'
  },
  {
    id: 'fb-neutral-emerald',
    label: 'Emerald Silhouette',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23D1FAE5"/><circle cx="64" cy="46" r="22" fill="%23059669"/><path d="M26 108c0-20.987 17.013-38 38-38s38 17.013 38 38v10H26v-10z" fill="%23059669"/></svg>'
  },
  {
    id: 'fb-neutral-amber',
    label: 'Warm Amber Silhouette',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23FEF3C7"/><circle cx="64" cy="46" r="22" fill="%23D97706"/><path d="M26 108c0-20.987 17.013-38 38-38s38 17.013 38 38v10H26v-10z" fill="%23D97706"/></svg>'
  },
  {
    id: 'fb-neutral-purple',
    label: 'Purple Silhouette',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23F3E8FF"/><circle cx="64" cy="46" r="22" fill="%239333EA"/><path d="M26 108c0-20.987 17.013-38 38-38s38 17.013 38 38v10H26v-10z" fill="%239333EA"/></svg>'
  }
];

export const PRESET_PIZZA_IMAGES: PresetPizzaImage[] = [
  {
    id: 'pepperoni',
    name: { en: 'Pepperoni Double Supreme', ja: 'ダブルペパロニシュプリーム' },
    category: 'classic',
    url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'margherita',
    name: { en: 'Margherita San Marzano', ja: 'マルゲリータ' },
    category: 'vegetarian',
    url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'teriyaki',
    name: { en: 'Teriyaki Chicken Mayo', ja: '照り焼きチキンマヨ' },
    category: 'specialty',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'quattro',
    name: { en: 'Quattro Formaggi Honey', ja: 'クアトロフォルマッジ' },
    category: 'specialty',
    url: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spicy-jalapeno',
    name: { en: 'Spicy Jalapeño Inferno', ja: 'ハラペーニョインフェルノ' },
    category: 'spicy',
    url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'veggie-delight',
    name: { en: 'Garden Veggie Harvest', ja: 'ガーデンベジタブル' },
    category: 'vegetarian',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'truffle-mushroom',
    name: { en: 'Truffle Mushroom Deluxe', ja: 'トリュフマッシュルーム' },
    category: 'specialty',
    url: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bbq-chicken',
    name: { en: 'Smoky Honey BBQ Chicken', ja: 'スモーキーBBQチキン' },
    category: 'specialty',
    url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'seafood-special',
    name: { en: 'Seafood Marinara Gold', ja: 'シーフードマリナーラ' },
    category: 'specialty',
    url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hawaiian',
    name: { en: 'Hawaiian Island Pineapple', ja: 'ハワイアンパイン' },
    category: 'classic',
    url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'
  }
];
