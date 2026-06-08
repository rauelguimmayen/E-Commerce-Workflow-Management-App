<template>
<div id="prod_details" :class="isModal ? '' : 'gs-page-wrapper'" v-if="product && product._id">
      <!-- Breadcrumb -->
      <nav class="gs-breadcrumb">
        <router-link to="/" class="gs-breadcrumb-link">Home</router-link>
        <span class="gs-breadcrumb-sep">/</span>
        <router-link to="/products" class="gs-breadcrumb-link">Products</router-link>
        <span class="gs-breadcrumb-sep">/</span>
        <span class="gs-breadcrumb-current">{{ product.name }}</span>
      </nav>

      <div class="gs-detail-grid">
        <!-- Image -->
        <div class="gs-detail-img-col">
          <div class="gs-detail-img-wrap">
            <img
              class="gs-detail-img"
              :src="product.image_url || `https://placehold.co/800x600/1e1b4b/818cf8?font=raleway&text=${encodeURIComponent(product.name)}`"
              :alt="product.name"
            />
            <div class="gs-detail-img-badge">{{ product.category }}</div>
          </div>
        </div>

        <!-- Info -->
        <div class="gs-detail-info-col">
          <div class="gs-detail-tag">In Stock
            <router-link
            id="updatebtn"
            v-if="user.isAdmin"
              :to="{ name: 'ProductUpdate', params: { id: product._id } }"
              class="gs-vp-edit-btn"
              title="Edit product">
            Update
          </router-link>
          </div>
          <h1 class="gs-detail-name">{{ product.name }}</h1>
          <p class="gs-detail-desc">{{ product.description }}</p>

          <!-- Price -->
          <div class="gs-detail-price-row">
            <span class="gs-detail-price">₱{{ product.price?.toLocaleString() }}</span>
            <span class="gs-detail-price-note">Free shipping available</span>
          </div>

          <!-- Quantity -->
          <div class="gs-detail-qty-section">
            <label class="gs-detail-qty-label">Quantity</label>
            <div class="gs-detail-qty-row">
              <div class="gs-detail-qty-ctrl">
                <button class="gs-detail-qty-btn" @click="decreaseQty">−</button>
                <span class="gs-detail-qty-val">{{ quantity }}</span>
                <button class="gs-detail-qty-btn" @click="increaseQty">+</button>
              </div>
              <span class="gs-detail-subtotal">
                Total: <strong>₱{{ (product.price * quantity).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) }}</strong>
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="gs-detail-actions">
            <button
              class="gs-detail-cart-btn"
              @click="addToCart"
              :disabled="user.isAdmin || !isLoggedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
              {{ isLoggedIn ? 'Add to Cart' : 'Log in to Add to Cart' }}
            </button>
            <router-link to="/products" class="gs-detail-back-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </router-link>
          </div>
          <!-- Features -->
          <div class="gs-detail-features">
            <div class="gs-detail-feature">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Free delivery over ₱1,000
            </div>
            <div class="gs-detail-feature">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              30-day free returns
            </div>
            <div class="gs-detail-feature">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              2-year warranty
            </div>
          </div>
        </div>
  </div>
  </div> 
  <div v-else class="gs-detail-loading">
    <div class="gs-spinner"></div>
  </div>
 
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api.js';
import { useGlobalStore } from '../stores/global.js';
const route = useRoute();
const product = ref(null);
const quantity = ref(1);
const props = defineProps({ isModal: Boolean })
const notyf = new Notyf();
const isLoggedIn = ref(!!localStorage.getItem('token'));
const { user } = useGlobalStore();
onMounted(async () => {
  const { data } = await api.get(`/products/${route.params.id}`);
  product.value = data;
});

function increaseQty() { quantity.value++; }
function decreaseQty() { if (quantity.value > 1) quantity.value--; }

async function addToCart() {
  try {
    await api.post('/cart/add-to-cart', {
      productId: product.value._id,
      quantity: quantity.value,
      subtotal: product.value.price * quantity.value
    });
    notyf.success("Item added to cart!");
    quantity.value = 1;
  } catch (error) {
    notyf.error("Failed to add item to cart.");
    console.error(error);
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* Breadcrumb */
.gs-breadcrumb {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 36px;
}
.gs-breadcrumb-link {
  font-size: 0.8rem; color: rgba(255,255,255,0.35); text-decoration: none;
  transition: color 0.2s;
}
.gs-breadcrumb-link:hover { color: #818cf8; }
.gs-breadcrumb-sep { font-size: 0.75rem; color: rgba(255,255,255,0.15); }
.gs-breadcrumb-current { font-size: 0.8rem; color: rgba(255,255,255,0.55); }

/* Grid */
.gs-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* Image */
.gs-detail-img-col {}
.gs-detail-img-wrap {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
}
.gs-detail-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s ease;
}
.gs-detail-img-wrap:hover .gs-detail-img { transform: scale(1.03); }
.gs-detail-img-badge {
  position: absolute; bottom: 16px; left: 16px;
  background: rgba(10,10,14,0.75); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  font-size: 0.72rem; font-weight: 600;
  font-family: 'Syne', sans-serif;
  padding: 6px 14px; border-radius: 100px;
  letter-spacing: 0.04em;
}

/* Info */
.gs-detail-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
  color: #34d399; letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: 12px;
}
.gs-detail-tag::before {
  content: ''; width: 7px; height: 7px;
  background: #34d399; border-radius: 50%;
  box-shadow: 0 0 8px #34d399;
}
#updatebtn {
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
  color: #42b0f5; letter-spacing: 0.08em; text-transform: uppercase;
  
}
#updatebtn::before {
  content: ''; width: 7px; height: 7px;
  background: #42b0f5; border-radius: 50%;
  box-shadow: 0 0 8px #42b0f5;

}

.gs-detail-name {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800; color: #f0f0f5;
  margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.1;
}

.gs-detail-desc {
  font-size: 0.92rem; color: rgba(255,255,255,0.45);
  line-height: 1.7; margin: 0 0 28px;
}

/* Price */
.gs-detail-price-row {
  display: flex; align-items: baseline; gap: 14px;
  margin-bottom: 28px;
}
.gs-detail-price {
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: #a5b4fc; letter-spacing: -0.02em;
}
.gs-detail-price-note {
  font-size: 0.78rem; color: #34d399; font-weight: 500;
}

/* Qty */
.gs-detail-qty-section { margin-bottom: 28px; }
.gs-detail-qty-label {
  display: block; font-size: 0.78rem; font-weight: 600;
  color: rgba(255,255,255,0.45); font-family: 'Syne', sans-serif;
  letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px;
}
.gs-detail-qty-row { display: flex; align-items: center; gap: 20px; }
.gs-detail-qty-ctrl {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 4px;
  gap: 4px;
}
.gs-detail-qty-btn {
  width: 36px; height: 36px;
  background: none; border: none;
  color: rgba(255,255,255,0.6);
  font-size: 1.1rem; font-weight: 600;
  cursor: pointer; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.gs-detail-qty-btn:hover { background: rgba(255,255,255,0.08); color: white; }
.gs-detail-qty-val {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 700; color: #f0f0f5;
  min-width: 36px; text-align: center;
}
.gs-detail-subtotal {
  font-size: 0.88rem; color: rgba(255,255,255,0.35);
}
.gs-detail-subtotal strong { color: #a5b4fc; }

/* Actions */
.gs-detail-actions { display: flex; gap: 12px; margin-bottom: 28px; }
.gs-detail-cart-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px 24px; border-radius: 13px; border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; font-family: 'Syne', sans-serif;
  font-size: 0.92rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(99,102,241,0.3);
}
.gs-detail-cart-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(99,102,241,0.4);
}
.gs-detail-cart-btn:disabled {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.25);
  box-shadow: none; cursor: not-allowed;
}
.gs-detail-back-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 15px 20px; border-radius: 13px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5); text-decoration: none;
  font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600;
  transition: all 0.2s; white-space: nowrap;
}
.gs-detail-back-btn:hover { background: rgba(255,255,255,0.08); color: white; }

/* Features */
.gs-detail-features {
  display: flex; flex-direction: column; gap: 10px;
  padding: 20px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
}
.gs-detail-feature {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.82rem; color: rgba(255,255,255,0.4);
}
.gs-detail-feature svg { color: #818cf8; flex-shrink: 0; }

/* Loading */
.gs-detail-loading {
  min-height: 100vh; background: #08080f;
  display: flex; align-items: center; justify-content: center;
}
.gs-spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(99,102,241,0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}


@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .gs-detail-grid { grid-template-columns: 1fr; gap: 28px; }
}
</style>
