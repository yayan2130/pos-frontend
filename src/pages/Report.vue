<script setup>
import { ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "vue-chartjs";

// Register Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const datePeriod = ref("Monthly");
const showGraph = ref(true);

// Dummy data stat cards
const stats = ref([
  { title: "Total Sales Amount", value: 12650, unit: "USD", growth: "+1543.30", percent: "12.2%" },
  { title: "Total Product Sales", value: 1250, unit: "Items", growth: "+125", percent: "10%" },
  { title: "Total Customers", value: 400, unit: "Persons", growth: "-5", percent: "-0.02%" },
  { title: "Net Profit", value: 12650, unit: "USD", growth: "+3792", percent: "0.3%" },
]);

// Dummy chart data
const chartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Sales",
      data: [3000, 4000, 2500, 3650],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};
const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
};

// Favorite products
const favoriteProducts = ref([
  { name: "Buttermelt Croissant", category: "Pastry", total: 183, img: "🥐" },
  { name: "Beef Crouwich", category: "Sandwich", total: 160, img: "🥪" },
  { name: "Sliced Blackforest", category: "Cake", total: 125, img: "🍰" },
  { name: "Solo Floss Bread", category: "Bread", total: 119, img: "🍞" },
]);

// Orders
const orders = ref([
  { id: "001", date: "25/05/2024 08:00 AM", customer: "George", amount: 25, status: "Paid" },
  { id: "002", date: "25/05/2024 09:15 AM", customer: "Eloise", amount: 19.35, status: "Closed" },
  { id: "003", date: "25/05/2024 10:00 AM", customer: "Mike", amount: 31.5, status: "Paid" },
]);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Report</h1>

    <!-- Filter -->
    <div class="flex justify-between items-center mb-6">
      <select v-model="datePeriod" class="border rounded p-2">
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-blue-500 text-white rounded">Download</button>
        <input type="date" class="border rounded p-2" />
        <label class="flex items-center gap-2">
          <span>Show Graph</span>
          <input type="checkbox" v-model="showGraph" />
        </label>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div v-for="(s, i) in stats" :key="i" class="p-4 border rounded shadow bg-white">
        <h2 class="text-sm text-gray-500">{{ s.title }}</h2>
        <p class="text-2xl font-bold">{{ s.value }} {{ s.unit }}</p>
        <p class="text-sm text-green-500">{{ s.growth }} ({{ s.percent }})</p>
      </div>
    </div>

    <!-- Report Graph & Favorite Product -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="md:col-span-2 p-4 border rounded shadow bg-white">
        <h2 class="font-semibold mb-2">Report Graph</h2>
        <Line v-if="showGraph" :data="chartData" :options="chartOptions" />
      </div>

      <div class="p-4 border rounded shadow bg-white">
        <h2 class="font-semibold mb-2">Favorite Product</h2>
        <ul>
          <li
            v-for="(p, i) in favoriteProducts"
            :key="i"
            class="flex justify-between items-center border-b py-2"
          >
            <span class="flex items-center gap-2">
              <span class="text-2xl">{{ p.img }}</span>
              <div>
                <p class="font-semibold">{{ p.name }}</p>
                <p class="text-sm text-gray-500">{{ p.category }}</p>
              </div>
            </span>
            <span class="font-bold">{{ p.total }}x</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- All Orders -->
    <div class="p-4 border rounded shadow bg-white">
      <h2 class="font-semibold mb-2">All Orders</h2>
      <table class="w-full text-left border">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">#</th>
            <th class="p-2 border">Date & Time</th>
            <th class="p-2 border">Customer</th>
            <th class="p-2 border">Total Payment</th>
            <th class="p-2 border">Order Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-b">
            <td class="p-2 border">{{ order.id }}</td>
            <td class="p-2 border">{{ order.date }}</td>
            <td class="p-2 border">{{ order.customer }}</td>
            <td class="p-2 border">${{ order.amount.toFixed(2) }}</td>
            <td class="p-2 border">
              <span
                :class="[
                  'px-2 py-1 rounded text-white',
                  order.status === 'Paid' ? 'bg-green-500' : 'bg-red-500',
                ]"
              >
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
