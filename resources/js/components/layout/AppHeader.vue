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
        <CNavLink href="#" @click="logOut">
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

<script lang="ts" setup>
import {useMainStore} from "../../stores/mainStore"
import AppBreadcrumb from "./AppBreadcrumb.vue"

const mainStore = useMainStore()
const logOut = () => {
  //this.$store.dispatch('auth/logout');
  //this.$router.push('/login');
}
</script>
