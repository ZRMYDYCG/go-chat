import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore('userStore', () => {
  const token = ref('has-token')

  return {
    token,
  }
})

export default useUserStore
