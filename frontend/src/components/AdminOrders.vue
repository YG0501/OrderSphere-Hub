<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">订单管理</h2>
    </div>
    <table class="w-full text-sm border border-gray-300 dark:border-gray-700">
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr class="text-gray-900 dark:text-gray-100">
          <th class="border border-gray-300 dark:border-gray-700 px-2 py-1">ID</th>
          <th class="border border-gray-300 dark:border-gray-700 px-2 py-1">客户名</th>
          <th class="border border-gray-300 dark:border-gray-700 px-2 py-1">明细</th>
          <th class="border border-gray-300 dark:border-gray-700 px-2 py-1">操作</th>
        </tr>
      </thead>
      <tbody class="text-gray-800 dark:text-gray-200">
        <tr
          v-for="order in orders"
          :key="order.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="border border-gray-300 dark:border-gray-700 px-2 py-1">{{ order.id }}</td>
          <td class="border border-gray-300 dark:border-gray-700 px-2 py-1">{{ order.customer_name }}</td>

          <td class="border border-gray-300 dark:border-gray-700 px-2 py-1">
            <ul class="space-y-1">
              <li
                v-for="item in order.items"
                :key="item.id"
                class="text-gray-700 dark:text-gray-300"
              >
                菜品ID: {{ item.menu_item_id }} × {{ item.quantity }}
              </li>
            </ul>
          </td>

          <td class="border border-gray-300 dark:border-gray-700 px-2 py-1">
            <button
              class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 dark:hover:bg-red-400"
              @click="remove(order.id)"
            >
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="text-red-500 text-xs mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  token: { type: String, required: true }
})

const orders = ref([])
const error = ref('')

const fetchOrders = async () => {
  error.value = ''
  const res = await fetch('http://127.0.0.1:8000/admin/orders/', {
    headers: {
      Authorization: `Bearer ${props.token}`
    }
  })
  if (res.ok) {
    orders.value = await res.json()
  } else {
    error.value = '获取订单失败'
  }
}

const remove = async (id) => {
  if (!confirm('确认删除该订单？')) return
  const res = await fetch(`http://127.0.0.1:8000/admin/orders/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${props.token}`
    }
  })
  if (res.ok) {
    fetchOrders()
  } else {
    error.value = '删除失败'
  }
}

onMounted(fetchOrders)
watch(() => props.token, () => {
  if (props.token) fetchOrders()
})
</script>
