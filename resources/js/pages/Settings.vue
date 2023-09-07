<script setup lang="ts">
import PasswordInput from '../components/inputs/PasswordInput.vue'
import {storeToRefs} from 'pinia'
import {onMounted, onUnmounted} from 'vue'
import {useCrudStore} from '../stores/crudStore'

const crudStore = useCrudStore()
const {item, errors} = storeToRefs(crudStore)

onMounted(async () => {
  await crudStore.getItem('settings')
})

onUnmounted(() => {
  crudStore.setDefaultStore()
})
</script>

<template>
  <CForm class="row g-3"  novalidate v-if="item !== null">
    <div class="mb-3">
      <CFormInput v-model="item.email" type="email" id="emailInput"
                  floatingLabel="Email" placeholder="name@example.com"
                  :valid="!Object.prototype.hasOwnProperty.call(errors, 'email') "
                  :invalid="Object.prototype.hasOwnProperty.call(errors, 'email') "
                  :feedback="Object.prototype.hasOwnProperty.call(errors, 'email') ? errors.email[0] : ''"/>
    </div>
    <div class="mb-3">
      <password-input  v-model="item.password" :validated="Object.prototype.hasOwnProperty.call(errors, 'password')" :errors="errors"/>
    </div>
    <CCol md="12" class="justify-content-end d-flex">
      <CButton  color="primary" shape="rounded-pill" @click="crudStore.updateWithoutFiles('settings', item)">Обновить</CButton>
    </CCol>
  </CForm>
</template>

<style scoped lang="scss">

</style>
