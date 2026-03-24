<template>
  <div class="flex items-center bg-white rounded shadow p-3 space-x-4">

    <!-- 左侧小图片 -->
    <img
      :src="`http://127.0.0.1:8000${item.image_url}`"
      alt=""
      class="w-20 h-20 object-cover rounded"
    />

    <!-- 右侧信息 -->
    <div class="flex-1 flex flex-col justify-between">

      <div>
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <p class="text-gray-600">￥{{ item.price }}</p>
      </div>

      <div class="flex items-center space-x-3 mt-2">
        <button @click="decrease" class="px-2 bg-gray-300 rounded">-</button>
        <span class="font-semibold">{{ quantity }}</span>
        <button @click="increase" class="px-2 bg-gray-300 rounded">+</button>
      </div>

      <button
        @click="add"
        class="mt-2 bg-green-600 text-white py-1 rounded text-sm"
      >
        加入购物车
      </button>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: Object
})

const emits = defineEmits(['add'])

const quantity = ref(1)

const increase = () => quantity.value++
const decrease = () => {
  if (quantity.value > 1) quantity.value--
}

const add = () => {
  emits('add', {
    ...props.item,
    quantity: quantity.value
  })

  alert(`已加入购物车：${props.item.name} × ${quantity.value}`)

  // ⭐ 添加后重置数量
  quantity.value = 1
}
</script>
