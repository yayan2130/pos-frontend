<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Inventory</h1>
      <button
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        + Add Item
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-5 rounded-xl shadow-sm">
        <p class="text-gray-500 text-sm">Total Items</p>
        <h2 class="text-2xl font-bold text-gray-800">{{ inventories.length }}</h2>
      </div>
      <div class="bg-white p-5 rounded-xl shadow-sm">
        <p class="text-gray-500 text-sm">Low Stock Items</p>
        <h2 class="text-2xl font-bold text-red-500">{{ lowStockCount }}</h2>
      </div>
      <div class="bg-white p-5 rounded-xl shadow-sm">
        <p class="text-gray-500 text-sm">Total Value</p>
        <h2 class="text-2xl font-bold text-gray-800">Rp {{ totalValue.toLocaleString() }}</h2>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold text-gray-700">Stock List</h2>
        <input
          v-model="search"
          type="text"
          placeholder="Search item..."
          class="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <table class="min-w-full text-left text-sm text-gray-700">
        <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-6 py-3">ID</th>
            <th class="px-6 py-3">Item Name</th>
            <th class="px-6 py-3">Category</th>
            <th class="px-6 py-3">Unit</th>
            <th class="px-6 py-3 text-right">Stock</th>
            <th class="px-6 py-3 text-right">Min Stock</th>
            <th class="px-6 py-3 text-right">Price</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredInventories"
            :key="item.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="px-6 py-3 font-medium">{{ item.id }}</td>
            <td class="px-6 py-3 font-medium">{{ item.item_name }}</td>
            <td class="px-6 py-3">{{ item.category }}</td>
            <td class="px-6 py-3">{{ item.unit }}</td>
            <td
              class="px-6 py-3 text-right"
              :class="item.stock < item.min_stock ? 'text-red-500 font-semibold' : ''"
            >
              {{ item.stock }}
            </td>
            <td class="px-6 py-3 text-right">{{ item.min_stock }}</td>
            <td class="px-6 py-3 text-right">Rp {{ item.purchase_price }}</td>
            <td class="px-6 py-3 text-right space-x-2">
              <button @click="openEditModal(item)" class="text-blue-600 hover:underline">
                Edit
              </button>
              <button @click="deleteItem(item.id)" class="text-red-600 hover:underline">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <h3 class="text-lg font-semibold mb-4">
          {{ isEditing ? 'Edit Item' : 'Add New Item' }}
        </h3>

        <div class="space-y-3">
          <p>Item Name</p>
          <input
            v-model="modalData.item_name"
            type="text"
            placeholder="Item Name"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <p>Category</p>
          <input
            v-model="modalData.category"
            type="text"
            placeholder="Category"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <p>Unit</p>
          <input
            v-model="modalData.unit"
            type="text"
            placeholder="Unit (gram/ml/pcs)"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <p>Stock</p>
          <input
            v-model.number="modalData.stock"
            type="number"
            placeholder="Stock"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <p>Min Stock</p>
          <input
            v-model.number="modalData.min_stock"
            type="number"
            placeholder="Min Stock"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <p>Purchase Price</p>
          <input
            v-model.number="modalData.purchase_price"
            type="number"
            placeholder="Purchase Price in Rp"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div class="flex justify-end mt-5 space-x-2">
          <button @click="closeModal" class="px-4 py-2">Cancel</button>
          <button
            @click="saveModal"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {{ isEditing ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})

const apiUrl = 'http://localhost:8000/api/inventories'

const inventories = ref([])
const search = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const modalData = ref({
  id: null,
  item_name: '',
  category: '',
  unit: '',
  stock: 0,
  min_stock: 0,
  purchase_price: 0,
})

async function fetchInventories() {
  try {
    const res = await axios.get(apiUrl)
    inventories.value = res.data
  } catch (err) {
    console.error('Failed to fetch:', err)
  }
}

const filteredInventories = computed(() =>
  inventories.value.filter((i) => i.item_name.toLowerCase().includes(search.value.toLowerCase())),
)

const lowStockCount = computed(() => inventories.value.filter((i) => i.stock < i.min_stock).length)

const totalValue = computed(() =>
  inventories.value.reduce((sum, i) => sum + i.stock * i.purchase_price, 0),
)

function openAddModal() {
  isEditing.value = false
  modalData.value = {
    id: null,
    item_name: '',
    category: '',
    unit: '',
    stock: 0,
    min_stock: 0,
    purchase_price: 0,
  }
  showModal.value = true
}

function openEditModal(item) {
  isEditing.value = true
  modalData.value = { ...item }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveModal() {
  try {
    if (isEditing.value && modalData.value.id) {
      await axios.put(`${apiUrl}/${modalData.value.id}`, modalData.value)
      Toast.fire({
        icon: 'success',
        title: 'Item updated successfully!',
      })
    } else {
      await axios.post(apiUrl, modalData.value)
      Toast.fire({
        icon: 'success',
        title: 'Item added successfully!',
      })
    }
    await fetchInventories()
    closeModal()
  } catch (message) {
    Toast.fire({
      icon: 'error',
      title: 'Failed to save!' + message,
    })
    console.error('Failed to save:', err)
  }
}

async function deleteItem(id) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This item will be deleted permanently.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  })
  if (result.isConfirmed) {
    try {
      await axios.delete(`${apiUrl}/${id}`)
      Toast.fire({
        icon: 'success',
        title: 'Item deleted successfully!',
      })
      await fetchInventories()
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: 'Failed to delete!',
      })
      console.error('Failed to delete:', err)
    }
  }
}

onMounted(fetchInventories)
</script>
