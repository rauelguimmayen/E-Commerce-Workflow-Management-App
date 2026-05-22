<template>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 my-3">
            <div id="ProductCard" class="card p-2 h-100">
                <img class="card-img-top"
                    :src="productData.imageUrl || `https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(productData.name)}`"
                    :alt="productData.name"
                    style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h4 class="card-title fw-bold mb-2">{{ productData.name }}</h4>
                    <div>
                        <div class="description-wrapper" :class="{ expanded }">
                            <p class="description-text">{{ productData.description }}</p>
                        </div>
                        <button @click="expanded = !expanded" class="btn btn-link p-0">
                            {{ expanded ? 'Show less ▲' : '... Show more ▼' }}
                        </button>
                        <p class="mb-1"><span class="fw-bold">Price:</span> PHP {{ productData.price }}</p>
                    </div>
                    <div class="mt-auto text-center d-flex gap-2">
                       <router-link 
                          v-if="!store.user.isAdmin"
                          class="btn btn-outline-primary flex-grow-1" 
                          :to="'/products/' + productData._id" 
                          title="View Product">
                          <i class="bi bi-eye"></i>
                        </router-link>
                        <button
                        v-if="store.user.email && !store.user.isAdmin"
                        class="btn btn-outline-success flex-grow-1"
                        @click="addToCart"
                        title="Add to Cart"
                    >
                        <i class="bi bi-cart-plus"></i>
                    </button>
                    </div>
                </div>
            </div>
        </div>

</template>


<script setup>

import { Notyf } from 'notyf';
import { useGlobalStore } from "../stores/global.js";
import api from "../api.js";
import { ref } from 'vue'
const expanded = ref(false)
const store = useGlobalStore();
const notyf = new Notyf();
const imageUrl = ref("");
const imageError = ref(false);
const props = defineProps({productData: Object});

async function addToCart() {
    try {
        const res = await api.post('/cart/add-to-cart', {
            productId: props.productData._id,
            quantity: 1,
            subtotal: props.productData.price
        });
        notyf.success("Item added to cart!");
        store.getUserCart(); 
    } catch (error) {
        notyf.error("Failed to add item to cart.");
        console.log(error);
    }
}

</script>
<style scoped>
    .description-wrapper {
        max-height: 60px;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .description-wrapper.expanded {
        max-height: 1000px;
    }
</style>
