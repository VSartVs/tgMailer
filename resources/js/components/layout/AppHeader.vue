<script setup lang='ts'>
import {useMainStore} from '../../stores/mainStore'
import {useAuthStore} from '../../stores/authStore'
import AppBreadcrumb from './AppBreadcrumb.vue'
import {useCrudStore} from '../../stores/crudStore'
import {storeToRefs} from 'pinia'

const mainStore = useMainStore()
const authStore = useAuthStore()
const crudStore = useCrudStore()
const {isLoading} = storeToRefs(crudStore)

</script>

<template>
  <CHeader position='sticky' :class="isLoading ? 'mb-0' : 'mb-4'">
    <CContainer fluid>
      <CHeaderToggler class='ps-1' @click='mainStore.toggleSidebar'>
        <CIcon icon='cil-menu' size='xl'/>
      </CHeaderToggler>
      <CHeaderNav>
        <CNavLink href='/settings'>
          <CIcon icon='cilList' size='xl'/>
        </CNavLink>
        <CNavLink href='#' @click='authStore.logout'>
          <CIcon icon='cil-lock-locked'/>
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
