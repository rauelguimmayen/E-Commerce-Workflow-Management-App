<template>
  <div class="update-page">
    <div class="page-bg">
      <div class="bg-circle bg-circle--1"></div>
      <div class="bg-circle bg-circle--2"></div>
    </div>

    <div class="container">
      <!-- Back -->
      <button class="back-btn" @click="router.back()">
        <span class="back-arrow">&#8592;</span> Back
      </button>

      <div class="card">
        <!-- Header -->
        <div class="card-header">
          <div class="header-icon">✦</div>
          <div>
            <h1 class="card-title">Update Product</h1>
            <p class="card-sub">ID: <span class="product-id">{{ productId }}</span></p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="state-block">
          <div class="spinner"></div>
          <p>Loading product…</p>
        </div>

        <!-- Fetch error -->
        <div v-else-if="fetchError" class="state-block state-block--error">
          <span class="state-icon">⚠</span>
          <p>{{ fetchError }}</p>
          <button class="btn btn--outline" @click="fetchProduct">Retry</button>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="form" novalidate>
          <div class="field" :class="{ 'field--error': errors.name }">
            <label class="label" for="name">Product Name</label>
            <input
              id="name"
              v-model.trim="form.name"
              class="input"
              type="text"
              placeholder="e.g. Running Shoes Pro"
              @input="clearError('name')"
            />
            <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
          </div>

          <div class="field">
            <label class="label" for="description">Description</label>
            <textarea
              id="description"
              v-model.trim="form.description"
              class="input input--textarea"
              rows="4"
              placeholder="Describe the product…"
            ></textarea>
          </div>
          <div class="field">
                <label class="label">Category</label>
                <select class="input" v-model="form.category">
                <option value="" disabled>Select a category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
                </option>
              </select>
          </div>
          <div class="field" :class="{ 'field--error': errors.price }">
            <label class="label" for="price">Price (₱)</label>
            <div class="input-wrap">
              <span class="input-prefix">₱</span>
              <input
                id="price"
                v-model="form.price"
                class="input input--prefixed"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                @input="clearError('price')"
              />
            </div>
            <span v-if="errors.price" class="error-msg">{{ errors.price }}</span>
          </div>
          <div class="field" :class="{ 'field--error': errors.name }">
            <label class="label" for="name">Product Image</label>
            <input
              id="image_url"
              v-model.trim="form.image_url"
              class="input"
              type="url"
              placeholder="https://..."
              @input="clearError('image_url')"
            />
            <span v-if="errors.image_url" class="error-msg">{{ errors.image_url }}</span>
          </div>

          <!-- Submit feedback -->
          <Transition name="fade">
            <div v-if="submitError" class="alert alert--error">⚠ {{ submitError }}</div>
            <div v-else-if="submitSuccess" class="alert alert--success">✔ Product updated successfully!</div>
          </Transition>

          <div class="form-actions">
            <button type="button" class="btn btn--outline" @click="resetForm" :disabled="submitting">
              Reset
            </button>
            <button type="submit" class="btn btn--primary" :disabled="submitting">
              <span v-if="submitting" class="btn-spinner"></span>
              <span>{{ submitting ? 'Saving…' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api.js' 

const props = defineProps({
  productId: {
    type: String,
    default: null
  }
})

const route  = useRoute()
const router = useRouter()

const id = computed(() => props.productId || route.params?.productId || route.params?.id)

const form = reactive({ name: '', description: '', price: '', category: '', image_url: '' })
const errors   = reactive({})
let original   = null

const loading       = ref(true)
const fetchError    = ref(null)
const submitting    = ref(false)
const submitError   = ref(null)
const submitSuccess = ref(false)
const categories = ['clothing', 'electronics', 'accessories', 'footwear', 'home', 'sports', 'toys & games']

async function fetchProduct() {
  loading.value    = true
  fetchError.value = null
  try {
    const { data } = await api.get(`/products/${id.value}`)
    const product  = data.result ?? data
    original = { name: product.name, description: product.description, price: product.price, category: product.category, image_url: product.image_url}
    Object.assign(form, original)
  } catch (e) {
    fetchError.value = e.response?.data?.error ?? e.message ?? 'Failed to load product.'
  } finally {
    loading.value = false
  }
}

function validate() {
  delete errors.name
  delete errors.price
  if (!form.name)           errors.name  = 'Product name is required.'
  if (form.price === '' || form.price === null) {
    errors.price = 'Price is required.'
  } else if (Number(form.price) < 0) {
    errors.price = 'Price must be a positive number.'
  }
  return Object.keys(errors).length === 0
}

function clearError(field) {
  delete errors[field]
}

function resetForm() {
  if (original) Object.assign(form, original)
  delete errors.name
  delete errors.price
  submitError.value   = null
  submitSuccess.value = false
}

async function handleSubmit() {
  submitError.value   = null
  submitSuccess.value = false
  if (!validate()) return

  submitting.value = true
  try {
    await api.patch(`/products/${id.value}/update`, {
        name: form.name,
        description: form.description,
        category: form.category,
        image_url: form.image_url || undefined,
        price: Number(form.price)
      })
    submitSuccess.value = true
    original = { ...form }
    setTimeout(() => { submitSuccess.value = false }, 3000)
  } catch (e) {
    submitError.value = e.response?.data?.error ?? e.message ?? 'Update failed.'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Root ── */
.update-page {
  min-height: 100vh;
  background: #0c0f1a;
  font-family: 'DM Sans', sans-serif;
  color: #e8eaf0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10px 16px 80px;
  position: relative;
  overflow: hidden;
}

/* ── Background blobs ── */
.page-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.18;
}
.bg-circle--1 {
  width: 520px; height: 520px;
  background: #4f6ef7;
  top: -120px; left: -140px;
}
.bg-circle--2 {
  width: 400px; height: 400px;
  background: #c45cf7;
  bottom: -80px; right: -100px;
}

/* ── Container ── */
.container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
}

/* ── Back button ── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #8b92b8;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 28px;
  padding: 0;
  transition: color 0.2s;
}
.back-btn:hover { color: #e8eaf0; }
.back-arrow { font-size: 1rem; }

/* ── Card ── */
.card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 20px;
  padding: 40px 36px;
  backdrop-filter: blur(20px);
}

/* ── Card header ── */
.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
}
.header-icon {
  width: 48px; height: 48px;
  background: linear-gradient(135deg, #4f6ef7, #c45cf7);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 2px;
  letter-spacing: -0.02em;
}
.card-sub {
  font-size: 0.78rem;
  color: #6b7199;
  margin: 0;
}
.product-id {
  font-family: 'DM Mono', monospace;
  color: #9ba3d4;
  font-size: 0.75rem;
}

/* ── States ── */
.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #8b92b8;
  font-size: 0.9rem;
  text-align: center;
}
.state-block--error { color: #f87171; }
.state-icon { font-size: 1.8rem; }
.spinner {
  width: 36px; height: 36px;
  border: 3px solid rgba(79,110,247,0.2);
  border-top-color: #4f6ef7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Form ── */
.form { display: flex; flex-direction: column; gap: 24px; }

.field { display: flex; flex-direction: column; gap: 8px; }

.label {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8b92b8;
}

.input {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 12px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: #e8eaf0;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.input::placeholder { color: #4a5070; }
.input:focus {
  border-color: #4f6ef7;
  box-shadow: 0 0 0 3px rgba(79,110,247,0.15);
}
.input--textarea { resize: vertical; min-height: 96px; }

.field--error .input {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248,113,113,0.12);
}

.error-msg { font-size: 0.78rem; color: #f87171; }

/* ── Price input ── */
.input-wrap { position: relative; }
.input-prefix {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7199;
  font-size: 0.95rem;
  pointer-events: none;
}
.input--prefixed { padding-left: 30px; }

/* ── Alerts ── */
.alert {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
}
.alert--error  { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }
.alert--success { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }

/* ── Actions ── */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 4px;
}
.btn {
  font-family: 'Syne', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 11px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn:not(:disabled):active { transform: scale(0.97); }

.btn--outline {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: #8b92b8;
}
.btn--outline:not(:disabled):hover {
  border-color: rgba(255,255,255,0.3);
  color: #e8eaf0;
}

.btn--primary {
  background: linear-gradient(135deg, #4f6ef7, #7c5cf7);
  color: #fff;
  box-shadow: 0 4px 20px rgba(79,110,247,0.35);
}
.btn--primary:not(:disabled):hover {
  box-shadow: 0 6px 28px rgba(79,110,247,0.5);
}

.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
select.input {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  cursor: pointer;

}

select.input option {
  background: #0f0f18;
  color: #f0f0f5;
  width: 75%;
}
/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 480px) {
  .card { padding: 28px 20px; }
  .form-actions { flex-direction: column-reverse; }
  .btn { justify-content: center; }
}
</style>