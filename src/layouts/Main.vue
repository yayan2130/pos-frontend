<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-white shadow-lg flex flex-col justify-between"
    >
      <div>
        <!-- Logo / Profile -->
        <div class="p-6 border-b">
          <h1 class="text-2xl font-bold text-blue-600">POS System</h1>
          <p class="text-sm text-gray-500 mt-1">THE W4RUNK</p>
        </div>

        <!-- Menu -->
        <nav class="mt-6">
          <RouterLink
            v-for="item in menu"
            :key="item.name"
            :to="item.path"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            active-class="bg-blue-100 text-blue-600 font-semibold"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </RouterLink>
        </nav>
      </div>

      <!-- Logout -->
      <div class="p-6 border-t">
        <button
          class="flex items-center text-red-600 hover:text-red-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            stroke-width="1.5" stroke="currentColor"
            class="w-5 h-5 mr-2"
          >
            <path
              stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Home, ActivitySquare, FileText, Package, Users } from "lucide-vue-next"

const menu = [
  { name: "Point of Sales", path: "/pos", icon: Home },
  { name: "Activity", path: "/activity", icon: ActivitySquare },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Teams", path: "/teams", icon: Users },
]
</script>
