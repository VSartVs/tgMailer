import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useMainStore = defineStore('main', () => {
  const state = reactive({
    sidebarVisible: true,
    sidebarUnfoldable: false
  })

  const toggleSidebar = () => {
    state.sidebarVisible = !state.sidebarVisible
  }

  const toggleUnfoldable = () => {
    state.sidebarUnfoldable = !state.sidebarUnfoldable
  }

  const updateSidebarVisible = (payload) => {
    state.sidebarVisible = payload
  }

  return { state, toggleSidebar, toggleUnfoldable, updateSidebarVisible}
})
