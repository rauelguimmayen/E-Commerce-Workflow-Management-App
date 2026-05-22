<template>
    <div id="adminboard">
    <h1 id="dashboard" class="text-center text-primary mt-5">Admin Dashboard</h1>
    
    <div v-if="showEditModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input v-model="editForm.name" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="editForm.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Price</label>
              <input v-model="editForm.price" type="number" class="form-control" />
            </div>

            
            <div class="mb-3">
              <label class="form-label">Product Image URL <span class="text-muted small">(optional)</span></label>
              <input v-model="editForm.imageUrl" type="url" class="form-control" placeholder="https://example.com/image.jpg" />
              
              <div v-if="editForm.imageUrl" class="mt-2">
                <img :src="editForm.imageUrl" alt="Preview" class="img-thumbnail"
                     style="max-height: 150px; object-fit: cover; width: 100%"
                     @error="imageError = true" @load="imageError = false" />
                <p v-if="imageError" class="text-danger small mt-1">Invalid image URL</p>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button class="btn btn-primary" @click="saveEdit">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Product</h5>
            <button class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong>?</p>
            <p class="text-danger small">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
            <button class="btn btn-danger" @click="deleteProduct">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-striped border">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Availability</th>
                <th colspan="3">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in productsData" :key="product._id">
                <td>{{ product._id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.price }}</td>
                <td>
                    <span v-if="product.isActive" class="text-success">Available</span>
                    <span v-else class="text-danger">Unavailable</span>
                </td>
                <td>
                    <button class="btn btn-primary" @click="openEditModal(product)">Edit</button>
                </td>
                <td>
                    <button
                      :class="product.isActive ? 'btn btn-danger' : 'btn btn-success'"
                      @click="toggleAvailability(product)"
                    >
                      {{ product.isActive ? 'Archive' : 'Activate' }}
                    </button>
                </td>
                <td>
                 <button class="btn btn-danger" @click="confirmDelete(product)">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>

<script setup>
    import { ref } from "vue";

    const props = defineProps({
        productsData: Array,
    });

    const emit = defineEmits(["update-product", "toggle-availability", "delete-product"])

    const showDeleteModal = ref(false)
    const productToDelete = ref(null)

    function confirmDelete(product) {
      productToDelete.value = product
      showDeleteModal.value = true
    }

    function deleteProduct() {
      emit('delete-product', { id: productToDelete.value._id })
      showDeleteModal.value = false
      productToDelete.value = null
    }

    const showEditModal = ref(false);
    const editForm = ref({});
    const selectedProductId = ref(null);
    const imageError = ref(false)

    function openEditModal(product) {
      editForm.value = { ...product };
      selectedProductId.value = product._id;
      showEditModal.value = true;
      imageError.value = false 
    }

    function closeModal() {
      showEditModal.value = false;
      editForm.value = {};
      selectedProductId.value = null;
      imageError.value = false 
    }

    function saveEdit() {
      emit("update-product", { id: selectedProductId.value, updatedData: editForm.value });
      closeModal();
    }

    function toggleAvailability(product) {
      emit("toggle-availability", { id: product._id, isActive: !product.isActive });
    }
</script>