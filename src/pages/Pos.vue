<template>
  <div class="grid grid-cols-3 gap-6 h-full">
    <!-- Produk Section -->
    <section class="col-span-2 flex flex-col">
      <!-- Search & kategori -->
      <div class="flex items-center justify-between mb-4">
        <input type="text" placeholder="Search menu..." class="w-1/2 border rounded px-3 py-2" />
        <div class="flex gap-2 ml-3">
          <button
            v-for="c in categories"
            :key="c"
            class="px-4 py-2 rounded-full border hover:bg-blue-100"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <!-- Grid Produk -->
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer"
          @click="openVariantModal(product)"
        >
          <h2 class="font-semibold">{{ product.name }}</h2>
          <p class="text-sm text-gray-500">Rp {{ product.price }}</p>
        </div>
      </div>
    </section>

    <!-- Cart Section -->
    <section class="bg-white rounded-xl shadow p-4 flex flex-col h-full">
      <!-- Order content -->
      <h2 class="text-lg font-semibold mb-4">Order</h2>

      <div class="flex-1">
        <div v-if="cart.length" class="space-y-3">
          <div
            v-for="(item, index) in cart"
            :key="item.id"
            class="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-500">Rp {{ item.price }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="decreaseQty(index)" class="px-2 py-1 border rounded">-</button>
              <span>{{ item.qty }}</span>
              <button @click="increaseQty(index)" class="px-2 py-1 border rounded">+</button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-400">No items in cart</p>
      </div>

      <!-- Totals + Button pinned at bottom -->
      <div class="mt-4 border-t pt-4">
        <div class="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>Rp {{ subtotal }}</span>
        </div>
        <div class="flex justify-between text-lg font-semibold mt-1">
          <span>Total</span>
          <span>Rp {{ total }}</span>
        </div>

        <button
          class="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition"
          @click="checkout"
        >
          Place Order
        </button>
      </div>
    </section>
    <!-- Variant Modal -->
    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 rounded-lg w-80 shadow-lg">
        <h3 class="text-lg font-bold mb-4">
          {{ selectedProduct?.name }}
        </h3>

        <!-- Step 1: pilih varian -->
        <div v-if="!selectedVariant">
          <h4 class="font-semibold mb-2">Pilih Varian</h4>
          <div class="space-y-2">
            <button
              v-for="variant in selectedProduct.variants"
              :key="variant"
              class="w-full p-2 border rounded hover:bg-blue-100"
              @click="chooseVariant(variant)"
            >
              {{ variant }}
            </button>
          </div>
        </div>

        <!-- Step 2: pilih ukuran (jika ada) -->
        <div v-else-if="selectedProduct.sizes">
          <h4 class="font-semibold mb-2">Pilih Ukuran</h4>
          <div class="space-y-2">
            <button
              v-for="size in selectedProduct.sizes"
              :key="size.name"
              class="w-full p-2 border rounded hover:bg-green-100"
              @click="chooseSize(size)"
            >
              {{ size.name }} (Rp{{ selectedProduct.price + size.extra }})
            </button>
          </div>
        </div>

        <!-- Jika tidak ada ukuran langsung masuk -->
        <div v-else>
          <button class="w-full p-2 bg-blue-500 text-white rounded" @click="addToCart">
            Tambahkan {{ selectedVariant }}
          </button>
        </div>

        <button class="mt-4 w-full bg-red-500 text-white py-2 rounded" @click="closeModal">
          Batal
        </button>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-6">
  <section class="col-span-2 flex flex-col">

  </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'

interface Menu {
  id: number
  menu_name: string
  category: string
  flavour: string
  size: string
  price: number
}

const categories = ['All', 'Makanan', 'Minuman', 'Snack']

const products = ref([
  {
    id: 1,
    name: 'Popes',
    price: 5000,
    variants: ['Coklat', 'Balado', 'BBQ'],
    sizes: [
      { name: 'Kecil', extra: 0 },
      { name: 'Besar', extra: 1000 },
    ],
  },
  {
    id: 2,
    name: 'Teh',
    price: 4000,
    variants: ['Es Teh Manis', 'Es Teh Tawar', 'Teh Panas'],
    sizes: [
      { name: 'Kecil', extra: 0 },
      { name: 'Besar', extra: 1000 },
    ],
  },
])

onMounted(async() => {
  const res = await axios.get('http://127.0.0.1:8000/api/menus')
  menus.value = res.data
})

const cart = ref<{ id: number; name: string; price: number; qty: number }[]>([])

const showModal = ref(false)
const selectedProduct = ref(null)
const selectedVariant = ref(null)
const selectedSize = ref(null)
const searchQuery = ref('')

// function searchProducts() {
//   searchQuery.value = searchQuery.value.toLowerCase()
//   return products.value.filter((product) => product.name.toLowerCase().includes(searchQuery.value))

// }

function openVariantModal(product) {
  selectedProduct.value = product
  selectedVariant.value = null
  selectedSize.value = null
  showModal.value = true
}

function closeModal() {
  selectedProduct.value = null
  selectedVariant.value = null
  selectedSize.value = null
  showModal.value = false
}

function chooseVariant(variant) {
  selectedVariant.value = variant
}

function chooseSize(size) {
  selectedSize.value = size
  addToCart()
}

function addToCart() {
  let finalName = selectedProduct.value.name
  let finalPrice = selectedProduct.value.price

  if (selectedVariant.value) {
    finalName += ` (${selectedVariant.value})`
  }
  if (selectedSize.value) {
    finalName += ` - ${selectedSize.value.name}`
    finalPrice += selectedSize.value.extra
  }

  const existing = cart.value.find((item) => item.name === finalName)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({
      name: finalName,
      price: finalPrice,
      qty: 1,
    })
  }

  closeModal()
}

function increaseQty(index: number) {
  cart.value[index].qty++
}

function decreaseQty(index: number) {
  if (cart.value[index].qty > 1) {
    cart.value[index].qty--
  } else {
    // Remove item when qty hits 0
    cart.value.splice(index, 1)
  }
}

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2),
)

const tax = computed(() => (Number(subtotal.value) * 0.1).toFixed(2))

const total = computed(() => Number(subtotal.value))

function checkout() {
  alert('Order placed! Total: $' + total.value)
  cart.value = []
}
</script>
