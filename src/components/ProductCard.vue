<template>
  <div class="gs-product-col">
    <div class="gs-product-card" @mouseenter="hovered = true" @mouseleave="hovered = false">
      <!-- Image Area -->
      <div class="gs-product-img-wrap">
        <img
          class="gs-product-img"
          :src="productData.image_url || `https://placehold.co/600x400/1e1b4b/818cf8?font=raleway&text=${encodeURIComponent(productData.name)}`"
          :alt="productData.name"
        />
        <!-- Overlay Actions -->
        <div class="gs-product-overlay" :class="{ visible: hovered }">
          <router-link
            v-if="!store.user.isAdmin"
            class="gs-overlay-btn"
            :to="'/products/' + productData._id"
            title="View Product"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Quick View
          </router-link>
          <button
            v-if="store.user.email && !store.user.isAdmin"
            class="gs-overlay-btn gs-overlay-cart"
            @click="addToCart"
            title="Add to Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
            Add to Cart
          </button>
        </div>
        <!-- Category Badge (placeholder) -->
        <span class="gs-product-badge">New</span>
      </div>

      <!-- Card Content -->
      <div class="gs-product-body">
        <h4 class="gs-product-name">{{ productData.name }}</h4>
        <div class="gs-product-desc-wrap" :class="{ expanded }">
          <p class="gs-product-desc">{{ productData.description }}</p>
        </div>
        <button @click="expanded = !expanded" class="gs-expand-btn" v-if="productData.description?.length > 80">
          {{ expanded ? 'Show less ↑' : 'Show more ↓' }}
        </button>
        <div class="gs-product-footer">
          <span class="gs-product-price">₱{{ productData.price?.toLocaleString() }}</span>
          <div class="gs-product-actions">
            <router-link
              v-if="!store.user.isAdmin"
              class="gs-action-btn"
              :to="'/products/' + productData._id"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </router-link>
            <button
              v-if="store.user.email && !store.user.isAdmin"
              class="gs-action-btn gs-action-primary"
              @click="addToCart"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Notyf } from 'notyf';
import { useGlobalStore } from "../stores/global.js";
import api from "../api.js";
import { ref } from 'vue';

const expanded = ref(false);
const hovered = ref(false);
const store = useGlobalStore();
const notyf = new Notyf();
const props = defineProps({ productData: Object });

async function addToCart() {
  try {
    await api.post('/cart/add-to-cart', {
      productId: props.productData._id,
      quantity: 1,
      subtotal: props.productData.price
    });
    notyf.success("Added to cart!");
    store.getUserCart();
  } catch (error) {
    notyf.error("Failed to add to cart.");
    console.log(error);
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-product-col {
  padding: 10px;
  width: 100%;
}

.gs-product-card {
  background: #111118;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'DM Sans', sans-serif;
}
.gs-product-card:hover {
  border-color: rgba(99,102,241,0.35);
  box-shadow: 0 20px 60px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.15);
  transform: translateY(-3px);
}

/* Image */
.gs-product-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #0d0d14;
}

.gs-product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.gs-product-card:hover .gs-product-img {
  transform: scale(1.06);
}

/* Overlay */
.gs-product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(6,6,15,0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.28s ease;
  backdrop-filter: blur(4px);
}
.gs-product-overlay.visible { opacity: 1; }

.gs-overlay-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 100px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Syne', sans-serif;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  transform: translateY(8px);
  transition: transform 0.28s ease, background 0.2s, border 0.2s;
}
.gs-product-overlay.visible .gs-overlay-btn {
  transform: translateY(0);
}
.gs-overlay-btn:hover {
  background: rgba(255,255,255,0.2);
}
.gs-overlay-cart {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
}
.gs-overlay-cart:hover {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

/* Badge */
.gs-product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: 'Syne', sans-serif;
  padding: 3px 10px;
  border-radius: 100px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Body */
.gs-product-body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.gs-product-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.97rem;
  font-weight: 700;
  color: #f0f0f5;
  margin: 0 0 8px;
  line-height: 1.3;
}

.gs-product-desc-wrap {
  max-height: 44px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.gs-product-desc-wrap.expanded { max-height: 400px; }

.gs-product-desc {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.38);
  margin: 0;
  line-height: 1.5;
}

.gs-expand-btn {
  background: none;
  border: none;
  color: #818cf8;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 0 6px;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
}

/* Footer */
.gs-product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.gs-product-price {
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #a5b4fc;
  letter-spacing: -0.02em;
}

.gs-product-actions {
  display: flex;
  gap: 6px;
}

.gs-action-btn {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.gs-action-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}
.gs-action-primary {
  background: rgba(99,102,241,0.15);
  border-color: rgba(99,102,241,0.3);
  color: #818cf8;
}
.gs-action-primary:hover {
  background: rgba(99,102,241,0.3);
  color: #c7d2fe;
}
</style>
