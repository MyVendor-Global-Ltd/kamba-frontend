// index.js - VERY FIRST LINES
import 'react-native-get-random-values';
import { TextEncoder, TextDecoder } from 'text-encoding';
import process from 'process';

// === MINIMAL WORKING POLYFILLS FOR RN 0.88 / EXPO 58 ===

// 1. EventEmitter
if (typeof global.EventEmitter === 'undefined') {
  global.EventEmitter = class EventEmitter {
    constructor() { this._events = {}; }
    addListener(e, l) { (this._events[e] = this._events[e] || []).push(l); return () => this.removeListener(e, l); }
    on(e, l) { return this.addListener(e, l); }
    removeListener(e, l) { if (this._events[e]) this._events[e] = this._events[e].filter(x => x !== l); }
    off(e, l) { return this.removeListener(e, l); }
    emit(e, ...a) { (this._events[e] || []).forEach(l => l(...a)); }
    removeAllListeners(e) { if (e) delete this._events[e]; else this._events = {}; }
    listenerCount(e) { return this._events[e]?.length || 0; }
  };
}

// 2. process (from installed 'process' package)
if (typeof global.process === 'undefined') {
  global.process = process;
}
if (typeof global.process.env === 'undefined') {
  global.process.env = {};
}
if (typeof global.process.version === 'undefined') {
  global.process.version = 'v0.0.0';
}
if (typeof global.process.platform === 'undefined') {
  global.process.platform = 'react-native';
}

// 3. TextEncoder / TextDecoder (from text-encoding package)
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// 4. __DEV__
if (typeof global.__DEV__ === 'undefined') {
  global.__DEV__ = true;
}

// 5. btoa / atob (from base-64 package)
import { decode as atob, encode as btoa } from 'base-64';
if (typeof global.btoa === 'undefined') {
  global.btoa = btoa;
}
if (typeof global.atob === 'undefined') {
  global.atob = atob;
}

// 6. URL / URLSearchParams (from react-native-url-polyfill)
import 'react-native-url-polyfill/auto';

// === NOW IMPORTS ===
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);