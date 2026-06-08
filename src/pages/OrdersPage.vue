<template>
  <div class="gs-orders-admin-page">
    <div class="gs-orders-admin-inner">

      <!-- Header -->
      <div class="gs-orders-admin-header">
        <div>
          <router-link to="/products" class="gs-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Dashboard
          </router-link>
          <h1 class="gs-orders-admin-title">All Orders</h1>
        </div>
        <div class="gs-orders-count" v-if="!loading">
          {{ orders.length }} order{{ orders.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="gs-loading">
        <div class="gs-spinner"></div>
        <p>Loading orders...</p>
      </div>

      <!-- Table -->
      <div v-else class="gs-orders-table-wrap" id="ordertable">
        <div class="gs-orders-table-scroll">
          <table class="gs-orders-table">
            <thead>
              <tr>
                <!-- <th>Order ID</th> -->
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!orders.length">
                <td colspan="6" class="gs-table-empty">No orders found</td>
              </tr>
              <tr v-for="order in orders" :key="order._id">
                <!-- Order ID -->
                <!-- <td>
                  <span class="gs-order-id-mono">#{{ order._id?.slice(-8).toUpperCase() }}</span>
                </td> -->

                <!-- Customer -->
                <td>
                  <div v-if="order.userId && typeof order.userId === 'object'" class="gs-customer-cell">
                    <div class="gs-customer-avatar">
                      {{ (order.userId.firstName?.[0] || '?').toUpperCase() }}
                    </div>
                    <div>
                      <p class="gs-customer-name">{{ order.userId.firstName }} {{ order.userId.lastName }}</p>
                      <p class="gs-customer-email">{{ order.userId.email }}</p>
                    </div>
                  </div>
                  <span v-else class="gs-order-id-mono">#{{ (order.userId?.toString() || '').slice(-8).toUpperCase() }}</span>
                </td>

                <!-- Items -->
                <td>
                  <div class="gs-items-cell" v-if="order.productsOrdered?.length">
                    <div v-for="(item, i) in order.productsOrdered.slice(0, 2)" :key="item._id" class="gs-item-row">
                      <img
                        :src="item.productId?.image_url || `https://placehold.co/80x80/1e1b4b/818cf8?font=raleway&text=${encodeURIComponent((item.productId?.name||'P').slice(0,2))}`"
                        class="gs-item-thumb"
                        width="32" height="32"
                      />
                      <span class="gs-item-name">{{ item.productId?.name || 'Unknown' }}</span>
                      <span class="gs-item-qty">×{{ item.quantity }}</span>
                    </div>
                    <p class="gs-items-more" v-if="order.productsOrdered.length > 2">
                      +{{ order.productsOrdered.length - 2 }} more item{{ order.productsOrdered.length - 2 !== 1 ? 's' : '' }}
                    </p>
                  </div>
                  <span v-else class="gs-table-muted">No items</span>
                </td>

                <!-- Total -->
                <td>
                  <span class="gs-order-total-val">₱{{ order.totalPrice?.toLocaleString() }}</span>
                </td>

                <!-- Status -->
                <td>
                  <div class="gs-status-select-wrap">
                    <select
                      class="gs-status-select"
                      :class="`gs-status-sel-${(order.status || '').toLowerCase()}`"
                      :value="order.status"
                      @change="updateStatus(order._id, $event.target.value)"
                    >
                      <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                    </select>
                    <svg class="gs-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </td>

                <!-- Date -->
                <td>
                  <span class="gs-order-date">{{ formatDate(order.orderedOn) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api.js'
import { Notyf } from 'notyf'

const orders = ref([])
const loading = ref(true)
const notyf = new Notyf()
const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

async function updateStatus(id, status) {
  try {
    const { data } = await api.put(`/orders/${id}/status`, { status })
    const index = orders.value.findIndex(o => o._id === id)
    if (index !== -1) orders.value[index] = data
    notyf.success('Status updated')
  } catch (e) {
    notyf.error(e.message)
  }
}
onMounted(async () => {
  try {
    orders.value = await api.orders.all()
  } catch (e) {
    notyf.error('Failed to load orders')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-orders-admin-page {
  min-height: 100vh; background: #08080f;
  padding: 90px 0 60px;
  font-family: 'DM Sans', sans-serif; color: #f0f0f5;
}
.gs-orders-admin-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
}

/* Header */
.gs-orders-admin-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 32px; flex-wrap: wrap; gap: 12px;
}
.gs-back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.78rem; color: rgba(255,255,255,0.3); text-decoration: none;
  margin-bottom: 8px; transition: color 0.2s;
}
.gs-back-link:hover { color: #818cf8; }
.gs-orders-admin-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800;
  color: #f0f0f5; margin: 0; letter-spacing: -0.02em;
}
.gs-orders-count {
  font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 600;
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
  color: #818cf8; padding: 6px 16px; border-radius: 100px;
}

/* Loading */
.gs-loading { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 80px; }
.gs-loading p { color: rgba(255,255,255,0.3); font-size: 0.85rem; margin: 0; }
.gs-spinner {
  width: 32px; height: 32px;
  border: 2.5px solid rgba(99,102,241,0.2);
  border-top-color: #6366f1; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Table */
.gs-orders-table-wrap {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px; overflow: hidden;
}
.gs-orders-table-scroll { overflow-x: auto; }

.gs-orders-table { width: 100%; border-collapse: collapse; }
.gs-orders-table th {
  padding: 14px 20px; text-align: left;
  font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
  color: rgba(255,255,255,0.25); letter-spacing: 0.08em; text-transform: uppercase;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;
}
.gs-orders-table td {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;
}
.gs-orders-table tr:last-child td { border-bottom: none; }
.gs-orders-table tbody tr:hover td { background: rgba(255,255,255,0.012); }

.gs-order-id-mono {
  font-family: 'Courier New', monospace; font-size: 0.78rem;
  color: rgba(255,255,255,0.3); letter-spacing: 0.04em;
}

/* Customer */
.gs-customer-cell { display: flex; align-items: center; gap: 11px; }
.gs-customer-avatar {
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-size: 0.78rem;
  font-weight: 700; color: white; flex-shrink: 0;
}
.gs-customer-name { font-size: 0.85rem; font-weight: 600; color: #f0f0f5; margin: 0 0 2px; }
.gs-customer-email { font-size: 0.72rem; color: rgba(255,255,255,0.25); margin: 0; }

/* Items */
.gs-items-cell { display: flex; flex-direction: column; gap: 6px; }
.gs-item-row { display: flex; align-items: center; gap: 8px; }
.gs-item-thumb { border-radius: 6px; object-fit: cover; background: #1a1a28; flex-shrink: 0; }
.gs-item-name { font-size: 0.78rem; color: rgba(255,255,255,0.6); flex: 1; }
.gs-item-qty { font-size: 0.72rem; color: rgba(255,255,255,0.25); white-space: nowrap; }
.gs-items-more { font-size: 0.7rem; color: rgba(255,255,255,0.2); margin: 0; }
.gs-table-muted { font-size: 0.78rem; color: rgba(255,255,255,0.2); }

.gs-order-total-val {
  font-family: 'Syne', sans-serif; font-size: 0.92rem;
  font-weight: 700; color: #a5b4fc;
}

/* Status Select */
.gs-status-select-wrap { position: relative; display: inline-flex; align-items: center; }
.gs-status-select {
  appearance: none; -webkit-appearance: none;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px; padding: 7px 30px 7px 12px;
  font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 700;
  color: rgba(255,255,255,0.55); cursor: pointer;
  transition: all 0.2s; outline: none;
}
.gs-status-select:focus { border-color: rgba(99,102,241,0.4); }
.gs-status-select option { background: #13131a; color: white; }

.gs-status-sel-processing { color: #fbbf24; border-color: rgba(245,158,11,0.25); background: rgba(245,158,11,0.08); }
.gs-status-sel-shipped { color: #818cf8; border-color: rgba(99,102,241,0.25); background: rgba(99,102,241,0.08); }
.gs-status-sel-delivered { color: #34d399; border-color: rgba(52,211,153,0.25); background: rgba(52,211,153,0.08); }
.gs-status-sel-cancelled { color: #f87171; border-color: rgba(239,68,68,0.25); background: rgba(239,68,68,0.08); }

.gs-select-chevron { position: absolute; right: 9px; pointer-events: none; opacity: 0.4; }

.gs-order-date { font-size: 0.78rem; color: rgba(255,255,255,0.3); white-space: nowrap; }
.gs-table-empty { text-align: center; padding: 60px !important; color: rgba(255,255,255,0.2); font-size: 0.88rem; }
</style>
