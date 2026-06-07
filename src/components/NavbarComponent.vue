<script setup>
import { useGlobalStore } from "../stores/global";
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
const store = useGlobalStore();

const email = ref("");
import '../style.css'

const menuOpen = ref(false);
const dropdownRef = ref(null);
const totalQuantity = computed(() =>
  store.userCart.items.reduce((sum, item) => sum + item.quantity, 0)
)
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav id="fixnavbar" class="gs-navbar">
    <div class="gs-navbar-inner">
      <!-- Brand -->
      <router-link :to="{ name: 'Home' }" class="gs-brand">
        <span class="gs-brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </span>
        <span class="gs-brand-name">Global<span class="gs-brand-accent">Cart</span></span>
      </router-link>

      <!-- Desktop Nav Links -->
      <div class="gs-nav-links">
        <router-link :to="{ name: 'Products' }" class="gs-nav-link" v-if="!store.user.isAdmin">
          Browse Products
        </router-link>
        <router-link :to="{ name: 'Products' }" class="gs-nav-link" v-if="store.user.email && store.user.isAdmin">
          Dashboard
        </router-link>
        <router-link :to="{ name: 'AddProduct' }" class="gs-nav-link" v-if="store.user.email && store.user.isAdmin">
          Add Product
        </router-link>
        <router-link :to="{ name: 'OrdersPage' }" class="gs-nav-link" v-if="store.user.email && store.user.isAdmin">
          Orders
        </router-link>
      </div>

      <!-- Right Actions -->
      <div class="gs-nav-actions">
        <!-- Cart Icon -->
        <router-link :to="{ name: 'Cart' }" class="gs-cart-btn" v-if="store.user.email && !store.user.isAdmin">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
          </svg>
          <span class="gs-cart-badge" v-if="store?.userCart?.items?.length">
            {{ totalQuantity }}
          </span>
        </router-link>

        <!-- Account Dropdown -->
        <div ref="dropdownRef" class="gs-dropdown" :class="{ open: menuOpen }">
          <button class="gs-account-btn" @click="menuOpen = !menuOpen">
            <span class="gs-avatar">
              {{ store.user.email ? store.user.email[0].toUpperCase() : '?' }}
            </span>
            <svg class="gs-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="gs-dropdown-menu">
            <div class="gs-dropdown-header" v-if="store.user.email">
              <span class="gs-dropdown-email">{{ store.user.email }}</span>
            </div>
            <div class="gs-dropdown-divider" v-if="store.user.email"></div>
            <button class="gs-dropdown-item" v-if="store.user.email && !store.user.isAdmin" @click="$router.push({ name: 'MyOrder' }); menuOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              My Orders
            </button>
            <button class="gs-dropdown-item" v-if="store.user.email" @click="$router.push({ name: 'ProfilePage' }); menuOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </button>
            <button class="gs-dropdown-item" v-if="store.user.email" @click="$router.push({ name: 'ResetPassword' }); menuOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Reset Password
            </button>
            <button class="gs-dropdown-item gs-dropdown-danger" v-if="store.user.email" @click="$router.push({ name: 'Logout' }); menuOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
            <div class="gs-dropdown-divider" v-if="!store.user.email"></div>
            <button class="gs-dropdown-item" v-if="!store.user.email" @click="$router.push({ name: 'Register' }); menuOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Register
            </button>
            <button class="gs-dropdown-item" v-if="!store.user.email" @click="$router.push({ name: 'Login' }); menuOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

.gs-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 14, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-family: 'Syne', sans-serif;
}

.gs-navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 32px;
}

/* Brand */
.gs-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;

}

.gs-brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.gs-brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #032254;
  letter-spacing: -0.02em;
}
.gs-brand-accent { color: #818cf8; }

/* Nav Links */
.gs-nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.gs-nav-link {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #032254;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.01em;
}
.gs-nav-link:hover,
.gs-nav-link.router-link-active {
  color: #0243ab;
  background: rgba(99,102,241,0.12);
}

/* Right Actions */
.gs-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

/* Cart Button */
.gs-cart-btn {
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #032254;
  text-decoration: none;
  transition: all 0.2s;
}
.gs-cart-btn:hover {
  background: rgba(99,102,241,0.15);
  border-color: rgba(99,102,241,0.4);
  color: #818cf8;
}

.gs-cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  background: #6366f1;
  color: white;
  border-radius: 9px;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #0a0a0e;
}

/* Account Dropdown */
.gs-dropdown { position: relative; }

.gs-account-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 6px 10px 6px 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(255,255,255,0.7);
}
.gs-account-btn:hover {
  background: rgba(99,102,241,0.15);
  border-color: rgba(99,102,241,0.4);
}

.gs-avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.gs-chevron {
  transition: transform 0.2s;
  opacity: 0.6;
}
.gs-dropdown.open .gs-chevron { transform: rotate(180deg); }

.gs-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: #13131a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
  pointer-events: none;
  transition: all 0.18s ease;
  z-index: 100;
}
.gs-dropdown.open .gs-dropdown-menu {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

.gs-dropdown-header {
  padding: 8px 12px 6px;
}
.gs-dropdown-email {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.02em;
}

.gs-dropdown-divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 4px 0;
}

.gs-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.65);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Syne', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}
.gs-dropdown-item:hover {
  background: rgba(99,102,241,0.12);
  color: #e0e7ff;
}
.gs-dropdown-danger:hover {
  background: rgba(239,68,68,0.1);
  color: #fca5a5;
}

@media (max-width: 640px) {
  .gs-nav-links { display: none; }
  .gs-navbar-inner { padding: 0 16px; }
}
</style>
