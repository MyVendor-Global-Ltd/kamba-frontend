import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';
import { ChevronRight, ShieldCheck, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows, animation } from '../../theme';
import { KambaButton } from '../../components/KambaButton';
import { AnimatedText } from '../../components/AnimatedText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── SLIDE 1: GLOBE COMPONENT ──────────────────────────────────────
const AnimatedGlobe = () => {
  const arcAnim1 = useRef(new Animated.Value(0)).current;
  const arcAnim2 = useRef(new Animated.Value(0)).current;
  const arcAnim3 = useRef(new Animated.Value(0)).current;
  const arcAnim4 = useRef(new Animated.Value(0)).current;
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered arc drawing animations (looping)
    const runArcs = () => {
      arcAnim1.setValue(0);
      arcAnim2.setValue(0);
      arcAnim3.setValue(0);
      arcAnim4.setValue(0);

      Animated.stagger(300, [
        Animated.timing(arcAnim1, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
        Animated.timing(arcAnim2, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
        Animated.timing(arcAnim3, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
        Animated.timing(arcAnim4, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
      ]).start(() => {
        setTimeout(runArcs, 1200);
      });
    };

    // Staggered pulse rings
    const makePulse = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 1500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    };

    runArcs();
    makePulse(pulseAnim1, 0);
    makePulse(pulseAnim2, 500);
    makePulse(pulseAnim3, 900);
  }, []);

  const size = Math.min(SCREEN_WIDTH * 0.78, 300);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;

  // Pulse rings scale and opacity
  const pulseScale1 = pulseAnim1.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] });
  const pulseOpacity1 = pulseAnim1.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0] });
  const pulseScale2 = pulseAnim2.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] });
  const pulseOpacity2 = pulseAnim2.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0] });
  const pulseScale3 = pulseAnim3.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] });
  const pulseOpacity3 = pulseAnim3.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0] });

  // Coordinates of university/city hubs on the mini globe
  const p1 = { x: cx - r * 0.55, y: cy + r * 0.15 };  // e.g. Lagos / UNILAG
  const p2 = { x: cx + r * 0.45, y: cy - r * 0.1 };   // e.g. Enugu / UNN
  const p3 = { x: cx - r * 0.2, y: cy - r * 0.5 };    // e.g. Ibadan / UI
  const p4 = { x: cx + r * 0.2, y: cy + r * 0.55 };   // e.g. Port Harcourt / Uniport
  const p5 = { x: cx - r * 0.6, y: cy - r * 0.3 };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Dim coral radial glow behind globe */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: (size * 0.9) / 2,
          backgroundColor: colors.coralDim,
          opacity: 0.6,
        }}
      />

      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.45" />
            <Stop offset="85%" stopColor="#0A0E1A" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#0A0E1A" stopOpacity="1" />
          </RadialGradient>
        </Defs>

        {/* Globe body */}
        <Circle cx={cx} cy={cy} r={r} fill="url(#globeGlow)" stroke={colors.inkBorder} strokeWidth={1.5} />

        {/* Longitude lines */}
        <Path
          d={`M ${cx} ${cy - r} A ${r * 0.4} ${r} 0 0 1 ${cx} ${cy + r}`}
          fill="none"
          stroke={colors.inkBorder}
          strokeWidth={1}
        />
        <Path
          d={`M ${cx} ${cy - r} A ${r * 0.4} ${r} 0 0 0 ${cx} ${cy + r}`}
          fill="none"
          stroke={colors.inkBorder}
          strokeWidth={1}
        />
        <Path
          d={`M ${cx} ${cy - r} L ${cx} ${cy + r}`}
          fill="none"
          stroke={colors.inkBorder}
          strokeWidth={1}
        />

        {/* Latitude lines */}
        <Path
          d={`M ${cx - r * 0.92} ${cy - r * 0.38} A ${r} ${r * 0.3} 0 0 1 ${cx + r * 0.92} ${cy - r * 0.38}`}
          fill="none"
          stroke={colors.inkBorder}
          strokeWidth={1}
        />
        <Path
          d={`M ${cx - r} ${cy} A ${r} ${r * 0.35} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={colors.inkBorder}
          strokeWidth={1}
        />
        <Path
          d={`M ${cx - r * 0.92} ${cy + r * 0.38} A ${r} ${r * 0.3} 0 0 1 ${cx + r * 0.92} ${cy + r * 0.38}`}
          fill="none"
          stroke={colors.inkBorder}
          strokeWidth={1}
        />

        {/* Trajectory Arcs connecting hubs */}
        <Path
          d={`M ${p1.x} ${p1.y} Q ${cx - 10} ${cy - 40} ${p2.x} ${p2.y}`}
          fill="none"
          stroke={colors.coral}
          strokeWidth={2}
          strokeDasharray="180"
          strokeDashoffset={180}
          strokeLinecap="round"
          opacity={0.85}
        />
        <Path
          d={`M ${p3.x} ${p3.y} Q ${cx + 20} ${cy - 10} ${p4.x} ${p4.y}`}
          fill="none"
          stroke={colors.gold}
          strokeWidth={1.75}
          strokeDasharray="190"
          strokeDashoffset={190}
          strokeLinecap="round"
          opacity={0.7}
        />
        <Path
          d={`M ${p5.x} ${p5.y} Q ${cx - 20} ${cy + 30} ${p1.x} ${p1.y}`}
          fill="none"
          stroke={colors.coral}
          strokeWidth={1.5}
          strokeDasharray="140"
          strokeDashoffset={140}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d={`M ${p3.x} ${p3.y} Q ${cx - 50} ${cy - 10} ${p5.x} ${p5.y}`}
          fill="none"
          stroke={colors.gold}
          strokeWidth={1.5}
          strokeDasharray="120"
          strokeDashoffset={120}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Hub dots */}
        <Circle cx={p1.x} cy={p1.y} r={4.5} fill={colors.coral} />
        <Circle cx={p2.x} cy={p2.y} r={4} fill={colors.gold} />
        <Circle cx={p3.x} cy={p3.y} r={3.5} fill={colors.coral} />
        <Circle cx={p4.x} cy={p4.y} r={4} fill={colors.coral} />
        <Circle cx={p5.x} cy={p5.y} r={3} fill={colors.gold} />
      </Svg>

      {/* Pulsing rings overlaid on top of p1, p2, p3 */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: p1.x - 10,
          top: p1.y - 10,
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: colors.coral,
          transform: [{ scale: pulseScale1 }],
          opacity: pulseOpacity1,
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: p2.x - 10,
          top: p2.y - 10,
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: colors.gold,
          transform: [{ scale: pulseScale2 }],
          opacity: pulseOpacity2,
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: p4.x - 10,
          top: p4.y - 10,
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: colors.coral,
          transform: [{ scale: pulseScale3 }],
          opacity: pulseOpacity3,
        }}
      />
    </View>
  );
};

// ── SLIDE 2: 3D STACKED STORE CARDS ───────────────────────────────
const StackedStoreCards = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const stores = [
    {
      name: "Tariq's Campus Kicks",
      campus: 'UNILAG • New Hall',
      rating: '4.9 (184)',
      tag: 'Sneakers & Streetwear',
      items: ['Air Force 1', 'Dunk Low', 'Campus Tee'],
      rotate: '6deg',
      translateX: 24,
      translateY: 28,
      zIndex: 1,
      opacity: 0.5,
      glow: false,
    },
    {
      name: "Chisom's Tech Hub",
      campus: 'UNN • Hilltop',
      rating: '5.0 (312)',
      tag: 'Gadgets & Laptops',
      items: ['MacBook Air M1', 'Sony XM4', 'MagSafe Bank'],
      rotate: '-4deg',
      translateX: -16,
      translateY: 12,
      zIndex: 2,
      opacity: 0.75,
      glow: false,
    },
    {
      name: "Ada's Campus Kitchen",
      campus: 'MOUAU • Umudike',
      rating: '4.95 (420)',
      tag: 'Hot Bowls • Ready 15m',
      items: ['Smokey Jollof', 'Ofada Combo', 'Asun Pack'],
      rotate: '0deg',
      translateX: 0,
      translateY: 0,
      zIndex: 3,
      opacity: 1,
      glow: true,
    },
  ];

  return (
    <Animated.View
      style={{
        width: SCREEN_WIDTH - 64,
        height: 240,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: floatY }],
      }}
    >
      {stores.map((s, idx) => (
        <View
          key={idx}
          style={{
            position: 'absolute',
            width: SCREEN_WIDTH - 96,
            backgroundColor: colors.inkRaised,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: s.glow ? 'rgba(255,107,71,0.45)' : colors.inkBorder,
            padding: spacing.base,
            zIndex: s.zIndex,
            opacity: s.opacity,
            transform: [
              { rotateZ: s.rotate },
              { translateX: s.translateX },
              { translateY: s.translateY },
            ],
            shadowColor: s.glow ? colors.coral : '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: s.glow ? 0.35 : 0.3,
            shadowRadius: s.glow ? 24 : 12,
            elevation: s.glow ? 12 : 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.md,
                  backgroundColor: colors.coralDim,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: typography.fontFamilies.displayHeavy, color: colors.coral, fontSize: 13 }}>
                  {s.name.charAt(0)}
                </Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text
                    style={{
                      fontFamily: typography.fontFamilies.display,
                      fontSize: 14,
                      color: colors.textPrimary,
                    }}
                    numberOfLines={1}
                  >
                    {s.name}
                  </Text>
                  <ShieldCheck size={14} color={colors.gold} strokeWidth={2.5} />
                </View>
                <Text
                  style={{
                    fontFamily: typography.fontFamilies.body,
                    fontSize: 11,
                    color: colors.textSecondary,
                  }}
                >
                  {s.campus}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.goldDim,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: radius.full,
              }}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamilies.bodySemiBold,
                  fontSize: 10,
                  color: colors.gold,
                }}
              >
                ★ {s.rating}
              </Text>
            </View>
          </View>

          {/* Product thumbnail chips */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.sm }}>
            {s.items.map((it, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: radius.sm,
                  borderWidth: 1,
                  borderColor: colors.inkBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamilies.body,
                    fontSize: 10,
                    color: colors.textSecondary,
                  }}
                >
                  {it}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </Animated.View>
  );
};

// ── SLIDE 3: ACTIVITY FEED / BANDWAGON COMPONENT ──────────────────
const ActivityFeed = () => {
  const events = [
    { user: 'Chidi', action: 'just bought from', target: "Chisom's Tech Hub", time: 'Just now', dot: colors.coral },
    { user: 'New Store', action: 'opened:', target: "Ada's Kitchen, Umudike", time: '2m ago', dot: colors.gold },
    { user: '47 students', action: 'near you are active on', target: 'Kamba', time: 'Campus Live', dot: colors.success },
    { user: 'Emeka', action: 'rated 5.0 for', target: "Tariq's Campus Kicks", time: '4m ago', dot: colors.coral },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeout;
    const runCycle = () => {
      slideAnim.setValue(40);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, damping: 16, stiffness: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        timeout = setTimeout(() => {
          Animated.parallel([
            Animated.timing(slideAnim, { toValue: -30, duration: 250, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
          ]).start(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
          });
        }, 1600);
      });
    };

    runCycle();
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const current = events[currentIndex];

  return (
    <View style={{ width: SCREEN_WIDTH - 64, height: 200, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background radial glow */}
      <View
        style={{
          position: 'absolute',
          width: 200,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.coralDim,
          opacity: 0.5,
        }}
      />

      {/* Pill: Campus pulse */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: colors.inkRaised,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: colors.inkBorder,
          marginBottom: spacing.md,
        }}
      >
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success }} />
        <Text style={{ fontFamily: typography.fontFamilies.mono, fontSize: 10, color: colors.gold, letterSpacing: 1.5 }}>
          CAMPUS LIVE ACTIVITY
        </Text>
      </View>

      <Animated.View
        style={{
          width: '100%',
          backgroundColor: colors.inkRaised,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.coralGlow,
          padding: spacing.base,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
          shadowColor: colors.coral,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 18,
          elevation: 8,
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: current.dot,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: typography.fontFamilies.body, fontSize: 13, color: colors.textSecondary }}>
            <Text style={{ fontFamily: typography.fontFamilies.bodySemiBold, color: colors.textPrimary }}>
              {current.user}{' '}
            </Text>
            {current.action}{' '}
            <Text style={{ fontFamily: typography.fontFamilies.bodySemiBold, color: colors.coral }}>
              {current.target}
            </Text>
          </Text>
        </View>
        <Text style={{ fontFamily: typography.fontFamilies.mono, fontSize: 10, color: colors.textTertiary }}>
          {current.time}
        </Text>
      </Animated.View>
    </View>
  );
};

// ── MAIN ONBOARDING SCREEN ─────────────────────────────────────────
export const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const dotWidths = [
    useRef(new Animated.Value(24)).current,
    useRef(new Animated.Value(6)).current,
    useRef(new Animated.Value(6)).current,
  ];

  const animateDots = (targetIndex) => {
    dotWidths.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === targetIndex ? 24 : 6,
        ...animation.spring,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleScroll = (e) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slide !== activeIndex && slide >= 0 && slide < 3) {
      setActiveIndex(slide);
      animateDots(slide);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < 2) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      navigation.navigate('Register');
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Register');
  };

  const slides = [
    {
      key: 'slide1',
      tag: 'HYPERLOCAL MARKETPLACE',
      headline: 'Your area has more\nto offer than you know.',
      body: 'Kamba connects buyers with sellers right in their community. No shipping. No strangers. Just your area.',
      renderVisual: () => <AnimatedGlobe />,
    },
    {
      key: 'slide2',
      tag: 'VERIFIED ON CAMPUS',
      headline: 'Every store you see\nis real and verified.',
      body: "We check who's selling before they appear on Kamba. Your money stays safe until you confirm delivery.",
      renderVisual: () => <StackedStoreCards />,
    },
    {
      key: 'slide3',
      tag: 'THE CULTURE',
      headline: 'Join the marketplace\nyour campus is building.',
      body: 'Something is happening in your area. Get in early.',
      renderVisual: () => <ActivityFeed />,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={{ width: 44 }} />
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{ flex: 1 }}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            {/* Top 55%: Visual area */}
            <View style={styles.visualContainer}>{item.renderVisual()}</View>

            {/* Bottom 45%: Text content */}
            <View style={styles.textContainer}>
              <Text style={styles.tagText}>{item.tag}</Text>
              <Text style={styles.headlineText}>{item.headline}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>

              {/* CTAs strictly on Slide 3 */}
              {index === 2 && (
                <View style={styles.slide3Actions}>
                  <KambaButton
                    label="Let's go →"
                    variant="primary"
                    fullWidth
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.navigate('Register');
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.navigate('Login');
                    }}
                    style={styles.alreadyAccountButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.alreadyAccountText}>I already have an account</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      />

      {/* Bottom Controls (Dots + Next Arrow, hidden when slide 3 has full CTAs) */}
      <View style={styles.bottomBar}>
        <View style={styles.dotsRow}>
          {dotWidths.map((wAnim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: wAnim,
                  backgroundColor: i === activeIndex ? colors.coral : 'rgba(255,255,255,0.12)',
                },
              ]}
            />
          ))}
        </View>

        {activeIndex < 2 && (
          <TouchableOpacity
            onPress={handleNext}
            style={styles.arrowButton}
            activeOpacity={0.85}
          >
            <ChevronRight size={22} color={colors.coral} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
    zIndex: 10,
  },
  skipText: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: typography.scale.bodySmall.fontSize,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  visualContainer: {
    height: SCREEN_HEIGHT * 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.base,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'flex-start',
  },
  tagText: {
    fontFamily: typography.fontFamilies.mono,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  headlineText: {
    fontFamily: typography.fontFamilies.display,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.md,
  },
  bodyText: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.scale.bodyMedium.fontSize,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  slide3Actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  alreadyAccountButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  alreadyAccountText: {
    fontFamily: typography.fontFamilies.bodyMedium,
    fontSize: typography.scale.bodySmall.fontSize,
    color: colors.coral,
  },
  bottomBar: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.coralDim,
    borderWidth: 1,
    borderColor: 'rgba(255,107,71,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingScreen;
