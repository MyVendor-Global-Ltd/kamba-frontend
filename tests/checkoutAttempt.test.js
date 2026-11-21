import test from 'node:test';
import assert from 'node:assert/strict';
import { getCheckoutAttempt } from '../src/utils/checkoutAttempt.js';

test('reuses the same idempotency key for an identical checkout retry', () => {
  const payload = { delivery_type: 'pickup' };
  const first = getCheckoutAttempt(payload);
  const retry = getCheckoutAttempt(payload, first);
  assert.equal(retry.key, first.key);
  assert.equal(retry.signature, first.signature);
});

test('creates a new idempotency key when checkout details change', () => {
  const first = getCheckoutAttempt({ delivery_type: 'pickup' });
  const changed = getCheckoutAttempt({
    delivery_type: 'delivery',
    delivery_address: { address_line: 'Hall 2' },
  }, first);
  assert.notEqual(changed.key, first.key);
});

test('does not reuse a key when the delivery address changes', () => {
  const first = getCheckoutAttempt({
    delivery_type: 'delivery',
    delivery_address: { address_line: 'Hall 2' },
  });
  const changed = getCheckoutAttempt({
    delivery_type: 'delivery',
    delivery_address: { address_line: 'Hall 3' },
  }, first);
  assert.notEqual(changed.key, first.key);
});
