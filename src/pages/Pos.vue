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
      <div class="grid grid-cols-3 gap-4 flex-1 overflow-y-auto">
        <div
          v-for="product in products"
          :key="product.id"
          class="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
          @click="addToCart(product)"
        >
          <img :src="product.image" alt="" class="w-full h-24 object-cover rounded" />
          <p class="mt-2 font-semibold">{{ product.name }}</p>
          <p class="text-sm text-gray-500">${{ product.price }}</p>
        </div>
      </div>
    </section>

    <!-- Cart Section -->
    <section class="bg-white rounded-xl shadow p-4 flex flex-col">
      <h2 class="text-xl font-semibold mb-4">Order</h2>

      <div v-if="cart.length" class="space-y-4">
        <div
          v-for="(item, index) in cart"
          :key="item.id"
          class="flex items-center justify-between border-b pb-2"
        >
          <div>
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-sm text-gray-500">${{ item.price }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-2 py-1 border rounded" @click="decreaseQty(index)">-</button>
            <span>{{ item.qty }}</span>
            <button class="px-2 py-1 border rounded" @click="increaseQty(index)">+</button>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="border-t pt-4">
        <p class="flex justify-between">
          <span>Subtotal</span>
          <span>${{ subtotal }}</span>
        </p>
        <!-- Tax -->
        <!-- <p class="flex justify-between"> -->
          <!-- <span>Tax (10%)</span> -->
          <!-- <span>${{ tax }}</span> -->
        <!-- </p> -->
        <p class="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${{ total }}</span>
        </p>
        <button
          class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          @click="checkout"
        >
          Place Order
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const categories = ['All', 'Breads', 'Cakes', 'Pastries', 'Sandwich']

const products = ref([
  { id: 1, name: 'Beef Crovich', price: 5.5, image: 'https://via.placeholder.com/100', categories: 'Breads' },
  { id: 2, name: 'Buttermelt Croissant', price: 4.0, image: 'https://via.placeholder.com/100' },
  { id: 3, name: 'Cereal Cream Donut', price: 2.45, image: 'https://via.placeholder.com/100' },
  { id: 4, name: 'Beef Crovich', price: 5.5, image: 'https://via.placeholder.com/100' },
  { id: 5, name: 'Buttermelt Croissant', price: 4.0, image: 'https://via.placeholder.com/100' },
  { id: 6, name: 'Cereal Cream Donut', price: 2.45, image: 'https://via.placeholder.com/100' },
])

const cart = ref<{ id: number; name: string; price: number; qty: number }[]>([])

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

function addToCart(product: { id: number; name: string; price: number }) {
  const found = cart.value.find((i) => i.id === product.id)
  if (found) {
    found.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
  }
}

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2),
)

const tax = computed(() => (Number(subtotal.value) * 0.1).toFixed(2))

const total = computed(() => (Number(subtotal.value) + Number(tax.value)).toFixed(2))

function checkout() {
  alert('Order placed! Total: $' + total.value)
  cart.value = []
}
</script>
