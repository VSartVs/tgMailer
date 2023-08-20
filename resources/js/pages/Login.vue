<script setup lang='ts'>
import {ref} from "vue"
import {useAuthStore} from "../stores/authStore"
import PasswordInput from '../components/inputs/PasswordInput.vue'
import {storeToRefs} from "pinia";

const authStore = useAuthStore()
const {errors, validated} = storeToRefs(authStore)

const email = ref('')
const password = ref('')


</script>

<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center bg_login" :style="'z-index: 9999'">
    <CContainer class="d-flex justify-content-center">
      <div class="wrap_login justify-content-center">
        <div class="d-flex justify-content-center w-100 js-tilt mb-3" data-tilt>
          <CImage class="d-flex justify-content-center m-auto" fluid
                  src="/icons/telegram.svg"
                  width="200" height="200"/>
        </div>
        <CForm class="w-100"
               novalidate>
          <div class="mb-3">
            <CFormInput v-model="email" type="email" id="emailInput"
                        floatingLabel="Email" placeholder="name@example.com"
                        :valid="!Object.prototype.hasOwnProperty.call(errors, 'email') && validated"
                        :invalid="Object.prototype.hasOwnProperty.call(errors, 'email') && validated"
                        :feedback="Object.prototype.hasOwnProperty.call(errors, 'email') ? errors.email[0] : ''"
            />
          </div>
          <div class="mb-3">
            <password-input v-model="password" :validated="validated" :errors="errors"/>
          </div>
          <CButton color="primary" type="button" @click="authStore.login(email, password)"
                   class="d-flex w-100 justify-content-center m-auto mt-3 border-radius-10 button-login">Войти
          </CButton>

        </CForm>
      </div>
    </CContainer>
  </div>
</template>

<style scoped lang="scss">

</style>
