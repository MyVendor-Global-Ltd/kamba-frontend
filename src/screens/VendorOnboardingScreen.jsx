import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, radius } from '../theme/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { KambaInput } from '../components/KambaInput';
import { KambaButton } from '../components/KambaButton';
import { authAPI, vendorAPI } from '../utils/api';
import { storage } from '../utils/storage';

const LOCATION_MODES = [
  { value: 'physical', label: 'Physical' },
  { value: 'service_area', label: 'Service area' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

const DEFAULT_STORE = {
  business_name: '',
  store_name: '',
  category: '',
  description: '',
  location_mode: 'physical',
  location_text: '',
  service_area_text: '',
  online_url: '',
  contact_whatsapp: '',
  same_as_business_address: false,
};

const DEFAULT_SERVICE = {
  business_name: '',
  service_title: '',
  category: '',
  description: '',
  price_range: '',
  location_mode: 'service_area',
  location_text: '',
  service_area_text: '',
  online_url: '',
  contact_preference: 'whatsapp',
  contact_whatsapp: '',
  same_as_business_address: false,
  fulfilment_options: ['customer_visit'],
};

const issueMessage = (error, fallback) =>
  error.response?.data?.error ||
  error.response?.data?.message ||
  error.message ||
  fallback;

export const VendorOnboardingScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eligibility, setEligibility] = useState(null);
  const [status, setStatus] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [vendorType, setVendorType] = useState('products');
  const [privateAddress, setPrivateAddress] = useState('');
  const [privateAddressSameAsBusiness, setPrivateAddressSameAsBusiness] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [locationPhotos, setLocationPhotos] = useState([]);
  const [storeForm, setStoreForm] = useState(DEFAULT_STORE);
  const [serviceForm, setServiceForm] = useState(DEFAULT_SERVICE);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [eligibilityData, statusData, profileResponse] = await Promise.all([
        vendorAPI.getOnboardingEligibility(),
        vendorAPI.getOnboardingStatus(),
        authAPI.getDashboard(),
      ]);
      const profile = profileResponse.data?.result;
      if (!profile?.id) throw new Error('Your authenticated profile could not be verified.');
      await storage.setUserData(profile);
      await storage.setUsername(profile.username || '');
      setEligibility(eligibilityData);
      setStatus(statusData);
      setPhone(profile.phone || '');
      if (statusData.vendor_type) setVendorType(statusData.vendor_type);
      return true;
    } catch (loadError) {
      setError(issueMessage(loadError, 'Could not load vendor onboarding. Check your connection and retry.'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    const unsubscribe = navigation.addListener('focus', () => { void loadStatus(); });
    return unsubscribe;
  }, [navigation, loadStatus]);

  const requestPhoneCode = async () => {
    if (!phone.trim()) {
      setError('Enter the Nigerian phone number you want to verify.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await authAPI.requestAccountPhoneVerification({ phone: phone.trim(), method: 'sms' });
      setOtpSent(true);
      setSuccess('Verification code sent. Enter the code to confirm your phone number.');
    } catch (requestError) {
      setError(issueMessage(requestError, 'Could not send a phone verification code.'));
    } finally {
      setSubmitting(false);
    }
  };

  const verifyPhoneCode = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the six-digit verification code.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await authAPI.verifyAccountPhone({ otp_code: otp.trim() });
      setOtp('');
      setOtpSent(false);
      await loadStatus();
      setSuccess('Phone number verified. Vendor eligibility has been refreshed.');
    } catch (verifyError) {
      setError(issueMessage(verifyError, 'Phone verification failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  const chooseSelfie = async () => {
    setError('');
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Camera permission is required to capture the vendor onboarding selfie.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
      base64: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    if (!asset.base64) {
      setError('The selected selfie could not be read. Please try again.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(asset.mimeType || 'image/jpeg')) {
      setError('Selfie must be JPEG, PNG or WebP.');
      return;
    }
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      setError('Selfie must be 5 MB or smaller.');
      return;
    }
    setSelfie(asset);
  };

  const submitSelfie = async () => {
    if (!selfie?.base64) {
      setError('Capture your selfie before continuing.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await vendorAPI.submitLiveness({
        image_base64: selfie.base64,
        mime_type: selfie.mimeType || 'image/jpeg',
        vendor_type: vendorType,
        home_address: privateAddress.trim(),
      });
      await loadStatus();
      setSelfie(null);
      setSuccess('Selfie submitted. Continue with your store or service profile.');
    } catch (submitError) {
      setError(issueMessage(submitError, 'Could not submit your selfie.'));
    } finally {
      setSubmitting(false);
    }
  };

  const createBasicVendorProfile = async () => {
    if (privateAddress.trim().length < 5) {
      setError('Enter your private residential address before continuing.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await vendorAPI.createBasicVendorProfile({ vendor_type: vendorType, home_address: privateAddress.trim() });
      await loadStatus();
      setSuccess('Vendor profile created. Continue with your store or service profile.');
    } catch (createError) {
      setError(issueMessage(createError, 'Could not create your vendor profile.'));
    } finally {
      setSubmitting(false);
    }
  };

  const savePrivateAddress = async () => {
    if (!privateAddressSameAsBusiness && privateAddress.trim().length < 5) {
      setError('Enter a valid private residential address.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await vendorAPI.updatePrivateAddress({
        home_address: privateAddress.trim(),
        same_as_business_address: privateAddressSameAsBusiness,
      });
      setSuccess('Private residential address updated.');
    } catch (saveError) {
      setError(issueMessage(saveError, 'Could not update your private address.'));
    } finally {
      setSubmitting(false);
    }
  };

  const updateStore = (key, value) => setStoreForm((current) => ({ ...current, [key]: value }));
  const updateService = (key, value) => setServiceForm((current) => ({ ...current, [key]: value }));

  const createStore = async () => {
    if (!storeForm.store_name.trim() || !storeForm.category.trim()) {
      setError('Store name and product category are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await vendorAPI.createStore({
        ...storeForm,
        home_address: privateAddress.trim(),
        business_name: storeForm.business_name.trim() || storeForm.store_name.trim(),
        store_name: storeForm.store_name.trim(),
        category: storeForm.category.trim(),
        description: storeForm.description.trim(),
      });
      const refreshed = await loadStatus();
      setSuccess(refreshed ? 'Store created. Continue with the next onboarding step.' : 'Store created, but status could not refresh. Tap Retry to continue.');
    } catch (createError) {
      setError(issueMessage(createError, 'Could not create the storefront.'));
    } finally {
      setSubmitting(false);
    }
  };

  const createService = async () => {
    if (!serviceForm.service_title.trim() || !serviceForm.category.trim()) {
      setError('Service title and category are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await vendorAPI.createServiceProfile({
        ...serviceForm,
        home_address: privateAddress.trim(),
        business_name: serviceForm.business_name.trim() || serviceForm.service_title.trim(),
        service_title: serviceForm.service_title.trim(),
        category: serviceForm.category.trim(),
        description: serviceForm.description.trim(),
        price_range: serviceForm.price_range.trim(),
      });
      const refreshed = await loadStatus();
      setSuccess(refreshed ? 'Service profile created.' : 'Service profile created, but status could not refresh. Tap Retry to continue.');
    } catch (createError) {
      setError(issueMessage(createError, 'Could not create the service profile.'));
    } finally {
      setSubmitting(false);
    }
  };

  const chooseLocationPhotos = async () => {
    setError('');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.85,
      base64: true,
    });
    if (result.canceled) return;
    const assets = result.assets || [];
    if (assets.length < 2 || assets.length > 6) {
      setError('Choose between 2 and 6 location photos.');
      return;
    }
    if (assets.some((asset) =>
      !asset.base64 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(asset.mimeType || 'image/jpeg') ||
      (asset.fileSize && asset.fileSize > 5 * 1024 * 1024)
    )) {
      setError('Every location photo must be JPEG, PNG or WebP and no larger than 5 MB.');
      return;
    }
    setLocationPhotos(assets);
  };

  const uploadPhotos = async () => {
    if (locationPhotos.length < 2 || locationPhotos.length > 6) {
      setError('Choose between 2 and 6 location photos.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const result = await vendorAPI.uploadLocationPhotos(locationPhotos.map((asset) => ({
        base64: asset.base64,
        mime_type: asset.mimeType || 'image/jpeg',
      })));
      if (!Number.isInteger(result.count) || result.count < 2) {
        throw new Error('The server did not confirm at least two uploaded location photos.');
      }
      await loadStatus();
      setLocationPhotos([]);
      setSuccess(`${result.count} location photos uploaded successfully.`);
    } catch (uploadError) {
      setError(issueMessage(uploadError, 'Could not upload location photos.'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderModeOptions = (form, update) => (
    <View style={styles.modeWrap}>
      {LOCATION_MODES.map((mode) => (
        <TouchableOpacity
          key={mode.value}
          onPress={() => update('location_mode', mode.value)}
          style={[styles.modeChip, form.location_mode === mode.value && styles.modeChipActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: form.location_mode === mode.value }}
        >
          <Text style={[styles.modeText, form.location_mode === mode.value && styles.modeTextActive]}>{mode.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLocationFields = (form, update) => (
    <View style={styles.formGroup}>
      {(form.location_mode === 'physical' || form.location_mode === 'hybrid') ? (
        <KambaInput label="Business location" value={form.location_text} onChangeText={(value) => update('location_text', value)} placeholder="Street, area, city and state" />
      ) : null}
      {(['service_area', 'mobile', 'hybrid'].includes(form.location_mode)) ? (
        <KambaInput label="Service area" value={form.service_area_text} onChangeText={(value) => update('service_area_text', value)} placeholder="Neighbourhoods or delivery coverage" />
      ) : null}
      {(['online', 'hybrid'].includes(form.location_mode)) ? (
        <KambaInput label="Online storefront URL" value={form.online_url} onChangeText={(value) => update('online_url', value)} placeholder="https://…" autoCapitalize="none" keyboardType="url" />
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <ScreenShell scrollable={false} padded bg={colors.light.background}>
        <View style={styles.state}><ActivityIndicator size="large" color={colors.light.accent} /><Text style={styles.muted}>Loading vendor onboarding…</Text></View>
      </ScreenShell>
    );
  }

  if (!status || !eligibility) {
    return (
      <ScreenShell scrollable={false} padded bg={colors.light.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Vendor onboarding</Text>
          <Text style={styles.error}>{error || 'We could not verify your onboarding status.'}</Text>
          <KambaButton label="Retry status check" fullWidth onPress={loadStatus} />
        </View>
      </ScreenShell>
    );
  }

  const stage = status.stage;

  return (
    <ScreenShell scrollable padded bg={colors.light.background}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>SELL OR OFFER SERVICES ON KAMBA</Text>
        <Text style={styles.title}>Vendor onboarding</Text>
        <Text style={styles.muted}>Complete the account and business steps. Verification remains pending until Kamba reviews your submission.</Text>

        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {success ? <Text accessibilityRole="alert" style={styles.success}>{success}</Text> : null}

        {(stage === 'not_eligible' || (stage === 'liveness_required' && !eligibility.eligible)) ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Complete these account requirements first</Text>
            {(eligibility.issues || []).map((issue) => (
              <Text key={issue.code} style={styles.muted}>• {issue.message}</Text>
            ))}
            {eligibility.issues?.some((issue) => issue.code === 'NO_USERNAME') ? (
              <KambaButton label="Complete account profile" fullWidth onPress={() => navigation.navigate('EditProfile')} />
            ) : null}
            {eligibility.issues?.some((issue) => issue.code === 'PHONE_NOT_VERIFIED') ? (
              <View style={styles.formGroup}>
                <KambaInput label="Nigerian phone number" value={phone} onChangeText={setPhone} placeholder="+234 801 234 5678" keyboardType="phone-pad" />
                {!otpSent ? (
                  <KambaButton label="Send verification code" fullWidth loading={submitting} onPress={requestPhoneCode} />
                ) : (
                  <>
                    <KambaInput label="Six-digit code" value={otp} onChangeText={setOtp} placeholder="000000" keyboardType="number-pad" />
                    <KambaButton label="Verify phone number" fullWidth loading={submitting} onPress={verifyPhoneCode} />
                    <TouchableOpacity onPress={requestPhoneCode} disabled={submitting}><Text style={styles.link}>Resend code</Text></TouchableOpacity>
                  </>
                )}
              </View>
            ) : null}
          </View>
        ) : null}

        {stage === 'vendor_profile_required' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create your vendor profile</Text>
            <Text style={styles.fieldLabel}>What will you offer on Kamba?</Text>
            <View style={styles.modeWrap}>
              {[
                { value: 'products', label: 'Products' },
                { value: 'services', label: 'Services' },
                { value: 'both', label: 'Both' },
              ].map((item) => (
                <TouchableOpacity key={item.value} onPress={() => setVendorType(item.value)} style={[styles.modeChip, vendorType === item.value && styles.modeChipActive]}>
                  <Text style={[styles.modeText, vendorType === item.value && styles.modeTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <KambaInput label="Private residential address" value={privateAddress} onChangeText={setPrivateAddress} placeholder="Your home address. Customers will not see this." />
            <Text style={styles.muted}>Stored separately from your public business location. It is not displayed to customers.</Text>
            <KambaButton label="Create vendor profile" fullWidth loading={submitting} disabled={privateAddress.trim().length < 5} onPress={createBasicVendorProfile} />
          </View>
        ) : null}

        {(stage === 'liveness_required' && eligibility.eligible) ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Selfie and vendor type</Text>
            <Text style={styles.muted}>Choose what you want to offer. Capture your own selfie; it is used for the vendor onboarding check.</Text>
            <View style={styles.modeWrap}>
              {[
                { value: 'products', label: 'Products' },
                { value: 'services', label: 'Services' },
                { value: 'both', label: 'Both' },
              ].map((item) => (
                <TouchableOpacity key={item.value} onPress={() => setVendorType(item.value)} style={[styles.modeChip, vendorType === item.value && styles.modeChipActive]}>
                  <Text style={[styles.modeText, vendorType === item.value && styles.modeTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <KambaButton label={selfie ? 'Retake selfie' : 'Capture selfie'} fullWidth onPress={chooseSelfie} />
            {selfie ? <Text style={styles.muted}>Selfie captured and ready to submit.</Text> : null}
            <KambaButton label="Submit selfie and continue" fullWidth loading={submitting} disabled={!selfie} onPress={submitSelfie} />
          </View>
        ) : null}

        {stage === 'liveness_done' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vendor profile needs attention</Text>
            <Text style={styles.muted}>Your liveness step is recorded, but the vendor profile is missing. Contact Kamba support before trying to create a store or service profile.</Text>
          </View>
        ) : null}

        {stage === 'profile_setup' && status.next_step === 'create_store' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create your storefront</Text>
            <KambaInput label="Business name (optional)" value={storeForm.business_name} onChangeText={(value) => updateStore('business_name', value)} placeholder="Business name" />
            <KambaInput label="Store name" value={storeForm.store_name} onChangeText={(value) => updateStore('store_name', value)} placeholder="Store name" />
            <KambaInput label="Product category" value={storeForm.category} onChangeText={(value) => updateStore('category', value)} placeholder="Fashion, electronics, home…" />
            <KambaInput label="Description" value={storeForm.description} onChangeText={(value) => updateStore('description', value)} placeholder="Describe your store" multiline />
            <Text style={styles.fieldLabel}>Business location type</Text>
            {renderModeOptions(storeForm, updateStore)}
            {renderLocationFields(storeForm, updateStore)}
            <TouchableOpacity onPress={() => updateStore('same_as_business_address', !storeForm.same_as_business_address)} style={styles.modeChip}><Text style={styles.modeText}>{storeForm.same_as_business_address ? '✓ ' : ''}My home address is the same as this business address</Text></TouchableOpacity>
            <KambaInput label="Business WhatsApp number (optional)" value={storeForm.contact_whatsapp} onChangeText={(value) => updateStore('contact_whatsapp', value)} placeholder="+234…" keyboardType="phone-pad" />
            <KambaButton label="Create storefront" fullWidth loading={submitting} onPress={createStore} />
          </View>
        ) : null}

        {stage === 'profile_setup' && status.next_step === 'create_service' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create your service profile</Text>
            <KambaInput label="Business name (optional)" value={serviceForm.business_name} onChangeText={(value) => updateService('business_name', value)} placeholder="Business name" />
            <KambaInput label="Service title" value={serviceForm.service_title} onChangeText={(value) => updateService('service_title', value)} placeholder="What service do you provide?" />
            <KambaInput label="Service category" value={serviceForm.category} onChangeText={(value) => updateService('category', value)} placeholder="Repairs, cleaning, photography…" />
            <KambaInput label="Description" value={serviceForm.description} onChangeText={(value) => updateService('description', value)} placeholder="Describe your service" multiline />
            <KambaInput label="Price range (optional)" value={serviceForm.price_range} onChangeText={(value) => updateService('price_range', value)} placeholder="From ₦15,000" />
            <Text style={styles.fieldLabel}>Business location type</Text>
            {renderModeOptions(serviceForm, (key, value) => { updateService(key, value); if (key === 'location_mode') updateService('fulfilment_options', value === 'physical' ? ['on_site'] : value === 'online' ? ['online'] : value === 'hybrid' ? ['on_site', 'customer_visit', 'online'] : ['customer_visit']); })}
            {renderLocationFields(serviceForm, updateService)}
            <Text style={styles.fieldLabel}>Preferred contact method</Text>
            <View style={styles.modeWrap}>
              {[
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'call', label: 'Phone call' },
                { value: 'both', label: 'Both' },
              ].map((item) => (
                <TouchableOpacity key={item.value} onPress={() => updateService('contact_preference', item.value)} style={[styles.modeChip, serviceForm.contact_preference === item.value && styles.modeChipActive]}>
                  <Text style={[styles.modeText, serviceForm.contact_preference === item.value && styles.modeTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Service fulfilment</Text>
            <View style={styles.modeWrap}>
              {[
                { value: 'on_site', label: 'At my location' },
                { value: 'customer_visit', label: 'I visit customers' },
                { value: 'online', label: 'Online' },
                { value: 'automated', label: 'Automated' },
              ].map((item) => {
                const selected = serviceForm.fulfilment_options.includes(item.value);
                return <TouchableOpacity key={item.value} onPress={() => updateService('fulfilment_options', selected ? serviceForm.fulfilment_options.filter((value) => value !== item.value) : [...serviceForm.fulfilment_options, item.value])} style={[styles.modeChip, selected && styles.modeChipActive]}><Text style={[styles.modeText, selected && styles.modeTextActive]}>{item.label}</Text></TouchableOpacity>;
              })}
            </View>
            <TouchableOpacity onPress={() => updateService('same_as_business_address', !serviceForm.same_as_business_address)} style={styles.modeChip}><Text style={styles.modeText}>{serviceForm.same_as_business_address ? '✓ ' : ''}My home address is the same as this business address</Text></TouchableOpacity>
            <KambaInput label="Business WhatsApp number (optional)" value={serviceForm.contact_whatsapp} onChangeText={(value) => updateService('contact_whatsapp', value)} placeholder="+234…" keyboardType="phone-pad" />
            <KambaButton label="Create service profile" fullWidth loading={submitting} onPress={createService} />
          </View>
        ) : null}

        {(stage === 'profile_setup' || stage === 'complete') ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Private residential address</Text>
            <KambaInput label="Home address" value={privateAddress} onChangeText={setPrivateAddress} placeholder="Your private residential address" />
            <TouchableOpacity onPress={() => setPrivateAddressSameAsBusiness((value) => !value)} style={styles.modeChip}>
              <Text style={styles.modeText}>{privateAddressSameAsBusiness ? '✓ ' : ''}My home address is the same as my business address</Text>
            </TouchableOpacity>
            <Text style={styles.muted}>This address is private and is never shown on your public store or service profile.</Text>
            <KambaButton label="Save private address" fullWidth loading={submitting} disabled={!privateAddressSameAsBusiness && privateAddress.trim().length < 5} onPress={savePrivateAddress} />
          </View>
        ) : null}

        {stage === 'complete' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vendor profile submitted</Text>
            <Text style={styles.muted}>Your vendor profile is created. Verification is pending until Kamba reviews the submitted information.</Text>
            {status.vendor_type !== 'services' && !status.location_photos_uploaded ? (
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>Upload 2–6 store location photos</Text>
                <KambaButton label={locationPhotos.length ? `${locationPhotos.length} photos selected` : 'Choose location photos'} fullWidth onPress={chooseLocationPhotos} />
                <KambaButton label="Upload location photos" fullWidth loading={submitting} disabled={locationPhotos.length < 2} onPress={uploadPhotos} />
              </View>
            ) : null}
            <KambaButton label="Done" fullWidth onPress={() => navigation.goBack()} />
          </View>
        ) : null}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xxl },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  eyebrow: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, letterSpacing: 1 },
  title: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.headline, fontSize: typography.scale.headlineMedium.fontSize },
  muted: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize, lineHeight: typography.scale.bodySmall.lineHeight },
  error: { color: colors.light.error, backgroundColor: colors.light.errorSoft, padding: spacing.md, borderRadius: radius.md, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  success: { color: colors.light.success, backgroundColor: colors.light.successSoft, padding: spacing.md, borderRadius: radius.md, fontFamily: typography.fontFamilies.body, fontSize: typography.scale.bodySmall.fontSize },
  card: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.lg, backgroundColor: colors.light.surface },
  cardTitle: { color: colors.light.textPrimary, fontFamily: typography.fontFamilies.title, fontSize: typography.scale.titleLarge.fontSize },
  formGroup: { gap: spacing.md },
  fieldLabel: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelMedium.fontSize },
  modeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  modeChip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.light.border, borderRadius: radius.full, backgroundColor: colors.light.surface },
  modeChipActive: { borderColor: colors.light.accent, backgroundColor: colors.light.accentSoft },
  modeText: { color: colors.light.textSecondary, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize },
  modeTextActive: { color: colors.light.accent, fontWeight: '700' },
  link: { color: colors.light.accent, fontFamily: typography.fontFamilies.label, fontSize: typography.scale.labelSmall.fontSize, paddingVertical: spacing.sm },
});

export default VendorOnboardingScreen;
