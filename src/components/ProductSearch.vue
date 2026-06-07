<template>
  <div class="gs-search-wrap">
    <!-- Search by Name -->
    <div class="gs-search-section">
      <form @submit.prevent="searchByName" class="gs-search-form">
        <div class="gs-search-input-wrap">
          <svg class="gs-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            v-model="productName"
            class="gs-search-input"
            placeholder="Search products by name..."
          />
          <button class="gs-search-submit" type="submit" :disabled="isLoading">
            <span v-if="!isLoading">Search</span>
            <div v-else class="gs-search-spinner"></div>
          </button>
        </div>
      </form>
    </div>

    <!-- Price Range -->
    <div class="gs-price-section">
      <p class="gs-price-label">Filter by Price Range</p>
      <form @submit.prevent="searchByPrice" class="gs-price-form">
        <div class="gs-price-inputs">
          <div class="gs-price-field">
            <span class="gs-price-prefix">₱</span>
            <input
              type="number"
              v-model="minPrice"
              class="gs-price-input"
              placeholder="Min"
              min="0"
            />
          </div>
          <div class="gs-price-separator">—</div>
          <div class="gs-price-field">
            <span class="gs-price-prefix">₱</span>
            <input
              type="number"
              v-model="maxPrice"
              class="gs-price-input"
              placeholder="Max"
              min="0"
            />
          </div>
          <button class="gs-price-submit" type="submit" :disabled="isLoading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Apply
          </button>
        </div>
      </form>
    </div>

    <!-- Clear -->
    <button v-if="hasSearched" class="gs-clear-btn" @click="clearSearch">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      Clear Search
    </button>

    <!-- Results -->
    <div v-if="products.length" class="gs-results">
      <p class="gs-results-label">{{ products.length }} result{{ products.length !== 1 ? 's' : '' }} found</p>
      <div class="gs-results-grid">
        <ProductCard v-for="product in products" :key="product._id" :productData="product" />
      </div>
    </div>
    <div v-else-if="!isLoading && hasSearched" class="gs-no-results">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p>No products found for your search</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Notyf } from 'notyf';
import api from '../api.js';
import ProductCard from './ProductCard.vue';

const notyf = new Notyf();
const products = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);
const productName = ref("");
const minPrice = ref("");
const maxPrice = ref("");
const emit = defineEmits(['searching']);

const searchByName = async () => {
  emit('searching', true);
  try {
    if (!productName.value.trim()) { notyf.error("Please enter a product name"); return; }
    isLoading.value = true; hasSearched.value = true;
    const response = await api.post('/products/search-by-name', { name: productName.value.trim() });
    products.value = response.data.products || [];
    if (!products.value.length) notyf.error("No products found");
  } catch (error) {
    notyf.error("Something went wrong while searching.");
  } finally { isLoading.value = false; }
};

const searchByPrice = async () => {
  emit('searching', true);
  try {
    if (minPrice.value === "" || maxPrice.value === "") { notyf.error("Please enter both min and max price"); return; }
    if (Number(minPrice.value) > Number(maxPrice.value)) { notyf.error("Min price cannot be greater than max price"); return; }
    isLoading.value = true; hasSearched.value = true;
    const response = await api.post('/products/search-by-price', { minPrice: Number(minPrice.value), maxPrice: Number(maxPrice.value) });
    products.value = response.data.products || [];
    if (!products.value.length) notyf.error("No products found in this price range");
  } catch (error) {
    notyf.error("Something went wrong while searching.");
  } finally { isLoading.value = false; }
};

const clearSearch = () => {
  products.value = []; hasSearched.value = false;
  productName.value = ""; minPrice.value = ""; maxPrice.value = "";
  emit('searching', false);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-search-wrap {
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 36px;
  padding-top: 100px;
}

/* Search Section */
.gs-search-section { margin-bottom: 14px; }

.gs-search-input-wrap {
  display: flex; align-items: center;
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
  padding: 5px 5px 5px 16px;
  transition: border-color 0.2s;
}
.gs-search-input-wrap:focus-within {
  border-color: rgba(99,102,241,0.45);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.gs-search-icon { color: rgba(255,255,255,0.2); flex-shrink: 0; }

.gs-search-input {
  flex: 1; background: none; border: none; outline: none;
  color: #f0f0f5; font-size: 0.92rem; font-family: 'DM Sans', sans-serif;
  padding: 10px 14px;
}
.gs-search-input::placeholder { color: rgba(255,255,255,0.2); }

.gs-search-submit {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none; border-radius: 10px;
  color: white; padding: 10px 22px;
  font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  white-space: nowrap;
  display: flex; align-items: center; justify-content: center;
  min-width: 80px;
}
.gs-search-submit:hover:not(:disabled) { opacity: 0.9; }
.gs-search-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.gs-search-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Price Filter */
.gs-price-section {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 16px 18px;
  margin-bottom: 16px;
}
.gs-price-label {
  font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
  color: rgba(255,255,255,0.35); letter-spacing: 0.07em;
  text-transform: uppercase; margin: 0 0 12px;
}
.gs-price-inputs { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.gs-price-field {
  position: relative; display: flex; align-items: center; flex: 1; min-width: 110px;
}
.gs-price-prefix {
  position: absolute; left: 12px;
  font-size: 0.85rem; color: rgba(255,255,255,0.25);
  font-family: 'Syne', sans-serif; pointer-events: none;
}
.gs-price-input {
  width: 100%; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09); border-radius: 10px;
  padding: 10px 12px 10px 26px;
  color: #f0f0f5; font-size: 0.88rem; font-family: 'DM Sans', sans-serif;
  outline: none; transition: all 0.2s;
}
.gs-price-input:focus {
  border-color: rgba(99,102,241,0.4);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
}
.gs-price-input::placeholder { color: rgba(255,255,255,0.18); }
.gs-price-input::-webkit-outer-spin-button,
.gs-price-input::-webkit-inner-spin-button { -webkit-appearance: none; }

.gs-price-separator { color: rgba(255,255,255,0.2); font-size: 0.9rem; flex-shrink: 0; }

.gs-price-submit {
  display: flex; align-items: center; gap: 7px;
  background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
  border-radius: 10px; padding: 10px 18px;
  color: #818cf8; font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.gs-price-submit:hover:not(:disabled) {
  background: rgba(99,102,241,0.2); color: #c7d2fe;
}
.gs-price-submit:disabled { opacity: 0.4; cursor: not-allowed; }

/* Clear */
.gs-clear-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: none; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 7px 14px;
  color: rgba(255,255,255,0.35); font-size: 0.78rem; font-weight: 600;
  font-family: 'Syne', sans-serif; cursor: pointer;
  transition: all 0.2s; margin-bottom: 28px;
}
.gs-clear-btn:hover { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.2); }

/* Results */
.gs-results-label {
  font-family: 'Syne', sans-serif; font-size: 0.78rem; font-weight: 700;
  color: rgba(255,255,255,0.35); letter-spacing: 0.06em; text-transform: uppercase;
  margin: 0 0 20px;
}
.gs-results-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 4px;
}

/* No Results */
.gs-no-results {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 48px 20px; text-align: center;
  color: rgba(255,255,255,0.2);
}
.gs-no-results p { margin: 0; font-size: 0.88rem; }
</style>
