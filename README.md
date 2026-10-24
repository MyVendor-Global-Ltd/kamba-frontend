<div align="center">

# Kamba Mobile App

[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-58-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-000000?style=for-the-badge&logo=android&logoColor=green)](https://expo.dev)
[![Language](https://img.shields.io/badge/Language-JavaScript%20(ES2022)-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-Proprietary%20(Source%20Available)-FF6B47?style=for-the-badge)](./LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://expo.dev)
[![Architecture](https://img.shields.io/badge/Architecture-Hooks%20Only-FF6B47?style=for-the-badge)](https://react.dev/learn)

</div>

---

## 🎯 Project Overview

**Kamba** is a hyperlocal marketplace built specifically for Nigerian university students. Every pixel, animation, and micro-interaction is designed with cultural intentionality — not a generic template.

> **Current Status**: **Day 1 Complete** — Project setup, design system, reusable component library, full auth flow (7 screens), and main tab navigation scaffold. Ready for Expo Go testing.

---

## 🎨 Design System

### Color Palette (Zero Generic Greens)
| Token | Hex | Purpose |
|-------|-----|---------|
| `--ink` | `#0A0E1A` | Deep night — main background |
| `--ink-raised` | `#111827` | Cards, elevated surfaces |
| `--coral` | `#FF6B47` | **Primary** — Nigerian warmth, energy |
| `--coral-dim` | `rgba(255,107,71,0.12)` | Tinted surfaces |
| `--coral-glow` | `rgba(255,107,71,0.25)` | Glow shadows |
| `--navy` | `#1E3A5F` | Depth, trust, structure |
| `--gold` | `#FFD23F` | Premium accent, highlights |
| `--text-primary` | `#F8FAFC` | Primary text |
| `--text-secondary` | `rgba(248,250,252,0.55)` | Muted text |
| `--text-tertiary` | `rgba(248,250,252,0.3)` | Very muted |

### Typography
| Role | Font | Weights |
|------|------|---------|
| Display/Headlines | **Space Grotesk** | 700, 800 |
| Body/UI | **Plus Jakarta Sans** | 400, 500, 600 |
| Monospace (OTP, username) | Platform native | — |

---

## 📱 Screens Implemented (Day 1)

### Auth Flow (7 screens)
| Screen | Key Features |
|--------|--------------|
| **SplashScreen** | Logo scale entrance (0.4→1), wordmark, tagline, pulsing dots, 2.4s auth check |
| **OnboardingScreen** | 3 slides: Animated SVG Globe (arcs + pulse rings), 3D Stacked Store Cards (float), Activity Feed (bandwagon notifications) |
| **RegisterScreen** | Social auth first (Google/Phone), email/password/confirm/referral (?r= param), staggered entrance |
| **UsernameScreen** | Ritual feel: @ prefix + unified input bar, debounced availability (1200ms), suggestions when taken |
| **PhoneVerifyScreen** | Fixed 🇳🇬 +234, WhatsApp/SMS method cards with spring selection |
| **OTPScreen** | 6-digit boxes (hidden TextInput), 60s countdown, success checkmark, wrong code = shake |
| **LoginScreen** | 3-tab switcher (Email/Phone/Google) with sliding indicator, forgot password |

### Main Tabs (5 placeholders)
- **Home** — Greeting, hot campus drop (GlowCard), verified sellers horizontal scroll
- **Search** — Campus search entry point
- **Orders** — Local delivery tracking
- **Notifications** — Campus updates feed
- **Profile** — Verified badge, logout

---

## 🧱 Component Library (9 reusable components)

| Component | Description |
|-----------|-------------|
| `KambaLogo` | Custom SVG bag icon + "kamba" wordmark (Space Grotesk 800) |
| `KambaButton` | 4 variants (primary/secondary/ghost/outline-coral), spring press (scale 1→0.96→1.03→1), haptics, custom spinner |
| `KambaInput` | Animated floating label, focus/error/success states, shake on error, secure toggle |
| `KambaOTPInput` | 6-digit boxes, single hidden TextInput, auto-advance, paste fill, gold underline on filled |
| `KambaPhoneInput` | Fixed 🇳🇬 +234 prefix with 10-digit input |
| `ScreenShell` | SafeAreaView + KeyboardAwareScrollView wrapper |
| `AnimatedText` | Word-by-word stagger entrance (configurable delay/direction) |
| `GlowCard` | Entrance animation (0.95→1), dynamic glow shadow prop |
| `SocialAuthButton` | Google (full-color SVG), WhatsApp, Phone, SMS — secondary variant |
| `UsernameAvailability` | Inline checking/available/taken with spring animations |

---

## 🗺 Navigation Architecture

```
RootStack (no header)
├── Splash → (auto-navigate based on token/username)
├── AuthStack
│   ├── Onboarding
│   ├── Register
│   ├── Username
│   ├── PhoneVerify
│   ├── OTP
│   └── Login
└── MainTabs (BottomTabs)
    ├── Home
    ├── Search
    ├── Orders
    ├── Notifications
    └── Profile
```

**Transitions**: Spring (`damping: 22, stiffness: 200` open / `damping: 26, stiffness: 200` close)

---

## ⚡ Quick Start

```bash
# Clone & enter
cd kamba-mobile

# Clean install (required for Expo SDK 58)
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Start Metro bundler
npx expo start --clear

# Scan QR code with Expo Go (iOS/Android)
```

### Requirements
- Node.js 18+
- npm 9+
- Expo Go app on physical device (recommended) or simulator
- **No Android Studio required** — pure Expo managed workflow

---

## 📂 Project Structure

```
kamba-mobile/
├── App.js                      # Entry: font loading + navigator
├── app.json                    # Expo config (dark, #0A0E1A bg)
├── babel.config.js             # Standard expo preset (NO reanimated plugin)
├── package.json
├── .gitignore
├── LICENSE                     # Proprietary Source-Available
├── README.md
├── src/
│   ├── theme/index.js          # ALL design tokens (colors, type, spacing, radius, shadows, animation)
│   ├── components/             # 9 reusable components (built FIRST)
│   ├── screens/
│   │   ├── auth/               # 7 auth screens
│   │   ├── HomeScreen.jsx
│   │   ├── SearchScreen.jsx
│   │   ├── OrdersScreen.jsx
│   │   ├── NotificationsScreen.jsx
│   │   └── ProfileScreen.jsx
│   ├── navigation/index.js     # Root/Auth/Main stacks
│   └── utils/
│       ├── storage.js          # SecureStore + AsyncStorage
│       ├── api.js              # Axios + auth interceptors
│       ├── username.js         # Validation, suggestions, formatting
│       └── format.js           # Phone, currency (₦)
└── assets/
```

---

## 🔒 License

**Proprietary — Source Available (No Replication)**

This codebase is the intellectual property of **Kamba**. You may view, study, and learn from the source code. You may **not**:
- Copy, fork, or replicate this codebase for any commercial or non-commercial product
- Redistribute any portion of this code
- Create derivative works
- Use the design system, component patterns, or animations in other projects

See [LICENSE](./LICENSE) for full terms.

---

## 🎬 Demo

<div align="center">

### Day 1 Walkthrough (Placeholder)

[![Kamba Mobile App Demo](https://img.shields.io/badge/▶_Watch_Demo-Video-FF6B47?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/placeholder-kamba-demo)

> **Demo video will be embedded here** showing:
> - Splash → Onboarding (3 slides with live animations)
> - Register → Username (ritual + availability check)
> - PhoneVerify → OTP (countdown + success)
> - Login (3-tab switcher)
> - Home tab (GlowCard drop, seller scroll)

</div>

---

## 🛠 Tech Stack Decisions

| Decision | Rationale |
|----------|-----------|
| **Expo Managed** | No Android Studio/Xcode needed; instant Expo Go preview |
| **Plain JavaScript** | Faster iteration, zero build config, team accessibility |
| **Hooks Only** | Modern React, no class component debt |
| **Native `Animated` API** | 60fps guaranteed, zero third-party deps, smaller bundle |
| **No Reanimated** | Spec explicitly forbids "third party" animation libs |
| **`lucide-react-native` + Custom SVG** | Zero emojis, full control, consistent stroke weights |
| **`expo-linear-gradient`** | Native gradient buttons (primary variant) |
| **`expo-haptics`** | Every interactive element has tactile feedback |
| **`react-native-keyboard-aware-scroll-view`** | Reliable keyboard avoidance on both platforms |

---

## 📋 Day 1 Definition of Done ✅

- [x] App runs on iOS + Android via Expo Go
- [x] Splash → Onboarding → Register → Username → PhoneVerify → OTP → Home all connect
- [x] Login flow works independently (3 tabs)
- [x] Token check on launch routes correctly (Main / Username / Auth)
- [x] Referral code `?r=` auto-fills + locks field
- [x] Username availability debounced (1200ms)
- [x] All animations smooth (60fps native Animated)
- [x] No TypeScript (plain JS only)
- [x] No red/yellow console warnings
- [x] Fonts load before first render (SplashScreen.preventAutoHideAsync)
- [x] Keyboard handling works on both platforms
- [x] Haptics fire on every interactive element

---

## 🗓 Roadmap (Next)

| Day | Focus |
|-----|-------|
| **Day 2** | Home feed: infinite scroll, store cards, product grid, pull-to-refresh |
| **Day 3** | Search: filters, geolocation, recent searches, empty states |
| **Day 4** | Orders: real-time tracking, dropoff codes, chat with seller |
| **Day 5** | Notifications: deep links, grouping, preferences |
| **Day 6** | Profile: settings, verification, wallet, referral history |
| **Day 7** | Polish: micro-interactions, error boundaries, analytics, crash reporting |

---

## 🤝 Contributing

This is a **closed-source, proprietary** project. External contributions are not accepted at this time.

---

<div align="center">

**Built with 🧡 for Nigerian university students**

*Kamba — Your area has more to offer than you know.*

</div>