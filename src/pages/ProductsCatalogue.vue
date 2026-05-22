<script setup>
import { ref } from 'vue';
import api from '../api.js';
import ProductCard from '../components/ProductCard.vue'

const products = ref([]);
const isLoading = ref(true);


async function getProducts() {
        try {
                let res = await api.get('/products/active');
                products.value = res.data;
        } catch (error) {
                console.log(error);
        } finally {
                isLoading.value = false;
        }
}

getProducts();
</script>

<template>
<!--         <h1>Products</h1>
        <div v-if="isLoading">Loading...</div>
        <ul v-else>
                <li v-for="product in products" :key="product._id">
                        {{ product.name }} - {{ product.price }}
                </li>
        </ul> -->
    <div class="container">
        <AdminView
            v-if="user.isAdmin"
            :coursesData="courses.data"
            @update-course="handleUpdateCourse"
            @toggle-availability="handleToggleAvailability"
        />
        <UserView v-if="!user.isAdmin" :productsData="products.data" />
    </div>
</template>