<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api.js'

const router = useRouter()
const notyf = new Notyf()

const name = ref('')
const description = ref('')
const category = ref('')
const price = ref('')
const image_url = ref('') 
const isLoading = ref(false)

const categories = ['clothing', 'electronics', 'accessories', 'footwear', 'home', 'sports', 'toys & games']

async function handleSubmit() {
  if (!name.value || !description.value || !category.value || !price.value) {
    notyf.error('Please fill in all required fields')
    return
  }
  isLoading.value = true
  try {
    await api.post('/products', {
      name: name.value,
      description: description.value,
      category: category.value,
      image_url: image_url.value || undefined, 
      price: Number(price.value)
    })
    notyf.success('Product created successfully!')
    router.push({ name: 'Products' })
  } catch (e) {
    notyf.error(e.response?.data?.error || 'Failed to create product')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="gs-addprod-page">
    <div class="gs-addprod-inner">

      <!-- Header -->
      <div class="gs-addprod-header">
        <router-link to="/products" class="gs-back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Dashboard
        </router-link>
        <h1 class="gs-addprod-title">Add New Product</h1>
        <p class="gs-addprod-sub">Fill in the details below to add a product to the catalogue</p>
      </div>

      <div class="gs-addprod-layout">
        <!-- Form -->
        <div class="gs-addprod-form-card">
          <form @submit.prevent="handleSubmit">

            <div class="gs-field">
              <label class="gs-label">
                Product Name <span class="gs-required">*</span>
              </label>
              <input
                type="text"
                class="gs-input"
                v-model="name"
                placeholder="e.g. Premium Wireless Headphones"
                required
              />
            </div>

            <div class="gs-field">
              <label class="gs-label">
                Description <span class="gs-required">*</span>
              </label>
              <textarea
                class="gs-input gs-textarea"
                v-model="description"
                placeholder="Describe the product — features, materials, dimensions..."
                rows="4"
                required
              ></textarea>
            </div>
            <div class="gs-field">
                <label class="gs-label">
                  Category <span class="gs-required">*</span>
                </label>
                <select class="gs-input" v-model="category">
                  <option value="" disabled>Select a category</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
                  </option>
                </select>
              </div>
            <div class="gs-field">
              <label class="gs-label">
                Price (₱) <span class="gs-required">*</span>
              </label>
              <div class="gs-price-input-wrap">
                <span class="gs-price-prefix">₱</span>
                <input
                  type="number"
                  class="gs-input"
                  v-model="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div class="gs-field">
              <label class="gs-label">Image URL <span class="gs-optional">(optional)</span></label>
              <div class="gs-input-with-icon">
                <svg class="gs-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <input
                  type="url"
                  class="gs-input"
                  v-model="image_url"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div class="gs-form-actions">
              <router-link to="/products" class="gs-cancel-btn">Cancel</router-link>
              <button type="submit" class="gs-submit-btn" :disabled="isLoading">
                <div v-if="isLoading" class="gs-btn-spinner"></div>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {{ isLoading ? 'Creating...' : 'Create Product' }}
              </button>
            </div>

          </form>
        </div>

        <!-- Preview -->
        <div class="gs-addprod-preview">
          <p class="gs-preview-label">Live Preview</p>
          <div class="gs-preview-card">
            <div class="gs-preview-img">
              <img
                v-if="image_url"
                :src="image_url"
                alt="Preview"
                @error="e => e.target.style.display = 'none'"
              />
              <div v-else class="gs-preview-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>No image yet</span>
              </div>
            </div>
            <div class="gs-preview-body">
              <p class="gs-preview-name">{{ name || 'Product Name' }}</p>
              <p class="gs-preview-desc">{{ description || 'Product description will appear here...' }}</p>
              <p class="gs-preview-price">{{ price ? '₱' + Number(price).toLocaleString() : '₱0' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-addprod-page {
  min-height: 100vh; background: #08080f;
  padding: 90px 0 60px;
  font-family: 'DM Sans', sans-serif; color: #f0f0f5;
}
.gs-addprod-inner { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

.gs-addprod-header { margin-bottom: 36px; }
.gs-back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.78rem; color: rgba(255,255,255,0.3); text-decoration: none;
  margin-bottom: 12px; transition: color 0.2s;
}
.gs-back-link:hover { color: #818cf8; }
.gs-addprod-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800;
  color: #f0f0f5; margin: 0 0 6px; letter-spacing: -0.02em;
}
.gs-addprod-sub { font-size: 0.88rem; color: rgba(255,255,255,0.35); margin: 0; }

/* Layout */
.gs-addprod-layout {
  display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start;
}

.gs-addprod-form-card {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px; padding: 32px;
  display: flex; flex-direction: column; gap: 22px;
}
.gs-addprod-form-card form { display: flex; flex-direction: column; gap: 22px; }

/* Fields */
.gs-field { display: flex; flex-direction: column; gap: 8px; }
.gs-label {
  font-family: 'Syne', sans-serif; font-size: 0.78rem; font-weight: 700;
  color: rgba(255,255,255,0.5); letter-spacing: 0.03em;
}
.gs-required { color: #f87171; }
.gs-optional { color: rgba(255,255,255,0.22); font-weight: 500; }

.gs-input {
  width: 100%; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;
  padding: 13px 15px; color: #f0f0f5; font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s;
  box-sizing: border-box;
}
.gs-input:focus {
  border-color: rgba(99,102,241,0.5);
  background: rgba(99,102,241,0.04);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.gs-input::placeholder { color: rgba(255,255,255,0.18); }
.gs-textarea { resize: vertical; min-height: 100px; }

/* Price Input */
.gs-price-input-wrap { position: relative; }
.gs-price-prefix {
  position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
  font-size: 0.9rem; color: rgba(255,255,255,0.3);
  font-family: 'Syne', sans-serif; pointer-events: none;
}
.gs-price-input-wrap .gs-input { padding-left: 30px; }
.gs-price-input-wrap .gs-input::-webkit-outer-spin-button,
.gs-price-input-wrap .gs-input::-webkit-inner-spin-button { -webkit-appearance: none; }

/* Input with Icon */
.gs-input-with-icon { position: relative; }
.gs-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.2); pointer-events: none; }
.gs-input-with-icon .gs-input { padding-left: 40px; }

.gs-input[type="select"],
select.gs-input {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  cursor: pointer;

}

select.gs-input option {
  background: #0f0f18;
  color: #f0f0f5;
  width: 75%;
}

/* Actions */
.gs-form-actions {
  display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px;
}
.gs-cancel-btn {
  padding: 12px 22px; border-radius: 11px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.45); font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 600; text-decoration: none;
  transition: all 0.2s; display: inline-flex; align-items: center;
}
.gs-cancel-btn:hover { background: rgba(255,255,255,0.08); color: white; }

.gs-submit-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 24px; border-radius: 11px; border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; font-family: 'Syne', sans-serif;
  font-size: 0.88rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 6px 20px rgba(99,102,241,0.3);
}
.gs-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(99,102,241,0.4); }
.gs-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.gs-btn-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Preview */
.gs-addprod-preview { position: sticky; top: 88px; }
.gs-preview-label {
  font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
  color: rgba(255,255,255,0.25); letter-spacing: 0.08em;
  text-transform: uppercase; margin: 0 0 12px;
}
.gs-preview-card {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px; overflow: hidden;
}
.gs-preview-img {
  aspect-ratio: 4/3; background: #0d0d14;
  overflow: hidden; position: relative;
}
.gs-preview-img img { width: 100%; height: 100%; object-fit: cover; }
.gs-preview-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; color: rgba(255,255,255,0.12);
}
.gs-preview-placeholder span { font-size: 0.78rem; }

.gs-preview-body { padding: 16px; }
.gs-preview-name {
  font-family: 'Syne', sans-serif; font-size: 0.92rem; font-weight: 700;
  color: #f0f0f5; margin: 0 0 6px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.gs-preview-desc {
  font-size: 0.78rem; color: rgba(255,255,255,0.3); margin: 0 0 10px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; line-height: 1.5;
}
.gs-preview-price {
  font-family: 'Syne', sans-serif; font-size: 1rem;
  font-weight: 800; color: #a5b4fc; margin: 0;
}

@media (max-width: 768px) {
  .gs-addprod-layout { grid-template-columns: 1fr; }
  .gs-addprod-preview { position: static; }
}
</style>
