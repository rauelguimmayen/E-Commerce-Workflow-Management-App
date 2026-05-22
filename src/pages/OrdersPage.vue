<template>
  <div class="admin-page">
    <div class="container py-4">
      <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <RouterLink to="/products" class="text-violet small text-decoration-none">← Dashboard</RouterLink>
          <h4 class="text-white fw-black mb-0 mt-1">All Orders</h4>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-violet"></div>
      </div>

      <div id="ordertable" v-else class="admin-card overflow-hidden">
        <div class="table-responsive">
          <table class="table table-dark table-hover mb-0 align-middle">
            <thead><tr class="border-white border-opacity-10">
              <th class="text-white-50 fw-normal px-4">Order</th>
              <th class="text-white-50 fw-normal">Customer</th>
              <th class="text-white-50 fw-normal">Items</th>
              <th class="text-white-50 fw-normal">Total</th>
              <th class="text-white-50 fw-normal">Status</th>
              <th class="text-white-50 fw-normal">Date</th>
            </tr></thead>
            <tbody>
              <tr v-for="order in orders" :key="order._id" class="border-white border-opacity-10">
                <td class="px-4 font-monospace small text-white-50">#{{ order._id?.slice(-8).toUpperCase() }}</td>
                <td class="small">
                  <div v-if="order.userId && typeof order.userId === 'object'">
                    <div class="fw-bold text-white">{{ order.userId.firstName }} {{ order.userId.lastName }}</div>
                    <div class="text-white-50 small mb-1">{{ order.userId.email }}</div>
                    <div class="font-monospace text-white-50" style="font-size: 0.75rem;">ID: #{{ (order.userId._id || '').slice(-8).toUpperCase() }}</div>
                  </div>
                  <div v-else>
                    <span class="font-monospace text-white-50">#{{ (order.userId?.toString() || '').slice(-8).toUpperCase() }}</span>
                  </div>
                </td>
                <td class="small text-white-50">
                  <div v-if="order.productsOrdered && order.productsOrdered.length">
                    <div v-for="item in order.productsOrdered" :key="item._id" class="d-flex align-items-center gap-2 mb-2">
                      <img :src="item.product_image || (item.productId && typeof item.productId === 'object' && item.productId.imageUrl) || `https://placehold.co/100x100/63c3ff/ffffff?font=raleway&text=${encodeURIComponent((item.productId && typeof item.productId === 'object' ? item.productId.name : 'Product') || 'Product')}`"
                           class="rounded" width="32" height="32" style="object-fit:cover">
                      <div>
                        <div class="text-white fw-semibold">
                          {{ item.productId && typeof item.productId === 'object' ? item.productId.name : 'Unknown Product' }}
                        </div>
                        <div class="text-white-50 small" style="font-size: 0.75rem;">
                          Qty: {{ item.quantity }} | PHP {{ (item.subtotal || 0).toLocaleString() }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>0 items</div>
                </td>
                <td class="fw-bold text-violet">PHP {{ order.totalPrice?.toLocaleString() }}</td>
                <td>
                  <select class="form-select form-select-sm bg-transparent text-white border-white border-opacity-25"
                          style="width:130px"
                          :value="order.status"
                          @change="updateStatus(order._id, $event.target.value)">
                    <option v-for="s in statuses" :key="s" :value="s" class="text-dark">{{ s }}</option>
                  </select>
                </td>
                <td class="text-white-50 small">{{ formatDate(order.orderedOn) }}</td>
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

  const orders  = ref([])
  const loading = ref(true)
  const notyf = new Notyf()
  const statuses = ['processing', 'shipped', 'delivered', 'cancelled']

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  async function updateStatus(id, status) {
    try {
      await api.orders.updateStatus(id, status)
      const o = orders.value.find(o => o._id === id)
      if (o) o.status = status
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
