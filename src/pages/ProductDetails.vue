<template>
  <div class="container my-5" v-if="product">
    <div class="row">
      <div class="col-md-6">
        <img class="img-fluid rounded"
          :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(product.name)}`"
          :alt="product.name" />
      </div>
      <div class="col-md-6">
        <h2 class="fw-bold">{{ product.name }}</h2>
        <p class="text-muted">{{ product.description }}</p>
        <p><span class="fw-bold">Price:</span> PHP {{ product.price }}</p>
        <!-- Quantity Controls -->
        <div class="d-flex align-items-center gap-3 my-3">
          <span class="fw-bold">Quantity:</span>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary" @click="decreaseQty">−</button>
            <span class="fw-bold px-2">{{ quantity }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="increaseQty">+</button>
          </div>
          <span class="text-muted">Total: PHP {{ (product.price * quantity).toFixed(2) }}</span>
        </div>
        <button
          class="btn btn-success w-100"
          @click="addToCart"
          :disabled="!isLoggedIn"
          :title="!isLoggedIn ? 'Please log in to add items to cart' : ''"
        >
          {{ isLoggedIn ? 'Add to Cart' : 'Log in to Add to Cart' }}
        </button>
        <router-link class="btn btn-outline-secondary w-100 mt-2" to="/products">← Back to Products</router-link>
      </div>
    </div>
  </div>
  <div v-else class="text-center my-5">Loading...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api.js';

const route = useRoute();
const product = ref(null);
const quantity = ref(1);
const notyf = new Notyf();

const isLoggedIn = ref(!!localStorage.getItem('token')); // adjust key to match your auth setup

onMounted(async () => {
  const { data } = await api.get(`/products/${route.params.id}`);
  product.value = data;
});

function increaseQty() {
  quantity.value++;
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--;
}

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