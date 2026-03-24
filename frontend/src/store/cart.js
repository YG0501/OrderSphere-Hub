import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  actions: {
    // 每次运行自动清空购物车
    init() {
      this.items = []
      localStorage.removeItem('cart')
    },

    save() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    add(item) {
      const existing = this.items.find(i => i.id === item.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        this.items.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url   // ⭐ 必须保存图片路径
        })
      }
      this.save()
    },

    increase(item) {
      item.quantity++
      this.save()
    },

    decrease(item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.items = this.items.filter(i => i.id !== item.id)
      }
      this.save()
    },

    remove(item) {
      this.items = this.items.filter(i => i.id !== item.id)
      this.save()
    },

    clear() {
      this.items = []
      this.save()
    }
  },

  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),

    totalCount: (state) =>
      state.items.reduce((sum, i) => sum + i.quantity, 0)
  }
})
