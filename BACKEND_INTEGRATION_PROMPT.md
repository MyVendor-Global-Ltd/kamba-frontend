# Backend Integration Prompt — Kamba Mobile App

## Overview

This document outlines the API contracts the Kamba mobile frontend expects from the backend. The frontend is complete and ready to connect — the backend needs to implement the missing endpoints listed below.

**Constraint**: Do not modify the frontend. Only implement backend endpoints.

---

## Frontend Base URL Configuration

The mobile app reads `EXPO_PUBLIC_API_URL` from environment config. Default: `https://api.kamba.ng`

All requests are made to: `{API_BASE_URL}/api/v1` (or `{API_BASE_URL}/api` depending on config)

**Cookie-based auth**: All requests use `withCredentials: true`. Backend must set HttpOnly cookies (`access_token`, `refresh_token`) via credentialed CORS.

---

## ✅ Already Compatible — No Backend Changes Needed

These endpoints already match existing frontend calls:

| Method | Endpoint | Frontend Usage |
|--------|----------|----------------|
| POST | `/auth/register` | Email/password registration |
| POST | `/auth/register/phone` | Phone registration |
| POST | `/auth/login` | Email login |
| POST | `/auth/login/phone` | Phone login |
| POST | `/auth/verify/phone` | Phone OTP verification |
| POST | `/auth/login/phone/verify` | Phone OTP login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout (clears HttpOnly cookies) |
| POST | `/auth/otp/request` | Request OTP for phone |
| POST | `/auth/otp/verify` | Verify OTP |
| POST | `/auth/otp/resend` | Resend OTP |
| POST | `/auth/username/set` | Set username (3-16 chars, @prefix) |
| GET | `/auth/dashboard` | Dashboard data (buyer/vendor info) |
| GET | `/vendors/stores` | List all stores (public) |
| GET | `/vendors/stores/:slug` | Get store details (public) |
| POST | `/auth/forgot-password` | Forgot password |
| POST | `/auth/reset-password` | Reset password |

**Auth flow**: Axios interceptor automatically refreshes on 401 → POST `/auth/refresh` → retry. Phone normalization handled server-side. Username: 3-16 chars, @ prefix, punctuation allowed except @ and whitespace.

---

## ❌ Missing Endpoints — Need Backend Implementation

### User Profile

| Method | Endpoint | Frontend Calls From | Expected Request | Expected Response |
|--------|----------|-------------------|------------------|-------------------|
| PATCH | `/auth/profile` | EditProfileScreen | `{ displayName?, username?, phone?, email? }` | `{ success, user: { id, username, displayName, phone, email, role } }` |
| GET | `/auth/username-availability` | EditProfileScreen (check) | `?username=...` | `{ available: true/false }` |

### Vendor Upgrade

| Method | Endpoint | Frontend Calls From | Expected Request | Expected Response |
|--------|----------|-------------------|------------------|-------------------|
| POST | `/auth/upgrade-to-vendor` | VendorOnboardingScreen | `{}` (body optional) | `{ success, user: { id, role: 'vendor' } }` |

### Products

| Method | Endpoint | Frontend Calls From | Expected Request | Expected Response |
|--------|----------|-------------------|------------------|-------------------|
| GET | `/api/products` | ProductListScreen | `?page, limit, category, vendor, stock` | `{ products: [...], pagination }` |
| GET | `/api/products/:productId` | ProductDetailScreen | path param | `{ product: { id, name, price, stock, vendor, category, description } }` |

### Cart

| Method | Endpoint | Frontend Calls From | Expected Request | Expected Response |
|--------|----------|-------------------|------------------|-------------------|
| GET | `/api/cart` | CartScreen | none (auth cookie) | `{ cart: { items: [...], subtotal, total, vendorId } }` |
| POST | `/api/cart/items` | CartScreen (add) | `{ productId, quantity }` | `{ cart: {...} }` |
| PUT | `/api/cart/items/:productId` | CartScreen (update) | `{ quantity }` | `{ cart: {...} }` |
| DELETE | `/api/cart/items/:productId` | CartScreen (remove) | none | `{ cart: {...} }` |

**Cart rules**: One vendor/store only. Server calculates totals from current product data. Never trust client prices.

### Checkout & Orders

| Method | Endpoint | Frontend Calls From | Expected Request | Expected Response |
|--------|----------|-------------------|------------------|-------------------|
| POST | `/api/checkout` | CheckoutScreen | `{ cartItems, vendorId }` | `{ order: { id, subtotal, platformFee, deliveryFee, total, status } }` |
| GET | `/api/orders` | OrdersScreen | none | `{ orders: [...] }` |
| GET | `/api/orders/:orderId` | OrderDetailScreen | path param | `{ order: {...} }` |
| POST | `/api/orders/:orderId/cancel` | OrderDetailScreen | none | `{ order: {...} }` |
| POST | `/api/orders/:orderId/delivery/confirm` | OrderDetailScreen | none | `{ order: {...} }` |
| POST | `/api/orders/:orderId/disputes` | OrderDetailScreen | none | `{ dispute: {...} }` |
| GET | `/api/disputes/:disputeId` | OrderDetailScreen | path param | `{ dispute: {...} }` |

### Vendor Operations (vendor role required)

| Method | Endpoint | Frontend Calls From | Expected Request | Expected Response |
|--------|----------|-------------------|------------------|-------------------|
| GET | `/api/vendor/products` | VendorHubScreen | none | `{ products: [...] }` |
| POST | `/api/vendor/products` | VendorHubScreen | product data | `{ product: {...} }` |
| PATCH | `/api/vendor/products/:productId` | VendorHubScreen | updates | `{ product: {...} }` |
| DELETE | `/api/vendor/products/:productId` | VendorHubScreen | none | `{ success: true }` |
| GET | `/api/vendor/orders` | VendorHubScreen | none | `{ orders: [...] }` |
| PATCH | `/api/vendor/orders/:orderId` | VendorHubScreen | `{ status }` | `{ order: {...} }` |
| GET | `/api/vendor/payments` | VendorPaymentScreen | none | `{ payments: { held, pending, released, disputed, refunded } }` |

### Payment & Escrow

| Method | Endpoint | Frontend Calls From | Expected Request | Expected Response |
|--------|----------|-------------------|------------------|-------------------|
| POST | `/api/orders/:orderId/payment` | CheckoutScreen | `{ provider, amount }` | `{ payment: { id, status, providerReference } }` |
| GET | `/api/orders/:orderId/payment` | CheckoutScreen | path param | `{ payment: { id, status, amount, heldUntil } }` |

---

## 🔐 Authentication Requirements

- **Cookies**: `access_token`, `refresh_token` (HttpOnly, Secure, SameSite=Lax)
- **CORS**: Must allow credentials from mobile app origin
- **Token shape**: `req.user` includes `id`, `role` (buyer/vendor), `username`, `phone_verified`
- **Role checks**: `requireRole('buyer')`, `requireRole('vendor')`, `requireRole('admin')`
- **Role changes**: Seen immediately (requireAuth loads from database)
- **Default role**: All new users start as `buyer`; upgrade to `vendor` via `/auth/upgrade-to-vendor`

---

## 🌐 Environment Configuration

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=https://api.kamba.ng
```

### Backend (.env)
```
NODE_ENV=production
DATABASE_URL=postgres://...
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
PAYMENT_PROVIDER_NAME=...
PAYMENT_WEBHOOK_SECRET=...
DELIVERY_WEBHOOK_SECRET=...
CURRENCY=NGN
PLATFORM_FEE_BPS=1000
DELIVERY_FEE_KOBO=200
```

---

## 📱 Frontend Files That Reference These Endpoints

| File | Endpoints Used |
|------|---------------|
| `src/utils/api.js` | All API client definitions |
| `src/screens/EditProfileScreen.jsx` | `PATCH /auth/profile`, `GET /auth/username-availability` |
| `src/screens/VendorOnboardingScreen.jsx` | `POST /auth/upgrade-to-vendor` |
| `src/screens/CheckoutScreen.jsx` | `POST /api/checkout`, `POST /api/orders/:id/payment` |
| `src/screens/CartScreen.jsx` | `GET /api/cart`, `POST/PUT/DELETE /api/cart/items` |
| `src/screens/OrderDetailScreen.jsx` | `GET /api/orders/:id`, `POST /api/orders/:id/cancel`, `POST /api/orders/:id/delivery/confirm`, `POST /api/orders/:id/disputes` |
| `src/screens/OrdersScreen.jsx` | `GET /api/orders` |
| `src/screens/ProductListScreen.jsx` | `GET /api/products` |
| `src/screens/ProductDetailScreen.jsx` | `GET /api/products/:id` |
| `src/screens/VendorHubScreen.jsx` | `GET/POST/PATCH/DELETE /api/vendor/products`, `GET/PATCH /api/vendor/orders` |
| `src/screens/VendorPaymentScreen.jsx` | `GET /api/vendor/payments` |

---

## 🚨 Important Notes

1. **Never trust client-sent prices/totals** — Server calculates from current product data
2. **One vendor per checkout** — Cart restricted to single store
3. **Integer amounts in kobo** for NGN — No floating-point arithmetic for money
4. **Escrow flow**: Payment initialized → funds held → buyer confirms delivery → 24h auto-release → dispute pauses release → admin resolves
5. **Role default**: All users start as `buyer`; role saved in JWT only after vendor upgrade