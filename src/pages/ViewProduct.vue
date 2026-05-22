<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api.js';
import { Notyf } from 'notyf';
import { useGlobalStore } from '../stores/global.js';
const notyf = new Notyf();
const route = useRoute();
const router = useRouter();
const { user } = useGlobalStore();
const product = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const { data } = await api.get(`/products/specific/${route.params.id}`);
    product.value = data;
  } catch (err) {
    error.value = 'Failed to load product.';
    notyf.error('Failed to load product!');
    console.log(err.response?.data);
  } finally {
    isLoading.value = false;
  }
});

function goBack() {
  router.push({ path: '/products' });
}
</script>

<template>
    <div class="container">
        <div class="row mx-auto my-5 gap-4 gap-md-0">
            <div class="col-md-6">
                <img 
                    class="img-fluid rounded" 
                    :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent('Sample Product')}`"
                    :alt="product.data.name"
                >
            </div>
            <div class="col-md-6">
                <div class="d-flex gap-2 text-primary">
                    <h1 class="bi bi-mortarboard"></h1>
                    <h1 class="mb-3">{{product.data.name}}</h1>
                </div>
                <h6>Product Description:</h6>
                <p class="text-muted">{{product.data.description}}</p>
                <p>Price: PHP {{product.data.price}}</p>    
                <button class="btn btn-primary" type="button" v-if="user.email && !user.isAdmin" @click="handleAddToCart">Add to Cart</button>
                <button class="btn btn-danger" type="button" v-if="user.email && user.isAdmin" disabled>Add to Cart</button>
                <router-link to="/login" class="btn btn-outline-danger" type="button" v-if="!user.email">Log in</router-link>
            </div>
        </div>
    </div>

</template>