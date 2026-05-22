<script setup>
defineProps(['items', 'totalAmount']);
defineEmits(['remove', 'updateQuantity', 'clearCart', 'checkout']);
</script>

<template>
        <button @click="$emit('clearCart')" class="btn btn-danger mb-3">Clear Cart</button>

        <table v-if="items && items.length > 0" class="table table-striped">
                <thead>
                        <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Actions</th>
                        </tr>
                </thead>
                <tbody>
                        <tr v-for="item in items" :key="item.productId._id">
                                <td>{{ item.productId.name }}</td>
                                <td>PHP {{ item.productId.price }}</td>
                                <td>
                                        <div class="input-group input-group-sm" style="max-width: 120px;">
                                                <button class="btn btn-outline-secondary" type="button"
                                                        @click="$emit('updateQuantity', item.productId._id, item.quantity - 1)">-</button>
                                                <input type="number" class="form-control text-center"
                                                        :value="item.quantity"
                                                        @change="$emit('updateQuantity', item.productId._id, Number($event.target.value))">
                                                <button class="btn btn-outline-secondary" type="button"
                                                        @click="$emit('updateQuantity', item.productId._id, item.quantity + 1)">+</button>
                                        </div>
                                </td>
                                <td>PHP {{ item.subtotal }}</td>
                                <td>
                                        <button class="btn btn-danger btn-sm"
                                                @click="$emit('remove', item.productId._id)">Remove</button>
                                </td>
                        </tr>
                </tbody>
                <tfoot>
                        <tr>
                                <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                <td><strong>PHP {{ totalAmount }}</strong></td>
                                <td>
                                        <button @click="$emit('checkout')"
                                                class="btn btn-success btn-sm">Checkout</button>
                                </td>
                        </tr>
                </tfoot>
        </table>
        <p v-else>Your cart is empty.</p>
</template>