import {
  GridFour,
  Heart,
  Package,
  Settings,
  ShoppingBag,
  Storefront,
} from '../utils/phosphorIcons';

export const marketplaceCategories = [
  {
    id: 'food',
    label: 'Food',
    aliases: ['food', 'foods', 'grocery', 'groceries', 'restaurant', 'restaurants'],
    Icon: Storefront,
  },
  {
    id: 'fashion',
    label: 'Fashion',
    aliases: ['fashion', 'clothing', 'clothes', 'apparel'],
    Icon: ShoppingBag,
  },
  {
    id: 'tech',
    label: 'Tech',
    aliases: ['tech', 'technology', 'electronic', 'electronics', 'gadgets'],
    Icon: GridFour,
  },
  {
    id: 'books',
    label: 'Books',
    aliases: ['book', 'books', 'stationery'],
    Icon: Package,
  },
  {
    id: 'beauty',
    label: 'Beauty',
    aliases: ['beauty', 'cosmetics', 'personal care'],
    Icon: Heart,
  },
  {
    id: 'services',
    label: 'Services',
    aliases: ['service', 'services'],
    Icon: Settings,
  },
];
