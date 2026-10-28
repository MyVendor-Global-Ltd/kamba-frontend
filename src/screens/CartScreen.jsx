// screens/CartScreen.jsx — Shopping Cart

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Easing } from 'react-native';
import { Trash, Plus, Minus, CreditCard, ArrowRight } from 'phosphor-react-native';
import { colors, typography, spacing, radius, motion, icons } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { DoubleBezelCard } from '../components/DoubleBezelCard';
import { MagneticButton } from '../components/MagneticButton';
import { NairaText } from '../components/NairaText';

const CART_ITEMS = [
  { id: 1, storeId: 1, storeName: "Ada's Kitchen", name: 'Jollof Rice & Chicken', price: 2500, quantity: 2, image: 'https://picsum.photos/seed/jollof/200/200' },
  { id: 2, storeId: 1, storeName: "Ada's Kitchen", name: 'Moi Moi', price: 800, quantity: 1, image: 'https://picsum.photos/seed/moimoi/200/200' },
  { id: 3, storeId: 3, storeName: 'Style Avenue', name: 'Vintage Denim Jacket', price: 8500, quantity: 1, image: 'https://picsum.photos/seed/denim/200/200' },
];

export const CartScreen = ({ navigation }) => {
  const [items, setItems] = React.useState(CART_ITEMS);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: motion.duration.slower, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: motion.duration.slower, easing: motion.easing.standard, useNativeDriver: true }),
    ]).start();
  }, []);

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 500 : 0;
  const total = subtotal + deliveryFee;

  const renderItem = ({ item }) => (
    <Animated.View style={styles.item} key={item.id}>
      <DoubleBezelCard variant="default" style={styles.itemCard}>
        <View style={styles.itemContent}>
          <View style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemStore}>{item.storeName}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <NairaText amount={item.price} variant="body" />
          </View>
          <View style={styles.itemQuantity}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id, -1)}
              activeOpacity={0.7}
              accessibilityLabel="Decrease quantity"
            >
              <Minus size={icons.sizes.xs} color={colors.light.textPrimary} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id, 1)}
              activeOpacity={0.7}
              accessibilityLabel="Increase quantity"
            >
              <Plus size={icons.sizes.xs} color={colors.light.textPrimary} weight="bold" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
            activeOpacity={0.7}
            accessibilityLabel="Remove item"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash size={icons.sizes.sm} color={colors.light.textMuted} weight="bold" />
          </TouchableOpacity>
        </View>
      </DoubleBezelCard>
    </Animated.View>
  );

  if (items.length === 0) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScreenShell scrollable={false} padded={true} bg={colors.light.background}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Discover stores and add items to get started</Text>
            <MagneticButton
              label="Start Shopping"
              variant="primary"
              size="lg"
              onPress={() => navigation.navigate('Discover')}
              style={styles.emptyCTA}
            />
          </View>
        </ScreenShell>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScreenShell scrollable padded bg={colors.light.background}>
        <View style={styles.content}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          <View style={styles.summaryCard}>
            <DoubleBezelCard variant="elevated">
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <NairaText amount={subtotal} variant="body" />
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <NairaText amount={deliveryFee} variant="body" />
              </View>
              <View style={styles.summaryDivider} />
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryLabel}>Total</Text>
                <NairaText amount={total} variant="body" />
              </View>
            </DoubleBezelCard>
          </View>

          <View style={styles.checkoutSection}>
            <MagneticButton
              label="Proceed to Checkout"
              variant="primary"
              size="lg"
              fullWidth
              icon={<ArrowRight size={icons.sizes.md} color="#FFFFFF" weight="bold" />}
              iconPosition="right"
              onPress={() => navigation.navigate('Checkout')}
              accessibilityLabel="Proceed to checkout"
            />
            <Text style={styles.secureText}>Secure payment • Easy returns</Text>
          </View>
        </View>
      </ScreenShell>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { flex: 1, gap: spacing.lg },
  listContent: { paddingBottom: spacing.lg },
  item: { marginHorizontal: spacing.xl },
  itemCard: { padding: 0 },
  itemContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  itemImage: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.light.surfaceElevated },
  itemInfo: { flex: 1, gap: spacing.xs },
  itemStore: { fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.accent },
  itemName: { fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleMedium.fontSize, color: colors.light.textPrimary },
  itemQuantity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyButton: { width: 32, height: 32, borderRadius: radius.full, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontFamily: typography.fontFamilies.monoMedium, fontSize: typography.scale.monoMedium.fontSize, color: colors.light.textPrimary, minWidth: 24, textAlign: 'center' },
  removeButton: { padding: spacing.xs },
  summaryCard: { marginHorizontal: spacing.xl, marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  summaryLabel: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary },
  summaryDivider: { height: 1, backgroundColor: colors.light.border, marginVertical: spacing.xs },
  summaryTotal: { borderTopWidth: 1, borderTopColor: colors.light.border, paddingTop: spacing.md },
  checkoutSection: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.md },
  secureText: { textAlign: 'center', fontFamily: typography.fontFamilies.caption, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textMuted },
  emptyState: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, color: colors.light.textPrimary },
  emptySubtitle: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary, textAlign: 'center', paddingHorizontal: spacing.xl },
  emptyCTA: { marginTop: spacing.md },
});

export default CartScreen;
