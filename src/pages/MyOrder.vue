<template>
  <div class="gs-orders-page">
    <div class="gs-orders-inner">

      <div class="gs-orders-header">
        <p class="gs-orders-eyebrow">Your Account</p>
        <h1 class="gs-orders-title">My Orders</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="gs-loading">
        <div class="gs-spinner"></div>
        <p>Loading your orders...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="!orders.length" class="gs-empty-state">
        <div class="gs-empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </div>
        <h3>No orders yet</h3>
        <p>Start shopping to see your orders here</p>
        <RouterLink to="/products" class="gs-btn-primary">
          Start Shopping
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </RouterLink>
      </div>

      <!-- Orders List -->
      <div v-else class="gs-orders-list">
        <div
          v-for="order in orders"
          :key="order._id"
          class="gs-order-card"
        >
          <!-- Order Header -->
          <div class="gs-order-head">
            <div class="gs-order-head-left">
              <span class="gs-status-badge" :class="`gs-status-${(order.status || 'pending').toLowerCase()}`">
                <span class="gs-status-dot"></span>
                {{ statusMap[order.status]?.label || order.status }}
              </span>
              <p class="gs-order-id">#{{ order._id?.slice(-8).toUpperCase() }}</p>
            </div>
            <div class="gs-order-head-right">
              <p class="gs-order-total">₱{{ order.totalPrice?.toLocaleString() }}</p>
              <p class="gs-order-date">{{ formatDate(order.orderedOn) }}</p>
            </div>
          </div>

          <!-- Order Items -->
          <div class="gs-order-items">
            <div
              v-for="item in order.productsOrdered"
              :key="item._id"
              class="gs-order-item"
            >
              <div class="gs-order-item-img">
                <img
                  :src="item.product_image || `https://placehold.co/200x200/1e1b4b/818cf8?font=raleway&text=${encodeURIComponent((item.productId?.name || 'P').slice(0,2))}`"
                  :alt="item.productId?.name"
                  width="52" height="52"
                />
              </div>
              <div class="gs-order-item-info">
                <p class="gs-order-item-name">{{ item.productId?.name || 'Unknown Product' }}</p>
                <p class="gs-order-item-qty">Qty: {{ item.quantity }}</p>
              </div>
              <span class="gs-order-item-price">₱{{ item.subtotal?.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api.js'

const orders = ref([])
const loading = ref(true)

const statusMap = {
  Pending:   { label: 'Pending' },
  Shipped:   { label: 'Shipped' },
  Delivered: { label: 'Delivered' },
  Cancelled: { label: 'Cancelled' },
  processing: { label: 'Processing' },
  shipped:   { label: 'Shipped' },
  delivered: { label: 'Delivered' },
  cancelled: { label: 'Cancelled' },
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

onMounted(async () => {
  try {
    const { data } = await api.get('/orders/my-orders');
    orders.value = data;
  } catch { } finally { loading.value = false }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-orders-page {
  min-height: 100vh; background: #08080f;
  padding: 100px 0 60px;
  font-family: 'DM Sans', sans-serif; color: #f0f0f5;
}
.gs-orders-inner { max-width: 800px; margin: 0 auto; padding: 0 24px; }

.gs-orders-header { margin-bottom: 40px; }
.gs-orders-eyebrow {
  font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 700;
  color: #818cf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 10px;
}
.gs-orders-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem); font-weight: 800;
  color: #f0f0f5; margin: 0; letter-spacing: -0.02em;
}

/* Loading */
.gs-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px 0; }
.gs-loading p { color: rgba(255,255,255,0.35); font-size: 0.9rem; }
.gs-spinner {
  width: 36px; height: 36px;
  border: 2.5px solid rgba(99,102,241,0.2);
  border-top-color: #6366f1; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.gs-empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 80px 20px; text-align: center;
}
.gs-empty-icon {
  width: 90px; height: 90px;
  background: rgba(99,102,241,0.07);
  border: 1px solid rgba(99,102,241,0.14);
  border-radius: 22px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(99,102,241,0.4); margin-bottom: 24px;
}
.gs-empty-state h3 {
  font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700;
  margin: 0 0 8px; color: #f0f0f5;
}
.gs-empty-state p { color: rgba(255,255,255,0.35); margin: 0 0 28px; }

.gs-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; padding: 13px 26px; border-radius: 12px;
  font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 700;
  text-decoration: none; box-shadow: 0 8px 24px rgba(99,102,241,0.3);
  transition: all 0.2s;
}
.gs-btn-primary:hover { transform: translateY(-1px); color: white; }

/* Orders */
.gs-orders-list { display: flex; flex-direction: column; gap: 16px; }

.gs-order-card {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px; overflow: hidden;
  transition: border-color 0.2s;
}
.gs-order-card:hover { border-color: rgba(99,102,241,0.2); }

.gs-order-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-wrap: wrap; gap: 10px;
}
.gs-order-head-left { display: flex; align-items: center; gap: 14px; }
.gs-order-head-right { text-align: right; }

/* Status Badge */
.gs-status-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 13px; border-radius: 100px;
  font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.04em;
}
.gs-status-dot { width: 6px; height: 6px; border-radius: 50%; }

.gs-status-pending,
.gs-status-processing {
  background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); color: #fbbf24;
}
.gs-status-pending .gs-status-dot,
.gs-status-processing .gs-status-dot { background: #fbbf24; box-shadow: 0 0 6px #fbbf24; }

.gs-status-shipped {
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #818cf8;
}
.gs-status-shipped .gs-status-dot { background: #818cf8; box-shadow: 0 0 6px #818cf8; }

.gs-status-delivered {
  background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399;
}
.gs-status-delivered .gs-status-dot { background: #34d399; box-shadow: 0 0 6px #34d399; }

.gs-status-cancelled {
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #f87171;
}
.gs-status-cancelled .gs-status-dot { background: #f87171; }

.gs-order-id {
  font-size: 0.75rem; color: rgba(255,255,255,0.25);
  font-family: 'Courier New', monospace; margin: 0;
}
.gs-order-total {
  font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800;
  color: #a5b4fc; margin: 0 0 2px;
}
.gs-order-date { font-size: 0.75rem; color: rgba(255,255,255,0.3); margin: 0; }

/* Order Items */
.gs-order-items { padding: 16px 22px; display: flex; flex-direction: column; gap: 12px; }

.gs-order-item {
  display: flex; align-items: center; gap: 14px;
}
.gs-order-item-img {
  width: 52px; height: 52px; border-radius: 10px;
  overflow: hidden; flex-shrink: 0; background: #1a1a28;
}
.gs-order-item-img img { width: 100%; height: 100%; object-fit: cover; }
.gs-order-item-info { flex: 1; }
.gs-order-item-name {
  font-size: 0.88rem; font-weight: 600; color: #f0f0f5; margin: 0 0 2px;
}
.gs-order-item-qty { font-size: 0.76rem; color: rgba(255,255,255,0.35); margin: 0; }
.gs-order-item-price {
  font-family: 'Syne', sans-serif; font-size: 0.9rem;
  font-weight: 700; color: #a5b4fc;
}
</style>
