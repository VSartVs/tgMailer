<template>
  <AppSidebar />
  <div class="wrapper d-flex flex-column min-vh-100 bg-light">
    <AppHeader />
    <div class="body flex-grow-1 px-3">
      <CContainer fluid>
        <router-view />
      </CContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { CContainer } from '@coreui/vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import { useMainStore } from "../stores/mainStore"

const mainStore = useMainStore()

onMounted(() => {
  mainStore.updateSidebarVisible(true)
})
</script>
