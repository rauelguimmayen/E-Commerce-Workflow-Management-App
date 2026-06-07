<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import api from '../api.js'

const products = ref([])
const featuredProducts = computed(() => products.value.slice(0, 4))

onMounted(async () => {
  try {
    const { data } = await api.get('/products/active')
    products.value = data
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="gs-home">

    <!-- Hero Section -->
    <section class="gs-hero">
      <div class="gs-hero-bg">
        <div class="gs-hero-orb gs-hero-orb-1"></div>
        <div class="gs-hero-orb gs-hero-orb-2"></div>
        <div class="gs-hero-grid"></div>
      </div>
      <div class="gs-hero-content">
        <div class="gs-hero-tag">✦ Premium Collection 2025</div>
        <h1 class="gs-hero-heading">
          Discover<br/>
          <span class="gs-hero-highlight">Amazing</span><br/>
          Products
        </h1>
        <p class="gs-hero-sub">
          Explore our curated collection of premium physical goods,
          crafted for those who demand the best.
        </p>
        <div class="gs-hero-actions">
          <router-link to="/products" class="gs-btn-primary">
            Shop Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </router-link>
          <a href="#featured" class="gs-btn-ghost">
            View Featured
          </a>
        </div>
        <div class="gs-hero-stats">
          <div class="gs-stat">
            <span class="gs-stat-num">500+</span>
            <span class="gs-stat-label">Products</span>
          </div>
          <div class="gs-stat-divider"></div>
          <div class="gs-stat">
            <span class="gs-stat-num">10K+</span>
            <span class="gs-stat-label">Happy Customers</span>
          </div>
          <div class="gs-stat-divider"></div>
          <div class="gs-stat">
            <span class="gs-stat-num">4.9★</span>
            <span class="gs-stat-label">Rating</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Strip -->
    <section class="gs-features-strip">
      <div class="gs-features-inner">
        <div class="gs-feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          Free Shipping on orders over ₱1,000
        </div>
        <div class="gs-feature-dot"></div>
        <div class="gs-feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 001 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
          Premium Quality Guarantee
        </div>
        <div class="gs-feature-dot"></div>
        <div class="gs-feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          24/7 Customer Support
        </div>
        <div class="gs-feature-dot"></div>
        <div class="gs-feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Easy 30-Day Returns
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="gs-section" id="featured">
      <div class="gs-section-inner">
        <div class="gs-section-header">
          <div class="gs-section-tag">Featured</div>
          <h2 class="gs-section-title">Handpicked For You</h2>
          <p class="gs-section-sub">Our team's top picks from this season's collection</p>
        </div>

        <div class="gs-products-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product._id"
            :productData="product"
          />
        </div>

        <div class="gs-section-cta">
          <router-link id="homepagebutton" to="/products" class="gs-btn-primary">
            View All Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-home {
  background: #08080f;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  padding-top: 64px;
}

/* ── Hero ── */
.gs-hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.gs-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.gs-hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.18;
}
.gs-hero-orb-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  top: -200px; left: -200px;
  animation: pulse 8s ease-in-out infinite;
}
.gs-hero-orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -100px; right: 0;
  animation: pulse 10s ease-in-out infinite reverse;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.18; }
  50% { transform: scale(1.1); opacity: 0.24; }
}

.gs-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

.gs-hero-content {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 24px;
  animation: fadeUp 0.8s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.gs-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99,102,241,0.12);
  border: 1px solid rgba(99,102,241,0.25);
  color: #a5b4fc;
  font-family: 'Syne', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 28px;
  letter-spacing: 0.04em;
}

.gs-hero-heading {
  font-family: 'Syne', sans-serif;
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-weight: 800;
  line-height: 0.95;
  color: #f0f0f5;
  margin: 0 0 28px;
  letter-spacing: -0.03em;
}

.gs-hero-highlight {
  background: linear-gradient(135deg, #818cf8, #a78bfa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gs-hero-sub {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.45);
  max-width: 460px;
  line-height: 1.65;
  margin: 0 0 36px;
}

.gs-hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 56px;
}

.gs-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.01em;
  box-shadow: 0 8px 30px rgba(99,102,241,0.35);
}
.gs-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(99,102,241,0.45);
  color: white;
}

.gs-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.7);
  padding: 14px 28px;
  border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.gs-btn-ghost:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.gs-hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}
.gs-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.gs-stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #f0f0f5;
}
.gs-stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  font-weight: 500;
}
.gs-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.1);
}

/* ── Features Strip ── */
.gs-features-strip {
  background: rgba(255,255,255,0.025);
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 18px 24px;
}
.gs-features-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}
.gs-feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  white-space: nowrap;
}
.gs-feature-item svg { color: #818cf8; }
.gs-feature-dot {
  width: 4px; height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
}

/* ── Section ── */
.gs-section {
  padding: 80px 0;
}
.gs-section-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.gs-section-header {
  text-align: center;
  margin-bottom: 48px;
}
.gs-section-tag {
  display: inline-block;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  color: #818cf8;
  font-family: 'Syne', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 100px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.gs-section-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  color: #f0f0f5;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}
.gs-section-sub {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.38);
  max-width: 400px;
  margin: 0 auto;
}

/* Products Grid */
.gs-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 4px;
  margin-bottom: 48px;
}

.gs-section-cta {
  text-align: center;
}

@media (max-width: 640px) {
  .gs-hero-stats { flex-wrap: wrap; }
  .gs-feature-dot { display: none; }
}
</style>
