<template>
  <div class="gs-admin-wrap">

    <!-- Stats Row -->
    <div class="gs-stats-row">
      <div class="gs-stat-card">
        <div class="gs-stat-icon gs-stat-icon-blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 001 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
        </div>
        <div>
          <p class="gs-stat-val">{{ products.length }}</p>
          <p class="gs-stat-lbl">Total Products</p>
        </div>
      </div>
      <div class="gs-stat-card">
        <div class="gs-stat-icon gs-stat-icon-green">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <p class="gs-stat-val">{{ products.filter(p => p.isActive).length }}</p>
          <p class="gs-stat-lbl">Active</p>
        </div>
      </div>
      <div class="gs-stat-card">
        <div class="gs-stat-icon gs-stat-icon-amber">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <p class="gs-stat-val">{{ products.filter(p => !p.isActive).length }}</p>
          <p class="gs-stat-lbl">Inactive</p>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="gs-admin-table-wrap">
      <div class="gs-admin-table-head">
        <h3 class="gs-admin-table-title">All Products</h3>
        <router-link to="/addProduct" class="gs-add-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </router-link>
      </div>

      <div class="gs-admin-table-scroll">
        <table class="gs-admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Featured</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="gs-table-loading">
                <div class="gs-table-spinner"></div>
              </td>
            </tr>
            <tr v-else-if="!products.length">
              <td colspan="4" class="gs-table-empty">No products found</td>
            </tr>
            <tr v-for="product in products" :key="product._id">
              <td>
                <div class="gs-prod-cell">
                  <div class="gs-prod-thumb">
                    <img
                      :src="product.image_url || `https://placehold.co/100x100/1e1b4b/818cf8?font=raleway&text=${encodeURIComponent((product.name||'P').slice(0,2))}`"
                      :alt="product.name"
                    />
                  </div>
                  <div>
                    <p class="gs-prod-name">{{ product.name }}</p>
                    <p class="gs-prod-id">Category:{{ product.category }}</p>
                  </div>
                </div>
              </td>
              <td>
              <i v-if="product.is_featured" class="bi bi-star-fill text-warning"></i>
              <i v-if="!product.is_featured" class="bi bi-star text-white-50"></i>
              </td>
              <td>
                <span class="gs-prod-price">₱{{ product.price?.toLocaleString() }}</span>
              </td>
              <td>
                <span class="gs-status-pill" :class="product.isActive ? 'active' : 'inactive'">
                  <span class="gs-status-dot"></span>
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="gs-action-group">
                  <router-link :to="'/products/' + product._id" class="gs-tbl-btn gs-tbl-view">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View
                  </router-link>
                  <button class="gs-tbl-btn gs-tbl-toggle"
                    @click="toggleAvailability(product._id, product.isActive)">
                    {{ product.isActive ? 'Deactivate' : 'Activate' }}
                  </button>
                  <router-link id="editbtn" class="gs-tbl-btn gs-tbl-edit" :to="{ name: 'ProductUpdate', params: { id: product._id } }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-pencil" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                  </router-link>
                  <button id="delbtn" class="gs-tbl-btn gs-tbl-delete" @click="deleteProduct(product._id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Notyf } from 'notyf';
import api from '../api.js';

const products = ref([]);
const loading = ref(true);
const notyf = new Notyf();
const id = computed(() => route.params?.id || route.params?.productId || props.productId)
async function fetchProducts() {
  try {
    const { data } = await api.get('/products/all');
    products.value = data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function toggleAvailability(id, isActive) {
  try {
    await api.patch(`/products/${id}/${isActive ? 'archive' : 'activate'}`)
    await fetchProducts()
  } catch (e) {
    notyf.error(e.response?.data?.error ?? 'Toggle failed')
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return
  try {
    await api.delete(`/products/${id}/delete`)
    products.value = products.value.filter(p => p._id !== id)
    notyf.success('Product deleted')
  } catch (e) {
    notyf.error(e.response?.data?.error ?? 'Failed to delete product')
  }
}
onMounted(fetchProducts)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-admin-wrap {
  font-family: 'DM Sans', sans-serif;
  padding: 60px 0 60px;
  min-height: 100vh;
  background: #08080f;
}

/* Stats */
.gs-stats-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  max-width: 1200px; margin: 0 auto 28px; padding: 0 24px;
}
.gs-stat-card {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 20px 22px;
  display: flex; align-items: center; gap: 16px;
}
.gs-stat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.gs-stat-icon-blue { background: rgba(99,102,241,0.12); color: #818cf8; }
.gs-stat-icon-green { background: rgba(52,211,153,0.1); color: #34d399; }
.gs-stat-icon-amber { background: rgba(245,158,11,0.1); color: #fbbf24; }

.gs-stat-val {
  font-family: 'Syne', sans-serif; font-size: 1.6rem;
  font-weight: 800; color: #f0f0f5; margin: 0 0 2px;
}
.gs-stat-lbl { font-size: 0.75rem; color: rgba(255,255,255,0.35); margin: 0; }

/* Table Wrap */
.gs-admin-table-wrap {
  max-width: 1400px; margin: 0 auto;
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px; overflow: hidden;
}
.gs-admin-table-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.gs-admin-table-title {
  font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
  color: #f0f0f5; margin: 0;
}
.gs-add-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; padding: 9px 18px; border-radius: 10px;
  font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700;
  text-decoration: none; transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.gs-add-btn:hover { transform: translateY(-1px); color: white; }

/* Table */
.gs-admin-table-scroll { overflow-x: auto; }
.gs-admin-table {
  width: 100%; border-collapse: collapse;
}
.gs-admin-table th {
  padding: 12px 24px; text-align: left;
  font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
  color: rgba(255,255,255,0.3); letter-spacing: 0.07em; text-transform: uppercase;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.gs-admin-table td {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;
}
.gs-admin-table tr:last-child td { border-bottom: none; }
.gs-admin-table tr:hover td { background: rgba(255,255,255,0.015); }

/* Product Cell */
.gs-prod-cell { display: flex; align-items: center; gap: 14px; }
.gs-prod-thumb {
  width: 44px; height: 44px; border-radius: 10px;
  overflow: hidden; flex-shrink: 0; background: #1a1a28;
}
.gs-prod-thumb img { width: 100%; height: 100%; object-fit: cover; }
.gs-prod-name {
  font-size: 0.88rem; font-weight: 600; color: #f0f0f5; margin: 0 0 2px;
}
.gs-prod-id {
  font-size: 0.7rem; color: rgba(255,255,255,0.2);
  font-family: 'Courier New', monospace; margin: 0;
}

.gs-prod-price {
  font-family: 'Syne', sans-serif; font-size: 0.9rem;
  font-weight: 700; color: #a5b4fc;
}

/* Status Pill */
.gs-status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 100px;
  font-size: 0.72rem; font-weight: 700;
  font-family: 'Syne', sans-serif; letter-spacing: 0.04em;
}
.gs-status-dot { width: 5px; height: 5px; border-radius: 50%; }
.gs-status-pill.active {
  background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399;
}
.gs-status-pill.active .gs-status-dot { background: #34d399; box-shadow: 0 0 6px #34d399; }
.gs-status-pill.inactive {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3);
}
.gs-status-pill.inactive .gs-status-dot { background: rgba(255,255,255,0.25); }

/* Actions */
.gs-action-group { display: flex; gap: 8px; }
.gs-tbl-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 13px; border-radius: 8px;
  font-size: 0.76rem; font-weight: 600;
  font-family: 'Syne', sans-serif; cursor: pointer;
  transition: all 0.2s; text-decoration: none; border: none;
  white-space: nowrap;
}
.gs-tbl-delete {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: #f87171;
}
.gs-tbl-delete:hover {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.4);
  color: #fca5a5;
}

.gs-tbl-edit {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: #f87171;
}
.gs-tbl-edit:hover {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.4);
  color: #fca5a5;
}
#delbtn, #editbtn {
  margin-left: auto;
}
.gs-tbl-view {
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #818cf8;
}
.gs-tbl-view:hover { background: rgba(99,102,241,0.2); color: #c7d2fe; }
.gs-tbl-toggle {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);
}
.gs-tbl-toggle:hover { background: rgba(255,255,255,0.08); color: white; }

/* Table Loading/Empty */
.gs-table-loading, .gs-table-empty {
  text-align: center; padding: 48px !important;
  color: rgba(255,255,255,0.25); font-size: 0.88rem;
}
.gs-table-spinner {
  width: 28px; height: 28px; margin: 0 auto;
  border: 2px solid rgba(99,102,241,0.2);
  border-top-color: #6366f1; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .gs-stats-row { grid-template-columns: 1fr; }
}
</style>
