<script setup>
import { useGlobalStore } from "../stores/global.js";
import api from "../api.js";
import { Notyf } from 'notyf';
import CartTable from '../components/CartTable.vue';
import { ref } from "vue"

const notyf = new Notyf();
const store = useGlobalStore();
store.getUserCart();



async function removeItem(productId) {
  try {
    await api.patch(`/cart/${productId}/remove-from-cart`)
    notyf.success('Item removed from cart')
    store.getUserCart()
  } catch (error) {
    console.log(error)
    notyf.error(error.response?.data?.message ?? 'Failed to remove item')
  }
}

async function clearCart() {
  try {
    await api.put(`/cart/clear-cart/`);
    store.getUserCart();
  } catch (error) {
    console.log(error);
  }
}

async function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;

  const item = store.userCart.items.find(i => i.productId._id === productId);
  if (item) item.quantity = newQuantity;

  try {
    await api.patch(`/cart/update-cart-quantity`, {
      productId: productId,
      newQuantity: newQuantity
    });
    store.getUserCart();
  } catch (error) {
    console.log(error);
    store.getUserCart();
  }
}

async function checkout() {
  if (store.userCart.items.length === 0) {
    notyf.error('Your cart is empty');
    return;
  }
  try {
    await api.post('/orders/checkout');
    notyf.success('Checkout Successful');
    store.getUserCart();
  } catch (error) {
    console.log(error);
    notyf.error(error.response.data.message)
  }
}

const productCache = ref({})

async function fetchProduct(productId) {
  if (productCache.value[productId]) return
  try {
    const { data } = await api.get(`/products/${productId}`)
    productCache.value[productId] = data
  } catch (e) {
    productCache.value[productId] = { name: 'Unknown Product' }
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="fw-black mb-0">My Cart</h2>
      <button @click="clearCart" class="btn btn-outline-danger btn-sm"
        :disabled="!store.userCart || store.userCart.items.length === 0">
        <i class="bi bi-trash me-1"></i> Clear Cart
      </button>
    </div>

    <!-- Cart Items -->
    <div v-if="store.userCart && store.userCart.items.length > 0">
      <div class="card border-0 shadow-sm mb-3" v-for="item in store.userCart.items" :key="item._id">
        <div class="card-body d-flex align-items-center gap-3">

          <!-- Product Initial Avatar -->
          <div class="rounded-3 bg-primary d-flex align-items-center justify-content-center flex-shrink-0"
            style="width:56px;height:56px">
            <span class="text-white fw-bold">
              {{ (item.productId?.name || 'P').slice(0, 2).toUpperCase() }}
            </span>
          </div>

          <!-- Product Info -->
          <div class="flex-grow-1">
            <h6 class="mb-0 fw-bold">{{ item.productId?.name || 'Unknown Product' }}</h6>
            <p class="mb-0 text-muted font-monospace small">#{{ (item.productId?._id || item.productId?.toString() || '').slice(-8).toUpperCase() }}</p>
            <small class="text-muted">PHP {{ item.productId?.price?.toLocaleString() || '0' }} | Subtotal: PHP {{ item.subtotal?.toLocaleString() }}</small>
          </div>

          <!-- Quantity Controls -->
          <div class="input-group input-group-sm" style="max-width:120px">
            <button class="btn btn-outline-secondary" type="button"
              @click="updateQuantity(item.productId?._id || item.productId, item.quantity - 1)">−</button>
            <input type="number" class="form-control text-center" v-model="item.quantity"
              @change="updateQuantity(item.productId?._id || item.productId, item.quantity)" min="1">
            <button class="btn btn-outline-secondary" type="button"
              @click="updateQuantity(item.productId?._id || item.productId, item.quantity + 1)">+</button>
          </div>

          <!-- Remove Button -->
          <button class="btn btn-outline-danger btn-sm" @click="removeItem(item.productId?._id || item.productId)">
            <i class="bi bi-x-lg"></i>
          </button>

        </div>
      </div>

      <!-- Order Summary -->
      <div class="card border-0 shadow-sm mt-4">
        <div class="card-body">
          <h5 class="fw-bold mb-3">Order Summary</h5>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Items ({{ store.userCart.items.length }})</span>
            <span>PHP {{ store.userCart.totalAmount?.toLocaleString() }}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between fw-black fs-5">
            <span>Total</span>
            <span class="text-success">PHP {{ store.userCart.totalAmount?.toLocaleString() }}</span>
          </div>
          <button @click="checkout" class="btn btn-success w-100 mt-3 py-2 fw-bold">
            <i class="bi bi-bag-check me-2"></i> Checkout
          </button>
        </div>
      </div>

    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-5">
      <div class="mx-auto d-flex align-items-center justify-content-center rounded-3 bg-light mb-4"
        style="width:96px;height:96px">
        <i class="bi bi-cart3 display-4 text-muted"></i>
      </div>
      <h4 class="fw-bold">Your cart is empty</h4>
      <p class="text-muted">Add some products to get started</p>
      <RouterLink to="/products" class="btn btn-primary px-5 py-2 mt-2">
        Start Shopping <i class="bi bi-arrow-right ms-1"></i>
      </RouterLink>
    </div>

  </div>
</template>