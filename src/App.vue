<script setup>
import './style.css'
import NavbarComponent from './components/NavbarComponent.vue';
import ResetPassword from './pages/ResetPassword.vue'
import { useGlobalStore } from './stores/global.js';
import { onBeforeMount } from 'vue';
import { ref } from 'vue'
const showResetModal = ref(false)
const { getUserDetails } = useGlobalStore();
onBeforeMount(() => getUserDetails(localStorage.getItem("token")));
</script>

<template>
  <NavbarComponent @open-reset="showResetModal = true" />
  <router-view />
  <ResetPassword :show="showResetModal" @close="showResetModal = false" />
</template>
