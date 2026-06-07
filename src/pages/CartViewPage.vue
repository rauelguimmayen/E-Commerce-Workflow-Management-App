<script setup>
import { useGlobalStore } from "../stores/global.js";
import api from "../api.js";
import { Notyf } from 'notyf';
import { ref, computed } from "vue";

const notyf = new Notyf();
const store = useGlobalStore();
store.getUserCart();

const totalQuantity = computed(() =>
  store.userCart.items.reduce((sum, item) => sum + item.quantity, 0)
)

async function removeItem(productId) {
  try {
    await api.patch(`/cart/${productId}/remove-from-cart`);
    notyf.success('Item removed from cart');
    store.getUserCart();
  } catch (error) {
    notyf.error(error.response?.data?.message ?? 'Failed to remove item');
  }
}

async function clearCart() {
  try {
    await api.put(`/cart/clear-cart/`);
    store.getUserCart();
  } catch (error) { console.log(error); }
}

async function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;
  const item = store.userCart.items.find(i => i.productId._id === productId);
  if (item) item.quantity = newQuantity;
  try {
    await api.patch(`/cart/update-cart-quantity`, { productId, newQuantity });
    store.getUserCart();
  } catch (error) { store.getUserCart(); }
}

async function checkout() {
  if (store.userCart.items.length === 0) {
    notyf.error('Your cart is empty');
    return;
  }
  try {
    await api.post('/orders/checkout');
    notyf.success('Order placed successfully!');
    store.getUserCart();
  } catch (error) {
    notyf.error(error.response?.data?.message ?? 'Checkout failed');
  }
}
</script>

<template>
  <div class="gs-cart-page">
    <div class="gs-cart-inner">

      <!-- Header -->
      <div class="gs-cart-header">
        <div>
          <router-link to="/products" class="gs-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Continue Shopping
          </router-link>
          <h1 class="gs-cart-title">
            Shopping Cart
            <span class="gs-cart-count" v-if="store.userCart?.items?.length">
              {{ totalQuantity }} item{{ totalQuantity !== 1 ? 's' : '' }}
            </span>
          </h1>
        </div>
        <button
          @click="clearCart"
          class="gs-clear-btn"
          v-if="store.userCart?.items?.length"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          Clear All
        </button>
      </div>

      <!-- Main Layout -->
      <div class="gs-cart-layout" v-if="store.userCart && store.userCart.items.length > 0">

        <!-- Cart Items -->
        <div class="gs-cart-items">
          <div
            class="gs-cart-item"
            v-for="item in store.userCart.items"
            :key="item._id"
          >
            <!-- Product Image -->
            <div class="gs-item-img">
              <img
                :src="item.productId?.image_url || `https://placehold.co/200x200/1e1b4b/818cf8?font=raleway&text=${encodeURIComponent((item.productId?.name || 'P').slice(0,2))}`"
                :alt="item.productId?.name"
              />
            </div>

            <!-- Product Info -->
            <div class="gs-item-info">
              <h4 class="gs-item-name">{{ item.productId?.name || 'Unknown Product' }}</h4>
              <p class="gs-item-id">Category: {{ item.productId?.category }}</p>
              <span class="gs-item-unit-price">₱{{ item.productId?.price?.toLocaleString() }} each</span>
            </div>

            <!-- Quantity -->
            <div class="gs-qty-control">
              <button class="gs-qty-btn" @click="updateQuantity(item.productId?._id || item.productId, item.quantity - 1)">−</button>
              <input
                type="number"
                class="gs-qty-input"
                v-model="item.quantity"
                @change="updateQuantity(item.productId?._id || item.productId, item.quantity)"
                min="1"
              />
              <button class="gs-qty-btn" @click="updateQuantity(item.productId?._id || item.productId, item.quantity + 1)">+</button>
            </div>

            <!-- Subtotal -->
            <div class="gs-item-subtotal">
              <span>₱{{ item.subtotal?.toLocaleString() }}</span>
            </div>

            <!-- Remove -->
            <button class="gs-remove-btn" @click="removeItem(item.productId?._id || item.productId)" title="Remove">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="gs-order-summary">
          <h3 class="gs-summary-title">Order Summary</h3>

          <div class="gs-summary-rows">
            <div class="gs-summary-row">
              <span class="gs-summary-label">Subtotal ({{ totalQuantity }} items)</span>
              <span class="gs-summary-value">₱{{ store.userCart.totalAmount?.toLocaleString() }}</span>
            </div>
            <div class="gs-summary-row">
              <span class="gs-summary-label">Shipping</span>
              <span class="gs-summary-free">Free</span>
            </div>
            <div class="gs-summary-row">
              <span class="gs-summary-label">Tax (12%)</span>
              <span class="gs-summary-value">₱{{ (store.userCart.totalAmount * 0.12)?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) }}</span>
            </div>
          </div>

          <div class="gs-summary-divider"></div>

          <div class="gs-summary-total">
            <span>Total</span>
            <span class="gs-total-amount">₱{{ (store.userCart.totalAmount * 1.12)?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) }}</span>
          </div>

          <button @click="checkout" class="gs-checkout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Secure Checkout
          </button>

          <div class="gs-trust-badges">
            <span class="gs-trust-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Secure SSL
            </span>
            <span class="gs-trust-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              Free Returns
            </span>
            <span class="gs-trust-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Fast Delivery
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="gs-cart-empty">
        <div class="gs-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
        </div>
        <h3 class="gs-empty-title">Your cart is empty</h3>
        <p class="gs-empty-sub">Looks like you haven't added any items yet.</p>
        <RouterLink to="/products" class="gs-btn-primary">
          Start Shopping
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-cart-page {
  min-height: 100vh;
  background: #08080f;
  padding: 100px 0 60px;
  font-family: 'DM Sans', sans-serif;
  color: #f0f0f5;
}
.gs-cart-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.gs-cart-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
  flex-wrap: wrap;
  gap: 12px;
}
.gs-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.38);
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
}
.gs-back-link:hover { color: #818cf8; }

.gs-cart-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #f0f0f5;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  letter-spacing: -0.02em;
}
.gs-cart-count {
  font-size: 0.8rem;
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.25);
  color: #818cf8;
  padding: 4px 12px;
  border-radius: 100px;
  font-weight: 600;
  letter-spacing: 0;
}
.gs-clear-btn {
  display: flex; align-items: center; gap: 6px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: #f87171;
  padding: 9px 16px; border-radius: 10px;
  font-size: 0.82rem; font-weight: 600;
  font-family: 'Syne', sans-serif;
  cursor: pointer; transition: all 0.2s;
}
.gs-clear-btn:hover { background: rgba(239,68,68,0.15); }

/* Layout */
.gs-cart-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;
}

/* Cart Items */
.gs-cart-items { display: flex; flex-direction: column; gap: 14px; }

.gs-cart-item {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 18px;
  transition: border-color 0.2s;
}
.gs-cart-item:hover { border-color: rgba(99,102,241,0.2); }

.gs-item-img {
  width: 72px; height: 72px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #1a1a28;
}
.gs-item-img img { width: 100%; height: 100%; object-fit: cover; }

.gs-item-info { flex: 1; min-width: 0; }
.gs-item-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.92rem; font-weight: 700;
  color: #f0f0f5; margin: 0 0 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.gs-item-id {
  font-size: 0.72rem; color: rgba(255,255,255,0.2);
  font-family: 'Courier New', monospace; margin: 0 0 4px;
}
.gs-item-unit-price {
  font-size: 0.78rem; color: rgba(255,255,255,0.35);
}

/* Qty Control */
.gs-qty-control {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 3px;
}
.gs-qty-btn {
  width: 30px; height: 30px;
  background: none; border: none;
  color: rgba(255,255,255,0.5);
  font-size: 1rem; cursor: pointer;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.gs-qty-btn:hover { background: rgba(255,255,255,0.08); color: white; }
.gs-qty-input {
  width: 42px; text-align: center;
  background: none; border: none;
  color: #f0f0f5; font-size: 0.88rem; font-weight: 600;
  font-family: 'Syne', sans-serif; outline: none;
}
.gs-qty-input::-webkit-outer-spin-button,
.gs-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }

.gs-item-subtotal {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: #a5b4fc;
  min-width: 80px; text-align: right;
}

.gs-remove-btn {
  width: 32px; height: 32px;
  background: rgba(239,68,68,0.06);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 8px; cursor: pointer;
  color: #f87171; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.gs-remove-btn:hover { background: rgba(239,68,68,0.15); }

/* Summary */
.gs-order-summary {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 28px;
  position: sticky;
  top: 88px;
}
.gs-summary-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.05rem; font-weight: 700;
  color: #f0f0f5; margin: 0 0 24px;
}
.gs-summary-rows { display: flex; flex-direction: column; gap: 12px; }
.gs-summary-row {
  display: flex; justify-content: space-between; align-items: center;
}
.gs-summary-label { font-size: 0.85rem; color: rgba(255,255,255,0.4); }
.gs-summary-value { font-size: 0.88rem; font-weight: 600; color: #f0f0f5; }
.gs-summary-free {
  font-size: 0.82rem; font-weight: 700;
  color: #34d399; font-family: 'Syne', sans-serif;
}
.gs-summary-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 16px 0; }
.gs-summary-total {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px;
}
.gs-summary-total > span:first-child {
  font-family: 'Syne', sans-serif; font-weight: 700; color: #f0f0f5;
}
.gs-total-amount {
  font-family: 'Syne', sans-serif;
  font-size: 1.3rem; font-weight: 800; color: #818cf8;
}

.gs-checkout-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 15px;
  border-radius: 13px; border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; font-family: 'Syne', sans-serif;
  font-size: 0.92rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
  margin-bottom: 16px;
}
.gs-checkout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(99,102,241,0.45);
}

.gs-trust-badges {
  display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;
}
.gs-trust-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.72rem; color: rgba(255,255,255,0.25); font-weight: 500;
}

/* Empty */
.gs-cart-empty {
  display: flex; flex-direction: column; align-items: center;
  padding: 80px 20px; text-align: center;
}
.gs-empty-icon {
  width: 96px; height: 96px;
  background: rgba(99,102,241,0.08);
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 24px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(99,102,241,0.5);
  margin-bottom: 28px;
}
.gs-empty-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem; font-weight: 800; color: #f0f0f5; margin: 0 0 10px;
}
.gs-empty-sub { color: rgba(255,255,255,0.35); margin: 0 0 32px; }

.gs-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; padding: 14px 28px; border-radius: 12px;
  font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700;
  text-decoration: none; box-shadow: 0 8px 24px rgba(99,102,241,0.3);
  transition: all 0.2s;
}
.gs-btn-primary:hover {
  transform: translateY(-2px); color: white;
  box-shadow: 0 12px 32px rgba(99,102,241,0.4);
}

@media (max-width: 768px) {
  .gs-cart-layout { grid-template-columns: 1fr; }
  .gs-cart-item { flex-wrap: wrap; }
  .gs-item-subtotal { margin-left: auto; }
}
</style>
