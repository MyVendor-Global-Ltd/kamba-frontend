import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { KambaInput } from '../components/KambaInput';
import { KambaButton } from '../components/KambaButton';
import { vendorAPI } from '../utils/api';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

function formatNaira(kobo) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format((Number(kobo) || 0) / 100);
}

async function uploadMedia(asset, kind) {
  const mimeType = asset.mimeType || '';
  const upload = await vendorAPI.createProductMediaUploadUrl({ kind, mime_type: mimeType });
  if (!upload?.signed_url || !upload?.public_url) throw new Error('The server did not return a usable signed upload URL.');
  const localResponse = await fetch(asset.uri);
  if (!localResponse.ok) throw new Error(`Could not read ${asset.fileName || 'selected media'} from the device.`);
  const blob = await localResponse.blob();
  if (!blob || blob.size <= 0) throw new Error('The selected media file is empty.');
  if (blob.size > upload.max_size_bytes) throw new Error('The selected media exceeds the server upload limit.');
  const response = await fetch(upload.signed_url, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: blob,
  });
  if (!response.ok) throw new Error('Supabase Storage rejected the media upload. The product was not created.');
  return upload.public_url;
}

export const VendorProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [media, setMedia] = useState([]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await vendorAPI.listProducts();
      setProducts(result);
    } catch (loadError) {
      setError(loadError.response?.data?.message || loadError.response?.data?.error || loadError.message || 'Could not load vendor products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
    const unsubscribe = navigation.addListener('focus', () => { void loadProducts(); });
    return unsubscribe;
  }, [navigation, loadProducts]);

  const chooseMedia = async () => {
    setError('');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: 25,
      quality: 0.85,
    });
    if (result.canceled) return;
    const assets = result.assets || [];
    const images = assets.filter((asset) => asset.type === 'image');
    const videos = assets.filter((asset) => asset.type === 'video');
    if (images.length > 20 || videos.length > 5) {
      setError('Choose no more than 20 images and 5 videos.');
      return;
    }
    const invalid = assets.find((asset) => {
      const mime = asset.mimeType || '';
      if (asset.type === 'image') return !IMAGE_TYPES.includes(mime) || (asset.fileSize && asset.fileSize > 5 * 1024 * 1024);
      if (asset.type === 'video') return !VIDEO_TYPES.includes(mime) || (asset.fileSize && asset.fileSize > 25 * 1024 * 1024);
      return true;
    });
    if (invalid) {
      setError('Images must be JPEG, PNG or WebP (max 5 MB); videos must be MP4, WebM or MOV (max 25 MB).');
      return;
    }
    setMedia(assets);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setStock('0');
    setCategory('');
    setTags('');
    setMedia([]);
    setShowForm(false);
  };

  const createProduct = async () => {
    const priceNaira = Number(price);
    const originalNaira = originalPrice.trim() ? Number(originalPrice) : null;
    const stockQuantity = Number(stock);
    if (!name.trim()) return setError('Enter a product name.');
    if (!Number.isFinite(priceNaira) || priceNaira <= 0) return setError('Enter a valid price greater than zero.');
    if (originalNaira !== null && (!Number.isFinite(originalNaira) || originalNaira < 0)) return setError('Enter a valid original price or leave it empty.');
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) return setError('Stock quantity must be a whole number of zero or more.');
    const images = media.filter((asset) => asset.type === 'image');
    const videos = media.filter((asset) => asset.type === 'video');
    setSaving(true);
    setError('');
    try {
      const imageUrls = [];
      const videoUrls = [];
      for (const asset of images) imageUrls.push(await uploadMedia(asset, 'image'));
      for (const asset of videos) videoUrls.push(await uploadMedia(asset, 'video'));
      await vendorAPI.createProduct({
        name: name.trim(),
        description: description.trim(),
        price: Math.round(priceNaira * 100),
        original_price: originalNaira === null ? null : Math.round(originalNaira * 100),
        stock_quantity: stockQuantity,
        category: category.trim() || undefined,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 20),
        images: imageUrls,
        videos: videoUrls,
        is_available: true,
      });
      resetForm();
      await loadProducts();
    } catch (createError) {
      setError(createError.response?.data?.message || createError.response?.data?.error || createError.message || 'Product creation failed. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const archiveProduct = (product) => {
    Alert.alert('Archive product', `Remove “${product.name}” from the public marketplace?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        style: 'destructive',
        onPress: async () => {
          try {
            await vendorAPI.deleteProduct(product.id);
            await loadProducts();
          } catch (archiveError) {
            setError(archiveError.response?.data?.message || archiveError.response?.data?.error || archiveError.message || 'Could not archive product.');
          }
        },
      },
    ]);
  };

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Your products</Text>
            <Text style={styles.subtitle}>Upload product images and videos directly to Kamba Storage.</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm((value) => !value)}>
            <Text style={styles.addButtonText}>{showForm ? 'Close' : 'Add product'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

        {showForm ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create product</Text>
            <KambaInput label="Product name" value={name} onChangeText={setName} placeholder="Product name" />
            <KambaInput label="Description" value={description} onChangeText={setDescription} placeholder="Describe the product" multiline />
            <KambaInput label="Price (₦)" value={price} onChangeText={setPrice} placeholder="e.g. 12500" keyboardType="decimal-pad" />
            <KambaInput label="Original price (₦, optional)" value={originalPrice} onChangeText={setOriginalPrice} placeholder="e.g. 15000" keyboardType="decimal-pad" />
            <KambaInput label="Stock quantity" value={stock} onChangeText={setStock} placeholder="0" keyboardType="number-pad" />
            <KambaInput label="Category" value={category} onChangeText={setCategory} placeholder="Fashion, food, electronics…" />
            <KambaInput label="Tags (comma-separated)" value={tags} onChangeText={setTags} placeholder="locally made, handmade…" />
            <TouchableOpacity style={styles.mediaButton} onPress={chooseMedia} disabled={saving}>
              <Text style={styles.mediaButtonText}>{media.length ? `${media.length} media file(s) selected` : 'Choose product images or videos'}</Text>
            </TouchableOpacity>
            {media.map((asset, index) => (
              <Text key={asset.assetId || asset.uri || index} style={styles.subtitle}>
                {asset.type === 'video' ? 'Video' : 'Image'}: {asset.fileName || `Selected file ${index + 1}`}
              </Text>
            ))}
            <KambaButton label="Create product" fullWidth loading={saving} onPress={createProduct} />
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loading}><ActivityIndicator color={colors.light.accent} /><Text style={styles.subtitle}>Loading products…</Text></View>
        ) : products.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No products yet</Text>
            <Text style={styles.subtitle}>Create your first product to start listing it on Kamba.</Text>
          </View>
        ) : products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            {product.images?.[0] ? <Image source={{ uri: product.images[0] }} style={styles.productImage} /> : <View style={styles.imagePlaceholder}><Text style={styles.subtitle}>No image</Text></View>}
            <View style={styles.productCopy}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.price}>{formatNaira(product.price)}</Text>
              <Text style={styles.subtitle}>{product.stock_quantity} in stock · {(product.videos || []).length} video(s)</Text>
              <TouchableOpacity onPress={() => archiveProduct(product)} style={styles.archiveButton}>
                <Text style={styles.archiveText}>Archive product</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize },
  subtitle: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  addButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.light.accent },
  addButtonText: { color: colors.light.onAccent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  error: { color: colors.light.error, backgroundColor: colors.light.errorSoft, padding: spacing.md, borderRadius: radius.md, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  card: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.light.border, backgroundColor: colors.light.surface },
  cardTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize },
  mediaButton: { borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  mediaButtonText: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  loading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  productCard: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.light.surface, borderWidth: 1, borderColor: colors.light.border },
  productImage: { width: 88, height: 88, borderRadius: radius.md, backgroundColor: colors.light.accentSoft },
  imagePlaceholder: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.light.accentSoft },
  productCopy: { flex: 1, gap: spacing.xs },
  productName: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  price: { color: colors.light.accent, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize },
  archiveButton: { alignSelf: 'flex-start', paddingVertical: spacing.xs },
  archiveText: { color: colors.light.error, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
});

export default VendorProductsScreen;
