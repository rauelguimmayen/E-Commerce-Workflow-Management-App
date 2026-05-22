<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import api from '../api.js'

const products = ref([])


const featuredProducts = computed(() => products.value.slice(0, 4))

onMounted(async () => {
  try {
    const { data } = await api.get('/products/active')
    products.value = data
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 pb-8" style="padding-top: 70px;">

    <!-- Hero -->
    <div class="mb-10 text-center hero-fade">
      <h1 id="homebanner" class="text-4xl md:text-6xl font-black tracking-tight mb-3">
        Discover <span class="text-primary">Amazing</span> Products
      </h1>
      <p id="hometagline" class="text-muted text-lg max-w-xl mx-auto">
        Explore our curated collection of premium physical goods.
      </p>
    </div>

    <!-- 4 Featured Products -->
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
      <ProductCard
        v-for="product in featuredProducts"
        :key="product._id"
        :productData="product"
      />
    </div>

    
    <div class="text-center">
      <router-link id="homepagebutton" to="/products" class="btn btn-primary btn-lg px-5">
        View All Products <i class="bi bi-arrow-right ms-2"></i>
      </router-link>
    </div>

  </div>
</template>

<style scoped>
.hero-fade {
  animation: fadeDown 0.5s ease both;
}
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>