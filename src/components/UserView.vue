<template>
  <div class="row">
    <div class="col my-5">
      <h1 class="text-center text-primary py-1">Product List</h1>
      <ProductSearch @searching="isSearching = $event" />
    </div>
  </div>

  <div class="row" v-if="!isSearching">
    <ProductCard 
      v-for="product in props.productsData" 
      :key="product._id" 
      :productData="product" 
    />
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import ProductCard from '../components/ProductCard.vue';
    import ProductSearch from '../components/ProductSearch.vue';
    const isSearching = ref(false)
    const props = defineProps({
        productsData: Array
    });
</script>