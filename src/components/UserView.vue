<template>
  <div class="gs-user-view">
    <ProductSearch @searching="handleSearching" />
    <div v-if="!isSearching">
      <div v-if="isLoading" class="gs-loading">
        <div class="gs-spinner"></div>
      </div>
      <div v-else class="gs-products-grid">
        <ProductCard
          v-for="product in products"
          :key="product._id"
          :productData="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import ProductSearch from './ProductSearch.vue'
import api from '../api.js'

const products = ref([])
const isLoading = ref(true)
const isSearching = ref(false)

const handleSearching = (val) => { isSearching.value = val }

onMounted(async () => {
  try {
    const { data } = await api.get('/products/active')
    products.value = data
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

.gs-user-view { font-family: 'DM Sans', sans-serif; }

.gs-loading { display: flex; justify-content: center; padding: 60px; }
.gs-spinner {
  width: 32px; height: 32px;
  border: 2.5px solid rgba(99,102,241,0.2);
  border-top-color: #6366f1; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.gs-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 4px;
}
</style>
