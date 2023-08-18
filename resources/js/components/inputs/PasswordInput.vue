<script setup lang="ts">

import {ref} from "vue"

const passwordHidden = ref(true)

const changePasswordVisibility = () => {
  passwordHidden.value = !passwordHidden.value;
  document.getElementById('passwordInput').setAttribute('type', passwordHidden.value ? 'password' : 'text')
}
</script>

<template>
  <CInputGroup class="hidden-password mb-3">
    <CFormInput id="passwordInput" placeholder="Пароль" floatingLabel="Пароль" type="password"/>
    <CInputGroupText class="cursor-pointer " @click="changePasswordVisibility">
      <CIcon icon="cilEnvelopeClosed" v-if="passwordHidden"/>
      <CIcon icon="cilEnvelopeOpen" v-else/>
    </CInputGroupText>
  </CInputGroup>
</template>

<style scoped lang="scss">
  .hidden-password {
    & > .input-group-text {
      background: var(--cui-body-bg);
    }
  }
</style>
