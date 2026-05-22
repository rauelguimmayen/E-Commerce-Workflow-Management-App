<script setup>
import { reactive, watch } from 'vue';
import api from '../api.js';
import ProductCard from '../components/ProductCard.vue';
import UserView from '../components/UserView.vue';
import AdminView from '../components/AdminView.vue';
import { useGlobalStore } from '../stores/global.js';
import { useRoute } from 'vue-router';
const route = useRoute();
const productId = route.params.id;

const { user } = useGlobalStore();
const products = reactive({ data: [] });

const fetchProducts = async () => {
    if (user.isAdmin) {
        let { data } = await api.get('/products/all');
         products.data = data;
    } else {
        let { data } = await api.get('/products/active');
        products.data = data;
    }
};

watch([user], fetchProducts, { immediate: true });

const handleUpdateProduct = async ({ id, updatedData }) => {
    console.log('Sending update:', updatedData)
  try {
    await api.patch(`/products/${id}/update`, updatedData);
    await fetchProducts();
  } catch (err) {
    console.error('Update failed:', err.response?.data || err.message);
  }
};
const handleDeleteProduct = async ({ id }) => {
  try {
    await api.delete(`/products/${id}`)
    await fetchProducts()
  } catch (err) {
    console.error('Delete failed:', err.response?.data || err.message)
  }
}
const handleToggleAvailability = async ({ id, isActive }) => {
    try {
        if (isActive) {
            await api.patch(`/products/${id}/activate`);
        } else {
            await api.patch(`/products/${id}/archive`);
        }
        await fetchProducts();
    } catch (err) {
        console.error('Toggle failed:', err.response?.data || err.message);
    }
};
</script>
<template>
    <div class="container">
        <AdminView
            v-if="user.isAdmin"
            :productsData="products.data"
            @update-product="handleUpdateProduct"
            @toggle-availability="handleToggleAvailability"
            @delete-product="handleDeleteProduct"   
        />
        <UserView v-if="!user.isAdmin" :productsData="products.data" />
    </div>
</template>