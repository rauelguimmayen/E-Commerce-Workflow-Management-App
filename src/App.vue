<script setup>
import './style.css'
import NavbarComponent from './components/NavbarComponent.vue';
//import { useGlobalStore } from './stores/global.js';
//import { onBeforeMount } from 'vue';
//import { ref } from 'vue'
//const { getUserDetails } = useGlobalStore();
//onBeforeMount(() => getUserDetails(localStorage.getItem("token")));
</script>

<template>
  <NavbarComponent />
  <router-view />

</template>
