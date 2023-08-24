<script setup lang="ts">

import PasswordInput from "../components/inputs/PasswordInput.vue";
import {useAuthStore} from "../stores/authStore";
import {storeToRefs} from "pinia";
import {ref} from "vue";

const authStore = useAuthStore()
const {errors, validated} = storeToRefs(authStore)

const email = ref('')
const password = ref('')
</script>

<template>
  <CForm class="row g-3"  novalidate>
    <div class="mb-3">
      <CFormInput v-model="email" type="email" id="emailInput"
                  floatingLabel="Email" placeholder="name@example.com"
                  :valid="!Object.prototype.hasOwnProperty.call(errors, 'email') && validated"
                  :invalid="Object.prototype.hasOwnProperty.call(errors, 'email') && validated"
                  :feedback="Object.prototype.hasOwnProperty.call(errors, 'email') ? errors.email[0] : ''"/>
    </div>
    <div class="mb-3">
      <password-input  v-model="password" :validated="validated" :errors="errors"/>
    </div>
    <CCol md="12" class="justify-content-end d-flex">
      <CButton  color="primary" shape="rounded-pill" type="submit">Обновить</CButton>
    </CCol>
  </CForm>
</template>

<style scoped lang="scss">

</style>
