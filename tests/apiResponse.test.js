import test from 'node:test';
import assert from 'node:assert/strict';
import { responsePayload } from '../src/utils/apiResponse.js';

test('unwraps the current flat Express handler response', () => {
  const payload = { success: true, universities: [{ id: 'uni-1' }] };
  assert.equal(responsePayload({ data: payload }), payload);
  assert.deepEqual(responsePayload({ data: payload }).universities, [{ id: 'uni-1' }]);
});

test('supports the older nested result response envelope', () => {
  const payload = { universities: [{ id: 'uni-1' }] };
  assert.equal(responsePayload({ data: { success: true, result: payload } }), payload);
});

test('returns null for a missing response', () => {
  assert.equal(responsePayload(null), null);
  assert.equal(responsePayload({}), null);
});
