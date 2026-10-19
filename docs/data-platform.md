# Data platform: schema, fixtures, and services

This mobile client deliberately contains **no production database credentials or authoritative database**. Treat `src/data/seeds/marketplace.js` as deterministic presentation fixtures only; its demo IDs and merchant details are fictional. Fixtures must not be loaded in production. The expected relational model below is the contract for the future backend. Database migrations and seed execution belong in the backend repository/service, not in the shipped app.

## Suggested production database

PostgreSQL with UUID primary keys, UTC timestamps, PostGIS for geo queries, and migrations under version control. Store prices as integer minor units (`price_minor`, NGN kobo), never floating-point. All user-facing reads are served through authenticated/validated backend APIs; the client must never connect directly to the database or hold privileged keys.

## Core entities

- `users`: `id`, normalized unique `email`, `password_hash` (managed by identity provider where possible), `username` unique, `display_name`, `phone_e164`, `status`, `created_at`, `updated_at`, `deleted_at`.
- `categories`: `id`, unique `slug`, `name`, `sort_order`, `is_active`, timestamps.
- `stores`: `id`, `owner_user_id` FK users, `category_id` FK categories, `name`, `slug`, `description`, `verification_status`, `location geography(Point,4326)`, `address_area`, `status`, timestamps, `deleted_at`.
- `products`: `id`, `store_id` FK stores, `category_id` FK categories, `name`, `description`, `price_minor` BIGINT, `currency` CHAR(3), `inventory_quantity`, `status`, timestamps, `deleted_at`.
- `product_media`: `id`, `product_id` FK products, `url`, `sort_order`, `alt_text`, timestamps.
- `store_reviews`: `id`, `store_id` FK stores, `author_user_id` FK users, `order_id` FK orders, `rating` CHECK 1..5, `body`, timestamps; one review per completed order.
- `orders`: `id`, `buyer_user_id` FK users, `store_id` FK stores, `status`, `currency`, `subtotal_minor`, `delivery_minor`, `total_minor`, timestamps.
- `order_items`: `id`, `order_id` FK orders, `product_id` FK products, immutable `product_name`, `unit_price_minor`, `quantity`, `line_total_minor`.
- `ads`: `id`, `store_id` FK stores, `starts_at`, `ends_at`, `status`, `budget_minor`, `created_at`. Featured ranking must be derived server-side from valid paid/active ads.
- `referrals`: `id`, `referrer_user_id` FK users, `referred_user_id` FK users UNIQUE, `code` UNIQUE, `status`, timestamps.

Use indexes on normalized user email/username, active store/category, product store/category/status, order buyer/status/created time, review store, and spatial store location. Enforce ownership and state transitions in the API/database; keep an audit trail for verification, ads, orders, and payments. Payment references should be unique and verified with the payment provider server-to-server.

## Expected service boundaries

`src/services/` contains client-side API adapters only (not DB drivers): `httpClient.js` (base URL, timeout, safe error normalization), `authService.js` (register/login/refresh/logout), `catalogService.js` (nearby/category/search with cursor pagination), `storeService.js`, `orderService.js`, `notificationService.js`, `uploadService.js`. Each adapter calls a versioned backend endpoint; authorization tokens belong in secure device storage. Do not embed service secrets, payment secrets, or database URLs in this app. Cache public catalog responses with explicit TTL/invalidation and avoid caching personal/order data in plaintext.

## Seed policy

The fixtures live in `src/data/seeds/marketplace.js` for deterministic UI development and tests. They are imported explicitly by development/demo tooling only. Never run them as production database seeds. Backend-owned seed migrations should contain only generic categories and be idempotent; customer accounts and fictional stores/products must not be seeded into production.
