<script setup lang="ts">
import {useMainStore} from "../../stores/mainStore"
import {useAuthStore} from "../../stores/authStore"
import AppBreadcrumb from "./AppBreadcrumb.vue"

const mainStore = useMainStore()
const authStore = useAuthStore()
</script>

<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="mainStore.toggleSidebar">
        <CIcon icon="cil-menu" size="lg"/>
      </CHeaderToggler>
      <CHeaderNav>
        <CNavLink href="/settings">
          <CIcon icon="cilList" size="xl"/>
        </CNavLink>
        <CNavLink href="#" @click="authStore.logout">
          <CIcon icon="cil-lock-locked"/>
          Выйти
        </CNavLink>
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider/>
    <CContainer fluid>
      <AppBreadcrumb/>
    </CContainer>
  </CHeader>
</template>
