// src/lib/stores/auth.js
import { writable } from 'svelte/store';

export const auth = writable({
  isAuthenticated: false,
  user: null,
});
