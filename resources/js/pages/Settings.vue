<script setup lang="ts">

import PasswordInput from "../components/inputs/PasswordInput.vue";
</script>

<template>
  <CForm class="row g-3">
    <div class="mb-3">
      <CFormInput type="email" id="emailInput" floatingLabel="Email" placeholder="name@example.com"/>
    </div>
    <div class="mb-3">
      <password-input/>
    </div>
    <CCol md="12" class="justify-content-end d-flex">
      <CButton  color="primary" shape="rounded-pill" type="submit">Обновить</CButton>
    </CCol>
  </CForm>
</template>

<style scoped lang="scss">

</style>
