// Fictional local fixtures for UI development only. Do not load into production.
export const seedCategories = [
  { id: 'all', name: 'All finds', icon: 'sparkles-outline', sortOrder: 0 },
  { id: 'food', name: 'Food', icon: 'leaf-outline', sortOrder: 1 },
  { id: 'fashion', name: 'Fashion', icon: 'shirt-outline', sortOrder: 2 },
  { id: 'phones', name: 'Phones', icon: 'phone-portrait-outline', sortOrder: 3 },
  { id: 'beauty', name: 'Beauty', icon: 'flower-outline', sortOrder: 4 },
  { id: 'services', name: 'Services', icon: 'sparkles-outline', sortOrder: 5 },
];

export const seedStores = [
  { id: 'demo-store-adaora', name: 'Adaora’s Craft', categoryId: 'fashion', area: 'Umuahia', verified: true, rating: 4.8, reviewCount: 24, distanceKm: 0.8, featured: false, initials: 'AC', tone: '#E8DED0' },
  { id: 'demo-store-fresh', name: 'Umuahia Fresh Mart', categoryId: 'food', area: 'Umuahia', verified: true, rating: 4.7, reviewCount: 18, distanceKm: 1.2, featured: true, initials: 'FM', tone: '#DDE7D9' },
  { id: 'demo-store-kene', name: 'Kene Footwear', categoryId: 'fashion', area: 'Umuahia', verified: true, rating: 4.6, reviewCount: 12, distanceKm: 2.1, featured: false, initials: 'KF', tone: '#EEE2D1' },
  { id: 'demo-store-nneka', name: 'Nneka Naturals', categoryId: 'beauty', area: 'Umuahia', verified: true, rating: 4.9, reviewCount: 31, distanceKm: 1.6, featured: false, initials: 'NN', tone: '#EFE5D6' },
];

export const seedProducts = [
  { id: 'demo-product-tote', storeId: 'demo-store-adaora', name: 'Handwoven everyday tote', priceKobo: 1499900, currency: 'NGN', categoryId: 'fashion', status: 'active', label: 'HANDCRAFTED', image: require('../../../assets/products/raffia-tote.jpg') },
  { id: 'demo-product-tomato', storeId: 'demo-store-fresh', name: 'Fresh garden tomatoes', priceKobo: 249900, currency: 'NGN', categoryId: 'food', status: 'active', label: 'PICKED TODAY', image: require('../../../assets/products/tomatoes.jpg') },
  { id: 'demo-product-sandals', storeId: 'demo-store-kene', name: 'Classic leather sandals', priceKobo: 1899900, currency: 'NGN', categoryId: 'fashion', status: 'active', label: 'LOCAL MAKER', image: require('../../../assets/products/sandals.jpg') },
  { id: 'demo-product-oil', storeId: 'demo-store-nneka', name: 'Golden glow body oil', priceKobo: 750000, currency: 'NGN', categoryId: 'beauty', status: 'active', label: 'SMALL BATCH', image: require('../../../assets/products/body-oil.jpg') },
];
