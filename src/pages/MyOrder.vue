<template>
  <div class="container py-5" style="padding-top:100px!important">
    <p class="text-violet fw-semibold text-uppercase small mb-2">Your Account</p>
    <h1 class="fw-black mb-5" style="font-size:clamp(2.5rem,6vw,4rem)">My Orders</h1>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-violet"></div>
    </div>

    <div v-else-if="!orders.length" class="text-center py-5">
      <div class="mx-auto bg-sv-gray rounded-3 d-flex align-items-center justify-content-center mb-4" style="width:96px;height:96px">
        <i class="bi bi-bag display-4 text-muted"></i>
      </div>
      <h4 class="fw-bold">No orders yet</h4>
      <p class="text-muted">Start shopping to see your orders here</p>
      <RouterLink to="/products" class="btn btn-sv px-5 py-3 mt-2">Start Shopping <i class="bi bi-arrow-right ms-1"></i></RouterLink>
    </div>

    <div v-else>
      <div v-for="order in orders" :key="order._id" class="card border-2 mb-4 overflow-hidden shadow-sm" style="border-radius:16px">
        <div class="card-header bg-white d-flex flex-column flex-sm-row justify-content-between gap-2 py-3">
          <div class="d-flex align-items-center gap-3">
            <i class="bi fs-5 " :class="[statusMap[order.status]?.icon, statusMap[order.status]?.text]"></i>
            <div>
              <span class="badge px-3 py-2 rounded-pill text-dark" :class="statusMap[order.status]?.badge">
                {{ statusMap[order.status]?.label }}
              </span>
              <p class="mb-0 font-monospace small text-muted mt-1">#{{ order._id?.slice(-8).toUpperCase() }}</p>
            </div>
          </div>
          <div class="text-sm-end">
            <p class="fw-black fs-4 mb-0">PHP {{ order.totalPrice?.toLocaleString() }}</p>
            <small class="text-muted">{{ formatDate(order.orderedOn) }}</small>
          </div>
        </div>
        <div class="card-body py-3">
          <div v-for="item in order.productsOrdered" :key="item._id" class="d-flex align-items-center gap-3 mb-2">
            <img :src="item.product_image || `https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(item.productId?.name || 'Product')}`"
                 class="rounded-2" width="56" height="56" style="object-fit:cover">
            <div class="flex-grow-1">
              <p class="mb-0 fw-semibold">{{ item.productId?.name || 'Unknown Product' }}</p>
              <p class="mb-0 text-muted font-monospace small" style="font-size: 0.8rem;">
                #{{ (item.productId?._id || item.productId?.toString() || '').slice(-8).toUpperCase() }}
              </p>
              <small class="text-muted">Qty: {{ item.quantity }}</small>
            </div>
            <span class="fw-bold">PHP {{ item.subtotal?.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api.js'


const orders  = ref([])
const loading = ref(true)
const productNames = ref({})
const statusMap = {
  Pending:   { label: 'Pending',    badge: 'badge-processing', icon: 'bi-clock-fill',      text: 'text-violet' },
  Shipped:   { label: 'Shipped',    badge: 'badge-shipped',    icon: 'bi-truck',            text: 'text-primary' },
  Delivered: { label: 'Delivered',  badge: 'badge-delivered',  icon: 'bi-check-circle-fill',text: 'text-success' },
  Cancelled: { label: 'Cancelled',  badge: 'badge-cancelled',  icon: 'bi-x-circle-fill',    text: 'text-danger' }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const fetchProductName = async (productId) => {
  if (productNames.value[productId]) return
  try {
    const { data } = await api.get(`/products/${productId}`)
    console.log('Product data:', data)
    productNames.value[productId] = data.name
  } catch (error) {
    console.log('Failed ID:', productId)
    console.log('Error:', error.response?.data)
    productNames.value[productId] = 'Unknown Product'
  }
}

onMounted(async () => {
  try { orders.value = await api.orders.my() }
  catch {}
  finally { loading.value = false }
})
</script>
