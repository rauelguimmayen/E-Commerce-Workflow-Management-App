<script setup>
import { useGlobalStore } from "../stores/global";
import { ref } from 'vue';
const { user, store } = useGlobalStore();

const email = ref("");
import '../style.css'
import ResetPassword from '../pages/ResetPassword.vue';
const emit = defineEmits(['open-reset'])


</script>

<template>

   <nav id="fixnavbar" class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">

    <div class="container">

      <router-link :to="{ name: 'Home' }" id="brand" class="navbar-brand">GlobalCart</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <router-link :to="{ name: 'Products' }" class="nav-link" v-if="!user.isAdmin">Browse Products</router-link>
          <router-link :to="{ name: 'Products' }" class="nav-link" v-if="user.email && user.isAdmin">Admin Dashboard</router-link>
          <router-link :to="{ name: 'AddProduct' }" class="nav-link" v-if="user.email && user.isAdmin">Add Product</router-link>
          <router-link :to="{ name: 'OrdersPage' }" class="nav-link" v-if="user.email && user.isAdmin">Orders</router-link>
          <router-link :to="{ name: 'Cart' }" class="nav-link position-relative" v-if="user.email && !user.isAdmin"><i class="bi bi-cart3" style="font-size: 1.2rem;"></i>
          </router-link>
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
              Menu
            </button>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
              <!-- Logged-in items -->
              <li><button class="dropdown-item" v-if="user.email && !user.isAdmin" @click="$router.push({ name: 'MyOrder' })">MyOrder</button></li>
              <li><button class="dropdown-item" v-if="user.email" @click="$router.push({ name: 'ProfilePage' })">Profile</button></li>
              <li><button class="dropdown-item text-white" v-if="user.email" @click="emit('open-reset')">Reset Password</button></li>
              <li><button class="dropdown-item" v-if="user.email" @click="$router.push({ name: 'Logout' })">Logout</button></li>

              <!-- Guest items (always visible when not logged in) -->
              <li><button class="dropdown-item" v-if="!user.email" @click="$router.push({ name: 'Register' })">Register</button></li>
              <li><button class="dropdown-item" v-if="!user.email" @click="$router.push({ name: 'Login' })">Login</button></li>
            </ul>
          </div>
          
          
        </div>
      </div>
    </div>
  </nav>

</template>
