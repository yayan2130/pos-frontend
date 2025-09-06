<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-700">Activity</h2>
      <div class="flex items-center gap-4">
        <input type="date" v-model="selectedDate" class="border rounded px-3 py-1 text-sm" />
        <button class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
          + Open Order
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex gap-6">
      <!-- Left Tabs -->
      <aside class="w-48">
        <ul class="space-y-2">
          <li
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'cursor-pointer px-4 py-2 rounded-lg',
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50',
            ]"
          >
            {{ tab }}
          </li>
        </ul>
      </aside>

      <!-- Order List -->
      <section class="flex-1 bg-white rounded-xl shadow p-4">
        <div class="flex items-center justify-between mb-4">
          <!-- Filter Buttons -->
          <div class="flex gap-2">
            <button
              v-for="filter in filters"
              :key="filter"
              @click="activeFilter = filter"
              :class="[
                'px-4 py-1 rounded-full text-sm',
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              {{ filter }}
            </button>
          </div>
          <span class="text-sm text-gray-500"> {{ activeOrders.length }} Active Queue </span>
        </div>

        <!-- Orders -->
        <div class="divide-y">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <p class="font-medium text-gray-800">{{ order.customer }}</p>
              <p class="text-xs text-gray-500">
                Order #{{ order.id }} • Table {{ order.table }} •
                {{ order.time }}
              </p>
            </div>
            <div class="flex items-center gap-6">
              <p class="text-gray-800 font-semibold">${{ order.total.toFixed(2) }}</p>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  order.status === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600',
                ]"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Track Orders -->
    <section class="bg-white rounded-xl shadow p-4">
      <h3 class="text-lg font-semibold mb-3">Track Orders</h3>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="border rounded-lg p-3 hover:shadow transition"
        >
          <p class="font-medium text-gray-700">{{ order.customer }} (Table {{ order.table }})</p>
          <p class="text-xs text-gray-500 mb-2">{{ order.items.length }} Items</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li v-for="item in order.items.slice(0, 2)" :key="item">- {{ item }}</li>
            <li v-if="order.items.length > 2" class="text-blue-500 text-xs">See more...</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tabs = ['Billing Queue', 'Order History']
const filters = ['All', 'Paid', 'Unpaid']

const activeTab = ref('Billing Queue')
const activeFilter = ref('All')
const selectedDate = ref(new Date().toISOString().substr(0, 10))

const orders = ref([
  {
    id: 6,
    customer: 'Francois',
    table: 6,
    time: '09:15 AM',
    status: 'Paid',
    total: 20.0,
    items: ['Beef Crovich', 'Grains Pan Bread'],
  },
  {
    id: 5,
    customer: 'Eloise',
    table: 5,
    time: '09:00 AM',
    status: 'Unpaid',
    total: 19.35,
    items: ['Beef Crovich', 'Sliced Black Forest'],
  },
  {
    id: 4,
    customer: 'Mike',
    table: 4,
    time: '08:15 AM',
    status: 'Paid',
    total: 25.0,
    items: ['Cheezy Sourdough', 'Egg Tart'],
  },
  {
    id: 3,
    customer: 'Billie',
    table: 3,
    time: '08:00 AM',
    status: 'Paid',
    total: 31.5,
    items: ['Solo Floss Bread', 'Cheesecake'],
  },
])

const filteredOrders = computed(() => {
  if (activeFilter.value === 'All') return orders.value
  return orders.value.filter((o) => o.status === activeFilter.value)
})

const activeOrders = computed(() => orders.value.filter((o) => o.status === 'Paid'))
</script>
