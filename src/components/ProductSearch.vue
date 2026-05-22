<template>
  <div class="container py-4">
    <button v-if="hasSearched" class="btn btn-outline-secondary btn-sm mb-3" @click="clearSearch">
  ✕ Clear Search </button>
    <!-- Search by Name -->
    <form @submit.prevent="searchByName" class="mb-4">
      <div class="input-group">
        <input type="text" v-model="productName" class="form-control" placeholder="Search Products..." required/>
        <button class="btn btn-primary" type="submit" :disabled="isLoading">
          {{ isLoading ? "Searching..." : "Search" }}
        </button>
      </div>
    </form>

    <!-- Search by Price -->
    <form @submit.prevent="searchByPrice" class="mb-4">
      <h6 class="fw-bold">Search by Price</h6>
      <div class="input-group">
        <input type="number" v-model="minPrice" class="form-control" placeholder="Min price" min="0" required/>
        <input type="number" v-model="maxPrice" class="form-control" placeholder="Max price" min="0" required/>
        <button class="btn btn-success" type="submit" :disabled="isLoading">
          {{ isLoading ? "Searching..." : "Search" }}
        </button>
      </div>
    </form>

    <!-- Results -->
    <div v-if="products.length">
      <h5>Results:</h5>
      <div class="row">
        <ProductCard v-for="product in products" :key="product._id" :productData="product" />
      </div>
    </div>
    <div v-else-if="!isLoading && hasSearched">
      <p class="text-muted">No products found.</p>
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue';
import { Notyf } from 'notyf';
import api from '../api.js';
import ProductCard from './ProductCard.vue';

const notyf = new Notyf();

// shared
const products = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);

// search by name
const productName = ref("");

// search by price
const minPrice = ref("");
const maxPrice = ref("");

const searchByName = async () => {
  emit('searching', true)
  try {
    if (!productName.value.trim()) {
      notyf.error("Please enter a product name");
      return;
    }
    isLoading.value = true;
    hasSearched.value = true;
    const response = await api.post('/products/search-by-name', {
      name: productName.value.trim()
    })
    products.value = response.data.products || [];
    if (products.value.length) {
      notyf.success(`Found ${products.value.length} product(s).`)
    } else {
      notyf.error("No products found");
    }
  } catch (error) {
    console.error(error.response?.data)
    notyf.error("Something went wrong while searching.");
  } finally {
    isLoading.value = false;
  }
}

const searchByPrice = async () => {
  emit('searching', true)
  try {
    if (minPrice.value === "" || maxPrice.value === "") {
      notyf.error("Please enter both min and max price");
      return;
    }
    if (Number(minPrice.value) > Number(maxPrice.value)) {
      notyf.error("Min price cannot be greater than max price");
      return;
    }
    isLoading.value = true;
    hasSearched.value = true;
    const response = await api.post('/products/search-by-price', {
      minPrice: Number(minPrice.value),
      maxPrice: Number(maxPrice.value)
    })
    products.value = response.data.products || [];
    if (products.value.length) {
      notyf.success(`Found ${products.value.length} product(s).`)
    } else {
      notyf.error("No products found in this price range");
    }
  } catch (error) {
    console.error(error.response?.data)
    notyf.error("Something went wrong while searching.");
  } finally {
    isLoading.value = false;
  }
}
const emit = defineEmits(['searching'])
const clearSearch = () => {
  products.value = []
  hasSearched.value = false
  productName.value = ""
  minPrice.value = ""
  maxPrice.value = ""
  emit('searching', false)
}
</script>