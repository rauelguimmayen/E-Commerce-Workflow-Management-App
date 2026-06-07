<script setup>
defineProps(['items', 'totalAmount']);
defineEmits(['remove', 'updateQuantity', 'clearCart', 'checkout']);
</script>

<template>
  <div class="gs-ct-wrap">

    <!-- Clear Cart Button -->
    <div class="gs-ct-toolbar">
      <button @click="$emit('clearCart')" class="gs-ct-clear-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        Clear Cart
      </button>
    </div>

    <!-- Table -->
    <div v-if="items && items.length > 0" class="gs-ct-table-wrap">
      <table class="gs-ct-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.productId._id" class="gs-ct-row">

            <!-- Product -->
            <td>
              <div class="gs-ct-product-cell">
                <div class="gs-ct-thumb">
                  <img
                    :src="item.productId?.imageUrl || `https://placehold.co/200x200/1e1b4b/818cf8?font=raleway&text=${encodeURIComponent((item.productId?.name || 'P').slice(0, 2))}`"
                    :alt="item.productId?.name"
                  />
                </div>
                <div>
                  <p class="gs-ct-prod-name">{{ item.productId.name }}</p>
                  <p class="gs-ct-prod-id">#{{ (item.productId._id || '').slice(-8).toUpperCase() }}</p>
                </div>
              </div>
            </td>

            <!-- Price -->
            <td>
              <span class="gs-ct-price">₱{{ item.productId.price?.toLocaleString() }}</span>
            </td>

            <!-- Quantity -->
            <td>
              <div class="gs-ct-qty-ctrl">
                <button
                  class="gs-ct-qty-btn"
                  type="button"
                  @click="$emit('updateQuantity', item.productId._id, item.quantity - 1)"
                >−</button>
                <input
                  type="number"
                  class="gs-ct-qty-input"
                  :value="item.quantity"
                  @change="$emit('updateQuantity', item.productId._id, Number($event.target.value))"
                  min="1"
                />
                <button
                  class="gs-ct-qty-btn"
                  type="button"
                  @click="$emit('updateQuantity', item.productId._id, item.quantity + 1)"
                >+</button>
              </div>
            </td>

            <!-- Subtotal -->
            <td>
              <span class="gs-ct-subtotal">₱{{ item.subtotal?.toLocaleString() }}</span>
            </td>

            <!-- Remove -->
            <td>
              <button
                class="gs-ct-remove-btn"
                @click="$emit('remove', item.productId._id)"
                title="Remove item"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </td>

          </tr>
        </tbody>

        <!-- Footer / Total row -->
        <tfoot>
          <tr class="gs-ct-footer-row">
            <td colspan="3" class="gs-ct-total-label">
              <span>Order Total</span>
            </td>
            <td>
              <span class="gs-ct-total-value">₱{{ totalAmount?.toLocaleString() }}</span>
            </td>
            <td>
              <button @click="$emit('checkout')" class="gs-ct-checkout-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Checkout
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="gs-ct-empty">
      <div class="gs-ct-empty-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
      </div>
      <p class="gs-ct-empty-title">Your cart is empty</p>
      <p class="gs-ct-empty-sub">Add some products to get started</p>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-ct-wrap {
  font-family: 'DM Sans', sans-serif;
  color: #f0f0f5;
}

/* Toolbar */
.gs-ct-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.gs-ct-clear-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(239,68,68,0.07);
  border: 1px solid rgba(239,68,68,0.18);
  border-radius: 9px; padding: 8px 15px;
  color: #f87171; font-family: 'Syne', sans-serif;
  font-size: 0.78rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.gs-ct-clear-btn:hover { background: rgba(239,68,68,0.14); }

/* Table Wrapper */
.gs-ct-table-wrap {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  overflow: hidden;
}

.gs-ct-table {
  width: 100%;
  border-collapse: collapse;
}

.gs-ct-table thead tr th {
  padding: 14px 20px;
  text-align: left;
  font-family: 'Syne', sans-serif; font-size: 0.68rem; font-weight: 700;
  color: rgba(255,255,255,0.25); letter-spacing: 0.08em; text-transform: uppercase;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;
}

.gs-ct-table tbody td {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;
}
.gs-ct-row:last-child td { border-bottom: none; }
.gs-ct-row:hover td { background: rgba(255,255,255,0.013); }

/* Product Cell */
.gs-ct-product-cell { display: flex; align-items: center; gap: 14px; }
.gs-ct-thumb {
  width: 52px; height: 52px;
  border-radius: 11px; overflow: hidden;
  flex-shrink: 0; background: #1a1a28;
}
.gs-ct-thumb img { width: 100%; height: 100%; object-fit: cover; }
.gs-ct-prod-name {
  font-size: 0.88rem; font-weight: 600; color: #f0f0f5;
  margin: 0 0 3px;
}
.gs-ct-prod-id {
  font-size: 0.7rem; color: rgba(255,255,255,0.2);
  font-family: 'Courier New', monospace; margin: 0;
}

/* Price */
.gs-ct-price {
  font-family: 'Syne', sans-serif;
  font-size: 0.88rem; font-weight: 600; color: rgba(255,255,255,0.55);
}

/* Qty Control */
.gs-ct-qty-ctrl {
  display: inline-flex; align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 3px; gap: 2px;
}
.gs-ct-qty-btn {
  width: 30px; height: 30px;
  background: none; border: none;
  color: rgba(255,255,255,0.5);
  font-size: 1rem; cursor: pointer;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.gs-ct-qty-btn:hover { background: rgba(255,255,255,0.08); color: white; }
.gs-ct-qty-input {
  width: 38px; text-align: center;
  background: none; border: none;
  color: #f0f0f5; font-size: 0.88rem; font-weight: 600;
  font-family: 'Syne', sans-serif; outline: none;
}
.gs-ct-qty-input::-webkit-outer-spin-button,
.gs-ct-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }

/* Subtotal */
.gs-ct-subtotal {
  font-family: 'Syne', sans-serif;
  font-size: 0.95rem; font-weight: 700; color: #a5b4fc;
}

/* Remove */
.gs-ct-remove-btn {
  width: 30px; height: 30px;
  background: rgba(239,68,68,0.06);
  border: 1px solid rgba(239,68,68,0.14);
  border-radius: 8px; cursor: pointer;
  color: #f87171;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.gs-ct-remove-btn:hover { background: rgba(239,68,68,0.15); }

/* Footer Row */
.gs-ct-table tfoot tr td {
  padding: 18px 20px;
  border-top: 1px solid rgba(255,255,255,0.07);
  background: rgba(99,102,241,0.04);
}
.gs-ct-total-label {
  text-align: right;
  font-family: 'Syne', sans-serif; font-size: 0.85rem;
  font-weight: 700; color: rgba(255,255,255,0.5);
}
.gs-ct-total-value {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem; font-weight: 800; color: #818cf8;
}
.gs-ct-checkout-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none; border-radius: 10px;
  color: white; padding: 10px 18px;
  font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.gs-ct-checkout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(99,102,241,0.4);
}

/* Empty State */
.gs-ct-empty {
  display: flex; flex-direction: column; align-items: center;
  padding: 60px 20px; text-align: center;
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
}
.gs-ct-empty-icon {
  width: 72px; height: 72px;
  background: rgba(99,102,241,0.07);
  border: 1px solid rgba(99,102,241,0.13);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(99,102,241,0.4);
  margin-bottom: 20px;
}
.gs-ct-empty-title {
  font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700;
  color: #f0f0f5; margin: 0 0 6px;
}
.gs-ct-empty-sub { font-size: 0.85rem; color: rgba(255,255,255,0.3); margin: 0; }
</style>
