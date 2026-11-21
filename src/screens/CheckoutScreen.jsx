import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { ScreenState } from '../components/ScreenState';
import { ShoppingBag, ArrowRight } from '../utils/phosphorIcons';
import { cartAPI, deliveryAPI, orderAPI } from '../utils/api';

const formatNaira = (kobo = 0) =>
  `₦${(Number(kobo || 0) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const CheckoutScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [universities, setUniversities] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [deliveryQuote, setDeliveryQuote] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    recipient_name: '',
    phone: '',
    address_line: '',
    city: '',
    state: '',
    university_id: '',
    zone_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadingZones, setLoadingZones] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [quoteError, setQuoteError] = useState('');

  const selectedUniversity = useMemo(
    () => universities.find((item) => item.id === selectedUniversityId) || null,
    [universities, selectedUniversityId],
  );
  const deliveryFee = deliveryQuote?.buyer_delivery_charge_kobo || 0;
  const total = subtotal + platformFee + (deliveryType === 'delivery' ? deliveryFee : 0);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const cart = await cartAPI.getCart();
      const items = cart.items || [];
      const sub = cart.subtotal || 0;
      setCartItems(items);
      setStoreId(items[0]?.store_id || null);
      setSubtotal(sub);
      setPlatformFee(Math.ceil((sub * 500) / 10000));
    } catch (err) {
      const message = err.response?.data?.error;
      setError(typeof message === 'string' ? message : 'Could not load cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
    deliveryAPI.listUniversities()
      .then(setUniversities)
      .catch(() => setQuoteError('University delivery locations could not be loaded. Please try again.'));
  }, [loadCart]);

  const selectUniversity = useCallback(async (university) => {
    setSelectedUniversityId(university.id);
    setSelectedZoneId('');
    setZones([]);
    setDeliveryQuote(null);
    setQuoteError('');
    setDeliveryAddress((current) => ({
      ...current,
      city: university.city || current.city,
      state: university.state || current.state,
      university_id: university.id,
      zone_id: '',
    }));
    setLoadingZones(true);
    try {
      const result = await deliveryAPI.listZones(university.slug);
      setZones(result);
      if (!result.length) setQuoteError('No delivery zones have been configured for this university yet.');
    } catch (err) {
      const message = err.response?.data?.error;
      setQuoteError(typeof message === 'string' ? message : 'Could not load this university’s delivery zones.');
    } finally {
      setLoadingZones(false);
    }
  }, []);

  const selectZone = useCallback(async (zone) => {
    setSelectedZoneId(zone.id);
    setDeliveryQuote(null);
    setQuoteError('');
    setDeliveryAddress((current) => ({ ...current, zone_id: zone.id }));
    if (!storeId || !selectedUniversityId) {
      setQuoteError('This cart is missing its store or university information.');
      return;
    }
    setQuoteLoading(true);
    try {
      const quote = await deliveryAPI.getQuote({
        store_id: storeId,
        university_id: selectedUniversityId,
        destination_zone_id: zone.id,
        delivery_mode: 'express',
      });
      setDeliveryQuote(quote);
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message;
      setQuoteError(typeof message === 'string' ? message : 'Delivery is not available on this route right now.');
    } finally {
      setQuoteLoading(false);
    }
  }, [storeId, selectedUniversityId]);

  const placeOrder = useCallback(async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setError('');
    if (deliveryType === 'delivery') {
      if (!deliveryQuote || !selectedUniversityId || !selectedZoneId) {
        setError(quoteError || 'Choose a university and delivery zone with an available route price.');
        return;
      }
      const required = ['recipient_name', 'phone', 'address_line', 'city', 'state'];
      const missing = required.some((field) => !String(deliveryAddress[field] || '').trim());
      if (missing) {
        setError('Complete the recipient name, phone number and delivery address.');
        return;
      }
    }

    setPlacingOrder(true);
    try {
      const options = deliveryType === 'delivery'
        ? {
            delivery_type: 'delivery',
            delivery_mode: 'express',
            delivery_address: {
              ...deliveryAddress,
              university_id: selectedUniversityId,
              zone_id: selectedZoneId,
            },
          }
        : { delivery_type: 'pickup' };
      const order = await orderAPI.createOrder(options);
      if (order?.id) {
        navigation.navigate('OrderDetail', { orderId: order.id });
      } else {
        setError('The order was not created. Please try again.');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message;
      setError(typeof message === 'string' ? message : 'Could not place order.');
    } finally {
      setPlacingOrder(false);
    }
  }, [cartItems, deliveryType, deliveryQuote, selectedUniversityId, selectedZoneId, deliveryAddress, quoteError, navigation]);

  if (loading) {
    return <ScreenShell><ActivityIndicator size="large" color={colors.light.accent} /></ScreenShell>;
  }

  if (cartItems.length === 0 && !error) {
    return (
      <ScreenShell>
        <ScreenState
          type="empty"
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add products from a store before checking out."
          actionLabel="Explore shops"
          onAction={() => navigation.navigate('Discover')}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ShoppingBag size={28} color={colors.light.accent} />
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fulfilment</Text>
          <View style={styles.choiceRow}>
            <TouchableOpacity
              style={[styles.choice, deliveryType === 'pickup' && styles.choiceActive]}
              onPress={() => { setDeliveryType('pickup'); setError(''); }}
            >
              <Text style={[styles.choiceText, deliveryType === 'pickup' && styles.choiceTextActive]}>Store pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.choice, deliveryType === 'delivery' && styles.choiceActive]}
              onPress={() => { setDeliveryType('delivery'); setError(''); }}
            >
              <Text style={[styles.choiceText, deliveryType === 'delivery' && styles.choiceTextActive]}>Delivery</Text>
            </TouchableOpacity>
          </View>

          {deliveryType === 'delivery' && (
            <View style={styles.deliveryPanel}>
              <Text style={styles.sectionTitle}>Choose your university</Text>
              {!universities.length ? (
                <Text style={styles.helper}>No active university delivery locations are available yet.</Text>
              ) : (
                <View style={styles.chipList}>
                  {universities.map((university) => (
                    <TouchableOpacity
                      key={university.id}
                      style={[styles.chip, selectedUniversityId === university.id && styles.chipActive]}
                      onPress={() => selectUniversity(university)}
                    >
                      <Text style={[styles.chipText, selectedUniversityId === university.id && styles.chipTextActive]}>
                        {university.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {loadingZones && <ActivityIndicator size="small" color={colors.light.accent} />}
              {!!zones.length && (
                <>
                  <Text style={styles.sectionTitle}>Delivery zone</Text>
                  <View style={styles.chipList}>
                    {zones.map((zone) => (
                      <TouchableOpacity
                        key={zone.id}
                        style={[styles.chip, selectedZoneId === zone.id && styles.chipActive]}
                        onPress={() => selectZone(zone)}
                      >
                        <Text style={[styles.chipText, selectedZoneId === zone.id && styles.chipTextActive]}>
                          {zone.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {quoteLoading && <View style={styles.quoteStatus}><ActivityIndicator size="small" color={colors.light.accent} /><Text style={styles.helper}>Checking route price…</Text></View>}
              {!!quoteError && <Text style={styles.inlineError}>{quoteError}</Text>}
              {deliveryQuote && (
                <View style={styles.quoteBox}>
                  <Text style={styles.quoteLabel}>Delivery charge</Text>
                  <Text style={styles.quoteAmount}>{formatNaira(deliveryFee)}</Text>
                  <Text style={styles.helper}>Express delivery · {selectedUniversity?.name}</Text>
                </View>
              )}

              <Text style={styles.sectionTitle}>Recipient and delivery address</Text>
              <TextInput style={styles.input} placeholder="Recipient name" placeholderTextColor={colors.light.textMuted} value={deliveryAddress.recipient_name} onChangeText={(value) => setDeliveryAddress((current) => ({ ...current, recipient_name: value }))} />
              <TextInput style={styles.input} placeholder="Phone number" placeholderTextColor={colors.light.textMuted} keyboardType="phone-pad" value={deliveryAddress.phone} onChangeText={(value) => setDeliveryAddress((current) => ({ ...current, phone: value }))} />
              <TextInput style={styles.input} placeholder="Hostel, room or delivery address" placeholderTextColor={colors.light.textMuted} value={deliveryAddress.address_line} onChangeText={(value) => setDeliveryAddress((current) => ({ ...current, address_line: value }))} />
              <View style={styles.addressRow}>
                <TextInput style={[styles.input, styles.addressInput]} placeholder="City" placeholderTextColor={colors.light.textMuted} value={deliveryAddress.city} onChangeText={(value) => setDeliveryAddress((current) => ({ ...current, city: value }))} />
                <TextInput style={[styles.input, styles.addressInput]} placeholder="State" placeholderTextColor={colors.light.textMuted} value={deliveryAddress.state} onChangeText={(value) => setDeliveryAddress((current) => ({ ...current, state: value }))} />
              </View>
              <Text style={styles.helper}>Batch delivery will be offered once compatible orders can be grouped into a shared trip.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order summary</Text>
          {cartItems.map((item) => (
            <View key={item.product_id || item.productId} style={styles.cartItem}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name || 'Product'}</Text>
                <Text style={styles.itemQty}>×{item.quantity || 1}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatNaira(item.line_total || ((item.price || 0) * (item.quantity || 1)))}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{formatNaira(subtotal)}</Text></View>
          <View style={styles.row}><Text style={styles.summaryLabel}>Platform fee (5%)</Text><Text style={styles.summaryValue}>{formatNaira(platformFee)}</Text></View>
          {deliveryType === 'delivery' && <View style={styles.row}><Text style={styles.summaryLabel}>Delivery fee</Text><Text style={styles.summaryValue}>{deliveryQuote ? formatNaira(deliveryFee) : '—'}</Text></View>}
          <View style={styles.divider} />
          <View style={styles.rowTotal}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatNaira(total)}</Text></View>
        </View>

        {!!error && <Text style={styles.inlineError}>{error}</Text>}

        <TouchableOpacity
          style={[styles.checkoutButton, (placingOrder || !cartItems.length || (deliveryType === 'delivery' && (!deliveryQuote || quoteLoading))) && styles.checkoutDisabled]}
          onPress={placingOrder || !cartItems.length || (deliveryType === 'delivery' && (!deliveryQuote || quoteLoading)) ? undefined : placeOrder}
          accessibilityRole="button"
          accessibilityLabel="Place order"
          disabled={placingOrder || !cartItems.length || (deliveryType === 'delivery' && (!deliveryQuote || quoteLoading))}
        >
          <View style={styles.buttonContent}>
            {placingOrder ? <ActivityIndicator size="small" color={colors.light.onAccent} /> : <ArrowRight size={20} color={colors.light.onAccent} />}
            <Text style={styles.buttonText}>{placingOrder ? 'Placing order…' : 'Place order'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: spacing.md },
  headerTitle: { fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize, letterSpacing: typography.scale.headlineMedium.letterSpacing, color: colors.light.textPrimary, marginLeft: spacing.sm },
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.lg },
  sectionTitle: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 0.5, color: colors.light.textMuted, marginBottom: spacing.sm, marginTop: spacing.sm },
  choiceRow: { flexDirection: 'row', gap: spacing.sm },
  choice: { flex: 1, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.md, alignItems: 'center', backgroundColor: colors.light.surface },
  choiceActive: { borderColor: colors.light.accent, backgroundColor: colors.light.accentSoft },
  choiceText: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  choiceTextActive: { color: colors.light.accentStrong },
  deliveryPanel: { marginTop: spacing.md, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border },
  chipList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingVertical: 8, paddingHorizontal: 11, borderRadius: 20, borderWidth: 1, borderColor: colors.light.border, backgroundColor: colors.light.background },
  chipActive: { backgroundColor: colors.light.accentSoft, borderColor: colors.light.accent },
  chipText: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.bodyMedium, fontSize: typography.scale.labelSmall.fontSize },
  chipTextActive: { color: colors.light.accentStrong },
  helper: { color: colors.light.textMuted, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize, lineHeight: 18, marginVertical: spacing.xs },
  quoteStatus: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.sm },
  quoteBox: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.light.accentSoft, marginBottom: spacing.md },
  quoteLabel: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  quoteAmount: { color: colors.light.accentStrong, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineLarge.fontSize, marginTop: 3 },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.md, backgroundColor: colors.light.background, paddingHorizontal: spacing.md, marginBottom: spacing.sm, color: colors.light.textPrimary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize },
  addressRow: { flexDirection: 'row', gap: spacing.sm },
  addressInput: { flex: 1 },
  inlineError: { color: colors.light.error, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize, marginVertical: spacing.sm, paddingHorizontal: spacing.md },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.light.border },
  itemDetails: { flex: 1 },
  itemName: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textPrimary },
  itemQty: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.labelSmall.fontSize, color: colors.light.textSecondary },
  itemPrice: { fontFamily: typography.fontFamilies.bodyMedium, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textPrimary },
  divider: { height: 1, backgroundColor: colors.light.border, marginVertical: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textSecondary },
  summaryValue: { fontFamily: typography.fontFamilies.bodyMedium, fontSize: typography.scale.bodyMedium.fontSize, color: colors.light.textPrimary },
  rowTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, backgroundColor: colors.light.accentSoft, borderRadius: radius.md, paddingHorizontal: spacing.md },
  totalLabel: { fontFamily: typography.fontFamilies.headlineMedium, fontSize: typography.scale.headlineMedium.fontSize, color: colors.light.textPrimary },
  totalValue: { fontFamily: typography.fontFamilies.headlineMedium, fontSize: typography.scale.headlineMedium.fontSize, color: colors.light.accentStrong, fontWeight: '600' },
  checkoutButton: { backgroundColor: colors.light.accent, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', marginHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.xxl },
  checkoutDisabled: { opacity: 0.5 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  buttonText: { fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelLarge.fontSize, color: colors.light.onAccent, fontWeight: '600' },
});

export default CheckoutScreen;
