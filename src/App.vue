<script setup>
import { ref, computed, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue'

const router = useRouter()
const route = useRoute()

const modalRoutes = ['Login', 'Register', 'ResetPassword', 'AddProduct', 'ProductDetails', 'ProductUpdate']

const isModal = computed(() => modalRoutes.includes(route.name))

// Store the last background component and its key
const bgComponent = shallowRef(null)
const bgKey = ref(null)

router.afterEach((to, from) => {
  if (!modalRoutes.includes(to.name)) {
    const matched = to.matched[to.matched.length - 1]
    if (matched?.components?.default) {
      bgComponent.value = matched.components.default
      bgKey.value = to.path
    }
  }
})

const modalWidths = {
  ProductDetails: '800px',
  ProductUpdate: '800px',
  AddProduct: '800px',
  Login: '480px',
  Register: '600px',
  ResetPassword: '480px',
}
const modalWidth = computed(() => modalWidths[route.name] ?? '540px')

function closeModal() { router.back() }
</script>

<template>
  <NavbarComponent />

  <!-- Always render the background component -->
  <component
    v-if="bgComponent"
    :is="bgComponent"
    :key="bgKey"
  />

  <!-- Fallback for first load before bgComponent is set -->
  <RouterView v-else name="default" />

  <!-- Modal layer -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box" :style="{ maxWidth: modalWidth }">
          <button class="modal-close" @click="closeModal">✕</button>
          <RouterView name="modal" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}
.modal-box {
  position: relative;
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
}

.modal-close {
  position: absolute; top: 16px; right: 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  width: 32px; height: 32px; border-radius: 8px;
  cursor: pointer; font-size: 0.85rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.modal-close:hover { background: rgba(255,255,255,0.12); color: white; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.96); }
</style>
