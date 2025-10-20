<template>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Menu List</h1>
        <button
          @click="openAddModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow"
        >
          + Add Menu
        </button>
      </div>
  
      <!-- Table -->
      <div class="bg-white shadow rounded-2xl overflow-hidden">
        <table class="min-w-full border-collapse">
          <thead class="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Menu Name</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Flavour</th>
              <th class="px-4 py-3">Size</th>
              <th class="px-4 py-3">Price</th>
              <th class="px-4 py-3">Auto Stock</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(menu, index) in menus"
              :key="menu.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-semibold">{{ menu.menu_name }}</td>
              <td class="px-4 py-3">{{ menu.category || '-' }}</td>
              <td class="px-4 py-3">{{ menu.flavour || '-' }}</td>
              <td class="px-4 py-3">{{ menu.size || '-' }}</td>
              <td class="px-4 py-3">Rp {{ menu.price.toLocaleString() }}</td>
              <td class="px-4 py-3">
                <span
                  :class="menu.is_auto_stock_update ? 'text-green-600' : 'text-gray-400'"
                >
                  {{ menu.is_auto_stock_update ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  @click="openEditModal(menu)"
                  class="text-blue-600 hover:text-blue-800 font-medium mr-2"
                >
                  Edit
                </button>
                <button
                  @click="deleteMenu(menu.id)"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
          <h2 class="text-xl font-bold mb-4">
            {{ editMode ? 'Edit Menu' : 'Add Menu' }}
          </h2>
  
          <form @submit.prevent="saveMenu">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium">Menu Name</label>
                <input
                  v-model="form.menu_name"
                  class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
  
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium">Category</label>
                  <input
                    v-model="form.category"
                    class="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium">Flavour</label>
                  <input
                    v-model="form.flavour"
                    class="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium">Size</label>
                  <input
                    v-model="form.size"
                    class="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium">Price (Rp)</label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    class="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
  
              <div class="flex items-center gap-2">
                <input
                  id="auto-stock"
                  type="checkbox"
                  v-model="form.is_auto_stock_update"
                  class="h-4 w-4 text-blue-600"
                />
                <label for="auto-stock" class="text-sm">Auto update stock</label>
              </div>
            </div>
  
            <div class="mt-6 flex justify-end gap-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {{ editMode ? 'Update' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const menus = ref([])
  const isModalOpen = ref(false)
  const editMode = ref(false)
  const form = ref({
    id: null,
    menu_name: '',
    category: '',
    flavour: '',
    size: '',
    price: 0,
    is_auto_stock_update: false,
  })
  
  const apiUrl = 'http://127.0.0.1:8000/api/menus' // ubah sesuai URL backend kamu
  
  async function fetchMenus() {
    const res = await axios.get(apiUrl)
    menus.value = res.data
  }
  
  async function saveMenu() {
    if (editMode.value) {
      await axios.put(`${apiUrl}/${form.value.id}`, form.value)
    } else {
      await axios.post(apiUrl, form.value)
    }
    await fetchMenus()
    closeModal()
  }
  
  async function deleteMenu(id) {
    await axios.delete(`${apiUrl}/${id}`)
    await fetchMenus()
  }
  
  function openAddModal() {
    editMode.value = false
    resetForm()
    isModalOpen.value = true
  }
  
  function openEditModal(menu) {
    editMode.value = true
    Object.assign(form.value, menu)
    isModalOpen.value = true
  }
  
  function closeModal() {
    isModalOpen.value = false
  }
  
  function resetForm() {
    Object.assign(form.value, {
      id: null,
      menu_name: '',
      category: '',
      flavour: '',
      size: '',
      price: 0,
      is_auto_stock_update: false,
    })
  }
  
  onMounted(() => {
    fetchMenus()
  })
  </script>
  
  